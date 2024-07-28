import { cart } from "../../data/cart.js";

export function renderAmazonHeader() {
  let cartQuantity = 0;

  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });

  const amazonHeaderHTML = `
     <div class="amazon-header-left-section">
        <a href="index.html" class="header-link">
          <img class="amazon-logo" src="images/amazon-logo-white.png" />
          <img
            class="amazon-mobile-logo"
            src="images/amazon-mobile-logo-white.png"
          />
        </a>
      </div>

      <div class="amazon-header-middle-section">
        <input
          class="search-bar js-search-bar"
          type="text"
          placeholder="Search"
        />

        <button class="search-button js-search-button">
          <img class="search-icon" src="images/icons/search-icon.png" />
        </button>
      </div>

      <div class="amazon-header-right-section">
        <a class="orders-link header-link" href="orders.html">
          <span class="returns-text">Returns</span>
          <span class="orders-text">& Orders</span>
        </a>

        <a class="cart-link header-link" href="checkout.html">
          <img class="cart-icon" src="images/icons/cart-icon.png" />
          <div class="cart-quantity js-cart-quantity">${cartQuantity}</div>
          <div class="cart-text">Cart</div>
        </a>
      </div>
  `;

  document.querySelector(".js-amazon-header").innerHTML = amazonHeaderHTML;
}
