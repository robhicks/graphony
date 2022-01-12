/* eslint-disable no-underscore-dangle */
import { uuid } from './utils/uuid';
import { isBrowser } from './utils/isBrowser';
import { isArray } from './utils/isArray';
import refRegX from './utils/refRegX';

const utc = () => Math.floor(new Date().getTime() / 1000);

export default class Node {
  constructor(path, ctx, readers = [], writers = []) {
    this.baseUrl = ctx.baseUrl;
    this.browser = isBrowser;
    this.client = ctx.client;
    this.server = !isBrowser;
    this.path = path;
    this.events = ctx.events;
    this.nodes = ctx.nodes;
    this.uid = uuid();
    this.gid = ctx.uuid;
    this.store = ctx.store;
    this.user = ctx.user;
    this.readers = readers;
    this.writers = writers;
    this.version = 0;
    this.store.get(this.path).then((sv) => {
      if (sv?.value) this.value = sv?.value;
    })
  }

  triggerMemoryEvent() {
    this.events.emit(this.path, this.value);
  }

  triggerNetworkEvent() {
    this.events.emit(this.path, this.value);
  }

  async triggerStoreEvent() {
    this.store.get(this.path).then((sv) => {
      if (sv?.value) this.value = sv?.value;
      else this.events.emit(this.path, null);
    })
  }

  defaultVal(val) {
    const retVal = {
      ...{value: val},
      ...{
        owner: val?.owner || this?.user?.uid,
        readers: val?.readers || this.readers,
        updated: val?.updated || utc(),
        updatedBy: val?.updatedBy || this?.user?.uid,
        writers: val?.writers || this.writers,
      },
    };
    // console.log('retVal', retVal);
    return retVal;
  }

  get value() {
    return this._value
  }

  set value(val) {
    const internalValue = this.defaultVal(val);
    this._value = internalValue.value;
    this.store.put(this.path, internalValue, true);
    this.events.emit(this.path, internalValue?.value);
  }

  valFromRefArray(value) {
    let rv = null;
    if (isArray(value) && value.some((el) => refRegX.test(el))) {
      rv = value.map((el) => {
        const node = this.nodes.get(el);
        return node.value
      })
    }
    return rv;
  }
  
}
