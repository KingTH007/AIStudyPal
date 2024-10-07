// Elements
const aiText = document.getElementById('ai-text');
const userText = document.getElementById('user-text');
const aiFeedback = document.getElementById('ai-feedback');
const timerElement = document.getElementById('timer');
const startButton = document.getElementById('start-speech');
const chatBox = document.querySelector('.chat-box');
const micIcon = document.getElementById('mic-icon');
const scoreElement = document.getElementById('score');

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
    };
    
}

// Predefined questions and answers in Filipino
const questions = [
    { question: "Ano ang tawag sa mga kasabihan o kawikaan na may dalang aral at ginagamit bilang idyoma?", answer: "sawikain" },
    { question: "Ano ang tawag sa bahagi ng kulturang pilipino na ipinasa pa galing sa mga ninuno?", answer: "kasabihan" },
    { question: "Ano ang tawag sa tanong o pangungusap na may nakatagong kahulugan na nilulutas bilang palaisipan?", answer: "bugtong" },
    { question: "Anong anyo ng panitikan ang nagbibigay ng magagandang aral o gabay sa pamumuhay?", answer: "salawikain" },
    { question: "Anong akdang may kinalaman sa kathang-isip, pag-ibig, at kasaysayan?", answer: "panitikan" }
];

// Score
let score = 0;
const maxScore = 10;

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

navigator.mediaDevices.getUserMedia({ audio: true })
    .then((stream) => {
        startButton.disabled = false; // Enable the start button
        console.log("Microphone is available");
    })
    .catch((error) => {
        alert('Microphone is not available. Please make sure your microphone is connected and enabled.');
        console.error('Microphone access error:', error);
    });

// Ensure recognition restarts after AI finishes speaking
function speakAIText(text, callback) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'tl-PH';

    speech.onend = function () {
        console.log('AI speech ended.');
        if (typeof callback === 'function') {
            callback(); // Start recognition again after speech ends
        }

        // Start speech recognition after AI speech ends
        if (recognition) {
            console.log('Starting speech recognition after AI speech...');
            recognition.start();
            micIcon.style.filter = 'none'; // Show mic is active
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

    // Display final score
    scoreElement.innerText = `Final Score: ${score}/${maxScore}`;
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
