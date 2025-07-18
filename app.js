const express = require('express');
const morgan = require('morgan');
const eventRoutes = require('./routes/eventRoutes');
const mainRoutes = require('./routes/mainRoutes');
const methodOverride = require('method-override');
const multer = require('multer');
const mongoose = require('mongoose');
const {fileUpload} = require('./middleware/fileUpload');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const User = require('./models/user'); 
const userRoutes = require('./routes/userRoutes');
const app = express();

let port = 3000;
let host = 'localhost';
//let url = 'mongodb://localhost:27017/demos';
app.set('view engine', 'ejs');
const mongUri = 'mongodb+srv://ayannalee839:ayannalee123@cluster0.xkfkmgx.mongodb.net/project3?retryWrites=true&w=majority&appName=Cluster0';

const eventModel = require('./models/event');

mongoose.connect(mongUri)
.then(()=>{
    app.listen(port, host, () =>{
        console.log('The server is on port ' + port);
    });
})
.catch(err=>console.log(err.message));

//middleware
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));

//sessions middleware
app.use(session({
    secret: 'fueuffuwfeuibfeefb',
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 60*60*1000},
    store: new MongoStore({
        mongoUrl: 'mongodb+srv://ayannalee839:ayannalee123@cluster0.xkfkmgx.mongodb.net/project3?retryWrites=true&w=majority&appName=Cluster0'})
}));
//have to use it after making the session
app.use(flash());

app.use((req, res, next)=>{
    //console.log(req.session);
    res.locals.user = req.session.user||null;
    res.locals.successMessages = req.flash('success');
    res.locals.errorMessages = req.flash('error');
    next();
});

app.use('/', mainRoutes);

app.use('/events', eventRoutes);
app.use('/users', userRoutes);


app.use((req, res, next) => {
    let err = new Error('The server cannot locate ' + req.url);
    err.status = 404;
    next(err);
})

app.use((err, req, res, next)=>{
    if(!err.status){
        console.log(err.stack);
        err.status = 500;
        err.message = ("Internal Server Error");
    }
    res.status(err.status);
    res.render('error', {error: err});
});

