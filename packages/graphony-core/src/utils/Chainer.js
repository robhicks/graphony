import del from '../methods/del';
import on from '../methods/on';
import once from '../methods/once';
import push from '../methods/push';
import put from '../methods/put';
import set from '../methods/set';
import get from '../methods/get';

export default class Chainer {
  constructor(ctx) {
    Object.assign(this, ctx)
    this.del = del.bind(this);
    this.get = get.bind(this);
    this.on = on.bind(this);
    this.once = once.bind(this);
    this.push = push.bind(this);
    this.put = put.bind(this);
    this.set = set.bind(this);
    return this;
  }
}
