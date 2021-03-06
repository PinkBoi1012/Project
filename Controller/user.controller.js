const bcrypt = require("bcryptjs");
const resigterValidate = require("../Validate/user/validate.userRegister");
const loginValidate = require("../Validate/user/validate.userLogin");
const forgetPasswordValidate = require("../Validate/user/validate.userForgot");
const userController = {};
const User = require("../models/User");
const sendMail = require("../middlewares/nodemailer.userActive");
const product = require("../models/Product");
const productType = require("../models/TypeProduct");
const jwt = require("jsonwebtoken");
const key = require("../config/keys");
const addProductTypeValidate = require("../Validate/user/validate.addProductType");
const addProductValidate = require("../Validate/user/validate.addProduct");
const fs = require("fs");
const ValidateResetPassword = require("../Validate/user/validate.userResetPassword");
const order = require("../models/Order");
const moment = require("moment");
const customer = require("../models/Customer");
const mailModel = require("../models/SendEmail");
moment.locale();
// Render login Page
userController.renderLogin = function (req, res) {
  return res.render("admin/login");
};
// Render forgot password page
userController.renderForgetPasswordPage = function (req, res) {
  res.render("admin/forgot");
  return;
};
// handle forgot and change password
userController.handleForgot = async function async(req, res) {
  let { errors, isValid } = ValidateResetPassword(req.body);
  if (!isValid) {
    let a = req.body._id;
    return res.render("admin/resetpassword", { data: { _id: a }, errors });
  }
  let salt = bcrypt.genSaltSync(10);
  let newPassword = bcrypt.hashSync(req.body.password, salt);

  let findUSer = await User.findByIdAndUpdate(req.body._id, {
    password: newPassword,
  });
  return res.redirect("/user/login");
};

// Render Admin register Page
userController.renderAdminRegisterPage = function (req, res) {
  return res.render("admin/register");
};
// Render reset password Page
userController.renderResetPasswordPage = async function (req, res) {
  jwt.verify(req.params._id, key.secret, async function (err, decoded) {
    if (err) {
      return res.render("admin/login");
    }

    let findUser = await User.findById(decoded._id);

    return res.render("admin/resetpassword", {
      data: findUser._id,
    });
  });
};
// Render Admin page
userController.renderAdminMainPage = async function (req, res) {
  let totalOrderValue = 0;
  let totalProductSold = 0;
  const topProductSale = await product
    .find({}, "P_unit_sale _id P_name P_picture")
    .sort({ P_unit_sale: -1 })
    .limit(5);
  const findOrder = await order.find({}, "cart");

  let totalOrderValue1 = await findOrder.map(function (x) {
    totalOrderValue = (
      parseFloat(totalOrderValue) + parseFloat(x.cart.totalPrice)
    ).toFixed(2);
  });
  let ProductForSale = await product.find({}, "_id");
  let numberProductForSale = Object.keys(ProductForSale).length;
  let totalPSold = findOrder.map(function (x) {
    totalProductSold = totalProductSold + x.cart.totalQty;
    return totalProductSold;
  });

  let orderPlaced = Object.keys(findOrder).length;
  console.log(topProductSale);
  return res.render("admin/dashboard", {
    numberProductForSale,
    totalProductSold,
    topProductSale,
    totalOrderValue,
    orderPlaced,
  });
};

//Render Admin product type page
userController.renderAdminProductTypePage = async function (req, res) {
  let dataProductType = await productType.find();
  var error = req.query.valid;

  if (error) {
    res.render("admin/productTypeManage", { dataProductType, error });
    return;
  }
  res.render("admin/productTypeManage", { dataProductType });
  return;
};
// Render mangager product page
userController.renderAdminProductPage = async function (req, res) {
  let productData = await product
    .find()
    .select("_id P_name P_unit_price P_unit P_unit_sale ");
  if (req.query.valid) {
    var status = "Delete" + req.query.valid;
    res.render("admin/productManager", { productData, status });
    return;
  }
  res.render("admin/productManager", { productData });
  return;
};
// render order detail page
userController.renderOrderDetailPage = async function (req, res) {
  if (!req.params._id) {
    return res.redirect("/user/dashboard");
  }
  let findOrder = await order.findById(req.params._id);

  let findCus = await customer.findById(
    findOrder.C_id,
    "full_name email phone"
  );

  let data = {
    cart: findOrder.cart,
    status: findOrder.O_status,
    description: findOrder.O_description,
    O_id: findOrder._id,
    createDateOrder: moment(findOrder.O_create_at).format("LLL"),
    address: findOrder.address,
    paymentId: findOrder.paymentId,
    C_id: findCus._id,
    C_name: findCus.full_name,
    C_email: findCus.email,
    C_phone: findCus.phone,
  };

  return res.render("./admin/orderDetail", { data });
};
//render order manager page
userController.renderOrderManagerPage = async function (req, res) {
  let findOrder = await order.find({}, "_id O_status O_create_at ");
  let orderData = await findOrder.map(function (x) {
    let data = {};
    data.status = x.O_status;
    data.create_at = moment(x.O_create_at).format("LLL");
    data._id = x._id;
    return data;
  });

  res.render("admin/orderManager", { orderData });
  return;
};
//render customer manager page
userController.renderCustomerManagerPage = async function (req, res) {
  let data = await customer.find({}, "create_at full_name email phone");
  res.render("admin/customerManager", { data });
  return;
};

