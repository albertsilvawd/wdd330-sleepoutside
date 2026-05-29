import { getLocalStorage, setLocalStorage, alertMessage } from './utils.mjs';
import ExternalServices from './ExternalServices.mjs';

const services = new ExternalServices();

function packageItems(items) {
    return items.map((item) => ({
        id: item.Id,
        name: item.Name,
        price: item.FinalPrice,
        quantity: 1,
    }));
}

function formDataToJSON(formElement) {
    const formData = new FormData(formElement);
    const convertedJSON = {};
    formData.forEach(function (value, key) {
        convertedJSON[key] = value;
    });
    return convertedJSON;
}

export default class CheckoutProcess {
    constructor(key, outputSelector) {
        this.key = key;
        this.outputSelector = outputSelector;
        this.list = [];
        this.itemTotal = 0;
        this.shipping = 0;
        this.tax = 0;
        this.orderTotal = 0;
    }

    init() {
        this.list = getLocalStorage(this.key);
        this.calculateItemSummary();
    }

    calculateItemSummary() {
        if (this.list) {
            this.itemTotal = this.list.reduce(
                (sum, item) => sum + parseFloat(item.FinalPrice),
                0
            );
            document.querySelector(`${this.outputSelector} #subtotal`).innerText =
                this.itemTotal.toFixed(2);
            this.calculateOrderTotal();
        }
    }

    calculateOrderTotal() {
        this.tax = this.itemTotal * 0.06;
        this.shipping = this.list.length > 0 ? 10 + (this.list.length - 1) * 2 : 0;
        this.orderTotal = this.itemTotal + this.tax + this.shipping;
        this.displayOrderTotals();
    }

    displayOrderTotals() {
        document.querySelector(`${this.outputSelector} #tax`).innerText =
            this.tax.toFixed(2);
        document.querySelector(`${this.outputSelector} #shipping`).innerText =
            this.shipping.toFixed(2);
        document.querySelector(`${this.outputSelector} #order-total`).innerText =
            this.orderTotal.toFixed(2);
    }

    async checkout(form) {
        const formData = formDataToJSON(form);
        formData.orderDate = new Date().toISOString();
        formData.orderTotal = this.orderTotal.toFixed(2);
        formData.tax = this.tax.toFixed(2);
        formData.shipping = this.shipping;
        formData.items = packageItems(this.list);

        try {
            const response = await services.checkout(formData);
            console.log('Order submitted successfully:', response);
            setLocalStorage('so-cart', []);
            window.location.href = '/checkout/success.html';
        } catch (err) {
            console.error('Checkout error:', err);
            if (err.message) {
                Object.values(err.message).forEach((msg) => alertMessage(msg));
            } else {
                alertMessage('There was an error placing your order. Please try again.');
            }
        }
    }
}