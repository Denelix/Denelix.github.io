// script.js
document.addEventListener('DOMContentLoaded', () => {
    const bubbles = document.querySelectorAll('.bubble');

    bubbles.forEach(bubble => {
        bubble.addEventListener('click', (e) => {
            // Prevent click event from triggering when clicking on links
            if (e.target.tagName.toLowerCase() === 'a' || e.target.tagName.toLowerCase() === 'i') return;

            // Toggle active class
            bubble.classList.toggle('active');

            // Optional: Close other bubbles
            // Uncomment to allow only one bubble open at a time
            /*
            bubbles.forEach(otherBubble => {
                if (otherBubble !== bubble) {
                    otherBubble.classList.remove('active');
                }
            });
            */
        });
    });
});