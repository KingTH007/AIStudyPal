let isStarted = false; 
let currentQuestion = {};
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
        startButton.innerHTML = '<img src="../static/image/mic-icon.png" alt="Mic" id="mic-icon"> Start Speaking';
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
        startRecognition(handleUserResponse); 
    });
}

// Display and animate the question
function displayAndSpeakQuestion() {
    currentQuestion = getRandomQuestion();
    if (!currentQuestion) {
        endGame(); 
        return;
    }
    aiText.innerText = ''; // Clear previous question
    addMessageToChatBox(aiText.parentNode, currentQuestion.question, 'system');
    
    // Animate and speak the question
    animateText(currentQuestion.question, () => {
        speakAIText(currentQuestion.question, () => {
            startRecognition(handleUserResponse);
        });
    });
}

// Animate text function
function animateText(text, callback) {
    aiText.innerText = ''; // Clear the AI text box
    let index = 0;
    const interval = setInterval(() => {
        aiText.innerText += text.charAt(index);
        index++;
        if (index === text.length) {
            clearInterval(interval);
            if (callback) callback(); // Call the next function after animation ends
        }
    }, 100); // Speed of animation (100ms per character)
}

// Handle user response
function handleUserResponse(transcript) {
    userText.innerText = `Sinabi mo: ${transcript}`;
    addMessageToChatBox(userText.parentNode, `Sinabi mo: ${transcript}`, 'user');

    const correctAnswer = currentQuestion.answer;
    const isCorrect = transcript.toLowerCase().includes(correctAnswer.toLowerCase());

    if (isCorrect) {
        aiFeedback.innerText = "Tama ang sagot!";
        score += 2; // Increase score
    } else {
        aiFeedback.innerText = `Mali ang sagot. Ang tamang sagot ay: ${correctAnswer}`;
    }

    scoreElement.innerText = `Score: ${score}/${maxScore}`;
    addMessageToChatBox(aiFeedback.parentNode, aiFeedback.innerText, 'system');
    speakAIText(aiFeedback.innerText);

    displayAndSpeakQuestion(); // Automatically move to next question
}

// End the game
function endGame() {
    aiFeedback.innerText = "Tapos na ang mga tanong.";
    addMessageToChatBox(aiFeedback.parentNode, aiFeedback.innerText, 'system');
    speakAIText(aiFeedback.innerText);
    startButton.innerHTML = 'Restart'; 
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

// Speak AI text
function speakAIText(text, callback) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'tl-PH';
    speech.onend = function () {
        if (typeof callback === 'function') {
            callback(); 
        }
    };
    window.speechSynthesis.speak(speech);
}

// Reset chatbox on load
window.addEventListener('load', () => {
    chatBox.innerHTML = ''; 
    startButton.innerHTML = '<img src="../static/image/mic-icon.png" alt="Mic" id="mic-icon"> Start'; 
});
