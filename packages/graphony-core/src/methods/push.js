import { isArray } from '../utils/isArray';
import { isObject } from '../utils/isObject';
import Node from '../Node';
import { isString } from '../utils/isString';
import { isNumber } from '../utils/isNumber';
import { uuid } from '../utils/uuid';
import containsStringsOrNumbers from '../utils/containsStringsOrNumbers';

export default function push(val) {
  const node = this.nodes.get(this.currentPath);
  const value = node.value;
  if (!isArray(value)) {
    throw Error('cannot push into non-array');
  } else {
    value.push(val)
    node.value = value;
  }
  return this;
}
