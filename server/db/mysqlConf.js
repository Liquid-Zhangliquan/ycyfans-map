const mysql = require('mysql2/promise');
// 出于安全性考量，可在上传至服务器之前删除config.json文件，并设置CI/CD Variable ，通过config.template.json文件动态生成config.json文件
const configJson = require('../config.json');

const pool = mysql.createPool({
  host: `${configJson.mysqlHost}`,
  user: `${configJson.mysqlUser}`,
  password: `${configJson.mysqlPassword}`,
  database: `${configJson.mysqlDatabase}`,
});

module.exports = pool;
