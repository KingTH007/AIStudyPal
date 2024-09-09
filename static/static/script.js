// Elements
const aiText = document.getElementById('ai-text');
const userText = document.getElementById('user-text');
const aiFeedback = document.getElementById('ai-feedback');
const timerElement = document.getElementById('timer');
const startSpeechButton = document.getElementById('start-speech');
const aiMessageBubble = document.getElementById('ai-message');
const userMessageBubble = document.getElementById('user-message');
const aiFeedbackBubble = document.getElementById('ai-feedback-message');
const micIcon = document.getElementById('mic-icon');

// Timer
let timer;
let timeLeft = 10;

function startTimer() {
    timeLeft = 10;
    timerElement.innerText = timeLeft;
    timer = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timer);
            aiFeedback.innerText = "Wala kang sagot. Subukan ulit.";
            aiFeedbackBubble.style.display = 'block';
            return;
        }
        timerElement.innerText = timeLeft;
        timeLeft--;
    }, 1000);
}

// Fetch question from API
async function fetchQuestion() {
    try {
        const response = await fetch('https://api.example.com/get_question'); // Replace with your API URL
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        aiText.innerText = data.question;
        speakAIQuestion(data.question);
        return data.question;
    } catch (error) {
        aiFeedback.innerText = 'Failed to fetch question.';
        aiFeedbackBubble.style.display = 'block';
        console.error('Error fetching question:', error);
    }
}

// Convert AI question text to speech
function speakAIQuestion(text) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'tl-PH';
    window.speechSynthesis.speak(speech);
}

// Speech-to-Text
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'tl-PH';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

// Start speech recognition when button is clicked
startSpeechButton.addEventListener('click', async () => {
    const question = await fetchQuestion();
    if (question) {
        recognition.start();
        micIcon.style.filter = 'none'; // Show mic is active
        startTimer(); // Start the timer
    }
});

// Handle speech recognition result
recognition.onresult = async (event) => {
    clearInterval(timer); // Stop the timer
    const transcript = event.results[0][0].transcript;
    userText.innerText = `You said: ${transcript}`;

    // Show the user message bubble
    userMessageBubble.style.display = 'block';

    // Send the user's response to the server for validation
    try {
        const question = aiText.innerText;
        const response = await fetch('https://api.example.com/process_voice', { // Replace with your API URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: transcript, question }),
        });
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        aiFeedback.innerText = data.response;

        // Show the feedback bubble
        aiFeedbackBubble.style.display = 'block';
    } catch (error) {
        aiFeedback.innerText = 'Error processing voice input.';
        aiFeedbackBubble.style.display = 'block';
        console.error('Error processing voice input:', error);
    } finally {
        micIcon.style.filter = 'grayscale(100%)'; // Turn off mic indicator
    }
};

// Handle speech recognition errors
recognition.onerror = (event) => {
    clearInterval(timer); // Stop the timer
    aiFeedback.innerText = `Error occurred: ${event.error}`;
    aiFeedbackBubble.style.display = 'block';
};
