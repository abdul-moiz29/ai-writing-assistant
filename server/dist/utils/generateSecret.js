"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const generateJWTSecret = () => {
    // Generate a random 64-byte string
    const secret = crypto_1.default.randomBytes(64).toString('hex');
    console.log('Generated JWT Secret:');
    console.log(secret);
    return secret;
};
// Generate and display the secret
generateJWTSecret();
