// fetch("api/products.json")
//   .then((response) => response.json())
//   .then((stickers) => renderProductList(stickers));

const response = await fetch("api/products.json");
const stickers = await response.json();
renderProductList(stickers);

function renderProductList(products, rate = 1, currency = "USD") {
  const productsHtml = [];
  for (const product of products) {
    productsHtml.push(`<article class="products__item">
            <img class="products__image" src="${product.image}" alt="${
      product.name
    }">
            <h3 class="products__name">${product.name}</h3>
            <p class="products__description">${product.description}</p>
            <div class="products__actions">
                <button class="products__button products__button--info button button-card">
                    Info
                </button>
                <button class="products__button products__button--buy button button-card">
                    Buy for ${(product.price * rate).toFixed(2)} ${currency}
                </button>
            </div>
        </article>`);
  }
  const productListContainer = document.querySelector(".products__list");
  productListContainer.innerHTML = productsHtml.join("");
}


document.querySelector('.products__currency').addEventListener('change', changeCurrency);

let allCurrencies;
async function changeCurrency() {
  const convertToCurrency = document.querySelector('.products__currency').value;
  if (!allCurrencies) {
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    allCurrencies = await response.json();
  }
  const rate = allCurrencies.rates[convertToCurrency];
  renderProductList(stickers, rate, convertToCurrency);
}