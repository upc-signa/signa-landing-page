function toggleMenu() {
    const nav = document.querySelector('.navigation');
    nav.classList.toggle('active');
}

function handleLanguageChange() {
    var selectElement = document.querySelector('.language');
    selectElement.addEventListener('change', function() {
        if (selectElement.value === 'en') {
            window.location.href = 'indexEN.html';
        }
        if (selectElement.value === 'es') {
            window.location.href = 'index.html';
        }
    });
}

document.addEventListener('DOMContentLoaded', handleLanguageChange);