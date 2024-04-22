function adjustKeyLength(key) {
  const encoder = new TextEncoder();
  let encodedKey = encoder.encode(key);
  if (encodedKey.byteLength > 32) {
      // If the key is longer than 32 bytes, truncate it to 32 bytes.
      encodedKey = encodedKey.slice(0, 32);
  } else if (encodedKey.byteLength < 32 && encodedKey.byteLength > 16) {
      // If the key is between 16 and 32 bytes but not exactly 32, pad to 32 bytes.
      let newKey = new Uint8Array(32);
      newKey.set(encodedKey);
      encodedKey = newKey;
  } else if (encodedKey.byteLength < 16) {
      // If the key is less than 16 bytes, pad to 16 bytes.
      let newKey = new Uint8Array(16);
      newKey.set(encodedKey);
      encodedKey = newKey;
  }
  // If exactly 16 or 32 bytes, return as is.
  return encodedKey;
}

//decryption of password 
async function decryptPassword(encryptedData, iv, secretKey) {
  try {
      const ivArray = new Uint8Array(iv);
      const encryptedArray = new Uint8Array(encryptedData);
      const adjustedKey = adjustKeyLength(secretKey);
      const key = await crypto.subtle.importKey(
          "raw",
          adjustedKey,
          { name: "AES-GCM" },
          false,
          ["decrypt"]
      );
      const decrypted = await crypto.subtle.decrypt(
          { name: "AES-GCM", iv: ivArray },
          key,
          encryptedArray
      );
      return new TextDecoder().decode(decrypted);
  } catch (error) {
      console.error("Decryption failed:", error);
      throw new Error("Decryption failed");
  }
}


document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("step-form");
   
    async function loginUser(email, password) {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const user = users.find(u => u.email === email);
      
      //decryption of password 
      if (user) {
          try {
              const decryptedPassword = await decryptPassword(user.password, user.iv, 'secret-key');
              if (decryptedPassword === password) {
                  localStorage.setItem('currentUser', JSON.stringify(user));
                  return true; // Login successful
              }
          } catch (error) {
              console.error("Decryption failed:", error);
          }
      }
      return false; 
    }
  
  
    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      
      // Retrieving user input
      const emailInput = document.getElementById('email').value.trim();
      const passwordInput = document.getElementById('password').value.trim();
      
      // Validating credentials
      if (await loginUser(emailInput, passwordInput)) {
        alert("Login successful!");
        window.location.href = "index.html";
      } else {
          alert("Invalid email or password.");
          form.reset();
      }
    });
    
});
