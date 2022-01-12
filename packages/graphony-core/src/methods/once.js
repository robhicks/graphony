export default function once(callback = Function, type = 'memory') {
  const node = this.nodes.get(this.currentPath);
  node.events.once(node.path, callback)
  if (type === 'memory') {
    node.triggerMemoryEvent();
  } else if (type === 'store') {
    node.triggerStoreEvent();
  } else if (type === 'network') {
    node.triggerNetworkEvent();
  }
  return this;
}
