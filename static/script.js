// Elements
const aiText = document.getElementById('ai-text');
const userText = document.getElementById('user-text');
const aiFeedback = document.getElementById('ai-feedback');
const timerElement = document.getElementById('timer');
const startButton = document.getElementById('start-speech');
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
const instructionText = "Pindutin ang Start button upang simulan ang pagsasanay. Pagkatapos, magsasalita ang AI at maaari mong sagutin gamit ang iyong boses.";
const readyPrompt = "Handa ka na bang magsimula? Sabihin 'oo' upang magpatuloy.";

// Speech Recognition
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'tl-PH';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

// Track button state
let isStarted = false;

// Display instructions and prompt
function displayInstructions() {
    chatBox.innerHTML = ''; // Clear chat box before adding new messages
    addMessageToChatBox(aiText, instructionText, 'system');
    speakAIText(instructionText);
    addMessageToChatBox(aiText, readyPrompt, 'system');
    speakAIText(readyPrompt);
    console.log('displayInstructions', isStarted);
}

// Start timer and speech recognition
function startTimer() {
    timeLeft = 10;
    timerElement.innerText = timeLeft;
    timer = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timer);
            aiFeedback.innerText = "Wala kang sagot. Subukan ulit.";
            addMessageToChatBox(aiFeedback, aiFeedback.innerText, 'system');
            speakAIText(aiFeedback.innerText);
            return;
        }
        timerElement.innerText = timeLeft;
        timeLeft--;
    }, 1000);
    recognition.start(); // Start speech recognition
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
    addMessageToChatBox(aiText, currentQuestion.question, 'system');
    speakAIText(currentQuestion.question);
    startTimer(); // Start timer when question is displayed
}

// Convert text to speech
function speakAIText(text) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'tl-PH'; // Tagalog language
    window.speechSynthesis.speak(speech);
}

// Handle speech recognition results
recognition.onresult = (event) => {
    clearInterval(timer); // Stop the timer
    const transcript = event.results[0][0].transcript;
    userText.innerText = `Sinabi mo: ${transcript}`;
    addMessageToChatBox(userText, `Sinabi mo: ${transcript}`, 'user');
    speakAIText(userText.innerText);

    // Check the user's answer and provide feedback
    const correctAnswer = currentQuestion.answer;
    const isCorrect = transcript.toLowerCase().includes(correctAnswer.toLowerCase());

    aiFeedback.innerText = isCorrect ? "Tama ang sagot!" : "Mali ang sagot. Ang tamang sagot ay: " + correctAnswer;
    addMessageToChatBox(aiFeedback, aiFeedback.innerText, 'system');
    speakAIText(aiFeedback.innerText);

    micIcon.style.filter = 'grayscale(100%)'; // Turn off mic indicator

    // Automatically move to the next question
    displayAndSpeakQuestion();
};

// Handle speech recognition errors
recognition.onerror = (event) => {
    clearInterval(timer); // Stop the timer
    aiFeedback.innerText = `Error occurred: ${event.error}`;
    addMessageToChatBox(aiFeedback, `Error occurred: ${event.error}`, 'system');
    speakAIText(aiFeedback.innerText);
};

// Add messages to chatbox
function addMessageToChatBox(messageElement, text, type) {
    const messageClone = messageElement.cloneNode(true);
    const paragraph = messageClone.querySelector('p');
    if (paragraph){
    messageClone.querySelector('p').innerText = text;
    }else {
console.log('no paragraph found');
    }
    messageClone.classList.add(type === 'system' ? 'ai-message' : 'user-message');
    chatBox.appendChild(messageClone);
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
}

// Start button click handler
startButton.addEventListener('click', function () {
    if (!isStarted) {
        displayInstructions(); // Show instructions and prompt
        startButton.innerHTML = '<img src="../static/image/mic-icon.png" alt="Mic" id="mic-icon"> Start Speaking'; // Change button text and icon
        recognition.start(); // Start listening for readiness
        micIcon.style.filter = 'none'; // Show mic is active
        isStarted = true;
        console.log('isStarted', isStarted);
    } else {
        recognition.stop(); // Stop listening for readiness
        startButton.style.display = 'none'; // Hide the button
        displayAndSpeakQuestion(); // Start asking questions
        console.log('isStarted', isStarted);
    }
});

// Clear chat box and reset button on page load
window.addEventListener('load', () => {
    chatBox.innerHTML = ''; // Clear chat box on page load
    startButton.innerHTML = '<img src="../static/image/mic-icon.png" alt="Mic" id="mic-icon"> Start'; // Set button text to 'Start'
    isStarted = false;
});
