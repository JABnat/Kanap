async function initializePage() {
  // putting the functions in order of action
  await getInfoAboutAllKanapsInCart();
  calculateTotalPriceAndQuantity();
  initEventListener();
}

initializePage();

function getKanapInfosFromId(id) {
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
  // loop through the lidst of cart items and get local storage info
  const localStorage = window.localStorage.getItem("cart");
  const cartInJsonFormat = JSON.parse(localStorage);

  for (let i = 0; i < cartInJsonFormat.length; i++) {
    let currentIdKanap = cartInJsonFormat[i]["id"];
    let chosenColor = cartInJsonFormat[i]["color"];
    let chosenQty = cartInJsonFormat[i]["quantity"];
    let currentKanapFromApi = await getKanapInfosFromId(currentIdKanap);
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

function initEventListener() {
  // event listener for qty
  let qtyInputList = document.querySelectorAll(".itemQuantity");
  for (let i = 0; i < qtyInputList.length; i++) {
    let qtyInputField = qtyInputList[i];
    qtyInputField.addEventListener("change", (event) => {});
  }
  // event listener for delete btn
  const dltBtnList = document.querySelectorAll(".deleteItem");
  for (let i = 0; i < dltBtnList.length; i++) {
    let dltBtn = dltBtnList[i];
    dltBtn.addEventListener("click", (event) => {
      actionDeleteItem(event);
    });
  }
}

function actionDeleteItem(event) {
    // delete html article from the page
  let article = event["target"].closest("article");
  article.remove();
    //  delete article from the local storage
    let cart = window.localStorage.getItem("cart");
    const cartInJsonFormat = JSON.parse(cart);
    const id = article.dataset.id; 
    const color = article.dataset.color;
    const indexOfSelectedItem = cartInJsonFormat.findIndex(
    (element) => element.id === id && element.color === color
    );

    cartInJsonFormat.splice(indexOfSelectedItem,1) // delete selceted couch (by index) from json variable

    window.localStorage.setItem("cart", JSON.stringify(cartInJsonFormat)); //SAVE deleted article INTO LOCAL STORAGE (in sring form)
    }
