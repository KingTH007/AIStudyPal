//chatbox.js
let isStarted = false; 
let currentQuestion = {};
let score = 0;
const maxScore = 10;
let timerInterval; // Timer variable

// Elements
const aiText = document.getElementById('ai-text');
const userText = document.getElementById('user-text');
const aiFeedback = document.getElementById('ai-feedback');
const timerElement = document.getElementById('timer');
const startButton = document.getElementById('start-speech');
const chatBox = document.querySelector('.chat-box');
const scoreElement = document.getElementById('score');

// Variable to store the selected voice for Filipino
let filipinoVoice = null;

// Load voices and select Filipino-compatible voice
function setFilipinoVoice() {
    const voices = window.speechSynthesis.getVoices();
    filipinoVoice = voices.find(voice => 
        voice.lang === "fil-PH" || voice.lang.startsWith("tl") || voice.lang.includes("Tagalog")
    );
}

// Text-to-speech function for AI text
function speakAIText(text, callback) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'tl-PH'; // Set Filipino language code

    // Set Filipino-compatible voice if available
    if (filipinoVoice) {
        speech.voice = filipinoVoice;
    }

    console.log("Speaking AI text:", text);
    speech.onend = function () {
        console.log("Text-to-speech finished.");
        if (typeof callback === 'function') {
            callback();
        }
    };
    window.speechSynthesis.speak(speech);
}

// Function to display and speak the AI's question
function displayAndSpeakQuestion() {
    currentQuestion = getRandomQuestion();
    if (!currentQuestion) {
        endGame(); // End the game if all questions are asked
        return;
    }

    // Display the question in the chatbox
    addMessageToChatBox(aiText.parentNode, currentQuestion.question, 'system');

    // Speak the question
    speakAIText(currentQuestion.question, function () {
        startTimer(); // Start the timer after AI finishes speaking
        startRecognition(handleUserResponse); // Start voice recognition after the question is spoken
    });
}

//FOR IDENTIFICATION LESSON 1
document.getElementById('identify1-quiz').addEventListener('click', function (event) {
    event.preventDefault(); // Prevent default link behavior

    // Reset and start the identification quiz
    resetIdentificationQuestions(); // Clear previous asked questions
    startButton.style.display = 'none'; // Hide the start button initially
    displayAndSpeakIdentificationQuestion(); // Start the first question
});

// Function to display and speak an identification question
function displayAndSpeakIdentificationQuestion() {
    currentQuestion = getIdentificationQuestion();
    if (!currentQuestion) {
        endGame(); // End the game if all questions are asked
        return;
    }

    // Display the question in the chatbox
    addMessageToChatBox(aiText.parentNode, currentQuestion.question, 'system');

    // Speak the question
    speakAIText(currentQuestion.question, function () {
        startTimer(); // Start the timer after AI finishes speaking
        startRecognition(handleUserResponse); // Start voice recognition after the question is spoken
    });
}
