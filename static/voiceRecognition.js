// voiceRecognition.js

let recognition;
let micIcon = document.getElementById('mic-icon');
const startButton = document.getElementById('start-speech');

// Speech Recognition initialization for cross-browser compatibility
if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition(); // For Chrome and Edge
} else if ('SpeechRecognition' in window) {
    recognition = new SpeechRecognition(); // For standard browsers supporting SpeechRecognition
} else {
    alert('Speech recognition is not supported by your browser. Please use Chrome, Edge, or another supported browser.');
    recognition = null;
}

// Initialize Speech Recognition
if (recognition) {
    recognition.lang = 'tl-PH';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    // Check if microphone is available
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
            startButton.disabled = false; // Enable the start button
        })
        .catch((error) => {
            alert('Microphone is not available. Please make sure your microphone is connected and enabled.');
            console.error(error);
        });

    // Handle speech recognition errors
    recognition.onerror = (event) => {
        handleSpeechError(event);
    };

    // Handle speech recognition results
    recognition.onresult = (event) => {
        handleSpeechResult(event);
    };
}

// Start speech recognition
function startRecognition(callback) {
    if (recognition) {
        recognition.start();
        micIcon.style.filter = 'none'; // Show mic is active
    }
}

// Handle speech recognition results
function handleSpeechResult(event) {
    clearInterval(timer); // Stop the timer
    const transcript = event.results[0][0].transcript;
    userText.innerText = `Sinabi mo: ${transcript}`;
    addMessageToChatBox(userText.parentNode, `Sinabi mo: ${transcript}`, 'user');
    speakAIText(userText.innerText);

    // Check the user's answer and provide feedback
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

    micIcon.style.filter = 'grayscale(100%)'; // Turn off mic indicator

    // Automatically move to the next question
    displayAndSpeakQuestion();
}

// Handle speech recognition errors
function handleSpeechError(event) {
    clearInterval(timer); // Stop the timer
    console.error('Speech recognition error:', event.error); // Log the exact error
    let errorMessage = 'An error occurred';

    switch (event.error) {
        case 'network':
            errorMessage = 'Network error occurred. Please check your internet connection.';
            break;
        case 'no-speech':
            errorMessage = 'No speech detected. Please try speaking louder or closer to the microphone.';
            break;
        case 'audio-capture':
            errorMessage = 'Audio capture error. Ensure your microphone is properly connected.';
            break;
        case 'not-allowed':
            errorMessage = 'Permission to use the microphone is denied. Please grant microphone access.';
            break;
        default:
            errorMessage = `Error occurred: ${event.error}`;
            break;
    }

    aiFeedback.innerText = errorMessage;
    addMessageToChatBox(aiFeedback.parentNode, errorMessage, 'system');
    speakAIText(errorMessage);
    micIcon.style.filter = 'grayscale(100%)'; // Turn off mic indicator
}

// Text-to-speech for AI
function speakAIText(text, callback) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'tl-PH';

    speech.onend = function () {
        if (typeof callback === 'function') {
            callback(); // Start recognition again after speech ends
        }
        if (recognition) {
            startRecognition(); // Start recognition after AI speech
        }
    };

    window.speechSynthesis.speak(speech);
}

window.onload = function() {
    // All your JavaScript logic here
    console.log("Chatbox JS loaded!");

    // Example: Interacting with DOM elements safely after load
    const chatBox = document.querySelector('.chat-box');
    const startButton = document.getElementById('start-speech');
    
    startButton.addEventListener('click', function() {
        console.log('Start button clicked!');
        console.log('voice');
        // Your other logic here
    });
};
