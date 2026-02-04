// Minimal Myanmar Unicode pre-vowel fixer (focus on "ေ" ordering only)

// Simple global reorder: move any pre-vowel \u1031 that appears before a consonant (including medials) to after the cluster.
function fixPreVowelOrder(text) {
  const regex = /(\u1031)([\u1000-\u102A\u103F\u104E])([\u103B-\u103E]*)/g;
  return text.replace(regex, '$2$3\u1031');
}

// Fix medial \u103C (ြ) when it appears before its base consonant: move it after the consonant.
function fixMedialOrder(text) {
  const regex = /(\u103C)([\u1000-\u102A])/g;
  return text.replace(regex, '$2\u103C');
}

// Main correction: apply both pre-vowel and medial reorders
function correctText() {
  const inputText = document.getElementById('inputText').value;
  const correctedText = fixPreVowelOrder(fixMedialOrder(inputText));

  const outputArea = document.getElementById('outputArea');
  const correctedDiv = document.getElementById('correctedText');

  if (correctedText && correctedText !== inputText) {
    correctedDiv.textContent = correctedText;
    outputArea.style.display = 'block';
  } else if (correctedText === inputText) {
    correctedDiv.textContent = 'No corrections needed.';
    outputArea.style.display = 'block';
  } else {
    outputArea.style.display = 'none';
  }
}

// Debounced input autocorrect
let debounceTimer;
function autoCorrectOnInput() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    const inputText = document.getElementById('inputText').value;
    if (inputText.length > 0) correctText();
  }, 300);
}

// Initialize on load (no Teams SDK calls to avoid blocking)
document.addEventListener('DOMContentLoaded', function() {
  const inputElement = document.getElementById('inputText');
  inputElement.addEventListener('input', autoCorrectOnInput);
  inputElement.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'Enter') correctText();
  });
});