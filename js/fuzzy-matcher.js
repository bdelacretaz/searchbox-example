// Fuzzy matcher written by Cursor

/**
 * Calculate the Levenshtein distance between two strings
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} The Levenshtein distance
 */
function levenshteinDistance(str1, str2) {
  const len1 = str1.length;
  const len2 = str2.length;
  
  // Create a matrix to store distances
  const matrix = Array(len1 + 1).fill(null).map(() => Array(len2 + 1).fill(0));
  
  // Initialize first column and row
  for (let i = 0; i <= len1; i++) {
    matrix[i][0] = i;
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }
  
  // Fill the matrix
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,      // deletion
        matrix[i][j - 1] + 1,      // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }
  
  return matrix[len1][len2];
}

/**
 * Fuzzy matching using Levenshtein distance
 * @param {string} query - The search query
 * @param {string} text - The text to search in
 * @returns {boolean} True if the query fuzzy matches the text
 */
export function matcher(query, text) {
  console.log('searching', query, text);
  
  // Normalize both strings to lowercase for case-insensitive matching
  const normalizedQuery = query.toLowerCase().trim();
  const normalizedText = text.toLowerCase();
  
  // Empty query matches nothing
  if (normalizedQuery.length === 0) {
    return false;
  }
  
  // Calculate threshold based on query length
  // Allow 1 error for every 3 characters, minimum 1
  const threshold = Math.max(1, Math.floor(normalizedQuery.length / 3));
  
  // First check: exact substring match (fastest)
  if (normalizedText.includes(normalizedQuery)) {
    return true;
  }
  
  // Second check: fuzzy match against the whole text
  const wholeTextDistance = levenshteinDistance(normalizedQuery, normalizedText);
  if (wholeTextDistance <= threshold) {
    return true;
  }
  
  // Third check: fuzzy match against individual words
  const words = normalizedText.split(/\s+/);
  for (const word of words) {
    // Skip very short words
    if (word.length < 2) {
      continue;
    }
    
    const distance = levenshteinDistance(normalizedQuery, word);
    if (distance <= threshold) {
      return true;
    }
    
    // Also check if the word contains the query with fuzzy matching
    // by checking all substrings of the word with similar length
    if (word.length >= normalizedQuery.length) {
      for (let i = 0; i <= word.length - normalizedQuery.length; i++) {
        const substring = word.substring(i, i + normalizedQuery.length);
        const substringDistance = levenshteinDistance(normalizedQuery, substring);
        if (substringDistance <= threshold) {
          return true;
        }
      }
    }
  }
  
  return false;
}