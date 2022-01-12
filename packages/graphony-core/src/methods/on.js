export default function on(cb, {immediate = false, type = 'memory'} = {}) {
  const node = this.nodes.get(this.currentPath);
  if (immediate) this.once(cb, type)
  node.events.on(node.path, cb);
  return this;
}
