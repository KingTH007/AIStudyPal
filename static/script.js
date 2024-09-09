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

// Predefined questions and answers in Filipino
const questions = [
    { question: "Ano ang pangunahing layunin ng Balagtasan?", answer: "sa pamamagitan ng tula." },
    { question: "Sino ang tinaguriang 'Ama ng Wika' sa Pilipinas?", answer: "Si Manuel L. Quezon" },
    { question: "Ano ang pagkakaiba ng tula at kwento?", answer: "Ang tula ay may sukat at tugma, ang kwento ay isang naratibong." },
    { question: "Ano ang kahulugan ng 'Buwan ng Wika'?", answer: "paggamit ng wikang Filipino" },
    { question: "Paano nakakatulong ang pagsasalita ng Tagalog sa pag-unlad ng bansa?", answer: "pagkakaisa at pag-unawa" }
];

// Timer
let timer;
let timeLeft = 10;
let currentQuestion = {};

// Instructions and prompt
const instructionText = "Pindutin ang Start Speaking button upang simulan ang pagsasanay. Pagkatapos, magsasalita ang AI at maaari mong sagutin gamit ang iyong boses.";
const readyPrompt = "Handa ka na bang magsimula? Sabihin 'oo' upang magpatuloy.";

// Speech Recognition
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'tl-PH';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

// Display instructions and prompt on page load
window.addEventListener('load', () => {
    aiText.innerText = instructionText;
    aiFeedbackBubble.style.display = 'block';

    // Automatically start recognition to listen for "oo" response
    recognition.start();
});

// Handle speech recognition result
recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.toLowerCase().trim();

    if (transcript === 'oo') {
        // If the user confirms they are ready, start the main process
        aiFeedbackBubble.style.display = 'none'; // Hide instructions
        displayAndSpeakQuestion();
        micIcon.style.filter = 'none'; // Show mic is active
        recognition.start(); // Restart recognition for the main process
    } else if (transcript !== '') {
        aiFeedback.innerText = `Hindi kita naintindihan. Sabihin 'oo' kung handa ka nang magsimula.`;
        aiFeedbackBubble.style.display = 'block';
    }
};

// Function to start timer
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
    currentQuestion = getRandomQuestion();
    aiText.innerText = currentQuestion.question;
    speakAIQuestion(currentQuestion.question);
}

// Convert AI question text to speech
function speakAIQuestion(text) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'tl-PH'; // Tagalog language
    speech.onend = () => {
        startTimer(); // Start timer after speaking
    };
    window.speechSynthesis.speak(speech);
}

// Handle speech recognition result for the main process
recognition.onresult = (event) => {
    clearInterval(timer); // Stop the timer
    const transcript = event.results[0][0].transcript;
    userText.innerText = `Sinabi mo: ${transcript}`;

    // Show the user message bubble
    userMessageBubble.style.display = 'block';

    // Check the user's answer and provide feedback
    const correctAnswer = currentQuestion.answer;
    const isCorrect = transcript.toLowerCase().includes(correctAnswer.toLowerCase());

    aiFeedback.innerText = isCorrect ? "Tama ang sagot!" : "Mali ang sagot. Ang tamang sagot ay: " + correctAnswer;
    aiFeedbackBubble.style.display = 'block';
    micIcon.style.filter = 'grayscale(100%)'; // Turn off mic indicator

    // Add new messages to chatbox
    addMessageToChatBox(aiMessageBubble, currentQuestion.question);
    addMessageToChatBox(userMessageBubble, `Sinabi mo: ${transcript}`);
    addMessageToChatBox(aiFeedbackBubble, aiFeedback.innerText);
};

// Handle speech recognition errors
recognition.onerror = (event) => {
    clearInterval(timer); // Stop the timer
    aiFeedback.innerText = `Error occurred: ${event.error}`;
    aiFeedbackBubble.style.display = 'block';
    addMessageToChatBox(aiMessageBubble, `Error occurred: ${event.error}`);
};

// Function to add messages to chatbox
function addMessageToChatBox(messageBubble, text) {
    const messageClone = messageBubble.cloneNode(true);
    messageClone.querySelector('p').innerText = text;
    document.querySelector('.chat-box').appendChild(messageClone);
}
