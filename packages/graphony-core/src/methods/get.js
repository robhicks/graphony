import { isArray } from '../utils/isArray';
import { membersAreStrings } from '../utils/membersAreStrings';
import Node from '../Node';

const dotPathRegEx = /\./;
const emailRegEx = /\w+@\S*?\.\w+/i;


export default function get(path = 'root', { readers = [], writers = [] } = {}) {
  if (!isArray(readers)
  || !isArray(writers)
  || !membersAreStrings(readers)
  || !membersAreStrings(writers)) {
    throw new SyntaxError('readers and writers must be arrays');
  }

  if (dotPathRegEx.test(path) && !emailRegEx.test(path)) {
    this.currentPath = path;
  } else {
    if (path === 'root') this.currentPath = path;

    const idx = this.currentPath ? this.currentPath.lastIndexOf(path) : -1;

    if (idx !== -1) {
      this.currentPath = this.currentPath.substr(0, idx + path.length);
    } else if (path.includes('root')) {
      this.currentPath = path;
    } else {
      this.currentPath = `${this.currentPath || 'root'}.${path}`;
    }
  }

  if (!this.nodes.has(this.currentPath)) {
    const node = new Node(this.currentPath, this, readers, writers);
    this.nodes.set(this.currentPath, node);
  }

  return this;
}
