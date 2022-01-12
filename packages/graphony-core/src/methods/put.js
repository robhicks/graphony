import { isObject } from '../utils/isObject';
import promiseTimeout from '../utils/promiseTimeout';

export default function put(val, timeout = 100, set = false) {
  if (isObject(val)) {
    const node = this.nodes.get(this.currentPath);
    let { value } = node;
    value = value ? { ...value, ...val } : val;
    node.value = value;
  } else {
    throw new SyntaxError('Use put for updating objects only');
  }
  
  return this;
}
