// necessary for finding te URL and ID within the parameters
const url = window.location.href;
const getURL = new URL(url);
const orderId = getURL.searchParams.get("orderId");
//

function displayConfirmationValidation() {
    // display order ID 
    let cartItems = document.getElementById("orderId");
    cartItems.innerHTML += `
     <span id="orderId">${orderId}</span>
      `;
  }
  displayConfirmationValidation()