const express = require('express');
const router = express();
const baseController = require("../controllers/base-controller");
const validationMiddleware = require('../middleware/validation-middleware');



router.get("/", baseController.index);
router.post("/signup", validationMiddleware.signup, baseController.signup);
router.post("/login", baseController.login);
router.post("/deleteUser", validationMiddleware.checkToken, baseController.deleteUser);
router.post("/updateUser", validationMiddleware.checkToken, baseController.updateUser);
module.exports = router;
