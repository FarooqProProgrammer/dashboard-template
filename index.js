import express from "express";
import session from "express-session";
import i18n from "i18n";
import path from "path";
import { fileURLToPath } from 'url';
import authRoute from "./routes/auth/index.js";
import chalk from 'chalk';
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { body, validationResult } from "express-validator"; // For input validation
import { accessControl } from "./middleware/access-control.js";
import MySQLStore from 'express-mysql-session';
import mysql from 'mysql2/promise'; // Use mysql2 for promise support

const app = express();

// Define __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use helmet to secure HTTP headers
app.use(helmet());

// Set up CORS with specific settings
app.use(cors({}));

// Set up rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later."
});
app.use(limiter);


// i18n Configuration
i18n.configure({
    locales: ['en', 'fr'],   // Add more languages as needed
    directory: path.join(__dirname, 'locales'),
    defaultLocale: 'en',
    queryParameter: 'lang',   // Language selection via query parameter
    cookie: 'locale'          // Optionally store language preference in a cookie
});

// Express session with secure cookie settings
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production', httpOnly: true, maxAge: 3600000 } // Only over HTTPS in production
}));

app.use(i18n.init);
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/v1', authRoute);



app.get('/lang/:locale', (req, res) => {
    res.setLocale(req.params.locale);
    res.cookie('locale', req.params.locale);
    res.redirect('back');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(chalk.blue.bold(`Server is running on ${chalk.underline(`http://localhost:${PORT}`)}`));
});
