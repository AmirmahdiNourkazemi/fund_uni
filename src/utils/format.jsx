const formatNumberInWords = (words) => {
    // Trim any extra spaces first
    words = words.trim();
  
    // Check if the last character is "و"
    if (words.endsWith("و")) {
      return words.slice(0, words.length - 1).trim(); // Remove the last "و" and any trailing spaces
    }
    
    // Return the original string if no change is needed
    return words;
  };
  
  export default formatNumberInWords;
  