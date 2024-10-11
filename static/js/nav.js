document.addEventListener('DOMContentLoaded', function() {
    const dropdown = document.querySelector('.dropdown');
    const dropdownContent = document.querySelector('.dropdown-content');
    const arrow = document.querySelector('.ri-arrow-down-s-line');

    // Handle hover on the dropdown
    dropdown.addEventListener('mouseenter', function() {
        dropdownContent.classList.add('show');
        arrow.classList.remove('ri-arrow-down-s-line');
        arrow.classList.add('ri-arrow-up-s-line'); // Change to up arrow when hovering
    });

    dropdown.addEventListener('mouseleave', function() {
        dropdownContent.classList.remove('show');
        arrow.classList.remove('ri-arrow-up-s-line');
        arrow.classList.add('ri-arrow-down-s-line'); // Change back to down arrow when not hovering

    });
});

// JavaScript for Hamburger Menu
document.addEventListener('DOMContentLoaded', function() {
    const hamburgerIcon = document.querySelector('.hamburger-icon');
    const navLine = document.querySelector('.nav_line');
    const buttons = document.querySelector('.buttons');

    hamburgerIcon.addEventListener('click', function() {
        navLine.classList.toggle('show');
        buttons.classList.toggle('show');
    });
});

