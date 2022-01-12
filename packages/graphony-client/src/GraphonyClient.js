/* eslint-disable import/prefer-default-export, no-underscore-dangle, no-console */
import { baseUrl, deserialize, Graphony, IdbKeyValStore, isBrowser, MemoryStore, serialize } from 'graphony-core';
import { Logger } from 'graphony-debug';
import decode from 'jwt-decode';
import User from './User';

const autoReconnectInterval = 1000;
const sendRetryTimeout = 1000;

export class GraphonyClient extends Graphony {
  constructor(options = {}) {
    super(options);
    this.isBrowser = isBrowser;
    this.logger = new Logger();
    if (this.isBrowser) {
      super.store = options.store || new IdbKeyValStore();
      this.baseUrl = options.baseUrl || baseUrl();
      this.socketUrl = this.baseUrl.replace('http', 'ws');
      this.id = localStorage.getItem('graphony-client-id') || this.uuid;
      localStorage.setItem('graphony-client-id', this.id);
      this.connect();
      this.user = new User(this);
    } else {
      super.store = new MemoryStore();
      this.baseUrl = options.baseUrl;
    }
  }

  check() {
    this.logger.log('checking connection', this.socket.readyState);
    if (!this.socket || this.socket.readyState === 3) this.connect();
  }

  connect() {
    try {
      this.socket = new WebSocket(this.socketUrl);
      this.socket.onclose = this.onclose.bind(this);
      this.socket.onerror = this.onerror.bind(this);
      this.socket.onopen = this.onopen.bind(this);
      this.socket.onmessage = this.onmessage.bind(this);
    } catch (e) {
      this.logger.log(`connect error ----------------------------------------`, e)
    }
  }

  onclose(e) {
    this.logger.log(`onclose error:----`, e)
    switch (e) {
      case 1000:
        this.logger.log("WebSocket closed normally");
        break;
      default:
        break;
    }
  }

  onerror(e) {
    this.logger.log(`onerror:--------------------------------------`, e)
    setTimeout(() => {
      this.connect()
    }, autoReconnectInterval);
  }

  onmessage(ev) {
    const data = ev.data ? deserialize(ev.data) : {};
    const decoded = decode(data);
    const { action, authenticated, error } = decoded;
    if (action === 'LOGIN_RESPONSE' || action === 'REGISTER_RESPONSE') {
      this.user.handleAuthResponse({authenticated, error, token: data});
    }
  }

  onopen() {
    setInterval(this.check.bind(this), autoReconnectInterval)
  }

  sendMessage(message) {
    if (this.socket.readyState !== 1) {
      setTimeout(() => {
        this.sendMessage(message);
        this.logger.log('trying to send message again');
      }, sendRetryTimeout);
    } else {
      this.logger.log(`sending message`, message )
      this.socket.send(serialize(message));
    }
  }
}


