const express = require('express');
const app = express();

const cookieParser = require('cookie-parser');
const path = require('path');

const espressSession = require('express-session');
const flash = require('connect-flash');

const db = require('./config/mongoose-connection');

const usersRouter = require('./routes/usersRouter');
const productsRouter = require('./routes/productsRouter');
const ownersRouter = require('./routes/ownersRouter');
const index = require('./routes/index');

require("dotenv").config();

// app.use((req, res, next) => {
//   res.locals.error = "";
//   next();
// });

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.use(espressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(flash());

app.use("/owners", ownersRouter);
app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use("/", index);

app.listen(3000)