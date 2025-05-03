"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const router = (0, express_1.Router)();
// User routes
router.get('/profile', user_controller_1.getUserProfile);
router.patch('/credits', user_controller_1.updateUserCredits);
exports.default = router;
