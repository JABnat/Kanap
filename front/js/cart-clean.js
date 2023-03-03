async function initializePage() {
  // putting the functions in order of action
  await getInfoAboutAllKanapsInCart();
  calculateTotalPriceAndQuantity();
  initEventListener();
}

initializePage();

function getKanapInfoFromId(id) {
  // fetching the API details for each couch
  return fetch("http://localhost:3000/api/products/" + id)
    .then(function (httpBodyResponse) {
      // httpBodyResponse contient la réponse dans son entièreté, avec le header & le reste.
      // Du coup, avec .json, on réccupère la partie "json" de la réponse, qui est ce dont
      // on a réellement besoin.
      if (httpBodyResponse.ok) {
        // si le fetch a fonctionné (url correcte), alors on retourne le json.
        // si le body ne contient pas de json, alors la méthode json() renverra aussi une
        // execption qui sera attrapée dans le routeur.

        return httpBodyResponse.json();
      } else {
        // Sinon, envoie une erreur (qui sera attrapée dans le routeur)
        throw new Error(
          `${httpBodyResponse.status} - ${httpBodyResponse.statusText}`
        );
      }
    })
    .catch((error) => {
      throw new Error(`Fetch catch : ${error}`);
    });
}

async function getInfoAboutAllKanapsInCart(info) {
  // loop through the list of cart items and get local storage info
  const localStorage = window.localStorage.getItem("cart");
  const cartInObjectFormat = JSON.parse(localStorage);

  for (let i = 0; i < cartInObjectFormat.length; i++) {
    let currentIdKanap = cartInObjectFormat[i]["id"];
    let chosenColor = cartInObjectFormat[i]["color"];
    let chosenQty = cartInObjectFormat[i]["quantity"];
    let currentKanapFromApi = await getKanapInfoFromId(currentIdKanap);
    convertProductToHTMLFormat(currentKanapFromApi, chosenColor, chosenQty);
  }
}

function convertProductToHTMLFormat(product, chosenColor, chosenQty) {
  // display personalized html for each item
  let cartItems = document.getElementById("cart__items");
  cartItems.innerHTML += `
    <article class="cart__item" data-id="${product._id}" data-color="${chosenColor}">
                <div class="cart__item__img">
                  <img src=${product.imageUrl} alt="Photographie d'un canapé">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2> ${product.name}</h2>
                    <p>${chosenColor}</p>
                    <p><div class="itemPrice">${product.price}</div>€</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : </p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${chosenQty}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>
              </article>
    `;
}

function calculateTotalPriceAndQuantity() {
  // calculate and display, loop
  const pricesHTML = document.getElementsByClassName("itemPrice");
  const cart = window.localStorage.getItem("cart");
  const cartInObjectFormat = JSON.parse(cart);

  let totalSum = 0;
  let totalQuantity = 0;

  for (let i = 0; i < cartInObjectFormat.length; i++) {
    let currentQty = +cartInObjectFormat[i]["quantity"]
    totalQuantity += currentQty;
    if (pricesHTML[i] != undefined) {
      totalSum += +pricesHTML[i]["innerHTML"] * currentQty;
    }
  }

  const totalHTML = document.getElementsByClassName("cart__price")[0];
  totalHTML.innerHTML = `<p>Total (<span id="totalQuantity">${totalQuantity}</span> articles) : <span id="totalPrice"></span>${totalSum} €</p>`;
}

function initEventListener() {
  // event listener for qty
  let qtyInputList = document.querySelectorAll(".itemQuantity");
  for (let i = 0; i < qtyInputList.length; i++) {
    let qtyInputField = qtyInputList[i];
    qtyInputField.addEventListener("change", (event) => {
        actionModifyQuantity(event)
        
    });
  }
  // event listener for delete btn
  const dltBtnList = document.querySelectorAll(".deleteItem");
  for (let i = 0; i < dltBtnList.length; i++) {
    let dltBtn = dltBtnList[i];
    dltBtn.addEventListener("click", (event) => {
      actionDeleteItem(event);
    });
  }
  // event listener on Commande button
  const submitButton = document.getElementById("order");
 
  submitButton.addEventListener("click", (event) => {
    event.preventDefault();
    postFormDatatoAPI();
  })

}

function actionDeleteItem(event) {
    // delete html article from the page
  let article = event["target"].closest("article");
  article.remove();
    //  delete article from the local storage
    let cart = window.localStorage.getItem("cart");
    const cartInObjectFormat = JSON.parse(cart);
    const id = article.dataset.id; 
    const color = article.dataset.color;
    const indexOfSelectedItem = cartInObjectFormat.findIndex(
    (element) => element.id === id && element.color === color
    );

    cartInObjectFormat.splice(indexOfSelectedItem,1) // delete selceted couch (by index) from json variable

    window.localStorage.setItem("cart", JSON.stringify(cartInObjectFormat)); //SAVE deleted article INTO LOCAL STORAGE (in sring form)

    calculateTotalPriceAndQuantity()
}
function actionModifyQuantity(event) {
    let article = event["target"].closest("article")
    let updatedQty = event['target']['value']
    let kanapId = article.dataset.id
    let kanapColor = article.dataset.color
    

    let cart = window.localStorage.getItem("cart");
    const cartInObjectFormat = JSON.parse(cart);

    for (let i=0; i < cartInObjectFormat.length; i++) {
        let currentKanap = cartInObjectFormat[i]
        if (kanapId === currentKanap.id && kanapColor === currentKanap.color){
            currentKanap.quantity = updatedQty
        
            
        }
    }
    
    window.localStorage.setItem("cart", JSON.stringify(cartInObjectFormat))

    calculateTotalPriceAndQuantity()
}

function postFormDatatoAPI () {
    const userFirstName = document.getElementById("firstName").value;
    const userLastName = document.getElementById("lastName").value;
    const userEmail = document.getElementById("email").value;
    const userCity = document.getElementById("city").value;
    const userAddress = document.getElementById("address").value;
    
    // dictionary
    let user = {
        name: userFirstName,
        surname: userLastName,
        email: userEmail,
        city: userCity,
        address: userAddress,
      };
    
      // retrieve the id's of every item in the cart
      const localStorage = window.localStorage.getItem("cart");
      const cartInObjectFormat = JSON.parse(localStorage);
      let cartItems = []


      for (let i=0; i< cartInObjectFormat.length; i++) {
      cartItems.push(cartInObjectFormat[i]["id"]);
      }
      console.log(cartItems)

      // where do I send the post?

    //   let response = await fetch(____, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json;charset=utf-8'
    //     },
    //     body: JSON.stringify(user)
    //   });
      
    //   let result = await response.json();
    //   alert(result.message);


}