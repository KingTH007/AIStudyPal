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

// Predefined questions in Filipino
const questions = [
    "Ano ang pangunahing layunin ng Balagtasan?",
    "Sino ang tinaguriang 'Ama ng Wika' sa Pilipinas?",
    "Ano ang pagkakaiba ng tula at kwento?",
    "Ano ang kahulugan ng 'Buwan ng Wika'?",
    "Paano nakakatulong ang pagsasalita ng Tagalog sa pag-unlad ng bansa?"
];

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

// Get a random question from predefined list
function getRandomQuestion() {
    const index = Math.floor(Math.random() * questions.length);
    return questions[index];
}

// Display question and speak it
function displayAndSpeakQuestion() {
    const question = getRandomQuestion();
    aiText.innerText = question;
    speakAIQuestion(question);
}

// Convert AI question text to speech
function speakAIQuestion(text) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'tl-PH'; // Tagalog language
    window.speechSynthesis.speak(speech);
}

// Speech-to-Text
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'tl-PH';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

// Start speech recognition when button is clicked
startSpeechButton.addEventListener('click', () => {
    displayAndSpeakQuestion();
    recognition.start();
    micIcon.style.filter = 'none'; // Show mic is active
    startTimer(); // Start the timer
});

// Handle speech recognition result
recognition.onresult = (event) => {
    clearInterval(timer); // Stop the timer
    const transcript = event.results[0][0].transcript;
    userText.innerText = `Sinabi mo: ${transcript}`;

    // Show the user message bubble
    userMessageBubble.style.display = 'block';

    // Simulate AI feedback based on user input
    aiFeedback.innerText = "Salamat sa iyong sagot!";
    aiFeedbackBubble.style.display = 'block';
    micIcon.style.filter = 'grayscale(100%)'; // Turn off mic indicator
};

// Handle speech recognition errors
recognition.onerror = (event) => {
    clearInterval(timer); // Stop the timer
    aiFeedback.innerText = `Error occurred: ${event.error}`;
    aiFeedbackBubble.style.display = 'block';
};
