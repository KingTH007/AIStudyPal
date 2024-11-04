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

// Function to start the game
startButton.addEventListener('click', function () {
    if (!isStarted) {
        displayInstructions(); // Show instructions and prompt
        startButton.innerHTML = '<img src="../static/image/mic-icon.png" alt="Mic" id="mic-icon"> Start Speaking';
        isStarted = true;
    } else {
        startButton.style.display = 'none'; // Hide the button
        displayAndSpeakQuestion(); // Start asking questions
    }
});

// Function to start the timer
function startTimer() {
    let timeLeft = 5; // Example: 5 seconds per question
    timerElement.innerText = `${timeLeft} : Timer`;

    timerInterval = setInterval(() => {
        timeLeft--;
        timerElement.innerText = `${timeLeft} : Timer`;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerElement.innerText = 'Time is up!';
            handleUserResponse(''); // Trigger empty response if time runs out
        }
    }, 1000);
}

// Function to stop the timer
function stopTimer() {
    clearInterval(timerInterval); // Stop the timer
}

// Display instructions
function displayInstructions() {
    alert("Pindutin ang Start button upang simulan ang pagsasanay. Pagkatapos, magsasalita ang AI at maaari mong sagutin gamit ang iyong boses.");
    chatBox.innerHTML = ''; // Clear chatbox
    addMessageToChatBox(aiText.parentNode, "Handa ka na bang magsimula? Pindutin ang 'SIMULAN'.", 'system');
    speakAIText("Handa ka na bang magsimula? Pindutin ang 'SIMULAN'."); 
}

// Add message to chatbox
function addMessageToChatBox(messageElement, text, type) {
    const messageClone = messageElement.cloneNode(true);
    const paragraph = messageClone.querySelector('p');
    if (paragraph) {
        paragraph.innerText = text;
    }
    messageClone.classList.add(type === 'system' ? 'ai-message' : 'user-message');
    chatBox.appendChild(messageClone);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// End the game
function endGame() {
    stopTimer();
    aiFeedback.innerText = "Tapos na ang mga tanong.";
    addMessageToChatBox(aiFeedback.parentNode, aiFeedback.innerText, 'system');
    speakAIText(aiFeedback.innerText, function () {
        startButton.style.display = 'block';
        startButton.innerHTML = '<img src="../static/image/mic-icon.png" alt="Mic" id="mic-icon"> Start Again';
    });
}

// Reset chatbox on load
window.addEventListener('load', () => {
    chatBox.innerHTML = ''; 
    startButton.innerHTML = '<img src="../static/image/mic-icon.png" alt="Mic" id="mic-icon"> Start'; 
    setFilipinoVoice(); // Load voices on page load
});

// Function to disable all quiz links with grey-out and lock icon
function disableQuizzes() {
    const quizLinks = document.querySelectorAll('.lesson-content a');
    quizLinks.forEach(link => {
        link.classList.add('disabled');
        link.classList.remove('enabled');
    });
}

// Function to enable all quiz links, removing grey-out and lock icon
function enableQuizzes() {
    const quizLinks = document.querySelectorAll('.lesson-content a');
    quizLinks.forEach(link => {
        link.classList.remove('disabled');
        link.classList.add('enabled');
    });
}

// Run this on page load to disable quizzes initially
document.addEventListener('DOMContentLoaded', () => {
    disableQuizzes();
});

// Assume this function is called when Lesson 1’s text-to-speech lecture completes
/*function onLessonOneComplete() {
    enableQuizzes();
}

// Example: Simulating completion of text-to-speech
// Replace this with the actual event handler for your text-to-speech
document.getElementById('filipino-lesson-1').addEventListener('click', () => {
    // Trigger Lesson 1 content and text-to-speech
    setTimeout(onLessonOneComplete, 5000); // Simulate 5 seconds of lecture
});
*/