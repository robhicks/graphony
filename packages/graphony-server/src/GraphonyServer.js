/* eslint-disable no-console, import/prefer-default-export */
import { createHash } from 'crypto';
import { deserialize, Graphony, heartbeat, isBrowser, MemoryStore, noop, serialize } from 'graphony-core';
import { Logger } from 'graphony-debug';
import { resolve } from 'path';
import cors from 'cors';
import fs from 'fs';
import { polka } from 'graphony-polka';
import WebSocket from 'graphony-ws';
import jwt from 'jsonwebtoken';
import logger from './middleware/logger';

export class GraphonyServer extends Graphony {
  constructor(options = {}) {
    super(options);
    this.createViteServer = options.createViteServer;
    this.port = options.port || 3001;
    this.subscriptions = new Map();
    this.liveCheckId = null;
    this.liveCheckInterval = 30000;
    this.store = options.store || new MemoryStore();
    this.vite = options.vite;
    this.logger = new Logger();
    this.logger.on = true;

    if (!isBrowser) {
      this.signingSecret = options.signingSecret || 'secret';
      this.server = options.server || polka();
      this.server.use(cors(options?.cors || {origin: '*'}))
      this.wss = new WebSocket.Server({ clientTracking: true, server: this.server.server });
      this.wss.on('close', this.onClose.bind(this));
      this.wss.on('connection', this.onConnection.bind(this));
      this.server.use(logger);
      this.createServer();
      this.checkConnections();
    }
  }

  addContext(req, res, next) {
    req.ctx = this;
    next();
  }

  broadcastToSubscribers({ data, path, gid }) {
    // this.logger.log('this.subscriptions.size', this.subscriptions.size);
    this.subscriptions.forEach((client, key) => {
      this.logger.log('key', key);
      if (!key.includes(gid)
        && key.includes(path)
        && client.readyState === 1) {
        client.send(serialize({ ...data, ...{ action: 'PUBLISHED' } }));
      }
    });
  }

  async createServer() {
    if (this.createViteServer) {
      const vite = await this.createViteServer({ server: { middlewareMode: 'html' }});
      this.server.use(vite.middlewares)
      this.server.listen(this.port, () => this.logger.log(`server running on port: ${this.port}`))
      this.server.get('*', async (req, res) => {
        const url = req.originalUrl;
        try {
          let template = fs.readFileSync(
            resolve(__dirname, 'index.html'),
            'utf-8',
          );
          template = await this.vite.transformIndexHtml(url, template);
  
          // 3. Load the server entry. vite.ssrLoadModule automatically transforms
          //    your ESM source code to be usable in Node.js! There is no bundling
          //    required, and provides efficient invalidation similar to HMR.
          const { render } = await this.vite.ssrLoadModule('/src/entry-server.js');
  
          const appHtml = await render(url);
  
          const html = template.replace('<!--ssr-outlet-->', appHtml);
  
          res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
        } catch (e) {
          this.vite.ssrFixStacktrace(e);
          console.error(e);
          res.status(500).end(e.message);
        }
      })
    } else {
      this.server.listen(this.port);
      console.log(`this.logger`, this.logger)
      this.logger.log(`server running on port: ${this.port}`)
    }
  }

  checkConnections() {
    this.liveCheckId = setInterval(() => {
      this.wss.clients.forEach((cl) => {
        const client = cl;
        if (client.isAlive === false) return client.terminate();
        client.isAlive = false;
        client.ping(noop);
      });
    }, this.liveCheckInterval);
  }

  onClose() {
    clearInterval(this.liveCheckId);
  }

  onConnection(ws) {
    this.logger.log('onConnection');
    const socket = ws;
    socket.isAlive = true;
    socket.on('pong', heartbeat);
    socket.on('message', this.onMessage.bind(this, socket));
  }

  onMessage(ws, msg) {
    this.logger.log('msg', msg);
    const socket = ws;
    const message = deserialize(msg);
    this.logger.log('message', message);

    const { action, data, gid, path } = message;
    let token = {};

    // this.logger.log('action', action);
    // this.logger.log('path', path);
    switch (action) {
      case 'LOGIN': {
        this.logger.log('data', data);
        const { password } = data;
        this.get(path).once((usr) => {
          this.logger.log(`usr`, usr)
          if (usr) {
            const hash = createHash('sha256');
            hash.update(password);
            if (usr.password === hash.digest('hex')) {
              token = jwt.sign({ 
                action: 'LOGIN_RESPONSE', 
                authenticated: true
              }, this.signingSecret, {expiresIn: '7d'});
              this.sendMessage(socket, token)
            } else {
              token = jwt.sign({ 
                action: 'LOGIN_RESPONSE', 
                authenticated: false,
                error: 'passwords do not match'
              }, this.signingSecret, {expiresIn: 1000});
              this.sendMessage(socket, token)
            }
          } else {
            token = jwt.sign({
              action: 'LOGIN_RESPONSE',
              authenticated: false,
              error: 'user does not exist'
            }, this.signingSecret, { expiresIn: 1000 });
            this.sendMessage(socket, token)
          }
        })
        break;
      }
      case 'REGISTER': {
        const { email, password } = data;
        this.get(path).once((usr) => {
          if (usr) {
            token = jwt.sign({
              action: 'REGISTER_RESPONSE',
              authenticated: false,
              error: 'user exists'
            }, this.signingSecret, { expiresIn: 1000 });
            this.sendMessage(socket, token)
          } else {
            const hash = createHash('sha256');
            hash.update(password);
            this.get(path).set({
              email,
              password: hash.digest('hex')
            });
            token = jwt.sign({
              action: 'REGISTER_RESPONSE',
              authenticated: true,
            }, this.signingSecret, { expiresIn: '7d' });
            this.sendMessage(socket, token)
          }
        })
        break;
      }
      default: break;
    }
  }

  sendMessage(socket, message) {
    this.logger.log('sendMessage::message', message)
    socket.send(serialize(message))
  }
}

