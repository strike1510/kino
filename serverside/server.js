// populate the object process.env from the file .env
const dotenv = require('dotenv');
dotenv.config(); 

// create express.js webapp
const express = require('express');
const app = express();
// app.set("view engine", "ejs"); // no server rendering, no problem
// app.set("views", "views"); // no server rendering, no problem
app.listen(process.env.WEB_PORT, '0.0.0.0',
    function() { console.log("Listening on "+process.env.WEB_PORT); }
);

// *** SETUP MIDDLEWARES ***
// app.use(callbackFunction1, callbackFunction2, callbackFunction3)
// app.use(routeBase, callback);

// setup form input (create request.body from POST data or json in the http request)
const bodyParser = require("body-parser");
app.use(bodyParser.json(), bodyParser.urlencoded({ extended: true }));

// setup serverside session storage
const session = require("express-session");
app.use(session({
    secret: "SecretRandomStringDskghadslkghdlkghdghaksdghdksh",
    saveUninitialized: true,
    // cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day in msec
    cookie: { maxAge: 1000 * 60 * 60 * 24, httpOnly: false, secure: false }, // PASSPORT
    resave: false
})); 
// if (request.session.cart===undefined) request.session.cart = [];
// request.session.cart.push("xxxx");

// setup CORS = Cross Origin Resource Sharing (needed for cross-origin API)
const cors = require('cors');
// app.use(cors()); // not enough!
// "when responding to a credentialed request, server must specify a domain, and cannot use wild carding"
app.use(cors({ origin: "http://localhost:8080", credentials: true, methods: [ 'GET', 'POST' ] })); 

// setup passport = authentication
// const auth = require("./utils/users.auth"); 
// auth.initializeAuthentications(app); 
// app.use("/auth", require("./controllers/auth.route"));

// setup additional routes
app.use("/static", express.static(__dirname + '/static'));
app.use("/carsapi", require("./controllers/carsapi.route"));

// setup default route = 'GET' as a HTTP VERB, not as a 'getter' of some data!
app.get('/', (request, response) => { 
    let clientIp = request.ip;
    response.send(`Hello, dear ${clientIp}. I am a nodejs website...`);
    response.end(); // optional = close response manually
});
