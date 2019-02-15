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
  console.log('POST');
  let id = req.path.substr(1, 6);
  let ndata = req.body;
  console.log(ndata);
  connection.query('SELECT * FROM user_data WHERE u_id = ' + id, function (error, results, fields) {
      if (error) throw error;

      console.log('RESULTS :', results);
      console.log('FIELDS :', fields);
      if(results == []) {
          // INSERT INTO
          connection.query(`INSERT INTO user_data VALUES ('${id}', 'typical value')`, function (error, results, fields) { if (error) throw error; console.log('INSERT :', results); });
      } else {
          // UPDATE
          connection.query(`UPDATE user_data SET data = '${ndata}' WHERE u_id = '${id}'`, function (error, results, fields) { if (error) throw error; console.log('UPDATE :', results); });
      }

      res.status(200).end();
  });
  return;
});

app.listen(port, () => console.log(`Starting server on port ${port} !`));