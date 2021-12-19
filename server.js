const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')


mongoose.connect('mongodb+srv://demo:hBjdsP9rTQaau7X@cluster0.jrdfh.mongodb.net/metting?retryWrites=true&w=majority', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
})

const app = express()
const PORT=process.env.PORT || 8080;
const routes = require('./routes/userCred');

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/', routes);




// app.use('/', express.static(path.join(__dirname, 'static')))
//app.use(bodyParser.json())

app.listen(PORT, () => console.log(`Server started on ${PORT}`));
