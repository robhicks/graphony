export default function containsStringsOrNumbers(arr) {
  const withStrings = arr.map((a) => typeof a === 'string' || typeof a === 'number');
  return arr.length === withStrings.length;
}