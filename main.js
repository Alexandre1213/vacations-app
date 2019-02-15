const express = require('express');
const app = express();

var cors = require('cors')
app.use(cors())

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : process.env.DB_SERVER,
  user     : process.env.DB_USER,
  password : process.env.DB_PASSWD,
  database : process.env.DB_NAME
});
connection.connect();
const port = process.env.PORT || 5000;

app.get(/\/[0-9]{6}/gm, (req, res) => {
    console.log('GET');
    let id = req.path.substr(1, 6);
    let data = '';
    connection.query('SELECT data FROM user_data WHERE u_id = ' + id, function (error, results, fields) {
        if(results[0] == undefined) { res.send('undefined'); return; }
        if (error) throw error;
        res.status(200).send(results[0].data).end();
    });
    return;
});

app.post(/\/[0-9]{6}/gm, (req, res) => {
  console.log('GET');
  let id = req.path.substr(1, 6);
  let data = '';
  connection.query('SELECT * FROM user_data WHERE u_id = ' + id, function (error, results, fields) {
      if (error) throw error;

      if(results == []) {
          // INSERT INTO
          connection.query("INSERT INTO user_data VALUES ('" + id + "', '" + req.body + "')", function (error, results, fields) { if (error) throw error; });
      } else {
          // UPDATE
          //connection.query('SELECT * FROM user_data WHERE u_id = ' + id, function (error, results, fields) {});
      }

      res.status(200).end();
  });
  return;
});

app.listen(port, () => console.log(`Starting server on port ${port} !`));