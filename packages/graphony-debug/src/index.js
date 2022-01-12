const levels = [
  'count',
  'debug',
  'error',
  'info',
  'trace',
  'warn',
]
export class Logger {
  constructor() {
    this.on = false;
    this._level = null;
  }

  count(...args) {
    this.level = 'count';
    this.log(...args)
  }

  debug(...args) {
    this.level = 'debug';
    this.log(...args)
  }

  error(...args) {
    this.level = 'error';
    this.log(...args)
  }

  info(...args) {
    this.level = 'info';
    this.log(...args)
  }
  log(...args) {
    if (this.level && this.on) {
      console[this.level](...args)
    }
  }

  trace(...args) {
    this.level = 'trace';
    this.log(...args)
  }

  warn(...args) {
    this.level = 'warn';
    this.log(...args)
  }

  get level() {
    return this._level;
  }

  set level(level) {
    if (levels.includes(level)) {
      this._level = level;
    } else {
      this._level = null;
    }
  }

  get on() {
    return this._on;
  }

  set on(bool) {
    this._on = bool;
  }
}