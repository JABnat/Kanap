const url = window.location.href;
console.log(url);

const getURL = new URL(url);
console.log(getURL);

const orderId = getURL.searchParams.get("orderId");
console.log(orderId)