//render Add product page
userController.renderAddProductPage = async function (req, res) {
  let productTypeInfo = await productType.find().select("_id TP_name");
  let productDataDefaultSelectArray = [];

  res.render("admin/addProduct", {
    productTypeInfo,
    productDataDefaultSelectArray,
  });
  return;
};
//render Add product Type page
userController.renderAddProductTypePage = function (req, res) {
  res.render("admin/addProductType");
  return;
};

//render Product Type Information
userController.renderProductTypeUpdate = async function (req, res) {
  let data = await productType.findById(req.params._id);
  if (!data) {
    return res.redirect("/user/producttype");
  }
  res.render("admin/updateProductType", { data });
  return;
};
// login Admin Function
userController.login = function (req, res) {
  const { errors, isValid } = loginValidate(req.body);
  if (errors) {
    if (!isValid) {
      res.render("admin/login", { errors, values: req.body });
      return;
    }
    User.findOne({ email: req.body.email }).then(function (data) {
      if (data) {
        if (!data.active) {
          errors.email =
            "Please contact to pinkfoxstoredemo@gmail.com to active the account";
          res.render("admin/login", { errors, values: req.body });
          return;
        }
        if (!bcrypt.compareSync(req.body.password, data.password)) {
          errors.password = "Wrong password";
          res.render("admin/login", { errors, values: req.body });
          return;
        }

        res.cookie("user", data.id, {
          signed: true,
          expires: new Date(Date.now() + 8 * 3600000),
        });
        res.redirect("/user/dashboard");

        return;
      }
      errors.email = "Email is not exist";
      res.render("admin/login", { errors, values: req.body });
      return;
    });
  }
};

// register Addmin
userController.register = async function (req, res) {
  const { errors, isValid } = resigterValidate(req.body);

  let userExit = await User.find({ email: req.body.email });

  if (userExit.length > 0) {
    errors.email = "This email is exist";
    res.render("admin/register", { errors, values: req.body });
    return;
  }
  if (!isValid) {
    res.render("admin/register", { errors, values: req.body });

    return;
  }
  let salt = bcrypt.genSaltSync(10);
  var password = bcrypt.hashSync(req.body.password, salt);
  let user = new User({
    email: req.body.email,
    fullname: req.body.fullname,
    password,
    phone: req.body.phone,
  });

  user.save(async function (err, userData) {
    let token = await jwt.sign({ _id: userData._id }, key.secret, {
      expiresIn: "24h",
    });
    let content =
      "<p>Please Click This Link To Active Admin Account:</p><a href=http://localhost:8080/user/active/" +
      token +
      ">Link";
    await sendMail(
      "pinkfoxstoredemo@gmail.com",
      "Active Amin Account Store",
      content
    );
    res.redirect("/user/login");
    return;
  });
};

