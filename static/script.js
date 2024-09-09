const aiText = document.getElementById('ai-text');
const userText = document.getElementById('user-text');
const aiFeedback = document.getElementById('ai-feedback');

// Bubbles for AI and user messages
const aiMessageBubble = document.getElementById('ai-message');
const userMessageBubble = document.getElementById('user-message');
const aiFeedbackBubble = document.getElementById('ai-feedback-message');

// Timer
let timer;
let timeLeft = 10;
const timerElement = document.getElementById('timer');

function startTimer() {
    timeLeft = 10;
    timerElement.innerText = timeLeft;
    timer = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timer);
            aiFeedback.innerText = "Wala kang sagot. Subukan ulit.";
            aiFeedbackBubble.style.display = 'block';
            aiMessageBubble.style.display = 'block';
            return;
        }
        timerElement.innerText = timeLeft;
        timeLeft--;
    }, 1000);
}

// Fetch question from API
async function fetchQuestion() {
    const response = await fetch('/get_question');
    const data = await response.json();
    aiText.innerText = data.question;
    speakAIQuestion(data.question);
    return data.question;
}

// Convert AI question text to speech
function speakAIQuestion(text) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'tl-PH';
    window.speechSynthesis.speak(speech);
}

// Speech-to-Text
const startSpeechButton = document.getElementById('start-speech');
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'tl-PH';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

// Start speech recognition when button is clicked
startSpeechButton.addEventListener('click', async () => {
    const question = await fetchQuestion();
    recognition.start();
    micIcon.style.filter = 'none'; // Show mic is active
    startTimer(); // Start the timer
});

// Handle speech recognition result
recognition.onresult = async (event) => {
    clearInterval(timer); // Stop the timer
    const transcript = event.results[0][0].transcript;
    userText.innerText = `You said: ${transcript}`;

    // Show the user message bubble
    userMessageBubble.style.display = 'block';

    // Send the user's response to the server for validation
    const question = aiText.innerText;
    const response = await fetch('/process_voice', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: transcript, question }),
    });
    const data = await response.json();

    aiFeedback.innerText = data.response;

    // Show the feedback bubble
    aiFeedbackBubble.style.display = 'block';
    micIcon.style.filter = 'grayscale(100%)'; // Turn off mic indicator
};

// Handle speech recognition errors
recognition.onerror = (event) => {
    clearInterval(timer); // Stop the timer
    aiFeedback.innerText = `Error occurred: ${event.error}`;
    aiFeedbackBubble.style.display = 'block';
};
