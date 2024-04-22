function adjustKeyLength(key) {
    const encoder = new TextEncoder();
    let encodedKey = encoder.encode(key);
    if (encodedKey.byteLength < 16) {
        // If less than 16 bytes, pad with zeros up to 16 bytes
        let newKey = new Uint8Array(16);
        newKey.set(encodedKey);
        return newKey;
    } else if (encodedKey.byteLength > 16 && encodedKey.byteLength < 32) {
        // If between 16 and 32 bytes, pad to 32 bytes
        let newKey = new Uint8Array(32);
        newKey.set(encodedKey);
        return newKey;
    } else if (encodedKey.byteLength > 32) {
        // If more than 32 bytes, truncate to 32 bytes
        return encodedKey.slice(0, 32);
    }
    // If exactly 16 or 32 bytes, return as is
    return encodedKey;
}

async function encryptPassword(password, secretKey) {
    try {
        console.log("Starting encryption process");
        const iv = crypto.getRandomValues(new Uint8Array(12));
        console.log("IV generated:", iv);

        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        console.log("Password encoded");

        //adjusting the length to make sure it is 128
        let adjustedKey = adjustKeyLength(secretKey); 
        console.log("Adjusted key length:", adjustedKey.byteLength);

        const key = await crypto.subtle.importKey(
            "raw",
            adjustedKey,
            { name: "AES-GCM" },
            false,
            ["encrypt"]
        );
        console.log("Key imported");

        const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, data);
        console.log("Encryption successful");

        return { encrypted: Array.from(new Uint8Array(encrypted)), iv: Array.from(iv) };
    } catch (error) {
        console.error("Encryption failed:", error);
        throw new Error("Encryption failed");
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("step-form");
    const steps = Array.from(document.querySelectorAll(".step"));
    const progressBar = document.getElementById("progress-bar");
    const progressBarWidth = 100 / (steps.length - 1);
    let currentStep = 0;


    // Setting the maximum date input to today's date
    const birthDateInput = document.getElementById('birth-date');
    if (birthDateInput) {
        birthDateInput.max = new Date().toISOString().split('T')[0];
    }
    

    function updateProgressBar() {
        const progress = currentStep * progressBarWidth;
        progressBar.style.width = progress + "%";
    }

    function goToNextStep() {
        

        // Performing validation before proceeding to the next step
        if (validateCurrentStep()) {
            currentStep++;
            showStep(currentStep);
            progressBar.classList.add("fill-animation"); 
        }
    }
    
    function goToPrevStep() {
        currentStep--;
        showStep(currentStep);
    }
    
    function showStep(stepIndex) {
        steps.forEach((step, index) => {
            if (index === stepIndex) {
                step.style.display = "block";
            } else {
                step.style.display = "none";
            }
        });
        updateProgressBar();
    }

    function isEmailUnique(email) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        return !users.some(user => user.email === email);
    }

    function validateCurrentStep() {
        console.log(currentStep);

        const currentInputs = steps[currentStep].querySelectorAll("input[required]");
        let isValid = true;
    
        for (let input of currentInputs) {
            if (!input.value.trim()) {
                alert("Please fill in all required fields.");
                isValid = false;
                break;
            }
        }
    
        // Email validation for the first step or whenever your email input is present
        if(isValid && currentStep === 0) { 
            const emailInput = document.getElementById('email');
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(emailInput.value.trim())) {
                alert("Please enter a valid email address!!");
                isValid = false;
            }

            if (!isEmailUnique(emailInput.value)) {
                alert("This email is already registered.");
                return; // Stoping the submission process
            }
            
            // Date of birth validation
            const birthDateInput = document.getElementById('birth-date');
            if (birthDateInput && !isValidAge(birthDateInput.value)) {
                alert("You must be at least 18 years old!!");
                isValid = false;
            }
        }
    
    
        return isValid;
    }

    function isValidAge(dob) {
        const dobDate = new Date(dob);
        const today = new Date();
        const ageDiffMs = today - dobDate.getTime();
        const ageDate = new Date(ageDiffMs);
        return ageDate.getUTCFullYear() - 1970 >= 18;
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];

    function registerUser(newUser) {
        newUser.userId = `user${users.length + 1}`; 
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(newUser));   
    }

    form.addEventListener("submit", async function (event) {
        event.preventDefault();
        // Extracting user info from form fields
        const email = document.getElementById('email').value;
        const firstName = document.getElementById('first-name').value;
        const lastName = document.getElementById('last-name').value;
        const password = document.getElementById('password').value; 
        const confirmPassword = document.getElementById('confirm-password').value;
        const termsCheckbox = document.getElementById('terms-checkbox');
    
        // Check password match right before form submission
        if (password.trim() !== confirmPassword.trim()) {
            alert("Passwords do not match.");
            return; // Preventing form submission
        }
        console.log(termsCheckbox.checked)
        if (!termsCheckbox.checked) {
            alert("You must agree to the terms before proceeding.");
            return;  // Stop the function from proceeding to the next step
        }
    
        //encryption of password 
        try {
            const secretKey = 'secret-key'; 
            const { encrypted, iv } = await encryptPassword(password, secretKey);
            console.log("Encrypted data and IV:", encrypted, iv);

            let newUser = {
                email,
                firstName,
                lastName,
                password: encrypted,
                iv
            };

            registerUser(newUser);
            alert("Signup successful!");
            window.location.href = 'index.html';
        } catch (error) {
            console.error("Encryption or registration failed:", error);
            alert("Failed to encrypt password or register user.");
        }
    
    });
    
    document.querySelectorAll(".next-btn").forEach((button) => {
        button.addEventListener("click", goToNextStep);
    });
    
    document.querySelectorAll(".prev-btn").forEach((button) => {
        button.addEventListener("click", goToPrevStep);
    });
    showStep(currentStep);
});
