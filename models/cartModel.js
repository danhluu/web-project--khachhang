module.exports = function Cart(cart) {
    this.items = cart.items || {};
    this.totalItems = cart.totalItems || 0;
    this.totalPrice = cart.totalPrice || 0;

    this.add = function(item, id, quantity) {
        var cartItem = this.items[id];
        if (!cartItem) {
            cartItem = this.items[id] = { item: item, quantity: 0, price: 0 };
        }
        this.editQuantity(id, quantity);
    };

    this.remove = function(id) {
        this.totalItems -= this.items[id].quantity;
        this.totalPrice -= this.items[id].price;
        delete this.items[id];
    };

    this.getItems = function() {
        var arr = [];
        for (var id in this.items) {
            arr.push(this.items[id]);
        }
        console.log(arr);
        return arr;
    };

    this.editQuantity = function(id, newQ) {
        if (newQ <= 0 || newQ == null) {
            this.remove(id);
        } else {
            const EditItem = this.items[id];
            console.log(EditItem);
            this.totalPrice = this.totalPrice - EditItem.price + EditItem.item.price * newQ;
            this.totalItems = this.totalItems - EditItem.quantity + newQ;
            EditItem.quantity = newQ;
            EditItem.price = EditItem.item.price * newQ;
        }
    }
};