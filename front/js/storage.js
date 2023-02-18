
//  DELETE ITEM  //

const localStorage = window.localStorage.getItem("cart");
const cartInJsonFormat = JSON.parse(localStorage);
const dltBtn = document.querySelectorAll(".deleteItem"); 
const article = dltBtn.closest("article"); 
const id = article.dataset.id; 
const color = article.dataset.color;
const index = cartInJsonFormat.findIndex(
  (el) => el.id === id && el.color === color
); 

cartInJsonFormat.splice(index, 1); // DELETE ITEM

localStorage.setItem("cart", JSON.stringify(cartInJsonFormat)); //SAVE INTO LOCAL STORAGE

article.remove(); // REMOVE FROM PAGE