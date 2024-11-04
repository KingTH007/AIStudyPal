// quiz.js
// Function to disable all quiz links with grey-out and lock icon
function disableQuizzes() {
    const quizLinks = document.querySelectorAll('.lesson-content a');
    quizLinks.forEach(link => {
        link.classList.add('disabled');
        link.classList.remove('enabled');
    });
}

// Function to enable all quiz links, removing grey-out and lock icon
function enableQuizzes() {
    const quizLinks = document.querySelectorAll('.lesson-content a');
    quizLinks.forEach(link => {
        link.classList.remove('disabled');
        link.classList.add('enabled');
    });
}

// Run this on page load to disable quizzes initially
document.addEventListener('DOMContentLoaded', () => {
    disableQuizzes();
});

// Function to be called when text-to-speech is complete
function onLessonOneComplete() {
    enableQuizzes();
}
