// TOTAL QTY & PRICE

function calculateTotalPriceAndQuantity() {
  const pricesHTML = document.getElementsByClassName("itemPrice");

  const cart = window.localStorage.getItem("cart");
  const cartJson = JSON.parse(cart);

  let totalSum = 0;
  let totalQuantity = 0;

  for (let i = 0; i < cartJson.length; i++) {
    totalQuantity += cartJson[i]["quantity"];
    if (pricesHTML[i] != undefined) {
      totalSum += +pricesHTML[i]["innerHTML"];
    }
  }

  const totalHTML = document.getElementsByClassName("cart__price")[0];
  totalHTML.innerHTML = `<p>Total (<span id="totalQuantity">${totalQuantity}</span> articles) : <span id="totalPrice"></span>${totalSum} €</p>`;
  
}

// FETCH INFO FROM LOCAL STORAGE & PUT IT INTO STRUCTURED FORM 

let cart = window.localStorage.getItem("cart");
const cartJson = JSON.parse(cart);

for (let i = 0; i < cartJson.length; i++) {
  let id = cartJson[i]["id"];
  let color = cartJson[i]["color"];
  let quantity = cartJson[i]["quantity"];
  quantity = JSON.stringify(quantity);

// INSERT CHANGES FOR PRODUCTS (COLOR, QTY, PRICE, PRODUCT NAME, IMAGE)

  fetch("http://localhost:3000/api/products/" + id) 
    .then((response) => {
      return response.json(); 
    })
    .then((product) => {
      let price = product.price * quantity;
      const cartItems = document.getElementById("cart__items"); 
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

      calculateTotalPriceAndQuantity();

// DELETE BUTTONS
      if (i === cartJson.length - 1) {
        const deleteBtns = document.querySelectorAll(".deleteItem"); 

       
        deleteBtns.forEach((btn) => {
          btn.addEventListener("click", () => {
            const article = btn.closest("article"); 
            const id = article.dataset.id; 
            const color = article.dataset.color;
            const index = cartJson.findIndex(
              (el) => el.id === id && el.color === color
            ); 

            cartJson.splice(index, 1); // DELETE ITEM

            localStorage.setItem("cart", JSON.stringify(cartJson)); //SAVE INTO LOCAL STORAGE

            article.remove(); // REMOVE FROM PAGE

            calculateTotalPriceAndQuantity()
          });
        });

// QUANTITY
        const changeQtyBtns = document.querySelectorAll(".itemQuantity");

        changeQtyBtns.forEach((btn) => {
          btn.addEventListener("change", (event) => {
            const article = btn.closest("article"); 
            const id = article.dataset.id; 
            const color = article.dataset.color;
            const index = cartJson.findIndex(
              (el) => el.id === id && el.color === color
            );
            const newQty = event.target.value; 

            cartJson[index]["quantity"] = +newQty;

            localStorage.setItem("cart", JSON.stringify(cartJson));


            fetch("http://localhost:3000/api/products/" + id) 
              .then((response) => {
                return response.json(); 
              })
              .then((product) => {
                const updatedPrice = product["price"] * newQty; 
                const itemPrice = article.querySelector(".itemPrice"); 
                itemPrice.innerHTML = updatedPrice;
                const itemPriceList = document.querySelectorAll(".itemPrice");
                let totalPrice = 0;

// TOTAL.PRICE & QUANTITY

                // for (i = 0; i < itemPriceList.length; i++) {
                //   const currentItem = itemPriceList[i];
                //   totalPrice = totalPrice + Number(currentItem.innerText);
                // }

                calculateTotalPriceAndQuantity();
              });
          });
        });
      }
    });
}

// submit buttom & NTUD
const submitButton = document.getElementById("order");
const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const submitEmail = document.getElementById("email");

submitButton.addEventListener('click', (event) => {
  event.preventDefault();
  console.log('event clicked')
})
