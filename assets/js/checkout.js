const button = document.getElementById("checkoutButton");

button.addEventListener("click", function (e) {

  //code to check is agree box checked or not
  const agreeCheckbox = document.getElementById('agree');
  if (!agreeCheckbox.checked) {
    
    e.preventDefault(); 
    alert('Please check the agree box before proceeding to payment.');
  }
  else{
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
      console.log('No user is currently logged in.');
      return;
    }
    let userCartKey = currentUser.userId + '_cart';
    localStorage.removeItem(userCartKey);

    //show payment successfull
    document.getElementById("payment").style.display = "none";
    document.getElementById("success").classList.remove("hidden");
    document.getElementById("success").classList.add("my-12");
    e.preventDefault(); 
  }
  
});

document.addEventListener('DOMContentLoaded', () => {
  
  //code to show total payment
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser) {
    window.location.href = 'login.html';
    return;
  } 
  else {
      // Use userCartKey (singular) instead of userCartKeys (plural)
      const userCartKey = currentUser.userId + '_cart'; 
  
      // Correct the variable name here to match the defined variable
      const cartItems = JSON.parse(localStorage.getItem(userCartKey)) || [];
      const cartItemsContainer = document.getElementById('cartItemsContainer'); 
      const totalPriceElement = document.getElementById('totalPrice');
      const totalPriceDollarElement = document.getElementById('totalPriceDollar');

      if (cartItems.length === 0) {
        window.location.href = 'login.html';
        return;
      }

      let total = 0;
      let dollarTotal = 0;

      cartItems.forEach((item, index) => {
          total += parseFloat(item.price);
      });

      dollarTotal = total * 3000; // 1ETH=3000$
      // Update the total price and total price in dollar
      totalPriceElement.textContent = `Total: ${total.toFixed(2)} ETH`;
      totalPriceDollarElement.textContent = `Total: $${dollarTotal.toFixed(2)}`;
    
  }

});

