let selectedLesson = null; // Tracks which lesson is selected
const lesson1Content = `...`; // The full Lesson 1 content (as you've provided)

// Handle click event for Filipino Subject
document.getElementById('filipino-subject').addEventListener('click', function (e) {
    e.preventDefault(); // Prevent default link behavior
    addMessageToChatBox("Napili mo ang Filipino na subject.", 'system');
    selectedLesson = null; // Reset selected lesson
});

// Handle click event for Filipino Lesson 1
document.getElementById('filipino-lesson-1').addEventListener('click', function (e) {
    e.preventDefault(); // Prevent default link behavior
    addMessageToChatBox("Napili mo ang Lesson 1: 'Panitikan (Kahulugan at Kahalagahan)'.", 'system');
    selectedLesson = 'lesson1'; // Set selected lesson to Lesson 1
});

// Handle Start button click event
document.getElementById('start-speech').addEventListener('click', function () {
    if (selectedLesson === 'lesson1') {
        addMessageToChatBox("Simula na ang Lesson 1...", 'system');
        addMessageToChatBox(lesson1Content, 'system'); // Add Lesson 1 content to chatbox
        // After lesson content, start asking identification questions
        displayAndSpeakQuestion();
    } else {
        alert('Pumili muna ng isang lesson bago pindutin ang Start.');
    }
});

// Function to display and speak a random question
function displayAndSpeakQuestion() {
    currentQuestion = getRandomQuestion(); // Get a random question from the pool
    if (!currentQuestion) {
        endGame(); // If all questions are asked, end the game
        return;
    }
    addMessageToChatBox(currentQuestion.question, 'system'); // Add the question to the chatbox
    speakAIText(currentQuestion.question, function () {
        startRecognition(handleUserResponse); // Start speech recognition for user response
    });
}

// Handle user's response after AI asks a question
function handleUserResponse(transcript) {
    addMessageToChatBox(`Sinabi mo: ${transcript}`, 'user'); // Add user response to chatbox

    const correctAnswer = currentQuestion.answer;
    const isCorrect = transcript.toLowerCase().includes(correctAnswer.toLowerCase());

    const feedback = isCorrect ? "Tama ang sagot!" : `Mali ang sagot. Ang tamang sagot ay: ${correctAnswer}`;
    addMessageToChatBox(feedback, 'system');
    speakAIText(feedback, function () {
        if (isCorrect) {
            score += 2;
        }
        scoreElement.innerText = `Score: ${score}/${maxScore}`; // Update score
        displayAndSpeakQuestion(); // Move to the next question
    });
}

// Function to add messages to the chatbox without clearing it
function addMessageToChatBox(text, type) {
    const messageElement = document.createElement('div');
    messageElement.classList.add(type === 'system' ? 'ai-message' : 'user-message');
    messageElement.innerHTML = `<p>${text}</p>`;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the latest message
}

// Reset chatbox and start button on page load
window.addEventListener('load', () => {
    chatBox.innerHTML = ''; 
    startButton.innerHTML = '<img src="../static/image/mic-icon.png" alt="Mic" id="mic-icon"> Start'; 
});
