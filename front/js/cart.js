// if item added to cart, display image, color, quantity, include hyperlink back to oritional product

let cart = window.localStorage.getItem('cart');

const cartJson = JSON.parse(cart); //convert sting into structured form
console.log(cartJson);

// for (START POINT ; END POINT ; INCREASE VALUE)
//    i variable is the "counter" of the loop, it count at which iteration the loop is at
//    i < cartJson.length tell how many times the loop runs, here we want the loop for every product in the cart (hence the .lengh)
//    i++ means to increase i varaible by one at every loop 
for (let i = 0; i < cartJson.length; i++) { // created loop for cartJson to display structured data on couches in the cart
    console.log(i);
    console.log(cartJson[i]['id']); // isolating 'id' from , each product (i), in the cart
    let id = cartJson[i]['id'];
    let color = cartJson[i]['color'];
    let quantity = cartJson [i]['quantity'];
    quantity = JSON.stringify(quantity)

   fetch("http://localhost:3000/api/products/"+ id) // fetching product data
  .then((response) => {
    return response.json(); // display data in structured form
  })
  .then((product) => {
    console.log(product)
    const cartItems = document.getElementById("cart__items");
    cartItems.innerHTML += `
        <article class="cart__item" data-id="{product-ID}" data-color="{product-color}">
                <div class="cart__item__img">
                  <img src=${product.imageUrl} alt="Photographie d'un canapé">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${product.name}</h2>
                    <p>${color}</p>
                    <p>${product.price} €</p>
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
            });
        }
            

/* const delete = [] => {
}

document.getElementsByClassName("cart__item__content__settings__delete").addEventListener("click", delete);
*/