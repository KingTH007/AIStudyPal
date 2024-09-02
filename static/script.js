const startRecordButton = document.getElementById('start-record-btn');
const getQuestionButton = document.getElementById('get-question-btn');
const resultElement = document.getElementById('result');
const questionElement = document.getElementById('question');
const audioElement = document.getElementById('audio');

// Check for browser support
if ('webkitSpeechRecognition' in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = function() {
        console.log('Voice recognition started.');
    };

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        resultElement.innerText = `You said: ${transcript}`;
        sendVoiceData(transcript);
    };

    recognition.onerror = function(event) {
        console.error('Error occurred in recognition: ', event.error);
    };

    recognition.onend = function() {
        console.log('Voice recognition ended.');
    };

    startRecordButton.addEventListener('click', function() {
        recognition.start();
    });

} else {
    alert('Your browser does not support Web Speech API. Please use Google Chrome.');
}

getQuestionButton.addEventListener('click', function() {
    fetch('/get_question')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            questionElement.innerText = `Question: ${data.question}`;
        })
        .catch(error => console.error('Error:', error));
});

function sendVoiceData(text) {
    fetch('/process_voice', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: text })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        resultElement.innerText = data.response;
        audioElement.src = data.audio_file;
        audioElement.play();
    })
    .catch(error => console.error('Error:', error));
}
