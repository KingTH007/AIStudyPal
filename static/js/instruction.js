const popupQuiz = document.querySelector('.popup-quiz');
const overlay = document.querySelector('.overlay');
const exitBtn = document.querySelector('.exit');
const continueBtn = document.querySelector('.continue');

// Function to open the popup
function openPopup() {
    popupQuiz.style.display = 'block';
    overlay.style.display = 'block';
}

// Function to close the popup
function closePopup() {
    popupQuiz.style.display = 'none';
    overlay.style.display = 'none';
}

// Event listeners for buttons
exitBtn.addEventListener('click', closePopup);
continueBtn.addEventListener('click', closePopup); // Adjust if this button should do something else