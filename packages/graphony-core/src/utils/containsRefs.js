export default function containsRefs(arr) {
  const withRefs = arr.map((a) => a.includes('ref:'));
  return arr.length === withRefs.length;
}