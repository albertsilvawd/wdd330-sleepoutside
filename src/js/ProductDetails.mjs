import { setLocalStorage, getLocalStorage } from './utils.mjs';

export default class ProductDetails {
    constructor(productId, dataSource) {
        this.productId = productId;
        this.product = {};
        this.dataSource = dataSource;
    }

    async init() {
        this.product = await this.dataSource.findProductById(this.productId);
        this.renderProductDetails();
        document
            .getElementById('addToCart')
            .addEventListener('click', this.addProductToCart.bind(this));
    }

    addProductToCart() {
        const cartItems = getLocalStorage('so-cart') || [];
        cartItems.push(this.product);
        setLocalStorage('so-cart', cartItems);

        // Animate cart icon
        const cartIcon = document.querySelector('.cart a');
        if (cartIcon) {
            cartIcon.classList.add('cart-bounce');
            cartIcon.addEventListener('animationend', () => {
                cartIcon.classList.remove('cart-bounce');
            }, { once: true });
        }

        // Update cart count
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            cartCount.textContent = cartItems.length;
        }
    }

    renderProductDetails() {
        document.querySelector('.product-detail h3').textContent =
            this.product.Brand.Name;
        document.querySelector('.product-detail h2').textContent =
            this.product.NameWithoutBrand;
        document.querySelector('.product-detail img').src =
            this.product.Images.PrimaryLarge;
        document.querySelector('.product-detail img').alt =
            this.product.NameWithoutBrand;
        document.querySelector('.product-detail .product-card__price').textContent =
            `$${this.product.FinalPrice}`;
        document.querySelector('.product__color').textContent =
            this.product.Colors[0].ColorName;
        document.querySelector('.product__description').innerHTML =
            this.product.DescriptionHtmlSimple;
        document.getElementById('addToCart').dataset.id = this.product.Id;
    }
}