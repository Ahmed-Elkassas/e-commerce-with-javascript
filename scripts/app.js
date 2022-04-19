// Main classes

class productList {
  async getProduct() {
    try {
      let result = await fetch("../products.json");
      let fetchedData = await result.json();
      let products = fetchedData.items;
      return products;
    } catch (error) {
      console.log(error);
    }
  }
}

class UI {}

class Storage {}

document.addEventListener("DOMContentLoaded", () => {
  const product = new productList();
  product.getProduct().then((data) => console.log(data));
});
