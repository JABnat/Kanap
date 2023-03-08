const url = window.location.href;
console.log(url);

const getURL = new URL(url);
console.log(getURL);

const orderId = getURL.searchParams.get("orderId");

function displayConfirmationValidation() {
    // display order ID 
    let cartItems = document.getElementById("orderId");
    cartItems.innerHTML += `
     <span id="orderId">${orderId}</span>
      `;
  }
  displayConfirmationValidation()