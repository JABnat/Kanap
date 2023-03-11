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
    // don't crash, continue
    .catch((error) => {
      throw new Error(`Fetch catch : ${error}`);
    });
}

async function getInfoAboutAllKanapsInCart() {
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
// to remember if there is a syntax error for any field
    let errorFound = false;
// first name field...
    let inputFirstName = document.getElementById("firstName");
    let nameRegex = new RegExp("^[a-zA-Z ,.'-]+$");
    let firstNameErrorMsg = document.getElementById("firstNameErrorMsg") 
    if (nameRegex.test(inputFirstName.value) === false) {
        errorFound= true;
        firstNameErrorMsg.classList.remove("hide") // ClassList is to access all classes in the element. Remove or add options to modify the HTML
    }
    else {
        firstNameErrorMsg.classList.add("hide")
    }
// last name field...
    let inputLastName = document.getElementById("lastName");
    let lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
    if (nameRegex.test(inputLastName.value) === false) {
        errorFound= true;
        lastNameErrorMsg.classList.remove("hide") // ClassList is to access all classes in the element. Remove or add options to modify the HTML
    }
    else {
      lastNameErrorMsg.classList.add("hide")
    }
// address field...
    let inputAddress = document.getElementById("address");
    let addressErrorMsg = document.getElementById("addressErrorMsg");
    let addressRegex = new RegExp("([0-9]+) [a-zA-Z0-9\s]+");
    if (addressRegex.test(inputAddress.value) === false) {
        errorFound= true;
        addressErrorMsg.classList.remove("hide")
    }
    else {
        addressErrorMsg.classList.add("hide")
    }
// city field...
    let inputCity = document.getElementById("city");
    let cityErrorMsg = document.getElementById("cityErrorMsg");
    if (nameRegex.test(inputCity.value) === false) {
        errorFound= true;
        cityErrorMsg.classList.remove("hide")
    }
    else {
        cityErrorMsg.classList.add("hide")
    }
// email field...
    let inputEmail = document.getElementById("email");
    let emailErrorMsg = document.getElementById("emailErrorMsg");
    let emailRegex = new RegExp(".+@.+\..+");
    if (emailRegex.test(inputEmail.value) === false) {
        errorFound= true;
        emailErrorMsg.classList.remove("hide")
    }
    else {
        emailErrorMsg.classList.add("hide")
    }

// perform action taking the user to the confirmation page if all the field formats are respected
    if (errorFound === false) {
        postFormDatatoAPI();
    }
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
    let contact = {
        firstName: userFirstName,
        lastName: userLastName,
        address: userAddress,
        city: userCity,
        email: userEmail
      };
    
      // retrieve the id's of every item in the cart
      const localStorage = window.localStorage.getItem("cart");
      const cartInObjectFormat = JSON.parse(localStorage);
      let products = []

      for (let i=0; i< cartInObjectFormat.length; i++) {
        products.push(cartInObjectFormat[i]["id"]);
      }
      let body = { contact, products }
      let jsonBody = JSON.stringify(body)

      // posting contact information to API
    fetch("http://localhost:3000/api/products/order", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: jsonBody
      })
      .then(function (orderResponse){
       return orderResponse.json()
      })

      .then(function (order){
        window.localStorage.removeItem("cart");
        window.location.href = "confirmation.html?orderId=" + order.orderId
      })

}
