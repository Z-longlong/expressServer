const express = require("express");
const router = express.Router();
const adminModel=require("../module/adminModel");
const upFile = require("../public/upFile.js");
//管理员登录接口；
router.post("/adminLogin",adminModel._adminLogin);
//token验证接口
router.get("/adminToken",adminModel._adminToken);
//获取所有管理员接口
router.get("/",adminModel._admin);
//通过id获取管理员日志接口
router.get("/adminLog",adminModel._adminLog);
//查看管理员名称是否重复
router.get("/adminRepeat",adminModel._adminRepeat);
//添加管理员接口；
router.post("/addAdmin",adminModel._addAdmin);
//添加验证密码接口
router.post("/makeSurePass",adminModel._makeSurePass);
//添加更改密码接口
router.post("/resetPass",adminModel._resetPass);
//添加图片上传接口
router.post("/upload",upFile.upFileCallBack);
//验证类别是否存在
router.get("/isTypeIn",adminModel._isTypeIn);
//添加店铺类别接口
router.post("/shopType",adminModel._shopType);
//获取店铺类别接口
router.get("/shopType",adminModel._getShopType);
//添加店铺接口
router.post("/shop",adminModel._shop);
//获取店铺接口
router.get("/shop",adminModel._getShop);
//验证商品类别是否存在接口
router.post("/goodsTypeRepeat",adminModel._goodsTypeRepeat);
//添加店铺中商品类别接口
router.post("/goodsType",adminModel._goodsType);
//通过店铺id获取店铺中的商品类别
router.get("/goodsType",adminModel._getGoodsType);
//添加商品
router.post("/goods",adminModel._goods);
module.exports = router;
