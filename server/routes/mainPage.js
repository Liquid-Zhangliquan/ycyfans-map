const express = require('express');

const router = express.Router();
const pool = require('../db/mysqlConf');
const { selectAll } = require('../db/sql');

router.get('/', async (req, res) => {
  // fields contains extra meta data about results, if available
  // execute will internally call prepare and query
  const [rows, fields] = await pool.execute(selectAll);
  console.log(rows);
  console.log(fields);
  res.send(rows);
});

module.exports = router;
