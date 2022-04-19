// Main classes

class ProductList {
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

const productDOM = document.querySelector(".products__center");
class UI {
  displayProducts(products) {
    let uiResult = "";
    products.forEach((product) => {
      uiResult += `
          <article class="product">
            <div class="product__container">
              <img
                src="${product.imageUrl}"
                alt="${product.title}"
                class="product__container--img"
              />
              <button class="product__container--btn" data-id=${product.id}>
                <i class="fa-solid fa-basket-shopping-simple"></i>
                add to cart
              </button>
            </div>
            <h4 class="product__name">${product.title}</h4>
            <h5 class="product__price">$${product.price}</h5>
          </article>
      `;
      productDOM.innerHTML = uiResult;
    });
  }
}

class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }
}

class App {
  static init() {
    const ui = new UI();
    const products = new ProductList();
    products.getProduct().then((products) => {
      ui.displayProducts(products);
      Storage.saveProducts(products);
    });
  }
}
App.init();

// Another approach to display to the UI ============== 👇

// document.addEventListener("DOMContentLoaded", () => {
//   const ui = new UI();
//   const products = new ProductList();
//   products.getProduct().then((products) => ui.displayProducts(products));
//   //   products.getProduct().then((data) => console.log(data));
// });
