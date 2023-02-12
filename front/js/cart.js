// if item added to cart, display image, color, quantity, include hyperlink back to oritional product

let cart = window.localStorage.getItem("cart");

const cartJson = JSON.parse(cart); //convert sting into structured form

let totalSum = 0
                let totalQuantity = 0 
                 for (let i = 0; i < cartJson.length; i++) {
                  totalSum += cartJson[i]['price']
                  totalQuantity += cartJson[i]['quantity']
                 }
const totalHTML = document.getElementsByClassName('cart__price')[0];
                 totalHTML.innerHTML =
                  `<p>Total (<span id="totalQuantity">${totalQuantity}</span> articles) : <span id="totalPrice"></span>${totalSum} €</p>`
                 console.log(totalHTML)

// for (START POINT ; END POINT ; INCREASE VALUE)
//    i variable is the "counter" of the loop, it count at which iteration the loop is at
//    i < cartJson.length tell how many times the loop runs, here we want the loop for every product in the cart (hence the .lengh)
//    i++ means to increase i varaible by one at every loop
for (let i = 0; i < cartJson.length; i++) {
  // created loop for cartJson to display structured data on couches in the cart
  let id = cartJson[i]["id"];
  let color = cartJson[i]["color"];
  let quantity = cartJson[i]["quantity"];
  quantity = JSON.stringify(quantity);

  fetch("http://localhost:3000/api/products/" + id) // fetching product data
    .then((response) => {
      return response.json(); // display data in structured form
    })
    .then((product) => {
      let price = product.price * quantity;
      const cartItems =
        document.getElementById(
          "cart__items"
        ); /* inside I used variables from selected items in cart (cartItems) like color qnd quantity, the rest are from the products API */
      cartItems.innerHTML += `
        <article class="cart__item" data-id="${product._id}" data-color="${color}">
                <div class="cart__item__img">
                  <img src=${product.imageUrl} alt="Photographie d'un canapé">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${product.name}</h2>
                    <p>${color}</p> 
                    <span class="itemPrice" >${price}</span> €
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qty:</p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${quantity}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>
              </article>
              `;
    

      // Create a conditional to ensure the action is performed after the last iteration
      if (i === cartJson.length - 1) {
        const deleteBtns = document.querySelectorAll(".deleteItem"); // Retrieve all the delete buttons on the page

        // ... for each delete button ...
        deleteBtns.forEach((btn) => {
          btn.addEventListener("click", () => {
            // Create an EventListener that watches for the clicks
            const article = btn.closest("article"); // Grab the parent article so that we can access data-id and data-color
            const id = article.dataset.id; // Access id and color with dataset
            const color = article.dataset.color;
            const index = cartJson.findIndex(
              (el) => el.id === id && el.color === color
            ); // Find the position of the element we want to delete

            cartJson.splice(index, 1); // Delete the item from the array

            localStorage.setItem("cart", JSON.stringify(cartJson)); // Update localStorage to reflect the changes

            article.remove();
          });
        });

        // Quantity
        const changeQtyBtns = document.querySelectorAll(".itemQuantity");

        changeQtyBtns.forEach((btn) => {
          btn.addEventListener("change", (event) => {
            const article = btn.closest("article"); // Grab the parent article so that we can access data-id and data-color
            const id = article.dataset.id; // Access id and color with dataset
            const color = article.dataset.color;
            const index = cartJson.findIndex(
              (el) => el.id === id && el.color === color
            );
            const newQty = event.target.value; // new variable to show the new value produced by the event (changed qty)

            cartJson[index]["quantity"] = +newQty;

            localStorage.setItem("cart", JSON.stringify(cartJson));

            // updating PRICE for quantity change inside of the eventlistener of the quantity change

            fetch("http://localhost:3000/api/products/" + id) //refetch the product information for the price
              .then((response) => {
                return response.json(); // display data in structured form
              })
              .then((product) => {
                const updatedPrice = product["price"] * newQty; //create variable with the math of thte updated price (price of the product x the new qty)
                const itemPrice = article.querySelector(".itemPrice"); // creating a variable to be able to display it on the page with innerHTML
                itemPrice.innerHTML = updatedPrice;
                const itemPriceList = document.querySelectorAll(".itemPrice");
                let totalPrice = 0;

                // TOTAL.PRICE & QUANTITY

                for (i = 0; i < itemPriceList.length; i++) {
                  const currentItem = itemPriceList[i];
                  totalPrice = totalPrice + Number(currentItem.innerText);
                }
                
                const totalCartJson = window.localStorage.getItem("cart")
                const cartJson = JSON.parse(totalCartJson)
                  console.log(cartJson)
               
                
                let totalSum = 0
                let totalQuantity = 0 
                 for (let i = 0; i < cartJson.length; i++) {
                  
                  totalSum += cartJson[i]['price']
                  totalQuantity += cartJson[i]['quantity']

                 }
                const totalHTML = document.getElementsByClassName('cart__price')[0];
                 totalHTML.innerHTML =
                  `<p>Total (<span id="totalQuantity">${totalQuantity}</span> articles) : <span id="totalPrice"></span>${totalSum} €</p>`
                 console.log(totalHTML)
              
              });
          });
        });

        // updating the price when a quantity is increased

        // Quantity

        // Total

        // Total

        //submit button
      }
    });
}

// submit buttom & NTUD
const submitButton = document.getElementById("order");
const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const submitEmail = document.getElementById("email");
