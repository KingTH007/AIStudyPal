// Elements
const aiText = document.getElementById('ai-text');
const userText = document.getElementById('user-text');
const aiFeedback = document.getElementById('ai-feedback');
const timerElement = document.getElementById('timer');
const startButton = document.getElementById('start-speech');
const chatBox = document.querySelector('.chat-box');
const micIcon = document.getElementById('mic-icon');

// Speech Recognition initialization for cross-browser compatibility
let recognition;

if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();  // For Chrome and Edge
} else if ('SpeechRecognition' in window) {
    recognition = new SpeechRecognition();  // For standard browsers supporting SpeechRecognition
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
        clearInterval(timer); // Stop the timer
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
            case 'service-not-allowed':
                errorMessage = 'Speech recognition service is not available. Please try again later.';
                break;
            default:
                errorMessage = `Error occurred: ${event.error}`;
                break;
        }

        aiFeedback.innerText = errorMessage;
        addMessageToChatBox(aiFeedback.parentNode, errorMessage, 'system');
        speakAIText(errorMessage);
        micIcon.style.filter = 'grayscale(100%)'; // Turn off mic indicator
        console.log('Error:', event.error);
    };
}

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
let askedQuestions = []; // Array to keep track of asked questions

// Instructions and prompt
const instructionText = "Pindutin ang Start button upang simulan ang pagsasanay. Pagkatapos, magsasalita ang AI at maaari mong sagutin gamit ang iyong boses.";
const readyPrompt = "Handa ka na bang magsimula? upang magpatuloy pindutin ang 'start speaking'.";

// Start button click handler
startButton.addEventListener('click', function () {
    if (!isStarted) {
        displayInstructions(); // Show instructions and prompt
        startButton.innerHTML = '<img src="../static/image/mic-icon.png" alt="Mic" id="mic-icon"> Start Speaking'; // Change button text and icon
        isStarted = true;
    } else if (startButton.innerHTML.includes('Restart')) {
        restartGame(); // Reset game if Restart button is clicked
    } else {
        startButton.style.display = 'none'; // Hide the button
        displayAndSpeakQuestion(); // Start asking questions
    }
});

// Track button state
let isStarted = false;

// Display instructions and prompt
function displayInstructions() {
    alert(instructionText);

    chatBox.innerHTML = '';
    addMessageToChatBox(aiText.parentNode, readyPrompt, 'system');
    speakAIText(readyPrompt, () => {
        if (recognition) {
            recognition.start(); // Start voice recognition after AI speech ends if supported
            micIcon.style.filter = 'none'; // Show mic is active
        }
    });
}

// Start timer and speech recognition
function startTimer() {
    timeLeft = 10;
    timer = setInterval(() => {
        timerElement.innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            aiFeedback.innerText = "Wala kang sagot. Subukan ulit.";
            addMessageToChatBox(aiFeedback.parentNode, aiFeedback.innerText, 'system');
            speakAIText(aiFeedback.innerText);
            // Automatically move to the next question if time runs out
            displayAndSpeakQuestion();
        } else {
            timeLeft--; // Decrease time
        }
    }, 1000);
}

// Get a random question from predefined list
function getRandomQuestion() {
    if (askedQuestions.length === questions.length) {
        // All questions have been asked
        return null;
    }
    let question;
    do {
        const index = Math.floor(Math.random() * questions.length);
        question = questions[index];
    } while (askedQuestions.includes(question));

    askedQuestions.push(question); // Mark question as asked
    return question;
}

// Display question and speak it
function displayAndSpeakQuestion() {
    currentQuestion = getRandomQuestion();
    if (!currentQuestion) {
        endGame(); // End the game if all questions are asked
        return;
    }
    aiText.innerText = currentQuestion.question;
    addMessageToChatBox(aiText.parentNode, currentQuestion.question, 'system');
    speakAIText(currentQuestion.question);
    startTimer(); // Start timer when question is displayed

    // Stop speech recognition while AI is speaking
    if (recognition) {
        recognition.stop();
    }
}

// Convert text to speech with a callback when done
function speakAIText(text, callback) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'tl-PH'; // Tagalog language

    speech.onend = function () {
        if (typeof callback === 'function') {
            callback(); // Call the callback function after speech ends
            // Start speech recognition after AI has finished speaking
            if (recognition) {
                recognition.start();
                micIcon.style.filter = 'none'; // Show mic is active again
            }
        }
    };

    window.speechSynthesis.speak(speech);
}

// Handle speech recognition results
if (recognition) {
    recognition.onresult = (event) => {
        clearInterval(timer); // Stop the timer
        const transcript = event.results[0][0].transcript;
        userText.innerText = `Sinabi mo: ${transcript}`;
        addMessageToChatBox(userText.parentNode, `Sinabi mo: ${transcript}`, 'user');
        speakAIText(userText.innerText);

        // Check the user's answer and provide feedback
        const correctAnswer = currentQuestion.answer;
        const isCorrect = transcript.toLowerCase().includes(correctAnswer.toLowerCase());

        aiFeedback.innerText = isCorrect ? "Tama ang sagot!" : "Mali ang sagot. Ang tamang sagot ay: " + correctAnswer;
        addMessageToChatBox(aiFeedback.parentNode, aiFeedback.innerText, 'system');
        speakAIText(aiFeedback.innerText);

        micIcon.style.filter = 'grayscale(100%)'; // Turn off mic indicator

        // Automatically move to the next question
        displayAndSpeakQuestion();
    };
}

// End the game when all questions are asked
function endGame() {
    clearInterval(timer); // Stop the timer
    aiFeedback.innerText = "Tapos na ang mga tanong.";
    addMessageToChatBox(aiFeedback.parentNode, aiFeedback.innerText, 'system');
    speakAIText(aiFeedback.innerText);
    micIcon.style.filter = 'grayscale(100%)'; // Turn off mic indicator
    startButton.innerHTML = 'Restart'; // Change button to Restart
}

// Restart the game
function restartGame() {
    chatBox.innerHTML = ''; // Clear chat box
    askedQuestions = []; // Reset asked questions
    startButton.innerHTML = '<img src="../static/image/mic-icon.png" alt="Mic" id="mic-icon"> Start'; // Set button text to 'Start'
    isStarted = false; // Reset the start state
}

// Add messages to chatbox
function addMessageToChatBox(messageElement, text, type) {
    const messageClone = messageElement.cloneNode(true);
    const paragraph = messageClone.querySelector('p');
    if (paragraph) {
        paragraph.innerText = text;
    } else {
        console.log('No paragraph found');
    }
    messageClone.classList.add(type === 'system' ? 'ai-message' : 'user-message');
    chatBox.appendChild(messageClone);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Clear chat box and reset button on page load
window.addEventListener('load', () => {
    chatBox.innerHTML = ''; // Clear chat box on page load
    startButton.innerHTML = '<img src="../static/image/mic-icon.png"  alt="Mic" id="mic-icon"> Start'; // Set button text to 'Start'
    isStarted = false; // Reset the start state
    
    const voices = window.speechSynthesis.getVoices();
    console.log(voices); 
});
