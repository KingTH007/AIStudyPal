// chatbox.js

let isStarted = false; // Track if the game has started
let currentQuestion = {}; // Declare currentQuestion only once
let score = 0;
const maxScore = 10;

// Elements
const aiText = document.getElementById('ai-text');
const userText = document.getElementById('user-text');
const aiFeedback = document.getElementById('ai-feedback');
const timerElement = document.getElementById('timer');
const startButton = document.getElementById('start-speech');
const chatBox = document.querySelector('.chat-box');
const scoreElement = document.getElementById('score');

// Instructions and prompt
const instructionText = "Pindutin ang Start button upang simulan ang pagsasanay. Pagkatapos, magsasalita ang AI at maaari mong sagutin gamit ang iyong boses.";
const readyPrompt = "Handa ka na bang magsimula? upang magpatuloy pindutin ang 'start speaking'.";

// Start button click handler
startButton.addEventListener('click', function () {
    if (!isStarted) {
        displayInstructions(); // Show instructions and prompt
        startButton.innerHTML = '<img src="../static/image/mic-icon.png" alt="Mic" id="mic-icon"> Start Speaking'; // Change button text and icon
        isStarted = true;
    } else {
        startButton.style.display = 'none'; // Hide the button
        displayAndSpeakQuestion(); // Start asking questions
    }
});

// Display instructions and prompt
function displayInstructions() {
    alert(instructionText);
    chatBox.innerHTML = '';
    addMessageToChatBox(aiText.parentNode, readyPrompt, 'system');
    speakAIText(readyPrompt, () => {
        startRecognition(handleUserResponse); // Start voice recognition after AI speech ends
    });
}

// Display question and speak it
function displayAndSpeakQuestion() {
    currentQuestion = getRandomQuestion();
    if (!currentQuestion) {
        endGame(); // End the game if all questions are asked
        return;
    }
    aiText.innerText = currentQuestion.question;
    addMessageToChatBox(aiText.parentNode, currentQuestion.question, 'system');
    speakAIText(currentQuestion.question);
}

// Handle user response
function handleUserResponse(transcript) {
    userText.innerText = `Sinabi mo: ${transcript}`;
    addMessageToChatBox(userText.parentNode, `Sinabi mo: ${transcript}`, 'user');

    const correctAnswer = currentQuestion.answer;
    const isCorrect = transcript.toLowerCase().includes(correctAnswer.toLowerCase());

    if (isCorrect) {
        aiFeedback.innerText = "Tama ang sagot!";
        score += 2; // Increase score by 2 points for each correct answer
    } else {
        aiFeedback.innerText = `Mali ang sagot. Ang tamang sagot ay: ${correctAnswer}`;
    }

    scoreElement.innerText = `Score: ${score}/${maxScore}`; // Update score display
    addMessageToChatBox(aiFeedback.parentNode, aiFeedback.innerText, 'system');
    speakAIText(aiFeedback.innerText);

    displayAndSpeakQuestion(); // Automatically move to the next question
}

// End the game when all questions are asked
function endGame() {
    aiFeedback.innerText = "Tapos na ang mga tanong.";
    addMessageToChatBox(aiFeedback.parentNode, aiFeedback.innerText, 'system');
    speakAIText(aiFeedback.innerText);
    startButton.innerHTML = 'Restart'; // Change button to Restart
}

// Function to add messages to chatbox
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

// Function to speak AI text
function speakAIText(text, callback) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'tl-PH';

    speech.onend = function () {
        if (typeof callback === 'function') {
            callback(); // Call the callback after speech ends
        }
    };

    window.speechSynthesis.speak(speech);
}

// Clear chat box and reset button on page load
window.addEventListener('load', () => {
    chatBox.innerHTML = ''; // Clear chat box on page load
    startButton.innerHTML = '<img src="../static/image/mic-icon.png" alt="Mic" id="mic-icon"> Start'; // Set button text to 'Start'
});
