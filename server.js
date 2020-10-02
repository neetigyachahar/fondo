var express = require('express');
var bodyParser = require('body-parser');
const mysql = require('mysql');
const fs = require('fs');
const aws = require('aws-sdk');
const formidable = require('formidable');
var app = express();
var server = app.listen(process.env.PORT || 3000);
var io = require('socket.io')(server);
const gc = io.of('/globalChat');
const iov = io.of('/vtop');
var path = require('path');
const webpush = require('web-push');

const publicVapidKey = "BLK2ZXGlXNAIFCWeG-bQ9Dkfjvc3dlwK3TbHJo6aZ__Tx47QUMvQLdHUi8Okq4Qit9plJwkEkuwRIVid6J2YGwI";
const privateVapidKey = "9Bl_L30_uwGIXOfMJ--dVeK6-gUBrnWf3zSDCZHZJws";

// Replace with your email
webpush.setVapidDetails('mailto:fondo.xyz@gmail.com', publicVapidKey, privateVapidKey);

// Public Key:
// BLK2ZXGlXNAIFCWeG-bQ9Dkfjvc3dlwK3TbHJo6aZ__Tx47QUMvQLdHUi8Okq4Qit9plJwkEkuwRIVid6J2YGwI

// Private Key:
// 9Bl_L30_uwGIXOfMJ--dVeK6-gUBrnWf3zSDCZHZJws


iov.on('connection', function(socket){
    var num1 = io.of('/vtop').sockets;
    num1 = Object.keys(num1).length;
    socket.emit('online', num1);
    socket.broadcast.emit('online', num1);
    socket.on('vtop', function(msg){
        console.log("vtop pe aaya");
        if(JSON.parse(msg).id.length == 0 ){
            return false;
        }
        socket.emit('vtop', msg);
        socket.broadcast.emit('vtop', msg);
    });
socket.on('disconnect', function(){
        num1 = io.of('/vtop').sockets;
        num1 = Object.keys(num1).length;
        socket.broadcast.emit('online', num1);
    });
});


gc.on('connection', function(socket1){
    var num = io.of('/globalChat').sockets;
    num = Object.keys(num).length;
    console.log("GC Connected: "+ num);
    socket1.emit('onlineGC',  num);
    socket1.broadcast.emit('onlineGC',  num);
    socket1.on('gc', function(msg1){
        if(JSON.parse(msg1).id.length == 0 ){
            return false;
        }
        console.log("gc pe aaya");
        socket1.emit('gc', msg1);
        socket1.broadcast.emit('gc', msg1);
    });
    socket1.on('disconnect', function(){
        num = io.of('/globalChat').sockets;
        num = Object.keys(num).length;
        socket1.broadcast.emit('onlineGC',  num);
    });
});

// io.on('disconnect', function(){
//     console.log('dis-----------sdf-sad-fa-sdf-asd-f');
//     io.emit('online', Object.keys(io.sockets.connected).length);
// });

//ye hack keliye comment he

app.set('views', './views');
app.use(express.static('./public'));
app.engine('html', require('ejs').renderFile);

const S3_BUCKET = process.env.S3_BUCKET;
aws.config.region = 'ap-south-1';	

var con_data = {
    host : "remotemysql.com",
    user : "IHXn51U10d",
    password: "ZZ7sxXwnkE",
    database: "IHXn51U10d",
    "port" : "3306"
};

//ddddddddddddddddddddddddddddddddddddddd
// var db_config = {
//   host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'example'
// };

var con;

function handleDisconnect() {
  con = mysql.createConnection(con_data); // Recreate the connection, since
                                                  // the old one cannot be reused.

  con.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  con.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}

handleDisconnect();
//dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd

//akash
// var conakash = mysql.createConnection({
//     host : "remotemysql.com",
//     user : "UzxBWmAJRh",
//     password: "l7kouMwha3",
//     database: "UzxBWmAJRh"
// });

console.log("Connection state: "+con.state);
var note = 1;

app.use(function(req,res, next){
    console.log("Connection state Andar use: "+ con.state);
    if(note == 1 && con.state == "disconnected"){
    conSql();
    note = 0;
    setInterval(()=>{note = 1}, 600000);
    }
    next();
});



