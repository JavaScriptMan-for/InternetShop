//dev
const express = require('express');
const app = express();
require('dotenv').config()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const path = require('path')
const cors = require('cors')
const https = require('https');
const http = require('http')
const fs = require('fs')

//Routes
const methods = require('./routes/products.route');
const auth = require('./routes/auth.route')
const basket = require('./routes/basket.route')

//Consts
const PORT = process.env.PORT || 80;
const BASE_URL = process.env.BASE_URL;
const BASE_URL_DEV = process.env.BASE_URL_DEV
const NODE_ENV = process.env.NODE_ENV || 'development';

// Переадресация с www на без www
app.use((req, res, next) => {
    if (req.headers.host.slice(0, 4) === 'www.') {
      const newHost = req.headers.host.slice(4);
          console.log(newHost)
      return res.redirect(301, `${req.protocol}://${newHost}${req.originalUrl}`);
    }
    next();
  });

app.use(cors({
  origin: NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://accessfull.ru', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')))
app.use('/', express.static(path.join(__dirname, '..', 'client', 'dist')))



//Middleware routes
app.use('/api', methods);
app.use('/api', auth)
app.use('/api', basket)


app.use((req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'));
})
const StartServer = async () => {
    try {
        console.log("Подключение к базе данных...");

        if(NODE_ENV === 'development') {
            await mongoose.connect(BASE_URL_DEV)
            .then(() => console.log('Успешное подключение базе данных для разработки'))
            .catch((e) => console.log("Ошибка при подключении к базе данных для разработки", e));
        app.listen(process.env.PORT, () => {
            console.log("Сервер запущен по порту", PORT, NODE_ENV)
        })
} else {
        await mongoose.connect(BASE_URL)
        .then(() => console.log('Успешное подключение базе данных'))
        .catch((e) => console.log("Ошибка при подключении к базе данных", e));

        const privateKey = fs.readFileSync('/etc/letsencrypt/live/accessfull.ru/privkey.pem', 'utf8');
        const certificate = fs.readFileSync('/etc/letsencrypt/live/accessfull.ru/fullchain.pem', 'utf8');
        const credentials = { key: privateKey, cert: certificate }
        const httpsServer = https.createServer(credentials, app);
        httpsServer.listen(process.env.PORT_SSL, () => {
        console.log('HTTPS Server running on port 443');

         // Создание HTTP-сервера для перенаправления на HTTPS
         const httpServer = http.createServer((req, res) => {
            res.writeHead(301, { "Location": `https://${req.headers.host}${req.url}` });
            res.end();
         });

        httpServer.listen(PORT, () => {
            console.log(`HTTP server is listening on port ${PORT}`);
         });
});
}
    } catch (error) {
        console.log("Ошибка при запуске сервера", error)
    }
}
try {
    StartServer();
} catch (error) {
    console.error(error)
}