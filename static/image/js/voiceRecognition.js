// Declare recognition globally
let recognition;
let micIcon = document.getElementById('mic-icon');
let recognitionActive = false; // Track if recognition is active

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
    recognition.lang = 'tl-PH';  // Use Filipino language
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

    // Ensure recognition stops when needed
    recognition.onend = function () {
        recognitionActive = false; // Reset flag when recognition ends
    };
}

// Start speech recognition
function startRecognition(callback) {
    if (recognition && !recognitionActive) {
        recognition.start(); // Only start recognition if it's not already running
        micIcon.style.filter = 'none'; // Show mic is active
        recognitionActive = true; // Set flag to indicate that recognition has started
    }
}

// Handle speech recognition results
function handleSpeechResult(event) {
    recognitionActive = false; // Reset flag when recognition finishes
    const transcript = event.results[0][0].transcript;
    userText.innerText = `Sinabi mo: ${transcript}`;
    addMessageToChatBox(userText.parentNode, `Sinabi mo: ${transcript}`, 'user');
    speakAIText(userText.innerText);

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
    recognitionActive = false; // Allow restarting recognition for the next question
    displayAndSpeakQuestion(); // Automatically move to the next question
}

// Handle speech recognition errors
function handleSpeechError(event) {
    recognitionActive = false; // Reset flag when error occurs
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
