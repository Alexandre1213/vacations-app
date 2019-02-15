const express = require('express');
const app = express();
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
    let id = req.path.substr(1, 6);
    connection.query('SELECT data FROM user_data WHERE u_id = ' + id, function (error, results, fields) {
        if(results[0] == undefined) { res.send('undefined'); return; }
        if (error) throw error;
        res.text(results[0].data);
    });
});

app.listen(port, () => console.log(`Starting server on port ${port} !`));