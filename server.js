var express = require('express');
var bodyParser = require('body-parser');
const mysql = require('mysql');
const fs = require('fs');
const aws = require('aws-sdk');
const formidable = require('formidable');

var app = express();

app.set('views', './views');
app.use(express.static('./public'));
app.engine('html', require('ejs').renderFile);


const S3_BUCKET = process.env.S3_BUCKET;
aws.config.region = 'ap-south-1';	

// var con = mysql.createConnection({
//     host : "remotemysql.com",
//     user : "IHXn51U10d",
//     password: "ZZ7sxXwnkE",
//     database: "IHXn51U10d",
//     "port" : "3306"
// });

var con = mysql.createConnection({
    host : "localhost",
    user : "root",
    password: "bharat1@",
    database: "FondoBase",
});

con.connect(function(err){
    if(err) throw err;
    var que = "create table if not exists photobase ( SrNo int(11) AUTO_INCREMENT PRIMARY KEY, UserID int(11), upvotes int(11), link text, uploaded_at timestamp DEFAULT CURRENT_TIMESTAMP	, PhotoPrivacy text, SetWallpaper int(11), tags text, userPassword varchar(50) default 'fondo');";
    con.query(que, function (err) {
       if (err) throw err; 
       console.log("Database Connected!");
    });
});

app.use(bodyParser.json()); 

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true })); 
//form-urlencoded

// for parsing multipart/form-data
app.use(express.static('public'));

