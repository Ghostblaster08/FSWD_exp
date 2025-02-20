document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    const images = [
        'https://images.unsplash.com/photo-1542281286-9e0a16bb7366',
        'https://images.unsplash.com/photo-1459478309853-2c33a60058e7',
        'https://images.unsplash.com/photo-1523712999610-f77fbcfc3843',
        'https://images.unsplash.com/photo-1470770903676-69b98201ea1c',
        'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d'
    ];

    let currentIndex = 0;
    let intervalId = null;

    // Function to change background
    function changeBackground() {
        document.body.style.backgroundImage = `url(${images[currentIndex]})`;
        currentIndex = (currentIndex + 1) % images.length;
    }

    // Set initial background
    changeBackground();

    // Start button functionality
    document.getElementById('startBtn').addEventListener('click', function() {
        if (!intervalId) {
            this.disabled = true;
            document.getElementById('stopBtn').disabled = false;
            intervalId = setInterval(changeBackground, 3000); // Change every 3 seconds
        }
    });

    // Stop button functionality
    document.getElementById('stopBtn').addEventListener('click', function() {
        if (intervalId) {
            this.disabled = true;
            document.getElementById('startBtn').disabled = false;
            clearInterval(intervalId);
            intervalId = null;
        }
    });
});