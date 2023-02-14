async function initializePage() {
    await getInfoAboutAllKanapsInCart();
    calculateTotalPriceAndQuantity() 
    initEventListener()
  }
  
  initializePage();

function getKanapInfosFromId(id) {
    return fetch("http://localhost:3000/api/products/" + id)
    .then(function(httpBodyResponse) {
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
            throw new Error(`${httpBodyResponse.status} - ${httpBodyResponse.statusText}`);
        }
    })
    .catch((error) => {
        throw new Error(`Fetch catch : ${error}`);
    });
}

async function getInfoAboutAllKanapsInCart(info) {
    const localStorage = window.localStorage.getItem("cart");
    const cartInJsonFormat = JSON.parse(localStorage);

    for (let i=0; i< cartInJsonFormat.length; i++) {
       let currentIdKanap = cartInJsonFormat[i]['id']
       let chosenColor = cartInJsonFormat[i]['color']
       let chosenQty = cartInJsonFormat[i]['quantity']
       let currentKanapFromApi = await getKanapInfosFromId(currentIdKanap)
    convertProductToHTMLFormat(currentKanapFromApi, chosenColor, chosenQty)
    }
}

function convertProductToHTMLFormat(product,chosenColor,chosenQty) {
    let cartItems = document.getElementById('cart__items')
    cartItems.innerHTML += `
    <article class="cart__item" data-id="{product-ID}" data-color="{product-color}">
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
    `
}

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

  function initEventListener() {
    let qtyInputList = document.querySelectorAll(".itemQuantity")
    for(let i = 0; i < qtyInputList.length; i++) {
        let qtyInputField = qtyInputList[i]
        qtyInputField.addEventListener("change", (event) => {
            console.log(event['target']['value'])
        })
       
     }
    
           
}

 