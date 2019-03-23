const express = require('express');

const router = express.Router();
// const jwt = require('jsonwebtoken');
// const pool = require('../db/mysqlConf');
// const { } = require('../db/sql');

router.post('/', (req, res) => {
  const { name } = req.body;
  const { password } = req.body;

  if (name === 'ycy' && password === 'ycy') {
    res.send('login success');
    // Sign Token if we need
  } else {
    res.status(400).send('name or password incorrect');
  }
});

module.exports = router;
