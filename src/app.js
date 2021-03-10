const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config()
const app = express();
const route = require('./routes');
const fileUpload = require('express-fileupload');
const path = require('path');
const pathConfig = require('./config');
app.use(fileUpload({
    createParentPath: true
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use('/api', route);
app.get(`${pathConfig.resourcePrefix}:filename`, function (req, res) {
    let fileName = req.params.filename
    //console.log(fileName)
    const parentDir = path.dirname(__dirname);
    console.log(__dirname, parentDir);
    return res.sendFile(parentDir + `/uploads/` + fileName)
});

app.get(`${pathConfig.resourcePrefix}:path/:filename`, function (req, res) {
    let fileName = req.params.filename
    let subPath = req.params.path
    //console.log(fileName)
    const parentDir = path.dirname(__dirname);
    console.log(__dirname, parentDir);
    return res.sendFile(parentDir + `/uploads/${subPath}/` + fileName)
});

app.get(`${pathConfig.resourcePrefix}:path1/:path2/:filename`, function (req, res) {
    let fileName = req.params.filename
    let subPath1 = req.params.path1
    let subPath2 = req.params.path2
    //console.log(fileName)
    const parentDir = path.dirname(__dirname);
    console.log(__dirname, parentDir);
    return res.sendFile(parentDir + `/uploads/${subPath1}/${subPath2}/` + fileName)
});

console.log(process.env);
// Connect to Database new
mongoose.connect(
    process.env.DB_CON_STRING,
    {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        dbName: 'Test'
    },
    (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Successfully Connected to the database');
        }
    }
);

app.listen(process.env.PORT);
console.log(`The magic happens at ${process.env.HOST}:${process.env.PORT}`);
