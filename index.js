const http = require('http');
const express = require('express');
const app = express();
const mysql = require('mysql2');
const cors = require('cors')
const bodyParser = require('body-parser');
const hostname = '127.0.0.1';
const port = 3000;
const fs = require('fs');

// create the connection to database
//const connection = mysql.createConnection({
//    host: 'localhost',
//    user: 'root',
//    password:"root",
//    database: 'imi_his_db'
//  });

const  { readFileSync } = require("fs");
var path  = require("path");
let cer_part = path.join(process.cwd(),'isrgrootx1.pem')

const connection = mysql.createConnection({
    host: 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
    user: '3EhZt2vFkmakGfT.root',
    password:"KnsHSuwa0dJylpGn",
    database: 'imi_his_db',
    port:4000,
    ssl:{
      ca:fs.readFileSync(cer_part)
    }
    });

app.use(cors())
app.use(express.json())
app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.get('/', (req, res) => {
    res.json({
        "Name":"project lab 4",
        "Author":"Charoenporn Bouyam",
        "APIs":[
            {"api_name":"/getDoctors/","method":"get"},
            {"api_name":"/getDoctor/:id","method":"get"},
            {"api_name":"/addDoctor/","method":"post"},
            {"api_name":"/editDoctor/","method":"put"},
            {"api_name":"/editDoctor/","method":"delete"},
        ]
    });
});

app.get('/getDoctors/', (req, res) => {
    let sql = 'SELECT * FROM doctor';
    connection.query(sql, function(err, results, fields) {
          res.json(results);
        }
      );
});

app.get('/getdoctor/:id', (req, res) => {
    let id = req.params.id;
    let sql = 'SELECT * FROM doctor WHERE doctor_id = ?';
    connection.query(sql,[id], function(err, results, fields) {
          res.json(results);
        }
      );
});

app.get('/getpatients/', (req, res) => {
    let sql = 'SELECT * FROM patient';
    connection.query(sql, function(err, results, fields) {
          res.json(results);
        }
      );
});

app.get('/getpatient/:id', (req, res) => {
    let sql = 'SELECT * FROM patient';
    connection.query(sql, function(err, results, fields) {
          res.json(results);
        }
      );
});

app.get('/getemrs/', (req, res) => {
    let sql = 'SELECT * FROM Medical_Record';
    connection.query(sql, function(err, results, fields) {
          res.json(results);
        }
      );
});

app.get('/getemr/:id', (req, res) => {
    let sql = 'SELECT * FROM Medical_Record';
    connection.query(sql, function(err, results, fields) {
          res.json(results);
        }
      );
});

app.post('/addDoctor',urlencodedParser, (req, res) => {
  console.log(req.body);
    let sql = 'INSERT INTO doctor(name, telephone, status) VALUES (?,?,?)';
    let values = [req.body.doctor_name,req.body.doctor_phone,req.body.status];
    let message = "Cannot Insert";
    connection.query(sql,values, function(err, results, fields) {
      if(results) { message = "Inserted";}
          res.json({error:false,data:results,msg:message});
        }
      );
});

app.put('/editDoctor', urlencodedParser, (req, res) => {
  console.log(req.body);
  let sql = 'UPDATE doctor SET name =?, telephone=?, status=? WHERE doctor_id=? ';
  let values = [req.body.doctor_name,req.body.doctor_phone,req.body.status, req.body.doctor_id];
  let message = "Cannot Edit";

  connection.query(sql,values, function(err, results, fields) {
        if(results) { message = "Updated";}
        res.json({error:false,data:results,msg:message});
      }
    );
});

app.delete('/editDoctor', urlencodedParser, (req, res) => {
console.log(req.body);
  let st = 0;
  if(req.body.doctor_status==1){
    st = 1;
  }
  let sql = 'UPDATE doctor set status=? WHERE doctor_id=? ';
  let values = [st,req.body.doctor_id];
  console.log(values)
  let message = "Cannot Delete";
  connection.query(sql,values, function(err, results, fields) {
          if(results) { message = "Updated";}
          res.json({error:false,data:results,msg:message});
      }
    );
});