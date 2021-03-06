const express = require("express");
const route = express.Router();
const UserController = require("../Controller/user.controller");
const User = require("../models/User");
const path = require("path");
const userAuth = require("../middlewares/Authentication.user");
const multer = require("multer");
const addProductValidate = require("../Validate/user/validate.addProduct");
const product = require("../models/Product");
const productType = require("../models/TypeProduct");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    const now = new Date().toISOString();
    const date = now.replace(/:/g, "-");
    cb(null, date + file.originalname);
  },
});
const fileFilter = function (req, file, cb) {
  let { errors, isValid } = addProductValidate(req.body);
  if (!isValid) {
    cb(null, false);
  }
  // reject a file
  else if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === undefined
  ) {
    cb(null, true);
  } else {
    cb(new Error("wrong file "), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });
// validate register user

//@route    GET  /
//@desc     render login from
//@access   Public
route.get("/login", userAuth.checkHasLogin, UserController.renderLogin);

//@route    POST  /
//@desc     render login from
//@access   Public
route.get("/", userAuth.checkHasLogin, UserController.renderLogin);
//@route    POST  /
//@desc     get data login form
//@access   Public
route.post("/login", UserController.login);

//@route    get /
//@desc     Render dashboard page
//@access   Public
route.get(
  "/dashboard",
  userAuth.checkAuthLogin,
  UserController.renderAdminMainPage
);

//@route    GET /resigter
//@desc     get user main page
//@access   Public
route.get(
  "/register",
  userAuth.checkHasLogin,
  UserController.renderAdminRegisterPage
);

//@route    GET
//@desc     Render forgot page
//@access   Public
route.get("/forgot", UserController.renderForgetPasswordPage);

//@route    Post /active
//@desc     Active User Account
//@access   Private
route.get(
  "/active/:_id",

  UserController.getActiveUserToken
);

//@route    GET
//@desc     Change password
//@access   private
route.get("/resetpassword/:_id", UserController.renderResetPasswordPage);

//@route    post
//@desc     Change password
//@access   private
route.post("/forgot", UserController.handleForgot);
//@route    POST
//@desc     Register Admin
//@access   private
route.post("/register", UserController.register);
//@route  GET
//@desc   Render Product Type Page
//@access Private
route.get(
  "/producttype",
  userAuth.checkAuthLogin,
  UserController.renderAdminProductTypePage
);

//@route  GET
//@desc   Render Product  Page
//@access Private
route.get(
  "/product",
  userAuth.checkAuthLogin,
  UserController.renderAdminProductPage
);

//@route  GET
//@desc   Render Order  Page
//@access Private
route.get(
  "/order",
  userAuth.checkAuthLogin,
  UserController.renderOrderManagerPage
);
// render order detail page
route.get("/order/:_id", UserController.renderOrderDetailPage);
//@route  GET
//@desc   Render Customer  Page
//@access Private
route.get(
  "/customer",
  userAuth.checkAuthLogin,
  UserController.renderCustomerManagerPage
);

//@route  GET
//@desc   Render Add Product type  Page
//@access Private
route.get(
  "/addProductType",
  userAuth.checkAuthLogin,
  UserController.renderAddProductTypePage
);

//@route  POST
//@desc   POST Product type  Page
//@access Private
route.post(
  "/addProductType",
  userAuth.checkAuthLogin,
  UserController.addProductType
);

//@route  GET /user/productTypeInfo/:_id
//@desc   Render Product type info Page
//@access Private
route.get(
  "/productTypeUpdate/:_id",
  userAuth.checkAuthLogin,
  UserController.renderProductTypeUpdate
);

//@route  POST /user/editProductType
//@desc   Update Product Type
//@access Private
route.post(
  "/editProductType",
  userAuth.checkAuthLogin,
  UserController.editProductType
);
//@route  GET /user/deleteProductType/:_id
//@desc   delete product type
//@access Private
route.get(
  "/productTypeDelete/:_id",
  userAuth.checkAuthLogin,
  UserController.deleteProductType
);
//@route  GET /user/product/
//@desc   Render add product page
//@access Private
route.get(
  "/addProduct",
  userAuth.checkAuthLogin,
  UserController.renderAddProductPage
);
//@route  POST /user/product
//@desc   Add new Product
//@access Private
route.post(
  "/addProduct",
  userAuth.checkAuthLogin,
  function (req, res, next) {
    upload.single("P_picture")(req, res, async function (err) {
      if (err) {
        let values = req.body;
        let errors = {};

        errors.P_picture = "Choose Product Picture right format (jpeg/png)";
        let productDataDefaultSelect = function () {
          if (typeof req.body.TP_id === "string") {
            return [req.body.TP_id];
          } else if (typeof req.body.TP_id === "object") {
            return Object.values(req.body.TP_id);
          }
          return [];
        };

        let productDataDefaultSelectArray = await productDataDefaultSelect().map(
          (x) => x.toString()
        );

        let productTypeInfo = await productType.find().select("_id TP_name");
        res.render("admin/addProduct", {
          productTypeInfo,
          productDataDefaultSelectArray,
          errors,
          values,
        });
        return;
      }
      next();
    });
  },
  UserController.addProduct
);
//@route  GET /user/productInfo/:_id
//@desc   Get infor product
//@access Private
route.get(
  "/productUpdate/:_id",
  userAuth.checkAuthLogin,
  UserController.renderUpdateProduct
);
//@route  POST /user/productInfo
//@desc   Update Product
//@access Private
route.post(
  "/updateProduct",
  userAuth.checkAuthLogin,
  function (req, res, next) {
    upload.single("P_picture")(req, res, async function (err) {
      if (err) {
        let productData = await product.findById(req.body._id);
        let errors = {};
        errors.P_picture = "Choose Product Picture right format (jpeg/png)";

        let productDataDefaultSelect = function () {
          if (typeof req.body.TP_id === "string") {
            return [req.body.TP_id];
          } else if (typeof req.body.TP_id === "Object") {
            return Object.values(req.body.TP_id);
          }
          return [];
        };
        let productDataDefaultSelectArray = productDataDefaultSelect().map(
          (x) => x.toString()
        );
        let productTypeInfo = await productType.find().select("_id TP_name");

        let pic = await productData.P_picture.slice(6);
        res.render("admin/productInfo", {
          errors,
          productData,
          pic,
          values: req.body,
          productTypeInfo,
          productDataDefaultSelectArray,
        });
        return;
      }
      next();
    });
  },
  UserController.updateProduct
);
//@route  POST /user/productInfo/:_id
//@desc   Get infor product
//@access Private
route.get(
  "/productDelete/:_id",
  userAuth.checkAuthLogin,
  UserController.deleteProduct
);

// clear cookie
route.get("/signout", function (req, res) {
  res.clearCookie("user");
  return res.redirect("/user/login");
});
//handle change status order detail
route.post(
  "/order/changestatusorder",
  userAuth.checkAuthLogin,
  UserController.handleChangeStatusOrderDetail
);
// render email manager
route.get(
  "/emailsend",
  userAuth.checkAuthLogin,
  UserController.renderEmailManager
);
module.exports = route;
