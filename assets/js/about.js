 // This script will handle the scroll animation
 document.addEventListener('DOMContentLoaded', function() {
    const benefits = document.querySelectorAll('.benefits-list li');

    function revealOnScroll() {
        for (let i = 0; i < benefits.length; i++) {
            const windowHeight = window.innerHeight;
            const elementTop = benefits[i].getBoundingClientRect().top;
            const elementVisible = 100;
            if (elementTop < windowHeight - elementVisible) {
                benefits[i].classList.add("visible");
            } else {
                benefits[i].classList.remove("visible");
            }
        }
    }

    window.addEventListener('scroll', revealOnScroll);


    var map = L.map('map').setView([51.505, -0.09], 13); // Set to your desired coordinates and zoom level

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    const canvasElement = document.getElementById('qr-canvas');
    const canvas = canvasElement.getContext('2d');
    const video = document.createElement('video');
    const qrResult = document.getElementById('qr-result');

    // Use navigator.mediaDevices.getUserMedia to access the camera
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then(function(stream) {
            video.srcObject = stream;
            video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
            video.play();
            requestAnimationFrame(tick);
        });

    function tick() {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            canvasElement.height = video.videoHeight;
            canvasElement.width = video.videoWidth;
            canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

            var imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
            var code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "dontInvert",
            });

            if (code) {
                qrResult.textContent = 'QR Code Content: ' + code.data;
                // You can handle the QR code result here, e.g., open a URL or display a message
            } else {
                qrResult.textContent = 'No QR code detected.';
            }
        }
        requestAnimationFrame(tick);
    }

});
