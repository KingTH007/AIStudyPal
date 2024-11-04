//lesson.js
document.addEventListener("DOMContentLoaded", function() {
    const chatContainer = document.querySelector(".chat-container .chat-box");
    const filipinoSubjectLink = document.getElementById("filipino-subject");
    const lesson1Link = document.getElementById("filipino-lesson-1");
    let filipinoVoice = null;
    let speechInstance = null;

    const lesson1ContentText = `
        Aralin 1: Panitikan (Kahulugan at Kahalagahan)
        Panitikan: Ito ay nagmula sa salitang "pang-titik-an" na ang ibig sabihin ay literatura o mga akdang nasusulat.
        KAHULUGAN NG PANITIKAN: Ang pilipinong salita ng “panitikan” ay nanggaling sa wikang latin na “littera”.
        KAHALAGAHAN NG PAG-AARAL NG PANITIKANG PILIPINO:
        - Mabatid ang kaugalian, tradisyon at kultura.
        - Maipagmalaki ang manunulat na Pilipino.
        - Mabatid ang mga akdang Pilipino.
        - Mabatid ang sariling kahusayan, kapintasan at kahinaan.
    `;

    function setFilipinoVoice() {
        const voices = window.speechSynthesis.getVoices();
        filipinoVoice = voices.find(voice => 
            voice.lang === "fil-PH" || voice.lang.startsWith("tl") || voice.lang.includes("Tagalog")
        );
    }

    function stopSpeech() {
        if (speechInstance) {
            window.speechSynthesis.cancel();
            speechInstance = null;
        }
    }

    function speakText(text) {
        const speech = new SpeechSynthesisUtterance(text);
        speech.lang = "tl-PH";
        if (filipinoVoice) speech.voice = filipinoVoice;
        speech.rate = 1;
        
        stopSpeech(); // Ensure any previous instance is stopped
        speechInstance = speech;
        speechSynthesis.speak(speech);

        speech.onend = function() {
            enableQuizzes(); // Enable quizzes when TTS completes
        };
    }

    function showLesson1Title() {
        chatContainer.innerHTML = `
            <h2>Aralin 1: Panitikan and Karunungang-bayan</h2>
            <button id="start-lesson-btn">Start Lesson</button>
        `;
        document.getElementById("start-lesson-btn").addEventListener("click", showLesson1Content);
    }

    function showLesson1Content() {
        chatContainer.innerHTML = `
            <h2>Aralin 1: Panitikan (Kahulugan at Kahalagahan)</h2>
            <p><strong>PANITIKAN</strong>: Ito ay nagmula sa salitang "pang-titik-an" na ang ibig sabihin ay literatura o mga akdang nasusulat...</p>
            <h4>KAHULUGAN NG PANITIKAN</h4>
            <p>Ang pilipinong salita ng “panitikan” ay nanggaling sa wikang latin na “littera”...</p>
            <h4>KAHALAGAHAN NG PAG-AARAL NG PANITIKANG PILIPINO</h4>
            <ul>
                <li>Mabatid ang kaugalian, tradisyon at kultura</li>
                <li>Maipagmalaki ang manunulat na Pilipino</li>
                <li>Mabatid ang mga akdang Pilipino</li>
                <li>Mabatid ang sariling kahusayan, kapintasan at kahinaan</li>
            </ul>
        `;

        speakText(lesson1ContentText);
    }

    function enableQuizzes() {
        const quizLinks = document.querySelectorAll('.lesson-content a');
        quizLinks.forEach(link => {
            link.classList.remove('disabled');
            link.classList.add('enabled');
        });
    }

    // Add a confirmation prompt when switching subjects or lessons
    function confirmNavigation(callback) {
        if (speechInstance) {
            const userConfirmed = confirm("Do you want to discard the current lesson?");
            if (userConfirmed) {
                stopSpeech(); // Stop TTS if the user confirms
                callback();
            }
        } else {
            callback();
        }
    }

    // Filipino Subject click event with confirmation handling
    filipinoSubjectLink.addEventListener("click", function(event) {
        event.preventDefault();
        confirmNavigation(() => {
            chatContainer.innerHTML = `
                <h2>FILIPINO SUBJECT</h2>
                <ul>
                    <li><a href="#" id="lesson-1-link">Aralin 1</a></li>
                    <li><a href="#">Aralin 2</a></li>
                    <li><a href="#">Aralin 3</a></li>
                    <li><a href="#">Aralin 4</a></li>
                </ul>
            `;
            document.getElementById("lesson-1-link").addEventListener("click", function(e) {
                e.preventDefault();
                showLesson1Title();
            });
        });
    });

    // Lesson 1 click event with confirmation handling
    lesson1Link.addEventListener("click", function(event) {
        event.preventDefault();
        confirmNavigation(showLesson1Title);
    });

    window.speechSynthesis.onvoiceschanged = setFilipinoVoice;
    stopSpeech();
});
