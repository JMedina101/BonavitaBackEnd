


const path = require('path');
const express = require('express');

const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const helmet  = require('helmet');

const app     = express();
const Port    = 300;

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

const productRoute = require('./routes/productRoute');
const viewsRoute   = require('./routes/viewsRoute');
const adminRoute   = require('./routes/adminRoute');
// serving static files
app.use(express.static(path.join(__dirname, 'public')));
// Body parser, reading the data from the body in to req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded());
app.use(cookieParser())
// Data sanitization against nosql query injection
app.use(mongoSanitize());
// prevent query parameter pollution
app.use(hpp());
// app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Security HTTP headers
app.use(helmet());




// limit request  
const limiter = rateLimit({
    max:100,
    windowMs:60*60*1000,
    message:'Too many requests in this IP'
});

app.listen(Port,'localhost',()=>{

    console.log("Working ");

});

// app.use('/',limiter);


// app.use("/",productRoute);
app.use("/",viewsRoute);
app.all('*', (req, res, next) => {
    return next(res.status(404).json({
        err:'Resource not Found'

    }));
  });
module.exports = app;