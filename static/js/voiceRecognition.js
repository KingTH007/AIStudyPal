//voiceRecognition.js
// Declare recognition globally
let recognition;
let micIcon = document.getElementById('mic-icon');
let recognitionActive = false; // Track if recognition is active

// Initialize Speech Recognition for cross-browser compatibility
if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition(); // For Chrome and Edge
} else if ('SpeechRecognition' in window) {
    recognition = new SpeechRecognition(); // For standard browsers supporting SpeechRecognition
} else {
    alert('Speech recognition is not supported by your browser. Please use Chrome, Edge, or another supported browser.');
    recognition = null;
}

// Check if recognition is available and set up microphone access
if (recognition) {
    recognition.lang = 'tl-PH'; // Use Filipino language
    recognition.interimResults = false; // Disable interim results (only final results)
    recognition.maxAlternatives = 1;

    // Check if microphone is available and request permission
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
            startButton.disabled = false; // Enable the start button if microphone is available
        })
        .catch((error) => {
            alert('Microphone is not available. Please make sure your microphone is connected and enabled.');
            console.error('Microphone error:', error);
        });

    // Handle speech recognition results
    recognition.onresult = (event) => {
        handleSpeechResult(event);
    };

    // Handle recognition errors
    recognition.onerror = (event) => {
        handleSpeechError(event);
    };

    // Handle when recognition ends (whether successfully or due to an error)
    recognition.onend = () => {
        recognitionActive = false;
        micIcon.style.filter = 'grayscale(100%)'; // Indicate mic is off
    };
}

// Function to start speech recognition
function startRecognition() {
    if (recognition && !recognitionActive) {
        recognition.start(); // Start recognition if not active
        micIcon.style.filter = 'none'; // Show mic is active
        recognitionActive = true; // Mark recognition as active
    } else {
        console.error("Recognition is already active or not initialized.");
    }
}

// Function to handle speech recognition results
function handleSpeechResult(event) {
    recognitionActive = false; // Reset flag when recognition finishes
    const transcript = event.results[0][0].transcript; // Get spoken text
    userText.innerText = `Sinabi mo: ${transcript}`; // Display spoken text
    addMessageToChatBox(userText.parentNode, `Sinabi mo: ${transcript}`, 'user'); // Add to chatbox
    speakAIText(userText.innerText); // Read it back to the user

    const correctAnswer = currentQuestion.answer; // Assuming currentQuestion contains the correct answer
    const isCorrect = transcript.toLowerCase().includes(correctAnswer.toLowerCase());

    if (isCorrect) {
        aiFeedback.innerText = "Tama ang sagot!";
        score += 2; // Increase score by 2 for correct answer
    } else {
        aiFeedback.innerText = `Mali ang sagot. Ang tamang sagot ay: ${correctAnswer}`;
    }

    scoreElement.innerText = `Score: ${score}/${maxScore}`; // Update score display
    addMessageToChatBox(aiFeedback.parentNode, aiFeedback.innerText, 'system');
    speakAIText(aiFeedback.innerText); // Provide feedback through text-to-speech

    micIcon.style.filter = 'grayscale(100%)'; // Turn off mic indicator
    recognitionActive = false; // Allow restarting recognition for the next question
    displayAndSpeakQuestion(); // Move to next question
}

// Function to handle speech recognition errors
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
