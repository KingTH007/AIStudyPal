//voiceRecognition
let recognition; // Declare recognition globally

// Function to start speech recognition
function startRecognition(callback) {
    recognition = new webkitSpeechRecognition() || new SpeechRecognition(); // WebkitSpeechRecognition for compatibility
    recognition.lang = 'tl-PH'; // Tagalog language
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = function (event) {
        const transcript = event.results[0][0].transcript;
        callback(transcript); // Call handleUserResponse
    };

    recognition.onerror = function (event) {
        console.error("Recognition error:", event.error); // Debugging
        callback(''); // Empty response if recognition fails
    };

    recognition.start(); // Start listening
}

// Function to handle user response
function handleUserResponse(transcript) {
    stopTimer(); // Stop the timer as soon as the user responds
    userText.innerText = `Sinabi mo: ${transcript}`;
    addMessageToChatBox(userText.parentNode, `Sinabi mo: ${transcript}`, 'user');

    const correctAnswer = currentQuestion.answer;
    const isCorrect = transcript.toLowerCase().includes(correctAnswer.toLowerCase());

    if (isCorrect) {
        aiFeedback.innerText = "Tama ang sagot!";
        score += 2; // Increase score for correct answer
    } else {
        aiFeedback.innerText = `Mali ang sagot. Ang tamang sagot ay: ${correctAnswer}`;
    }

    scoreElement.innerText = `Score: ${score}/${maxScore}`; // Update score display
    addMessageToChatBox(aiFeedback.parentNode, aiFeedback.innerText, 'system');

    if (score >= maxScore) {
        endGame(); // End game after reaching max score
    } else {
        speakAIText(aiFeedback.innerText, function () {
            displayAndSpeakQuestion(); // Ask the next question
        });
    }
}

