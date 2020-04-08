module.exports = function Cart(oldCart) {
  this.items = oldCart.items || {};
  this.totalQty = oldCart.totalQty || 0;
  this.totalPrice = oldCart.totalPrice || 0;

  this.add = function (item, id, unit) {
    let storedItem = this.items[id];
    let unitProduct = parseInt(unit);
    console.log(unitProduct);
    if (!storedItem) {
      storedItem = this.items[id] = { item: item, qty: 0, price: 0 };
    }

    if (storedItem.qty + unitProduct > 5) {
      return "ERROR qty";
    }
    if (storedItem.qty + unitProduct < 0) {
      return "ERROR qty 2";
    }
    if (this.totalQty + unitProduct > 20) {
      return "ERROR totalQty";
    }
    if (storedItem.qty + unitProduct > storedItem.item.P_unit) {
      return "ERROR P_unit";
    }
    storedItem.qty += unitProduct;
    this.totalQty += unitProduct;
    storedItem.price = (
      parseFloat(storedItem.price) +
      parseFloat(storedItem.item.P_unit_price) * unitProduct
    ).toFixed(2);

    this.totalPrice = (
      parseFloat(this.totalPrice) +
      parseFloat(storedItem.item.P_unit_price) * unitProduct
    ).toFixed(2);
  };

  this.generateArray = function () {
    let arr = [];
    for (let id in this.items) {
      arr.push(this.items[id]);
    }
    return arr;
  };
};
