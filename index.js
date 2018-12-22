const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const validator = require('express-validator');
const session = require('express-session');
const dependencies = require('./dependencies');
const path = require('path');
const http = require('http');

dependencies.resolve(function(main){
    SetupExpress();

    function SetupExpress(){
        const app = express();

        configureExpress(app);
        const server = http.createServer(app);

        // Setup Router/Routing
        const router = require('express-promise-router')();
        main.setRouting(router);
        app.use(router);

        server.listen(80, function(...args){
            console.log('Listening on port 80');
        });

        // database.setupDB();
    }

    function configureExpress(app){
        // require('./passport/passport-local');

        app.use(express.static('client/public'));
        app.use(cookieParser());
        app.set('views', path.join(__dirname, '/client/public'));
        app.set('view engine', 'ejs');
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(validator());
        app.use(session({
            secret: 'supersecretkey',
            resave: true,
            saveInitializes: true,
            saveUninitialized: true,
            //cookie: {secure: true},
        }));
        // app.use(passport.initialize());
        // app.use(passport.session());
    }

});