app.use(function(req, res, next){
    console.log(req.query);
    console.log(Object.keys(req.query)[0]);
    if(Object.keys(req.query)[0] == "module"){
        var ki = JSON.parse(req.query.module);
        switch (Object.keys(ki)[0]) {
            case 'search':{fs.readFile('SearchResult.html','utf8', function(err, file){
                            if (err) throw err;
                            var obj = {
                                'html': file,
                                'UserID': null,
                                'PhotoData': ""
                            };
                            console.log(ki.search);
                            console.log(`SELECT * FROM photobase WHERE UserID = ${ki.search}`);
                            console.log("||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||");
                            con.query(`SELECT * FROM photobase WHERE UserID = ${ki.search} AND PhotoPrivacy = 'Public'`, function(err, result){
                                if (err) throw err;
                                console.log("__________________________"+(result)+"sfsf");
                                if((result).length == 0){
                                    console.log("fdzvfmofvnajfnv+++++++++++++++++++++++++");
                                    con.query(`SELECT COUNT(*) FROM photobase WHERE UserID = ${ki.search}`, function(err, result){
                                        if (err)         {             res.writeHead(404);             res.write("some error occurred");             res.end();         }else{
                                        if(result[0]['COUNT(*)'] > 0 ){
                                            obj.UserID = ki.search;
                                        }
                                        res.writeHead(200, {'Content-Type': 'application/json'});
                                        res.write(JSON.stringify(obj));
                                        res.end();
                                    }
                                    });
                                }
                                else{
                                    obj.UserID = ki.search;
                                    obj.PhotoData = result;
                                    res.writeHead(200, {'Content-Type': 'application/json'});
                                    res.write(JSON.stringify(obj));
                                    res.end();
                                }
                            });
                            });
                            break;}
            case 'profile':{
                var obj = {
                    'UserID': null,
                    'PhotoData': null
                };   
                console.log("22222222222");
                console.log(`SELECT * FROM photobase WHERE UserID = ${ki.profile}`);
                con.query(`SELECT * FROM photobase WHERE UserID = ${ki.profile}`, function(err, result){
                    console.log("3333333333");
                    if (err)  throw err;
                        console.log("55555555555555");
                        console.log(result);
                    if(result.length === 0){
                        console.log("666666666666");
                        obj.PhotoData = [];
                        res.writeHead(200, {'Content-Type': 'application/json'});
                        res.write(JSON.stringify(obj));
                        res.end();
                    }
                    else{
                        console.log("77777777777");
                        obj.UserID = ki.profile;
                        obj.PhotoData = result;
                        res.writeHead(200, {'Content-Type': 'application/json'});
                        res.write(JSON.stringify(obj));
                        res.end();
                    }
                });         
                break;
            }
    
            case "password":{
                console.log(ki.password[0]);
                var que = `SELECT userPassword FROM photobase WHERE UserID = ${parseInt(ki.password[0])}`;
                console.log(que);
                con.query(que, function(err, results){
                    if (err)   throw err;
                    var obj = {
                        "auth": null
                    }
                    if(results[0].userPassword == ki.password[1]){
                        obj.auth = true;
                    }
                    else{
                        obj.auth = false;
                    }
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.write(JSON.stringify(obj));
                    res.end();
                });
                break;
            }
        
            case "delete":{
                var que = `DELETE FROM photobase WHERE SrNo = ${ki.delete}`;
                con.query(que, function(err, result){
                    if (err) throw err;
                    if (result.affectedRows == 1){
                        res.writeHead(200);
                        res.write(JSON.stringify({"del":true}));
                        res.end();
                    }
                    else{
                        res.writeHead(200);
                        res.write(JSON.stringify({"del":false}));
                        res.end();
                    }
                });
                break;
            }
    
            case "togglePrivacy" : {
                var que = `SELECT * FROM photobase WHERE SrNo = ${ki.togglePrivacy}`;
                con.query(que, function(err, result){
                    if (err) throw err;
                    var privacy = "Only me";
                    if (result[0].PhotoPrivacy == "Only me"){
                        privacy = "Public";
                    }
                    que = `UPDATE photobase SET PhotoPrivacy = "${privacy}" WHERE SrNo = ${ki.togglePrivacy}`;
                    con.query(que, function(err, result){
                        if (err)    throw err;
                        if (result.affectedRows == 1){
                            que = `SELECT PhotoPrivacy, uploaded_at FROM photobase WHERE SrNo = ${ki.togglePrivacy}`;
                            con.query(que, function(err, result){
                                if (err)  throw err;
                                res.writeHead(200);
                                res.write(JSON.stringify(result));
                                res.end();
                            });
                        }
                        else{
                            res.writeHead(404);
                            res.write("Some error occurred!");
                            res.end();
                        }
                    });
                });
                break;
            }
            case "setback" : {
                var que = `UPDATE photobase SET SetWallpaper = 0 WHERE UserID = ${ki.UserID} AND SetWallpaper = 1`
                con.query(que, function(err){
                    if (err)   throw err;
                    que = `SELECT * FROM photobase WHERE SrNo = ${ki.setback}`
                    con.query(que, function(err, result){
                        if (err)   throw err;
                        if(result[0].UserID == ki.UserID){
                            que = `UPDATE photobase SET SetWallpaper = 1 WHERE SrNo = ${ki.setback}`
                            con.query(que, function(err, result1){
                                if (err)   throw err;
                                res.writeHead(200);
                                res.write(JSON.stringify({'reply':true}));
                                res.end();
                            });
                        }
                        else{
                            que = `SELECT userPassword FROM photobase WHERE UserID = ${ki.UserID}`
                            con.query( que , function(err, pass){
                                if (err)  throw err;
                                console.log(result[0].uploaded_at);
                                var t = result[0].uploaded_at;
                                console.log(t.toUTCString());
                                que = `INSERT INTO photobase (UserID, link, upvotes, PhotoPrivacy, SetWallpaper, userPassword, tags ) values (${ki.UserID}, "${result[0].link}", ${result[0].upvotes}, "${result[0].PhotoPrivacy}", 1, "${pass[0].userPassword}", "${result[0].tags}")`;
                                con.query(que, function(err, abcd){
                                    if (err) throw err;
                                    res.writeHead(200);
                                    res.write(JSON.stringify({'reply':true}));
                                    res.end();
                                });
                            });
                        }
                    });
                });
                break;
            }
            case "checkID" : {
                var que = `SELECT COUNT(*) FROM photobase WHERE UserID = ${ki.checkID}`;
                con.query(que, function(err, result){
                    if (err)  throw err;
                    var bool;
                    if(result[0]["COUNT(*)"] != 0){
                        bool = 'true';
                    }
                    else{
                        bool = 'false';
                    }
                    res.writeHead(200);
                    res.write(bool);
                    res.end();
                });
                break;
            }
    
     
            default: {console.log("wrong request");
                        res.writeHead(200);
                        res.write("hello there");
                        res.end();
                break;}
        }
    }
    else{
        next();
    }
    });

