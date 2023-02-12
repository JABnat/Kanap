console.log(1);
fetch("http://localhost:3000/api/products")
  .then((response) => {
console.log(2);
    console.log(response);
    return response.json();
  })
  .then((products) => {
console.log(3);
    const items = document.getElementById("items");
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      console.log(product);
      items.innerHTML += `
        <a href="./product.html?id=${product._id}">
        <article>
          <img src="${product.imageUrl}" alt="Lorem ipsum dolor sit amet, Kanap name1">
          <h3 class="productName">${product.name}</h3>
          <p class="productDescription">${product.description}.</p>
        </article>
      </a>
      `;
    }
  });
  console.log(4);