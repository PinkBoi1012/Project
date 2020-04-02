module.exports = function Cart(oldCart) {
  this.items = oldCart.items || {};
  this.totalQty = oldCart.totalQty || 0;
  this.totalPrice = oldCart.totalPrice || 0;

  this.add = function(item, id) {
    let storedItem = this.items[id];

    if (!storedItem) {
      storedItem = this.items[id] = { item: item, qty: 0, price: 0 };
    }

    if (storedItem.qty + 1 > 5) {
      return "ERROR qty";
    }
    if (this.totalQty + 1 > 20) {
      return "ERROR totalQty";
    }
    if (storedItem.qty + 1 > storedItem.item.P_unit) {
      return "ERROR P_unit";
    }
    storedItem.qty++;
    this.totalQty++;
    storedItem.price = (
      parseFloat(storedItem.price) + parseFloat(storedItem.item.P_unit_price)
    ).toFixed(2);

    this.totalPrice = (
      parseFloat(this.totalPrice) + parseFloat(storedItem.item.P_unit_price)
    ).toFixed(2);
  };

  this.generateArray = function() {
    let arr = [];
    for (let id in this.items) {
      arr.push(this.items[id]);
    }
    return arr;
  };
};