app.get('/', function(req, res){
    fs.readFile("index.html", 'utf8', function(err, result){
        if(err) throw err;
        res.writeHead(200);
        res.write(result);
        res.end();
    }); 
});

app.get('/create', function(req, res){
    fs.readFile("create.html", 'utf8', function(err, result){
        if(err) throw err;
        res.writeHead(200);
        res.write(result);
        res.end();
    });
});


app.get('/get_image_name', function(req, res){
    console.log("Mai andar aagaya");
    con.query("select SrNo from photobase where SrNo = (select MAX(SrNo) from photobase)", function(err, result){
        if(result.length == 0){
            result = [
                {
                    'SrNo' : 0
                }
            ];
        }
        var send_back = (parseInt(result[0].SrNo)+1);
        res.writeHead(200);
        res.write(`${send_back}`);
        res.end();

        });
});

app.get('/sign-s3', (req, res) => {
    console.log("reached1");
    const s3 = new aws.S3();
    const fileName = req.query['file-name'];
    const fileType = req.query['file-type'];
    const s3Params = {
      Bucket: S3_BUCKET,
      Key: fileName,
      Expires: 60,
      ContentType: fileType,
      ACL: 'public-read'
    };

    console.log("reached2");
  
    s3.getSignedUrl('putObject', s3Params, (err, data) => {
      if(err){
    console.log("reached3");

        console.log(err);
        return res.end();
      }
    console.log("reached4");

      const returnData = {
        signedRequest: data,
        url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
      };
      console.log(returnData.url);
      res.write(JSON.stringify(returnData));
      res.end();
    });
  });

  app.post('/save-details', (req, res) => {
    var host = req.headers.host;
    var form = new formidable.IncomingForm();
    con.query("select SrNo from photobase where SrNo = (select MAX(SrNo) from photobase)", function(err, result){
        if(result.length == 0){
            result = [
                {
                    'SrNo' : 0
                }
            ];
        }
    form.parse(req, function(err, fields, files){
    console.log("qqqqqqqqqqqqqqqqq");
    console.log(req.body);
    console.log(req.query);
    que = `SELECT userPassword FROM photobase WHERE UserID = ${fields.UserID}`;
    console.log(fields.url);
    con.query(que, function(err, resultz){
        if (err)  throw err;
    if(resultz.length == 0){
        console.log(resultz);
        console.log("sssssssssssssssssss");
        var passwd = fields.Password;
        var uploadSql = `insert into photobase (UserID,upvotes, link, PhotoPrivacy, SetWallpaper, userPassword, tags) values ( ${fields.UserID}, 0, "${fields.url}","Public", 0, "${passwd}" , '${fields.tags}');`;
        console.log(uploadSql);
        con.query(uploadSql, function(err, result){
            if (err) throw err;
            res.writeHead(200);
            console.log("uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu");
            res.write(`<script>window.location.href = 'http://${host}/profile.html';</script>` );
            res.end();
        });
    }
    else{
        console.log(fields);
        console.log(uploadSql);
        var passwd = resultz[0].userPassword;
        var uploadSql = `insert into photobase (UserID,upvotes, link, PhotoPrivacy, SetWallpaper, userPassword, tags) values ( ${fields.UserID}, 0, "${fields.url}","Public", 0, "${passwd}" , '${fields.tags}');`;
        con.query(uploadSql, function(err, result){
            if (err)      throw err;
            res.writeHead(200);
            res.write(`<script>window.location.href = 'http://${host}/profile.html'</script>` );
            res.end();
            
        });
    }
    });
});
});
  });

app.get('/:d', function(req, res){
    fs.readFile(req.params.d, 'utf8', function(err, result){
        if(err) throw err;
        res.writeHead(200);
        res.write(result);
        res.end();
    });
});

app.get('*', function(req, res){
    res.send("Invalid request");
});

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
 });

app.listen(process.env.PORT || 3000);