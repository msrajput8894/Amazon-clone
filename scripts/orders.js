import { getProduct, loadProductsFetch } from "../data/products.js";
import { orders } from "../data/orders.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import { formatCurrency } from "./utils/money.js";
import { buyAgain } from "../data/cart.js";
import { renderAmazonHeader } from "./utils/amazonHeader.js";

renderAmazonHeader();

async function loadPage() {
  console.log(orders);
  await loadProductsFetch();

  const url = new URL(window.location.href);
  const search = url.searchParams.get("search");

  let filteredOrders = orders;

  // Filter orders based on search keyword
  if (search) {
    filteredOrders = orders.filter((order) => {
      return order.products.some((productDetails) => {
        const product = getProduct(productDetails.productId);
        return (
          product.name.toLowerCase().includes(search.toLowerCase()) ||
          product.keywords.some((keyword) =>
            keyword.toLowerCase().includes(search.toLowerCase())
          )
        );
      });
    });
  }

  let ordersHTML = "";

  if (filteredOrders.length > 0) {
    filteredOrders.forEach((order) => {
      const orderTimeString = dayjs(order.orderTime).format("MMMM D");

      ordersHTML += `
        <div class="order-container">
          <div class="order-header">
            <div class="order-header-left-section">
              <div class="order-date">
                <div class="order-header-label">Order Placed:</div>
                <div>${orderTimeString}</div>
              </div>
              <div class="order-total">
                <div class="order-header-label">Total:</div>
                <div>$${formatCurrency(order.totalCostCents)}</div>
              </div>
            </div>
            <div class="order-header-right-section">
              <div class="order-header-label">Order ID:</div>
              <div>${order.id}</div>
            </div>
          </div>
          <div class="order-details-grid">
            ${productsListHTML(order)}
          </div>
        </div>
      `;
    });
  } else {
    ordersHTML = `<p>No orders found with search keyword: "${search}"</p>`;
  }

  function productsListHTML(order) {
    let productsListHTML = "";

    order.products.forEach((productDetails) => {
      const product = getProduct(productDetails.productId);

      // to update delivery message
      const deliveryTime = dayjs(productDetails.estimatedDeliveryTime);
      const today = dayjs();

      //if deliveryTime passed current time display Delivered or else display Arriving
      const deliveryMessage =today.isAfter(deliveryTime)?`Delivered on`: `Arriving on`;
     
  

      productsListHTML += `
        <div class="product-image-container">
          <img src="${product.image}">
        </div>
        <div class="product-details">
          <div class="product-name">
            ${product.name}
          </div>
          <div class="product-delivery-date">
            ${deliveryMessage}: ${dayjs(productDetails.estimatedDeliveryTime).format(
              "MMMM D"
            )}
          </div>
          <div class="product-quantity">
            Quantity: ${productDetails.quantity}
          </div>
          <button class="buy-again-button button-primary js-buy-again" data-product-id="${
            product.id
          }">
            <img class="buy-again-icon" src="images/icons/buy-again.png">
            <span class="buy-again-message">Buy it again</span>
          </button>
        </div>
        <div class="product-actions">
          <a href="tracking.html?orderId=${order.id}&productId=${product.id}">
            <button class="track-package-button button-secondary">
              Track package
            </button>
          </a>
        </div>
      `;
    });

    return productsListHTML;
  }

  document.querySelector(".js-orders-grid").innerHTML = ordersHTML;

  document.querySelectorAll(".js-buy-again").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.dataset.productId;
      buyAgain(productId);

      // display a message that the product was added,
      // then change it back after a second.
      button.innerHTML = "Added";
      setTimeout(() => {
        button.innerHTML = `
          <img class="buy-again-icon" src="images/icons/buy-again.png">
          <span class="buy-again-message">Buy it again</span>
        `;
      }, 1000);
    });
  });



  //Event listener for search button
  document.querySelector(".js-search-button").addEventListener("click", () => {
    const search = document.querySelector(".js-search-bar").value;
    window.location.href = `orders.html?search=${search}`;
  });


  // Keyboar support to search bar
  document
    .querySelector(".js-search-bar")
    .addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        const searchTerm = document.querySelector(".js-search-bar").value;
        window.location.href = `orders.html?search=${searchTerm}`;
      }
    });
}



//calling load page function
loadPage();
