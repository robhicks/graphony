/* eslint-disable no-underscore-dangle */
import { decrypt, EventEmitter, encrypt, isArray, noop, uuid } from 'graphony-core';
import jwtDecode from "jwt-decode";

const userIdString = 'graphony-user-id';

export default class User {
  constructor(ctx) {
    this.ctx = ctx;
    this.events = new EventEmitter();
    this._authenticated = false;
    this._permissions = [];
    if (localStorage) {
      this.uuid = localStorage.getItem(userIdString) || uuid();
      localStorage.setItem(userIdString, this.uuid);
    }
    this.get = ctx.get.bind(ctx);
    this.set = ctx.set.bind(ctx);
    this.client = ctx.client;
    this.baseUrl = ctx.baseUrl;
    this.isBrowser = ctx.isBrowser;
    this.rpcClient = ctx.rpcClient;
    this.rpcUri = ctx.rpcUri;
  }

  authChange(cb = noop) {
    this.events.on('authChange', cb)
  }

  checkAuth() {
    this.get().get('users').get(this.uuid).once((usr) => {
      if (usr?.token) {
        const decodedJwt = jwtDecode(usr.token);
        if (this.ctx.logger.on) console.log(`decodedJwt`, decodedJwt)
        if (decodedJwt.exp * 1000 > Date.now()) {
          this.get().get('users').get(this.uuid).put({ authenticated: true, uuid: this.uuid }).once((us) => {
            this.events.emit('authChange', us)
          })
        } else {
          this.get().get('users').get(this.uuid).put({ authenticated: false }).once((us) => {
            this.events.emit('authChange', us)
          })
        }
      } else {
        this.get().get('users').get(this.uuid).put({ authenticated: false }).once((us) => {
          this.events.emit('authChange', us)
        })
      }
    }, 'store')
  }

  deleteAccount() {
    this.get()
      .get('users')
      .get(this.uid)
      .set(null);
  }

  handleAuthResponse({ authenticated, error, token }) {
    this.get().get('users').get(this.uuid).put({ authenticated, error, token, uuid: this.uuid }).once((u) => {
      this.events.emit('authChange', u);
    });
  }

  login(email, password) {
    this.email = email;
    this.rawPassword = password;
    if (this.isBrowser) {
      this.get().get('users').get(this.uuid).once((usr) => {
        if (usr?.token) {
          const decodedJwt = jwtDecode(usr.token);
          if (decodedJwt.exp * 1000 > Date.now()) {
            this.get().get('users').get(this.uuid).put({ authenticated: true, uuid: this.uuid })
            this.checkAuth()
          } else {
            this.ctx.sendMessage({action: 'LOGIN', gid: this.ctx.id, path: `root.users.${this.uuid}`, data: {email, password}})
          }
        } else {
          this.ctx.sendMessage({action: 'LOGIN', gid: this.ctx.id, path: `root.users.${this.uuid}`, data: {email, password}})
        }
      }, 'store')
    }
  }

  logout() {
    if (this.isBrowser) {
      this.get().get('users').get(this.uuid).put({ authenticated: false, token: null }).once((u) => {
        this.events.emit('authChange', u);
      })
    }
  }

  register(email, password) {
    this.email = email;
    this.rawPassword = password;
    if (this.isBrowser) {
      this.get().get('users').get(this.uuid).once((usr) => {
        if (usr?.token) {
          const decodedJwt = jwtDecode(usr.token);
          // console.log(`decodedJwt`, decodedJwt)
          // console.log(`decodedJwt.exp > Date.now()`, decodedJwt.exp > Date.now())
          if (decodedJwt.exp * 1000 > Date.now()) {
            this.get().get('users').get(this.uuid).put({ authenticated: true })
          } else {
            this.ctx.sendMessage({ action: 'REGISTER', gid: this.ctx.id, path: `root.users.${this.uuid}`, data: { email, password } })
          }
        } else {
          this.ctx.sendMessage({ action: 'REGISTER', gid: this.ctx.id, path: `root.users.${this.uuid}`, data: { email, password } })
        }
      }, 'store')
    }
  }

  get authenticated() {
    return this._authenticated;
  }

  set authenticated(flag) {
    this._authenticated = flag;
    this.events.emit('authChange', this._authenticated);
  }

  get permissions() {
    return this._permissions;
  }

  set permissions(perms = []) {
    if (!isArray(perms)) throw new SyntaxError('permissions must be an array of strings');
    perms.forEach((perm) => {
      if (typeof perm !== 'string') throw new SyntaxError('permissions must contain only strings');
    });
    this._permissions = perms;
  }

  get uid() {
    return this.uuid;
  }

  set uid(uid) {
    this.uuid = uid;
  }
}

User.prototype.encrypt = encrypt;
User.prototype.decrypt = decrypt;
