// necessary for finding te URL and ID within the parameters
const url = window.location.href;
const getURL = new URL(url);
const id = getURL.searchParams.get("id");
//

// retrieving product infomation through ID identifier to return image, title, price, descrition and color

fetch("http://localhost:3000/api/products/" + id)
  .then((response) => {
    return response.json();
  })

  .then((product) => {
    const image = document.querySelector(".item__img");
    image.innerHTML = `<img src="${product.imageUrl}" alt="">`;
    const title = document.getElementById("title");
    title.innerHTML = product.name;
    const price = document.getElementById("price");
    price.innerHTML = product.price;
    const description = document.getElementById("description");
    description.innerHTML = product.description;

    const colorSelect = document.getElementById("colors");

    // preparing for specific color of the chosen couch
    let colors = product.colors;

    // creating a loop to display the color options and modify the chosen color in the field
    for (let i = 0; i < colors.length; i++) {
      let option = document.createElement("option");
      option.value = colors[i];
      option.innerHTML = colors[i];
      colorSelect.append(option);
    }
  });

// create a variable to create detailed eventListener upon clicking the add to cart button

const addToCart = () => {
  // ()=> makes this an arrow function
  const color = document.getElementById("colors").value; //to add the selected color value to the cart
  const quantity = +document.getElementById("quantity").value; // + indicates treating quantity as number, not string
  const product = {
    id: id,
    color: color,
    quantity: quantity,
  };
  const cart = (localStorage.cart && JSON.parse(localStorage.cart)) || []; // localstoarage sees what's in cart, then reconverts from string to array otherwise gives 0
  // to find duplicates in the cart
  const match = cart.find((item) => {
    if (item.id === id && item.color === color) {
      return item;
    }
  });
  // adding multiples to the cart instead of inserting it as another seperate item
  if (match) {
    match.quantity += quantity;
    alert("L'article existe déjà dans le panier !"); // alert to already existing item in cart
  } else {
    cart.push(product);
    alert("L'article a été mis dans votre panier !"); // alter the item has been added to your cart
  }
  localStorage.cart = JSON.stringify(cart); //for LocalStorage to store the string values, must always first convert to string form
};

document.getElementById("addToCart").addEventListener("click", addToCart);
