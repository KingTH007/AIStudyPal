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
    addMessageToChatBox(aiText.parentNode, "Handa ka na bang magsimula? Pindutin ang Start Speaking.", 'system');
    speakAIText("Handa ka na bang magsimula? Pindutin ang Start Speaking."); 
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
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the latest message
}

// Restart the game
function restartGame() {
    isStarted = false;
    score = 0;
    scoreElement.innerText = `Score: 0/${maxScore}`;
    startButton.innerHTML = '<img src="../static/image/mic-icon.png" alt="Mic" id="mic-icon"> Start';
    startButton.style.display = 'block';
    chatBox.innerHTML = ''; // Clear chatbox
}

// End the game
function endGame() {
    aiFeedback.innerText = "Tapos na ang mga tanong.";
    addMessageToChatBox(aiFeedback.parentNode, aiFeedback.innerText, 'system');
    speakAIText(aiFeedback.innerText, function () {
        startButton.innerHTML = 'Restart';
        startButton.style.display = 'block';
        startButton.onclick = restartGame();
    });
}

function speakAIText(text, callback) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'tl-PH'; // Tagalog language

    console.log("Speaking AI text: ", text); // Debugging

    // When TTS finishes, call the callback function (e.g., enable mic or start timer)
    speech.onend = function () {
        console.log("Text-to-speech finished."); // Debugging
        if (typeof callback === 'function') {
            callback(); // Trigger the next action when speaking ends
        }
    };

    window.speechSynthesis.speak(speech); // Start speaking
}

// Reset chatbox on load
window.addEventListener('load', () => {
    chatBox.innerHTML = ''; 
    startButton.innerHTML = '<img src="../static/image/mic-icon.png" alt="Mic" id="mic-icon"> Start'; 
});