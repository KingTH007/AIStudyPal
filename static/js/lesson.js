


document.addEventListener("DOMContentLoaded", function() {
    const filipinoLessonsDiv = document.getElementById("filipino-lessons");
    const lesson1TitleDiv = document.getElementById("lesson-1-title");
    const lesson1ContentDiv = document.getElementById("lesson-1-content");
    const filipinoSubjectLink = document.getElementById("filipino-subject");
    const lesson1LinkSidebar = document.getElementById("filipino-lesson-1");
    const lesson1LinkMain = document.getElementById("lesson-1-link");
    let filipinoVoice = null;
    let speechInstance = null;

    const lesson1ContentText = `
        Aralin 1: Panitikan (Kahulugan at Kahalagahan) at Karununganp-bayan (Salawikain, Sawikain, Kasabihan, Bugtong)
        PANITIKAN
        ⦁	Ito ay nagmula sa salitang “pang-titik-an” na ang ibig sabihin ay literatura o mgaakdang nasusulat.
        ⦁	Ito ay naglalaman ng mga akdang may kinalaman sa pang-araw-araw na buhay, mga kathang-isip, pag-ibig, kasaysayan at iba pa.
        KAHULUGAN NG PANITIKAN
        ⦁	Ang pilipinong salita ng “panitikan” ay nanggaling sa wikang latin na “littera” na ang ibig sabihin ay “titik”. Sa pinakapayak na pagkakalarawan, ito ay angpagsusulat ng tuwiran at patula na nag uugnay sa isang tao. Isang malinaw nasalamin, larawan, repleksyon o representasyon ng buhay, karanasan, lipunan atkasaysayan.
        KAHALAGAHAN NG PAG-AARAL NG PANITIKANG PILIPINO
        ⦁	Mabatid ang kaugalian, tradisyon at kultura
        ⦁	Maipagmalaki ang manunulat na Pilipino
        ⦁	Mabatid ang mga akdang Pilipino
        ⦁	Mabatid ang sariling kahusayan, kapintasan at kahinaan

        KARUNUNGANG-BAYAN
        SALAWIKAIN
        ⦁	Ang salawikain ay mga kasabihan o kawikaan na nagbibigay o nagpapanuto ngmagagandang aral o gabay sa pamumuhay, sa asal, sa pakikipagkapwa.
        SAWIKAIN
        ⦁	Ang sawikain ay kasabihan o kawikaan na may dalang aral na maaaring tumukoysa isang idyoma, isang pagpapahayag na ang kahulugan ay hindi komposisyunal omatatalinghagang salita.
        Halimbawa: Ilaw ng tahanan – INA
        KASABIHAN
        ⦁	Ang kasabihan ay bahagi na ng kulturang Pilipino. Ito ay ipinasa sa atin ng ating mga ninuno, ang kasabihan ay nagbibigay ng paalala at mabuting aral sa atin.
        Halimbawa: Walang lihim na hindi nabubunyag, walang totoo na hindi nahahayag
        BUGTONG
        ⦁	Isang pangungusap o tanong na may doble o nakatagong kahulugan na nilulutasbilang isang palaisipan.
        Halimbawa: Binti walang hita, may tuktok walang mukha. (KABUTE)
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

    // Handle Sidebar Aralin 1 link
    lesson1LinkSidebar.addEventListener("click", function(event) {
        event.preventDefault();
        confirmNavigation(() => showDiv(lesson1TitleDiv));
    });

    // Handle Filipino-link Aralin 1 link
    lesson1LinkMain.addEventListener("click", function(event) {
        event.preventDefault();
        confirmNavigation(() => showDiv(lesson1TitleDiv));
    });

    // Filipino Subject click event
    filipinoSubjectLink.addEventListener("click", function(event) {
        event.preventDefault();
        confirmNavigation(() => showDiv(filipinoLessonsDiv));
    });

    // Start lesson button click event
    document.getElementById("start-lesson-btn").addEventListener("click", function() {
        showDiv(lesson1ContentDiv);
        speakText(lesson1ContentText);
    });

    // Add a confirmation prompt when switching subjects or lessons
    function confirmNavigation(callback) {
        if (speechSynthesis.speaking) {
            const userConfirmed = confirm("Gusto mo ba ihinto ang Aralin?");
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
