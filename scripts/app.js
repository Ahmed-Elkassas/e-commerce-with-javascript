// variables
const productDOM = document.querySelector(".products__center");
const cartItemsAmount = document.querySelector(".navbar__cart--items");
const cartTotalPrice = document.querySelector(".cart__footer h3 span");
let cart = [];
// Main classes

class ProductItem {
  constructor(product) {
    this.product = product;
  }

  render() {
    const articalElement = document.createElement("article");
    articalElement.className = "product";
    articalElement.innerHTML = `
            <div class="product__container">
              <img
                src="${this.product.imageUrl}"
                alt="${this.product.title}"
                class="product__container--img"
              />
              <button class="product__container--btn" data-id=${this.product.id}>
                <i class="fa-solid fa-basket-shopping-simple"></i>
                add to cart
              </button>
            </div>
            <h4 class="product__name">${this.product.title}</h4>
            <h5 class="product__price">$${this.product.price}</h5>
      `;
    return articalElement;
  }
}

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

class UI {
  displayProducts(products) {
    for (let product of products) {
      const productItem = new ProductItem(product);
      const productElement = productItem.render();
      productDOM.append(productElement);
    }
  }
  getCartButtons() {
    let buttons = document.querySelectorAll(".product__container--btn");
    let buttonsArray = [...buttons];
    // console.log(buttonsArray);
    buttonsArray.forEach((button) => {
      let buttonId = button.dataset.id;
      let elementInCart = cart.find((element) => element.id === buttonId);
      /**
       * change button textContent
       * make button disabled
       */
      if (elementInCart) {
        button.textContent = "Checkout";
        button.disabled = true;
      }
      button.addEventListener("click", (event) => {
        event.target.textContent = "Checkout";
        event.target.disabled = true;
        /**
         * [1] Get product from productList
         * [2] Add product to Cart array
         * [3] Save cart to the LocalStorage
         * [4] set cart value
         * [5] display cart item
         * [6] show the cart section
         */
        // add amount property because we will use it in cart section
        let cartItem = { ...Storage.getProduct(buttonId), amount: 1 };
        cart = [...cart, cartItem];
        Storage.saveCart(cart);
        this.setCartValues(cart);
      });
    });
  }
  setCartValues(cart) {
    let totalAmount = 0;
    let totalPrice = 0;
    cart.map((item) => {
      totalAmount += item.amount;
      totalPrice += item.price * item.amount;
    });
    cartItemsAmount.textContent = totalAmount;
    cartTotalPrice.textContent = parseFloat(totalPrice.toFixed(2));
    console.log(cartItemsAmount, cartTotalPrice);
  }
}

class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }
  static getProduct(id) {
    let products = JSON.parse(localStorage.getItem("products"));
    return products.find((product) => product.id === id);
  }
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
}

class App {
  static init() {
    const ui = new UI();
    const products = new ProductList();
    products
      .getProduct()
      .then((products) => {
        ui.displayProducts(products);
        Storage.saveProducts(products);
      })
      // add here to can access buttons after html code been loaded
      .then(() => ui.getCartButtons());
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
