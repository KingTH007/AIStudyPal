const aiQuestion = document.getElementById('ai-question');
const userResponse = document.getElementById('user-response');
const aiFeedback = document.getElementById('ai-feedback');

// Bubbles for AI and user messages
const aiMessageBubble = document.getElementById('ai-message');
const userMessageBubble = document.getElementById('user-message');
const aiFeedbackBubble = document.getElementById('ai-feedback-message');

// AI Question (Text-to-Speech)
const aiQuestionText = "Ano ang capital ng Pilipinas?";
aiQuestion.innerText = aiQuestionText;

// Show the AI question bubble
aiMessageBubble.style.display = 'block';

// Convert AI question text to speech
function speakAIQuestion(text) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'tl-PH';
    window.speechSynthesis.speak(speech);
}
speakAIQuestion(aiQuestionText);

// Speech-to-Text (User Response)
const startSpeechButton = document.getElementById('start-speech');
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'tl-PH';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

// Start speech recognition when button is clicked
startSpeechButton.addEventListener('click', () => {
    recognition.start();
    micIcon.style.filter = 'none'; // Show mic is active
});

// Handle speech recognition result
recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    userResponse.innerText = `You said: ${transcript}`;

    // Show the user message bubble
    userMessageBubble.style.display = 'block';

    // Example logic for response validation
    if (transcript.toLowerCase() === "manila") {
        aiFeedback.innerText = "Tama! The capital of the Philippines is Manila.";
    } else {
        aiFeedback.innerText = "Mali. The capital is Manila.";
    }

    // Show the feedback bubble
    aiFeedbackBubble.style.display = 'block';
    micIcon.style.filter = 'grayscale(100%)'; // Turn off mic indicator
};

// Handle speech recognition errors
recognition.onerror = (event) => {
    aiFeedback.innerText = `Error occurred: ${event.error}`;
};