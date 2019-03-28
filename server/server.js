const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const login = require('./routes/login');
const mainPage = require('./routes/mainPage');

const app = express();

app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use(bodyParser.json());

// 解决跨域问题
app.use(cors());
app.options('*', cors());

app.set('trust proxy', true);

app.use((req, res, next) => {
  res.setHeader('Content-Type', 'text/html');
  next();
});

app.use('/login', login);
app.use('/mainpage', mainPage);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
