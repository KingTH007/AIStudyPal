document.addEventListener("DOMContentLoaded", function() {
    // Get references to the chat-container and sidebar links
    const chatContainer = document.querySelector(".chat-container .chat-box");
    const filipinoSubjectLink = document.getElementById("filipino-subject");
    const lesson1Link = document.getElementById("filipino-lesson-1");

    // Define lesson content
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

    // Variable to store the selected voice for Tagalog
    let filipinoVoice = null;

    // Load voices and select Filipino-compatible voice
    function setFilipinoVoice() {
        const voices = window.speechSynthesis.getVoices();
        filipinoVoice = voices.find(voice => 
            voice.lang === "fil-PH" || voice.lang.startsWith("tl") || voice.lang.includes("Tagalog")
        );
    }

    // Text-to-speech function for lesson content
    function speakText(text) {
        const speech = new SpeechSynthesisUtterance(text);
        speech.lang = "tl-PH"; // Filipino language code
        if (filipinoVoice) {
            speech.voice = filipinoVoice; // Set Filipino voice if available
        }
        speech.rate = 1;
        speechSynthesis.speak(speech);
    }

    // Function to display Lesson 1 title with Start Lesson button
    function showLesson1Title() {
        chatContainer.innerHTML = `
            <h2>Aralin 1: Panitikan and Karunungang-bayan </h2>
            <button id="start-lesson-btn">Start Lesson</button>
        `;

        // Add event listener for Start Lesson button
        document.getElementById("start-lesson-btn").addEventListener("click", showLesson1Content);
    }

    // Function to display full Lesson 1 content and initiate text-to-speech
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

        // Start text-to-speech for lesson content
        speakText(lesson1ContentText);
    }

    // Display the Filipino subject and list of lessons
    filipinoSubjectLink.addEventListener("click", function(event) {
        event.preventDefault();
        chatContainer.innerHTML = `
            <h2>FILIPINO SUBJECT</h2>
            <ul>
                <li><a href="#" id="lesson-1-link">Aralin 1</a></li>
                <li><a href="#">Aralin 2</a></li>
                <li><a href="#">Aralin 3</a></li>
                <li><a href="#">Aralin 4</a></li>
            </ul>
        `;

        // Add event listener to the dynamically created Lesson 1 link
        document.getElementById("lesson-1-link").addEventListener("click", function(e) {
            e.preventDefault();
            showLesson1Title(); // Display the Lesson 1 title when clicked from Filipino subject list
        });
    });

    // Add event listener for Lesson 1 in the sidebar
    lesson1Link.addEventListener("click", function(event) {
        event.preventDefault();
        showLesson1Title(); // Display the Lesson 1 title when clicked directly from the sidebar
    });

    // Wait for voices to load before setting the Filipino voice
    window.speechSynthesis.onvoiceschanged = setFilipinoVoice;
});
