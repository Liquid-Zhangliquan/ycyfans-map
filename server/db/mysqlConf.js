const mysql = require('mysql2/promise');
// 在上传至服务器之前请删除config.json文件，并在服务器配置变量，通过config.template.json文件生成config.json文件
const configJson = require('../config.json');

const pool = mysql.createPool({
  host: `${configJson.mysqlHost}`,
  user: `${configJson.mysqlUser}`,
  password: `${configJson.mysqlPassword}`,
  database: `${configJson.mysqlDatabase}`,
});

module.exports = pool;
