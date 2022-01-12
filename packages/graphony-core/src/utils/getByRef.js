export default async function getByRef(ref, nodes, store) {
  const node = nodes.get(ref);
  if (node.value) return node.value;
  const storedValue = await store.get(ref);
  return storedValue?.value;
}