// Active user Account
userController.getActiveUserToken = function (req, res) {
  jwt.verify(req.params._id, key.secret, function (err, decoded) {
    if (err) {
      res.send(
        "Token is expired.We has send another token, Please check your email again "
      );
      return;
    }
    User.findById(decoded._id, function (err, data1) {
      if (data1.active == false) {
        User.findByIdAndUpdate(decoded._id, { active: true }, function (
          err,
          data
        ) {
          res.send("Account " + data.email + " is Activate.");
          let content = "<p>Account is active </p>";
          sendMail(data1.email, "Active Admin Account Store", content);
          return;
        });
        return;
      }
      res.send("Account is already active Activate.");
      return;
    });
  });
};
// Sent Forgot password, send Mail
userController.sentForgotUserPassword = async function (req, res) {
  const { errors, isValid } = forgetPasswordValidate(req.body);
  if (!isValid) {
    res.render("admin/forgot", { errors, values: req.body });
    return;
  }
  let findUser = await User.findOne({ email: req.body.email });
  if (!findUser) {
    errors.email = "Email is not exist Please input again";
    res.render("admin/forgot", { errors, values: req.body });
    return;
  }
  let token = await jwt.sign({ _id: findUser._id }, key.secret, {
    expiresIn: "24h",
  });
  let subject = `Recovery Account ${findUser.email}`;
  let content =
    "<p>Please Click This Link To reset password Admin Account:</p><a href=http://localhost:8080/user/resetpassword/" +
    token +
    ">Link";
  await sendMail(req.body.email, subject, content);

  res.redirect("/user/login");
  return;
};
// Submit new Product Type
userController.addProductType = async function (req, res) {
  const { errors, isValid } = addProductTypeValidate(req.body);
  let isNameExist = await productType.findOne({ TP_name: req.body.TP_name });
  if (isNameExist) {
    // send
    errors.TP_name = "This Product Type is exist";
    res.render("admin/addProductType", { errors, values: req.body });
    return;
  }
  if (!isValid) {
    res.render("admin/addProductType", { errors, values: req.body });
    return;
  }
  let newProductType = new productType({
    TP_name: req.body.TP_name,
    TP_description: req.body.TP_description,
  });
  // Add product type and save turn back to product type page
  newProductType.save(function (err, data) {
    return res.redirect("producttype");
  });
};
// update product type
userController.editProductType = async function (req, res) {
  const { errors, isValid } = addProductTypeValidate(req.body);

  let data = await productType.findOne({ TP_name: req.body.TP_name });

  if (data && data._id != req.body._id) {
    errors.TP_name = "This Product Type is exist";
    let data = req.body;
    res.render("admin/updateProductType", { data, errors });
    return;
  }

  if (!isValid) {
    let data = req.body;
    res.render("admin/updateProductType", { data, errors });
    return;
  }
  let change = {
    TP_name: req.body.TP_name,
    TP_description: req.body.TP_description,
  };

  productType.findByIdAndUpdate(req.body._id, change, function (err, data) {
    if (err) {
      return;
    }
    res.redirect("producttype");
    return;
  });
};
// Delete product type
userController.deleteProductType = async function (req, res) {
  let findProductHavePT = await product.find({ TP_id: req.params._id });
  if (findProductHavePT.length != 0) {
    let data = await encodeURIComponent(findProductHavePT.map((x) => x.P_name));
    res.redirect("/user/producttype/?valid=" + data.toString());
    return;
  }
  productType.findByIdAndRemove(req.params._id, function (err, data) {
    res.redirect("/user/producttype");
    return;
  });
};

// Add new product
userController.addProduct = async function (req, res) {
  let existProduct = await product.find({ P_name: req.body.P_name });
  let productTypeInfo = await productType.find().select("_id TP_name");
  let { errors, isValid } = addProductValidate(req.body);

  let productDataDefaultSelect = function () {
    if (typeof req.body.TP_id === "string") {
      return [req.body.TP_id];
    } else if (typeof req.body.TP_id === "object") {
      return Object.values(req.body.TP_id);
    }

    return [];
  };

  let productDataDefaultSelectArray = productDataDefaultSelect().map((x) =>
    x.toString()
  );

  if (existProduct.length > 0) {
    errors.P_name = "This product is exist.";
    res.render("admin/addProduct", {
      errors,
      values: req.body,
      productTypeInfo,
      productDataDefaultSelectArray,
    });
    return;
  } else if (!isValid && req.file == undefined) {
    errors.P_picture = "Choose Product Picture right format (jpeg/png)";

    res.render("admin/addProduct", {
      errors,
      values: req.body,
      productTypeInfo,
      productDataDefaultSelectArray,
    });
    return;
  } else if (req.file == undefined) {
    errors.P_picture = "Choose Product Picture right format (jpeg/png)";
    res.render("admin/addProduct", {
      errors,
      values: req.body,
      productTypeInfo,
      productDataDefaultSelectArray,
    });
    return;
  }

  let path_img = req.file.path;

  let newProduct = new product({
    P_name: req.body.P_name,
    P_description: req.body.P_description,
    P_content: req.body.P_content,
    P_unit_price: req.body.P_unit_price,
    P_unit: req.body.P_unit,
    P_picture: req.file.path,
    TP_id: req.body.TP_id,
  });

  newProduct.save(async function (err, data) {
    // send Mail to user
    let emailSub = await mailModel.find();
    let content =
      "<p>Hi Customer this is new product. Click this link to check our new product:</p><a href=http://localhost:8080/productInfo/" +
      data._id +
      ">Link";
    //send mail
    await emailSub.forEach(async function (x) {
      await sendMail(x.email, "New Product", content);
    });

    res.redirect("/user/product");
    return;
  });
  return;

  // let { errors, isValid } = addProductValidate(req.body);
  // if (!isValid) {
  //   // change \r\n to <br>
  //   // console.log(req.body);
  //   // let c = req.body.P_content.replace(/\n/g, "<br />");
  // }
  // check file img
  // if (req.file == undefined) {
  //   errors.P_picture =
  //     "Please choose right format for product image(jpg, jpeg)";
  //   return res.send("dit me");
  // }
  // add new product
};

