document.addEventListener("DOMContentLoaded", function () {
    // Retrieve currentUser from local storage
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Check if currentUser exists
    if (currentUser) {
        // Retrieve userDetails from local storage
        const userDetails = JSON.parse(localStorage.getItem('users')).find(user => user.userId === currentUser.userId);

        // Check if userDetails exists
        if (userDetails) {
            // Update the welcome message with the user's first name and last name
            const welcomeHeading = document.querySelector('.heading');
            if (welcomeHeading) {
                welcomeHeading.textContent = `Welcome, ${userDetails.firstName} ${userDetails.lastName}`;
            }
        } else {
            console.error("User details not found in local storage.");
        }
    } else {
        console.error("Current user not found in local storage.");
    }

    const userCartKey = currentUser.userId + '_cart'; 
    const cartItems = JSON.parse(localStorage.getItem(userCartKey)) || []; 

    // Display user's personal information
    const userDetailsContainer = document.getElementById('user-details');
    if (userDetailsContainer) {
        const userDetails = JSON.parse(localStorage.getItem('users')).find(user => user.userId === currentUser.userId);
        userDetailsContainer.innerHTML = `
            <div class="card">
                <h2 class="heading2">Your personal info:</h2>
                <p class="info"><strong>Email:</strong> ${userDetails.email}</p>
                <p class="info"><strong>First Name:</strong> ${userDetails.firstName}</p>
                <p class="info"><strong>Last Name:</strong> ${userDetails.lastName}</p>
            </div>
        `;
    }

    // Display user's cart details
    const cartDetailsContainer = document.getElementById('cart-details');
    if (cartDetailsContainer) {
        cartDetailsContainer.innerHTML = `
            <div class="card">
                <h2 class="heading2">Cart Details</h2>
                <p class="info"><strong>Number of items in cart:</strong> ${cartItems.length} <span>&#x1F6D2;</span></p>
                <div class="cart-items" align="center">
                    ${cartItems.map(item => `
                        <div class="cart-item">
                            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                            <div class="cart-item-details">
                                <p class="info"><strong>Name:</strong> ${item.name}</p>
                                <p class="info"><strong>Creator:</strong> ${item.creator}</p>
                                <p class="info"><strong>Price:</strong> ${item.price} ETH</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
});

