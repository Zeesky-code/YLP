const words = [
    { word: 'baba', correctTones: 'bàbá', meaning: 'father' },
    { word: 'iya', correctTones: 'ìyá', meaning: 'mother' },
    { word: 'omo', correctTones: 'ọmọ', meaning: 'child' },
    { word: 'ile', correctTones: 'ilé', meaning: 'house' },
    { word: 'owo', correctTones: 'owó', meaning: 'money' }
];

let currentWord = words[0];
let score = 0;

// Get DOM elements
const currentWordElement = document.getElementById('current-word');
const wordMeaningElement = document.getElementById('word-meaning');
const userInput = document.getElementById('user-input');
const checkButton = document.getElementById('check-answer');
const playButton = document.getElementById('play-audio');
const feedbackElement = document.getElementById('feedback');
const scoreElement = document.getElementById('score');

// Initialize display
function displayWord() {
    currentWordElement.textContent = currentWord.word;
    wordMeaningElement.textContent = currentWord.meaning;
}

// Check answer
function checkAnswer() {
    const userAnswer = userInput.value.trim();
    if (userAnswer === currentWord.correctTones) {
        feedbackElement.textContent = 'Correct! 👏';
        score += 1;
        scoreElement.textContent = `Score: ${score}`;
        nextWord();
    } else {
        feedbackElement.textContent = 'Try again! Check your tone marks.';
    }
}

// Get next word
function nextWord() {
    const nextIndex = Math.floor(Math.random() * words.length);
    currentWord = words[nextIndex];
    displayWord();
    userInput.value = '';
}

// Add event listeners
checkButton.addEventListener('click', checkAnswer);
playButton.addEventListener('click', () => {
    // TODO: Implement audio playback
    alert('Audio feature coming soon!');
});

// Initialize first word
displayWord();