// function conSql(){
//     console.log("Connection state Andar andar use: "+ con.state);
//     console.log(con.state);
// }





// function conSql(){
// con.connect(function(err){
//     if(err) throw err;
//     var que = "create table if not exists photobase ( SrNo int(11) AUTO_INCREMENT PRIMARY KEY, UserID int(11), upvotes int(11), link text, uploaded_at DATETIME DEFAULT (CONVERT_TZ(NOW(), '+0:00', '+05:30' ))	, PhotoPrivacy text, SetWallpaper int(11), tags text, userPassword varchar(50) default 'fondo');";
//     con.query(que, function (err) {
//        if (err) throw err; 
//        console.log("Database connected!");
//         var que = "create table if not exists timeliner ( SrNo int(11) AUTO_INCREMENT PRIMARY KEY, ID int(11), topicName text, progress text,  uploaded_at DATETIME DEFAULT (CONVERT_TZ(NOW(), '+0:00', '+05:30' )));";
//         con.query(que, function (err) {
//             if (err) throw err; 
//             console.log("Table set");
//             console.log(con.state);

// //akash All in one
// conakash.connect(function(err){
//     if(err) throw err;
//     var que = "create table if not exists allinonedata(name text, work text, email text, address text, aadhar int(20));";
//     con.query(que, function (err) {
//        if (err) throw err; 
//        console.log("Akash Database connected!");
//     });
// });


//        });
//     });
// });
// }


app.use(bodyParser.json()); 

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true })); 
//form-urlencoded

// for parsing multipart/form-data
app.use(express.static('public'));

