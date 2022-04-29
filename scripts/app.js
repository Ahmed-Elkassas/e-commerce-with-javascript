// variables
const productDOM = document.querySelector(".products__center");
const cartItemsAmount = document.querySelector(".navbar__cart--items");
const cartTotalPrice = document.querySelector(".cart__footer h3 span");
const cartContent = document.querySelector(".cart__content");
const cartOverlay = document.querySelector(".cart__overlay");
const cartDOM = document.querySelector(".cart");
const closeCartBtn = document.querySelector(".cart__close");
const cartBtn = document.querySelector(".navbar__cart--icon");
const clearCartBtn = document.querySelector(".cart__btn--clear");

let cart = [];
let buttonsArray = [];
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
    buttonsArray = [...buttons];
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
         * [5] display cart item in cart section
         * [6] show the cart section
         */
        // add amount property because we will use it in cart section
        let cartItem = { ...Storage.getProductIdx(buttonId), amount: 1 };
        cart = [...cart, cartItem];
        Storage.saveCart(cart);
        this.setCartValues(cart);
        this.addItemToCart(cartItem);
        this.showCart();
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
    // console.log(cartItemsAmount, cartTotalPrice);
  }
  addItemToCart(item) {
    const divDOM = document.createElement("div");
    divDOM.classList.add("cart__item");
    divDOM.innerHTML = `
      <img src="${item.imageUrl}" alt="product" />
              <div>
                <h4 class="cart__item--title">${item.title}</h4>
                <h6 class="cart__item--price">$${item.price}</h6>
                <span class="cart__item--remove" data-id=${item.id}>Remove</span>
              </div>
              <div class="cart__item--icons">
                <i class="fa-solid fa-chevron-up" data-id=${item.id}></i>
                <p class="cart__item--amount">1</p>
                <i class="fa-solid fa-chevron-down" data-id=${item.id}></i>
              </div>`;
    cartContent.append(divDOM);
  }
  showCart() {
    cartOverlay.classList.add("transparentBG");
    cartDOM.classList.add("showcart");
  }
  hideCart() {
    cartOverlay.classList.remove("transparentBG");
    cartDOM.classList.remove("showcart");
  }
  setUpAPP() {
    cart = Storage.getCart();
    this.setCartValues(cart);
    this.populateCartItem(cart);
    cartBtn.addEventListener("click", this.showCart);
    closeCartBtn.addEventListener("click", this.hideCart);
  }
  populateCartItem() {
    cart.forEach((item) => this.addItemToCart(item));
  }
  cartLogic() {
    clearCartBtn.addEventListener("click", this.clearCart.bind(this));
    cartContent.addEventListener("click", (event) => {
      if (event.target.classList.contains("cart__item--remove")) {
        let removeItem = event.target;
        let itemId = removeItem.dataset.id;
        cartContent.remove(cartContent.closest("cart__item"));
        this.removeItem(itemId);
      }
    });
  }
  clearCart() {
    let ItemsId = cart.map((item) => item.id);
    ItemsId.forEach((id) => this.removeItem(id));
    while (cartContent.children.length > 0) {
      cartContent.removeChild(cartContent.children[0]);
    }
    this.hideCart();
  }
  removeItem(id) {
    cart = cart.filter((item) => item.id !== id);
    this.setCartValues(cart);
    Storage.saveCart(cart);
    let button = this.getSingleButton(id);
    button.disabled = false;
    button.textContent = "Add to Cart";
  }
  getSingleButton(id) {
    return buttonsArray.find((button) => button.dataset.id === id);
  }
}

class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }
  static getProductIdx(id) {
    let products = JSON.parse(localStorage.getItem("products"));
    return products.find((product) => product.id === id);
  }
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  static getCart() {
    return localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }
}

class App {
  static init() {
    const ui = new UI();
    const products = new ProductList();
    ui.setUpAPP();
    products
      .getProduct()
      .then((products) => {
        ui.displayProducts(products);
        Storage.saveProducts(products);
      })
      // add here to can access buttons after html code been loaded
      .then(() => {
        ui.getCartButtons();
        ui.cartLogic();
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
