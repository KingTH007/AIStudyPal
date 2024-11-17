document.addEventListener("DOMContentLoaded", function() {
    const filipinoLessonsDiv = document.getElementById("filipino-lessons");
    const lesson1TitleDiv = document.getElementById("lesson-1-title");
    const lesson1ContentDiv = document.getElementById("lesson-1-content");
    const filipinoSubjectLink = document.getElementById("filipino-subject");
    const lesson1Link = document.getElementById("lesson-1-link");
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

    function showDiv(div) {
        // Hide all divs in the chat box
        [filipinoLessonsDiv, lesson1TitleDiv, lesson1ContentDiv].forEach(d => d.classList.add("hidden"));
        // Show the requested div
        div.classList.remove("hidden");
    }

    function enableQuizzes() {
        const quizLinks = document.querySelectorAll('.lesson-content a');
        quizLinks.forEach(link => {
            link.classList.remove('disabled');
            link.classList.add('enabled');
        });
    }

    // Filipino Subject click event with confirmation handling
    filipinoSubjectLink.addEventListener("click", function(event) {
        event.preventDefault();
        confirmNavigation(() => showDiv(filipinoLessonsDiv));
    });

    // Lesson 1 link click event
    lesson1Link.addEventListener("click", function(event) {
        event.preventDefault();
        confirmNavigation(() => showDiv(lesson1TitleDiv));
    });

    // Start lesson button click event
    document.getElementById("start-lesson-btn").addEventListener("click", function() {
        showDiv(lesson1ContentDiv);
        speakText(lesson1ContentText);
    });

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

    window.speechSynthesis.onvoiceschanged = setFilipinoVoice;
    stopSpeech();

    window.addEventListener("beforeunload", function() {
        stopSpeech();
    });
});
