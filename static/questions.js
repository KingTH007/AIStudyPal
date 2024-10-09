// questions.js

// Predefined questions and answers in Filipino
const questions = [
    { question: "Ano ang tawag sa mga kasabihan o kawikaan na may dalang aral at ginagamit bilang idyoma?", answer: "sawikain" },
    { question: "Ano ang tawag sa bahagi ng kulturang pilipino na ipinasa pa galing sa mga ninuno?", answer: "kasabihan" },
    { question: "Ano ang tawag sa tanong o pangungusap na may nakatagong kahulugan na nilulutas bilang palaisipan?", answer: "bugtong" },
    { question: "Anong anyo ng panitikan ang nagbibigay ng magagandang aral o gabay sa pamumuhay?", answer: "salawikain" },
    { question: "Anong akdang may kinalaman sa kathang-isip, pag-ibig, at kasaysayan?", answer: "panitikan" }
];

let askedQuestions = []; // Array to keep track of asked questions

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

// Reset the questions when restarting the game
function resetQuestions() {
    askedQuestions = [];
}

