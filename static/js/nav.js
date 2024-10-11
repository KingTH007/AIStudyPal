document.addEventListener('DOMContentLoaded', function() {
    const dropdown = document.querySelector('.dropdown');
    const dropdownContent = document.querySelector('.dropdown-content');
    const arrow = document.querySelector('.arrow');

    // Handle hover on the dropdown
    dropdown.addEventListener('mouseenter', function() {
        dropdownContent.classList.add('show');
        arrow.innerHTML = '&#9650;'; // Change to up arrow when hovering
    });

    dropdown.addEventListener('mouseleave', function() {
        dropdownContent.classList.remove('show');
        arrow.innerHTML = '&#9660;'; // Change back to down arrow when not hovering
    });
});
