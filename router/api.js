const express = require("express");
const router = express.Router();
const apiModel=require("../module/apiModel");
const upFile = require("../public/upFile.js");
const db = require("../public/db.js");//
//获取商品接口
router.get("/shop",apiModel._shop)
//获取验证码接口
router.post("/yzm",apiModel._yzm);
//登录&注册接口
router.post("/login",apiModel._login);
//获取店铺详情
router.get("/shopOpt",apiModel._shopOpt);
//根据类别id及商铺id获取商品
router.get("/goods",apiModel._goods);
//添加/减少购物车接口
router.post("/car",apiModel._car);
//获取购物车接口
router.get('/car',apiModel._getCar);
//支付接口
router.post("/getSum",apiModel._getSum);
//支付
router.post("/pay",apiModel._pay);
module.exports = router;
