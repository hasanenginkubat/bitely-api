const express = require("express");
const router = express.Router();
const product = require("./productRoutes")
router.use(express.json());

router.use("/product", product);



module.exports = router;