// Elements
const aiText = document.getElementById('ai-text');
const userText = document.getElementById('user-text');
const aiFeedback = document.getElementById('ai-feedback');
const timerElement = document.getElementById('timer');
const startSpeechButton = document.getElementById('start-speech');
const chatBox = document.querySelector('.chat-box');
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

// Function to start timer
function startTimer() {
    timeLeft = 10;
    timerElement.innerText = timeLeft;
    timer = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timer);
            aiFeedback.innerText = "Wala kang sagot. Subukan ulit.";
            addMessageToChatBox(aiFeedback, aiFeedback.innerText);
            speakAIText(aiFeedback.innerText);
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
    addMessageToChatBox(aiText, currentQuestion.question);
    speakAIText(currentQuestion.question);
}

// Convert text to speech
function speakAIText(text) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'tl-PH'; // Tagalog language
    speech.onend = () => {
        startTimer(); // Start timer after speaking
        recognition.start(); // Start recognition after question is spoken
    };
    window.speechSynthesis.speak(speech);
}

// Handle speech recognition result for the readiness prompt
recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.toLowerCase().trim();

    if (transcript === 'oo') {
        // If the user confirms they are ready, start the main process
        aiText.innerText = '';
        startSpeechButton.style.display = 'none'; // Hide the start button
        recognition.stop(); // Stop listening for readiness
        displayAndSpeakQuestion(); // Start asking questions
    } else if (transcript !== '') {
        aiFeedback.innerText = `Hindi kita naintindihan. Sabihin 'oo' kung handa ka nang magsimula.`;
        addMessageToChatBox(aiFeedback, aiFeedback.innerText);
        speakAIText(aiFeedback.innerText);
    }
};

// Handle speech recognition result for the main process
recognition.onresult = (event) => {
    clearInterval(timer); // Stop the timer
    const transcript = event.results[0][0].transcript;
    userText.innerText = `Sinabi mo: ${transcript}`;
    addMessageToChatBox(userText, `Sinabi mo: ${transcript}`);
    speakAIText(userText.innerText);

    // Check the user's answer and provide feedback
    const correctAnswer = currentQuestion.answer;
    const isCorrect = transcript.toLowerCase().includes(correctAnswer.toLowerCase());

    aiFeedback.innerText = isCorrect ? "Tama ang sagot!" : "Mali ang sagot. Ang tamang sagot ay: " + correctAnswer;
    addMessageToChatBox(aiFeedback, aiFeedback.innerText);
    speakAIText(aiFeedback.innerText);

    micIcon.style.filter = 'grayscale(100%)'; // Turn off mic indicator

    // Automatically move to the next question
    displayAndSpeakQuestion();
};

// Handle speech recognition errors
recognition.onerror = (event) => {
    clearInterval(timer); // Stop the timer
    aiFeedback.innerText = `Error occurred: ${event.error}`;
    addMessageToChatBox(aiFeedback, `Error occurred: ${event.error}`);
    speakAIText(aiFeedback.innerText);
};

// Function to add messages to chatbox
function addMessageToChatBox(messageElement, text) {
    const messageClone = messageElement.cloneNode(true);
    messageClone.querySelector('p').innerText = text;
    chatBox.appendChild(messageClone);
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
}

// Handle the "Start Speaking" button click
startSpeechButton.addEventListener('click', () => {
    addMessageToChatBox(aiText, readyPrompt);
    speakAIText(readyPrompt);
    recognition.start(); // Start listening for the "oo" response
});
