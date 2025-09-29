const stickers = [
    {
        id: 1,
        name: "Baby Yoda",
        price: 5.99,
        image: "img/baby-yoda.svg",
        description: "The cutest character from The Mandalorian series. Perfect for Star Wars fans, this sticker adds a touch of adorable wisdom to your laptop, notebook, or water bottle.",
    },
    {
        id: 2,
        name: "Banana",
        price: 3.49,
        image: "img/banana.svg",
        description: "A fun and quirky banana sticker for fruit lovers. Brighten up your belongings with this playful design that brings a smile wherever you stick it.",
    },
    {
        id: 3,
        name: "Viking",
        price: 6.25,
        image: "img/viking.svg",
        description: "A fierce viking sticker for adventurous spirits. Show off your bold side with this detailed illustration, ideal for travel gear, notebooks, or phone cases.",
    },
    {
        id: 4,
        name: "Girl",
        price: 4.75,
        image: "img/girl.svg",
        description: "A cheerful girl sticker to brighten up your day. This vibrant and positive design is great for personalizing your workspace, planner, or favorite accessories.",
    },
];

function renderProductList(products) {
    const productsHtml = [];
    for (const product of products) {
        productsHtml.push(`<article class="products__item">
            <img class="products__image" src="${product.image}" alt="${product.name}">
            <h3 class="products__name">${product.name}</h3>
            <p class="products__description">${product.description}</p>
            <div class="products__actions">
                <button class="products__button products__button--info button button-card">
                    Info
                </button>
                <button class="products__button products__button--buy button button-card">
                    Buy for $${product.price.toFixed(2)}
                </button>
            </div>
        </article>`);
    }
    const productListContainer = document.querySelector(".products__list");
    productListContainer.innerHTML = productsHtml.join("");
}

renderProductList(stickers);