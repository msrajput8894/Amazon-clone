import {
  cart,
  loadCart,
  removeFromCart,
  updateDeliveryOption,
  updateQuantity,
} from "../../data/cart.js";
import { products, getProduct } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import {
  deliveryOptions,
  getDeliveryOption,
} from "../../data/deliveryOptions.js";
import { renderPaymentSummary } from "./paymentSummary.js";
import { updateCartQuantity } from "../checkout.js";
import { renderCheckoutHeader } from "./checkoutHeader.js";

export function renderOrderSummary() {
  renderCheckoutHeader();
  let cartSummaryHTML = "";

  cart.forEach((cartItem) => {
    const productId = cartItem.productId;

    const matchingProduct = getProduct(productId);

    const deliveryOptionId = cartItem.deliveryOptionId;

    const deliveryOption = getDeliveryOption(deliveryOptionId);

    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
    const dateString = deliveryDate.format("dddd, MMMM D");

    cartSummaryHTML += `
        <div class="cart-item-container js-cart-item-container js-cart-item-container-${
          matchingProduct.id
        }">
            <div class="delivery-date">Delivery date:${dateString} </div>

            <div class="cart-item-details-grid">
              <img
                class="product-image"
                src="${matchingProduct.image}"
              />

              <div class="cart-item-details">
                <div class="product-name">
                ${matchingProduct.name}
                </div>
                <div class="product-price">
                  ${matchingProduct.getPrice()}
                </div>
                <div class="product-quantity js-product-quantity-${
                  matchingProduct.id
                }">
                  <span> Quantity: <span class="quantity-label">${
                    cartItem.quantity
                  }</span> </span>
                  <span class="update-quantity-link link-primary js-update-link js-update-link-${
                    matchingProduct.id
                  }" 
                  data-product-id=${matchingProduct.id}>
                    Update
                  </span>
                  <input class="quantity-input js-quantity-input-${
                    matchingProduct.id
                  }" min="0" max="1000" type="number">
                  <span class="save-quantity-link link-primary js-save-quantity-link" data-product-id="${
                    matchingProduct.id
                  }">
                  Save
                  </span>
                  <span class="error js-error-message-${
                    matchingProduct.id
                  }" id="error-message"></span>
                  <span class="delete-quantity-link link-primary js-delete-link js-delete-link-${
                    matchingProduct.id
                  }" 
                  data-product-id=${matchingProduct.id}>
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                
                ${deliveryOptionsHTML(matchingProduct, cartItem)}
                
              </div>
            </div>
          </div>
      `;
  });

  function deliveryOptionsHTML(matchingProduct, cartItem) {
    let html = "";

    deliveryOptions.forEach((deliveryOption) => {
      const today = dayjs();
      const deliveryDate = today.add(deliveryOption.deliveryDays, "days");

      const dateString = deliveryDate.format("dddd, MMMM D");

      const priceString =
        deliveryOption.priceCents === 0
          ? "FREE"
          : `$${formatCurrency(deliveryOption.priceCents)} -`;

      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

      html += `
                <div class="delivery-option js-delivery-option" data-product-id="${
                  matchingProduct.id
                }" data-delivery-option-id="${deliveryOption.id}">
                    <input
                      type="radio"
                      ${isChecked ? "checked" : ""}
                      class="delivery-option-input"
                      name="delivery-option-${matchingProduct.id}"
                    />
                    <div>
                      <div class="delivery-option-date">${dateString}</div>
                      <div class="delivery-option-price">${priceString} Shipping</div>
                    </div>
                </div>
              `;
    });

    return html;
  }

  document.querySelector(".js-order-summary").innerHTML = cartSummaryHTML;

  // to update the cart quantity
  document.querySelectorAll(".js-update-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;

      const container = document.querySelector(
        `.js-cart-item-container-${productId}`
      );

      container.classList.add("is-editing-quantity");
      updateCartQuantity();
      renderCheckoutHeader();

      renderPaymentSummary();
    });
  });

  //code for saving the quantity by update link
  document.querySelectorAll(".js-save-quantity-link").forEach((link) => {
    const productId = link.dataset.productId;
    renderCheckoutHeader();
    const container = document.querySelector(
      `.js-cart-item-container-${productId}`
    );

    const quantityInput = document.querySelector(
      `.js-quantity-input-${productId}`
    );

    const errorMessage = document.querySelector(
      `.js-error-message-${productId}`
    );

    const updateQuantityHandler = () => {
      const newQuantity = quantityInput.value ? Number(quantityInput.value) : 1;

      if (isNaN(newQuantity) || newQuantity < 0 || newQuantity > 1000) {
        errorMessage.textContent = "Quantity must be between 0 and 1000.";
        quantityInput.style.borderColor = "red";
      } else if (newQuantity === 0) {
        removeFromCart(productId);

        renderOrderSummary();
        renderPaymentSummary();
      } else {
        errorMessage.textContent = "";
        quantityInput.style.borderColor = "";

        container.classList.remove("is-editing-quantity");

        updateQuantity(productId, newQuantity);
        renderOrderSummary();
        renderPaymentSummary();
      }
    };

    link.addEventListener("click", updateQuantityHandler);

    quantityInput.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        updateQuantityHandler();
      }
    });
  });

  // to delete items from cart
  document.querySelectorAll(".js-delete-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      removeFromCart(productId);

      renderCheckoutHeader();
      renderOrderSummary();
      renderPaymentSummary();
    });
  });

  //to update delivery option
  document.querySelectorAll(".js-delivery-option").forEach((element) => {
    element.addEventListener("click", () => {
      const { productId, deliveryOptionId } = element.dataset;
      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });
}