app.use(function(req, res, next){
     
     
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
                             
                             
                             
                            con.query(`SELECT * FROM photobase WHERE UserID = ${ki.search} AND PhotoPrivacy = 'Public'`, function(err, result){
                                if (err) throw err;
                                 
                                if((result).length == 0){
                                     
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
                 
                 
                con.query(`SELECT * FROM photobase WHERE UserID = ${ki.profile}`, function(err, result){
                     
                    if (err)  throw err;
                         
                         
                    if(result.length === 0){
                         
                        obj.PhotoData = [];
                        res.writeHead(200, {'Content-Type': 'application/json'});
                        res.write(JSON.stringify(obj));
                        res.end();
                    }
                    else{
                         
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
                 
                var que = `SELECT userPassword FROM photobase WHERE UserID = ${parseInt(ki.password[0])}`;
                 
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
                var que = `SELECT link FROM photobase WHERE SrNo = ${ki.delete}`;
                con.query(que, function(err, link){
                     
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


                    const s3 = new aws.S3();
                    const params = {
                        Bucket: S3_BUCKET,
                        Key: (link[0].link).split('/')[(link[0].link).split('/').length-1]
                }
                try {
                    s3.headObject(params).promise();
                     
                    try {
                        s3.deleteObject(params).promise();
                        console.log("file deleted Successfully");
                    }
                    catch (err) {
                         console.log("ERROR in file Deleting : " + JSON.stringify(err));
                    }
                } catch (err) {
                        console.log("File not Found ERROR : " + err.code);
                }
                });
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
                if(ki.UserID.length == 0){
                    res.write("<script>alert('No profile set');</script>");
                    res.render('profile.html');
                    break;
                }
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
                                 
                                var t = result[0].uploaded_at;
                                 
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
    
     
            default: { 
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

app.get('/get_image_name', function(req, res){
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

     
  
    s3.getSignedUrl('putObject', s3Params, (err, data) => {
      if(err){
     

         
        return res.end();
      }
     

      const returnData = {
        signedRequest: data,
        url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
      };
       
      res.write(JSON.stringify(returnData));
      res.end();
    });
  });


  const options = {
    setHeaders: function (res, path, stat) {
        res.set('Service-Worker-Allowed', '/');
    },
};

app.use(express.static(path.join(process.cwd(), './public/js'), options));

  app.post('/subscribe', (req, res) => {
    const subscription = req.body;
    res.status(201).json({});
    const payload = JSON.stringify({ title: 'test' });

    console.log(subscription);
    webpush.sendNotification(subscription, payload).catch(error => {
      console.error(error.stack);
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
     
     
     
    que = `SELECT userPassword FROM photobase WHERE UserID = ${fields.UserID}`;
     
    con.query(que, function(err, resultz){
        if (err)  throw err;
    if(resultz.length == 0){
         
         
        var passwd = fields.Password;
        var uploadSql = `insert into photobase (UserID,upvotes, link, PhotoPrivacy, SetWallpaper, userPassword, tags) values ( ${fields.UserID}, 0, "${fields.url}","Public", 0, "${passwd}" , '${fields.tags}');`;
         
        con.query(uploadSql, function(err, result){
            if (err) throw err;
                res.render("profile.html");
        });
    }
    else{
        var passwd = resultz[0].userPassword;
        var uploadSql = `insert into photobase (UserID,upvotes, link, PhotoPrivacy, SetWallpaper, userPassword, tags) values ( ${fields.UserID}, 0, "${fields.url}","Public", 0, "${passwd}" , '${fields.tags}');`;
        con.query(uploadSql, function(err, result){
            if (err)      throw err;
            res.render("profile.html");            
        });
    }
    });
});
});
  });

//akash
app.post('/worker', function(req, res){
    var data = req.query;
        var que = `INSERT INTO workerdetails(name,work,email,address,aadhar)values('${data.name}','${data.work}','${data.email}','${data.address}','${data.aadhar}')`;
        conakash.query(que, function(err, result){
            if (err) throw err;
            res.render('worker.html');
            res.end();
        });
});

app.get('/timeliner', (req, res)=>{res.render("timeliner.html");});
app.get('/timeliner/search', (req, res)=>{
    que = `select * from timeliner where ID = ${req.query.ID}`;
    con.query(que, function(err, result){
        if (err)  throw err;
        if(result.length == 0){
            res.writeHead(200);
            res.write('not found');
            res.end();
        }else{
            res.writeHead(200);
            res.write('Exists');
            res.end();
        }
    });
});


app.get('/timeliner/fire', (req, res)=>{
    var para = JSON.parse(req.query.p);
    console.log(para);
    que = `insert into timeliner(ID, topicName, progress) values(${para.ID}, "${para.topic}", "${para.fire}")`;
    con.query(que, function(err, result){
        if (err)  throw err;
        if(result.message.length == 0){
            res.writeHead(200);
            res.write('lit!');
            res.end();
        }else{
            res.writeHead(200);
            res.write('some error occured!');
            res.end();
        }
    });
});

app.get('/timeliner/getID', (req, res)=>{
    var obj = {};
    var arr = new Array();
    que = `select topicName, progress, uploaded_at from timeliner where ID = ${req.query.ID}`;
    con.query(que, function(err, result){
        console.log(result);
        if(err) throw err;
        var obj = {};
        for(var i = 0; i<result.length; i++){
            var topic = result[i].topicName;
            var pro = result[i].progress;
            var tim = result[i].uploaded_at;
            if (Object.keys(obj).indexOf(topic) > -1) {
                obj[topic].push([pro, tim]);
             }
             else{
                 obj[topic] = [[pro, tim]];
             }
        }
        console.log(obj)
        res.write(JSON.stringify(obj));
        res.end();
    });
});

app.get('/timeliner/createTopic', (req, res)=>{
    que = `select * from timeliner where timeliner.ID = ${req.query.ID} `;
    con.query(que, function(err, result){
        if (err) throw err;
        console.log(result);
        if(result.length == 0){
            if(req.query.N == 1){
                que = `insert into timeliner(ID, topicName, progress) values(${req.query.ID}, "${req.query.topicName}", "Topic created.");`;
                con.query(que, function(err, result){
                    if (err)  throw err;
                    if(result.message.length == 0){
                        res.writeHead(200);
                        res.write('ID Successfully Created!');
                        res.end();
                    }else{
                        res.writeHead(200);
                        res.write('Some Error Occured!');
                        res.end();
                    }
                });
            }
            else{
                res.writeHead(200);
                res.write('Some Error Occured!');
                res.end();
            }
        }else{
            if(req.query.N == 0){

                que = `select * from timeliner where ID=${req.query.ID} and topicName =  "${req.query.topicName}";`;
                con.query(que, function(err, result){
                    if (err)  throw err;
                    if(result.length == 0){
                        que = `insert into timeliner(ID, topicName, progress) values(${req.query.ID}, "${req.query.topicName}", "Topic created.");`;
                        con.query(que, function(err, result){
                            if (err)  throw err;
                            if(result.message.length == 0){
                                res.writeHead(200);
                                res.write('Topic Added!');
                                res.end();
                            }else{
                                res.writeHead(200);
                                res.write('Some Error Occured!');
                                res.end();
                            }
                        });
                    }else{
                        res.writeHead(200);
                        res.write('Topic Already Exists!');
                        res.end();
                    }
                });
            }
            else{
                res.writeHead(200);
                res.write('ID Already Exists!');
                res.end();
            }
        }
});
    console.log(req.query.topicName);
    console.log(req.query.ID);
});



app.get('/shubham-Kumar', (req, res)=>{res.render('shubham_index.html')});
app.get('/shubham-Kumar/an-interstellar-visitor', (req, res)=>{res.render('shubham_post1.html')});
app.get('/shubham-Kumar/about', (req, res)=>{res.render('shubham_about.html')});
app.get('/contact', (req, res)=>{res.render('fondo_contact.html')});


app.get('/allinone', function(req, res){res.render('allinone.html');});
app.get('/electrician', function(req, res){res.render('electrician.html');});


app.get('/chat', function(req, res){res.render('chat.html');});
app.get('/', function(req, res){res.render('index.html');});
app.get('/create', function(req, res){res.render('create.html');});
app.get('/profile', function(req, res){res.render('profile.html');});
app.get('/confessions', function(req, res){res.send('<script>alert("Coming Soon ☺"); window.history.back();</script>');});
app.get('/about', function(req, res){res.send('<script>alert("Coming Soon ☺"); window.history.back();</script>');});
app.get('/popup', function(req, res){res.render('popup.html')});
app.get('/download', function(req, res){res.download('fondo_extension.zip')});
app.get('/extend', function(req, res){
    var que = `SELECT link FROM photobase WHERE UserID = ${req.query.id} AND SetWallpaper = 1`;
    con.query(que, function(err, result){
         
        if(err) throw err;
        if(result.length != 0){
       fs.readFile('layout.html', 'utf8', function(err, data){
        if(err) throw err;
        var send = {
            'html' : data,
            'link' : result[0].link,
        };
         
        res.send(JSON.stringify(send));
       });
    }
    else{
        res.sendStatus(404);
    }
    });
});

app.get('/:d', function(req, res, next){
    console.log(req.params.d);
    fs.readFile(req.params.d, 'utf8', function(err, result){
        if(err) next();
        else{
        res.writeHead(200);
        res.write(result);
        res.end();}
    });
});

// app.get('/js/:d', function(req, res, next){
//     console.log(req.params.d);
//     fs.readFile('./js/'+req.params.d, 'utf8', function(err, result){
//         if(err) next();
//         else{
//         res.writeHead(200);
//         res.write(result);
//         res.end();}
//     });
// });

// app.get('/css/:d', function(req, res, next){
//     console.log(req.params.d);
//     fs.readFile('./css/'+req.params.d, 'utf8', function(err, result){
//         if(err) next();
//         else{
//         res.writeHead(200);
//         res.write(result);
//         res.end();}
//     });
// });


// app.get('/images/:d', function(req, res, next){
//     console.log(req.params.d);
//     fs.readFile('./images/'+req.params.d, 'utf8', function(err, result){
//         if(err) next();
//         else{
//         res.writeHead(200);
//         res.write(result);
//         res.end();}
//     });
// });
// app.get('/timeliner/:d', function(req, res, next){
//     console.log(`timeliner/${req.params.d}`);
//     fs.readFile(`timeliner/${req.params.d}`, 'utf8', function(err, result){
//         if(err) next();
//         else{
//         res.writeHead(200);
//         res.write(result);
//         res.end();}
//     });
// });

app.get('*', function(req, res){
    res.send("Invalid request");
});

// app.use(function(err, req, res) {
//     console.error(err.stack);
//     res.status(500).send('Something broke!');
//  });
