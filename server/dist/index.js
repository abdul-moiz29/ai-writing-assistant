"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./utils/db"));
const routes_1 = __importDefault(require("./routes"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
// Connect to MongoDB
(0, db_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// API routes
app.use('/api', routes_1.default);
// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to AI Writing Assistant API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            users: '/api/users'
        }
    });
});
// Error handling middleware
app.use((req, res, next) => {
    res.status(404).json({ error: 'Route not found' });
});
// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`API Documentation: http://localhost:${port}`);
});
