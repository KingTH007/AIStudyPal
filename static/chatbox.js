// chatbox.js

const aiText = document.getElementById('ai-text');
const userText = document.getElementById('user-text');
const aiFeedback = document.getElementById('ai-feedback');
const timerElement = document.getElementById('timer');
const startButton = document.getElementById('start-speech');
const chatBox = document.querySelector('.chat-box');
const scoreElement = document.getElementById('score');

// Timer
let timer;
let timeLeft = 10;
let score = 0;
const maxScore = 10;

// Start button click handler
startButton.addEventListener('click', function () {
    if (!isStarted) {
        displayInstructions(); // Show instructions and prompt
        startButton.innerHTML = '<img src="../static/image/mic-icon.png" alt="Mic" id="mic-icon"> Start Speaking'; // Change button text and icon
        isStarted = true;
    } else if (startButton.innerHTML.includes('Restart')) {
        restartGame(); // Reset game if Restart button is clicked
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
    speakAIText(readyPrompt, startRecognition);
}

// Start timer for answering
function startTimer() {
    timeLeft = 10;
    timer = setInterval(() => {
        timerElement.innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            aiFeedback.innerText = "Wala kang sagot. Subukan ulit.";
            addMessageToChatBox(aiFeedback.parentNode, aiFeedback.innerText, 'system');
            speakAIText(aiFeedback.innerText);
            displayAndSpeakQuestion();
        } else {
            timeLeft--; // Decrease time
        }
    }, 1000);
}

// Display question and start speech
function displayAndSpeakQuestion() {
    currentQuestion = getRandomQuestion();
    if (!currentQuestion) {
        endGame(); // End the game if all questions are asked
        return;
    }
    aiText.innerText = currentQuestion.question;
    addMessageToChatBox(aiText.parentNode, currentQuestion.question, 'system');
    speakAIText(currentQuestion.question);
    startTimer();
}

// End the game when all questions are asked
function endGame() {
    clearInterval(timer);
    aiFeedback.innerText = "Tapos na ang mga tanong.";
    addMessageToChatBox(aiFeedback.parentNode, aiFeedback.innerText, 'system');
    speakAIText(aiFeedback.innerText);
    startButton.innerHTML = 'Restart'; // Change button to Restart
    scoreElement.innerText = `Final Score: ${score}/${maxScore}`;
}

// Add messages to the chatbox
function addMessageToChatBox(parent, message, role) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', role);
    messageDiv.innerHTML = `<span>${message}</span>`;
    parent.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
}

window.onload = function() {
    // All your JavaScript logic here
    console.log("Chatbox JS loaded!");

    // Example: Interacting with DOM elements safely after load
    const chatBox = document.querySelector('.chat-box');
    const startButton = document.getElementById('start-speech');
    
    startButton.addEventListener('click', function() {
        console.log('Start button clicked!');
        // Your other logic here
    });
};