// GET Update product page
userController.renderUpdateProduct = async function (req, res) {
  // slice public
  let productTypeInfo = await productType.find();
  let values = await product.findById(req.params._id);
  let pic = await values.P_picture.slice(6);
  let productDataDefaultSelect = Object.values(values.TP_id);
  let productDataDefaultSelectArray = productDataDefaultSelect.map((x) =>
    x.toString()
  );

  return res.render("admin/productInfo", {
    values,
    productTypeInfo,
    productDataDefaultSelectArray,
    pic,
  });
};

// Delete product
userController.deleteProduct = async function (req, res) {
  let findProduct = await product.findById(req.params._id);
  let path = findProduct.P_picture;
  fs.unlink(path, (err) => {
    if (err) {
      res.redirect("/user/product");
      return;
    }
    product.findByIdAndRemove(req.params._id, function (err) {
      let data = "Success";
      res.redirect("/user/product?valid=" + data);
      return;
    });
  });
};
// Update product
userController.updateProduct = async function (req, res) {
  let productFind = await product.findById({ _id: req.body._id });

  let pic = await productFind.P_picture.slice(6);
  let existProduct = await product.find({ P_name: req.body.P_name });
  let productTypeInfo = await productType.find().select("_id TP_name");
  let productDataDefaultSelect = await function () {
    if (typeof req.body.TP_id === "string") {
      return [req.body.TP_id];
    } else if (typeof req.body.TP_id === "object") {
      return Object.values(req.body.TP_id);
    }
    return [];
  };

  let productDataDefaultSelectArray = productDataDefaultSelect().map((x) =>
    x.toString()
  );
  let { errors, isValid } = addProductValidate(req.body);
  if (!isValid) {
    res.render("admin/productInfo", {
      errors,
      values: req.body,
      productTypeInfo,
      pic,
      productDataDefaultSelectArray,
    });
    return;
  } else if (productFind.length > 0 && productFind.P_name != req.body.P_name) {
    errors.P_name = "This product is exist.";
    res.render("admin/productInfo", {
      errors,
      values: req.body,
      productTypeInfo,
      pic,
      productDataDefaultSelectArray,
    });
    return;
  } else if (req.file == undefined) {
    let data = {
      P_name: req.body.P_name,
      TP_id: req.body.TP_id,
      P_description: req.body.P_description,
      P_content: req.body.P_content,
      P_unit_price: req.body.P_unit_price,
      P_unit: req.body.P_unit,
    };

    product.findByIdAndUpdate(req.body._id, data, function (err) {
      if (err) {
        return;
      }
      res.redirect("/user/product");
      return;
    });
  } else {
    let oldProduct = await product.findById(req.body._id);
    let filePath = oldProduct.P_picture;

    fs.unlink(filePath, function (err) {
      return;
    });

    let path_img = req.file.path;
    let data = {
      P_name: req.body.P_name,
      TP_id: req.body.TP_id,
      P_description: req.body.P_description,
      P_content: req.body.P_content,
      P_unit_price: req.body.P_unit_price,
      P_unit: req.body.P_unit,
      P_picture: path_img,
    };
    product.findByIdAndUpdate(req.body._id, data, function (err) {
      res.redirect("/user/product");
      return;
    });
  }

  // slice public

  // // productData.P_picture = productData.P_picture.slice(6);
  // let productDataDefaultSelect = Object.values(productData.TP_id);
  // let productDataDefaultSelectArray = productDataDefaultSelect.map(x =>
  //   x.toString()
  // );
  // let existProduct = await product.find({ P_name: req.body.P_name });
  // let productTypeInfo = await productType.find().select("_id TP_name");
  // let { errors, isValid } = addProductValidate(req.body);
  // if (existProduct && existProduct.P_name != req.body.P_name) {
  //   errors.P_name = "This product is Exist";
  //   return res.render("admin/productInfo/", {
  //     productData,
  //     productTypeInfo,
  //     productDataDefaultSelectArray,
  //     errors
  //   });
  // }

  // if form not upload picture

  return;
};

//handle change status order detail
userController.handleChangeStatusOrderDetail = async function (req, res) {
  // check err
  let update = {
    O_status: req.body.status,
    O_description: req.body.description,
  };

  let findOrder = await order.findByIdAndUpdate(req.body._id, update);
  let link = "/user/order/" + req.body._id;
  res.redirect(link);
  return;
};

//render Email manager
userController.renderEmailManager = async function (req, res) {
  let dataMail = await mailModel.find();
  let data = await dataMail.map(function (x) {
    let result = {};
    result.create_at = moment(x.create_at).format("LLL");
    result.email = x.email;
    return result;
  });
  res.render("./admin/emailManager", { data });
};
module.exports = userController;
