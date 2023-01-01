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

} 


/* fetch("http://localhost:3000/api/products")
  .then((response) => {
    return response.json();
  })
  .then((products) => {
    const items = document.getElementById("items");

    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        console.log(product);
      const title = document.getElementsByClassName("title");
      const price = +document.getElementsByClassName("price").value;
      const color = document.getElementsByClassName("colors").value; //to add the selected color value to the cart
  const quantity = +document.getElementsByClassName("itemquantity").value; // + indicates treating quantity as number, not string
  
      console.log(product);

items.innerHTML += `
<article class="cart__item" data-id=${product-ID}" data-color="${product-color}">
                <div class="cart__item__img">
                  <img src="${product.imageUrl}" alt="this is a couch">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>"${product.title}"</h2>
                    <p>"${product.color}"</p>
                    <p>"${product.price}"</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : "${product.quantity}"</p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="42">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">"Supprimer"</p>
                    </div>
                  </div>
                </div>
              </article>
              `;
            }
        });
        */