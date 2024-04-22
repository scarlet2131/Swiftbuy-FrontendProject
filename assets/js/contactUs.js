document.addEventListener('DOMContentLoaded', function() {
    var form = document.getElementById('contact-us-form');
    var thankYouMessage = document.getElementById('thank-you-message');
    var submitButton = document.getElementById('submit-contact'); 
    var formTitle = document.getElementById('form-title'); 

    submitButton.addEventListener('click', function(event) {
        // Prevents the default form submission
        event.preventDefault(); 

        var formData = new FormData(form);

        // Ensure the URL here is updated to where you actually need to send the form data
        fetch('https://formspree.io/f/xwkgaonk', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if(response.ok) {
                // Hiding form and form title upon successful submission
                form.style.display = 'none'; 
                formTitle.style.display = 'none';
                thankYouMessage.style.display = 'block'; 
            } else {
                throw new Error('Form submission error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('There was an error submitting the form. Please try again later.');
        });
    });
});

