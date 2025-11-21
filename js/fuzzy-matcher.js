export function matcher(query, text) {
  console.log('searching', query, text);
  return text.toLowerCase().indexOf(query.toLowerCase()) > 0;
}