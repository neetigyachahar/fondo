const http = require('http');
const fs = require('fs');
const url = require('url');
const formidable = require('formidable');
const mysql = require('mysql');

var con = mysql.createConnection({
    host : "remotemysql.com",
    user : "IHXn51U10d",
    password: "ZZ7sxXwnkE",
    database: "IHXn51U10d",
    "port" : "3306"
});

// var con = mysql.createConnection({
//     host : "localhost",
//     user : "root",
//     password: "bharat1@",
//     database: "FondoBase",
// });


con.connect(function(err){
    if(err) throw err;
    var que = "create table if not exists photobase ( SrNo int(11) AUTO_INCREMENT PRIMARY KEY, UserID int(11), upvotes int(11), link text, uploaded_at timestamp DEFAULT CURRENT_TIMESTAMP	, PhotoPrivacy text, SetWallpaper int(11), tags text, userPassword varchar(50) default 'fondo');";
    con.query(que, function (err) {
       if (err) throw err; 
       console.log("Database Connected!");
    });
});

http.createServer(function(req,res){
    var host = req.headers.host;
    var data = url.parse("https://"+host+req.url, true);
    console.log("1111111111");
    data = data.query;
    console.log(__dirname);
    console.log(req.url);
    if (Object.entries(data).length === 0){
        console.log(req.url);
        if(req.url == '/fileupload'){
            var form = new formidable.IncomingForm();
            form.parse(req, function(err, fields, files){
                if (err)         {             res.writeHead(404);             res.write("some error occurred");             res.end();  throw err;         }else{
                console.log(fields);
                if((files.filetoupload.type).split('/')[0] == "image"){
                con.query("select SrNo from PhotoBase where SrNo = (select MAX(SrNo) from PhotoBase)", function(err, result){
                    if (err)         {             res.writeHead(404);             res.write("some error occurred");             res.end();  throw err;         }else{
                    var oldname = files.filetoupload.path;
                    var newname = __dirname+(parseInt(result[0].SrNo)+1)+'.'+(files.filetoupload.type).split('/')[1] ;
                    fs.rename(oldname, newname, function(err){
                        if (err)         {             res.writeHead(404);             res.write("some error occurred");             res.end();  throw err;         }else{
                        que = `SELECT userPassword FROM PhotoBase WHERE UserID = ${fields.UserID}`;
                        con.query(que, function(err, resultz){
                            if (err)         {             res.writeHead(404);             res.write("some error occurred");             res.end();  throw err;         }else{
                        if(toString(resultz) == '[]'){
                            console.log(resultz);
                            var passwd = resultz[0].userPassword;
                            var uploadSql = `insert into PhotoBase (UserID,upvotes, link, PhotoPrivacy, userPassword, tags) values ( ${fields.UserID}, 0,"https://${host}/images/${(parseInt(result[0].SrNo)+1)+'.'+(files.filetoupload.type).split('/')[1]}","Public", "${passwd}" , '${fields.tags}')`;
                            con.query(uploadSql, function(err, result){
                                if (err)         {             res.writeHead(404);             res.write("some error occurred");             res.end();  throw err;         }else{
                                res.writeHead(200);
                                res.write("<script>window.location.href = 'https://'"+host+"'/profile.html';</script>" );
                                res.end();
                                }
                            });
                        }
                        else{
                            console.log(fields);
                            var passwd = fields.Password;
                            var uploadSql = `insert into PhotoBase (UserID,upvotes, link, PhotoPrivacy, SetWallpaper, userPassword, tags) values ( ${fields.UserID}, 0,"https://${host}/images/${(parseInt(result[0].SrNo)+1)+'.'+(files.filetoupload.type).split('/')[1]}","Public", 0, "${passwd}" , '${fields.tags}')`;
                            con.query(uploadSql, function(err, result){
                                if (err)         {             res.writeHead(404);             res.write("some error occurred");             res.end();  throw err;         }else{
                                res.writeHead(200);
                                res.write(`<script>window.location.href = 'https://${host}/profile.html'</script>` );
                                res.end();
                                }
                            });
                        }
                    }
                        });
                    }
                    });         
                }            
            });
        }
        else{
            fs.readFile('profile.html',function(err, data){
                    if (err)         {             res.writeHead(404);             res.write("some error occurred");             res.end();  throw err;         }else{
                    res.writeHead(200);
                    res.write("<script>alert('Wrong file format!');</script>");
                    res.write(data);
                    res.end();
                    }
            });
        }
    }
            });
        
        }
        else if(req.url == '/create'){
            fs.readFile("create.html", function(err, result){
                if (err)         {             res.writeHead(404);             res.write("some error occurred");             res.end();  throw err;         }else{
                res.writeHead(200);
                res.write(result);
                res.end();
                }
            });
        }
        else{
        fs.readFile(req.url.slice(1), function(err, bit) 
        {
            if (err)         {             res.writeHead(404);             res.write("some error occurred");             res.end();  throw err;         }else{
            res.writeHead(200);
            res.write(bit);
            res.end();
            }
          });
        }
    }
    else{
    var ki = JSON.parse(data.module);
    console.log("||\\||||\\\||||\\\|||   "+data.module);
    console.log(Object.keys(ki)[0]);
    switch (Object.keys(ki)[0]) {
        case 'search':{fs.readFile('SearchResult.html','utf8', function(err, file){
                        if (err)         {             res.writeHead(404);             res.write("some error occurred");             res.end();  throw err;         }else{
                        var obj = {
                            'html': file,
                            'UserID': null,
                            'PhotoData': ""
                        };
                        console.log(`SELECT * FROM PhotoBase WHERE UserID = "${ki.search}"`);
                        console.log("||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||");
                        con.query(`SELECT * FROM PhotoBase WHERE UserID = ${ki.search} AND PhotoPrivacy = 'Public'`, function(err, result){
                            if (err)         {             res.writeHead(404);             res.write("some error occurred");             res.end();  throw err;         }else{
                            console.log("__________________________"+(result)+"sfsf");
                            if((result).length == 0){
                                console.log("fdzvfmofvnajfnv+++++++++++++++++++++++++");
                                con.query(`SELECT COUNT(*) FROM PhotoBase WHERE UserID = ${ki.search}`, function(err, result){
                                    if (err)         {             res.writeHead(404);             res.write("some error occurred");             res.end();  throw err;         }else{
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
                        }
                        });
                    }
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
                if (err)         {    console.log("444444444444");         res.writeHead(404);             res.write("some error occurred");             res.end();  throw err;         }else{
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
            }
            });         
            break;
        }

        case "password":{
            console.log(ki.password[0]);
            var que = `SELECT userPassword FROM PhotoBase WHERE UserID = ${parseInt(ki.password[0])}`;
            console.log(que);
            con.query(que, function(err, results){
                if (err)         {             res.writeHead(404);             res.write("some error occurred");             res.end();  throw err;         }else{
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
            }
            });
            break;
        }
    
        case "delete":{
            var que = `DELETE FROM PhotoBase WHERE SrNo = ${ki.delete}`;
            con.query(que, function(err, result){
                if (err)         {             res.writeHead(404);             res.write("some error occurred");             res.end();  throw err;         }else{
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
            }
            });
            break;
        }

        case "togglePrivacy" : {
            var que = `SELECT * FROM PhotoBase WHERE SrNo = ${ki.togglePrivacy}`;
            con.query(que, function(err, result){
                if (err)         {             res.writeHead(404);             res.write("some error occurred");             res.end();  throw err;         }else{
                var privacy = "Only me";
                if (result[0].PhotoPrivacy == "Only me"){
                    privacy = "Public";
                }
                que = `UPDATE PhotoBase SET PhotoPrivacy = "${privacy}" WHERE SrNo = ${ki.togglePrivacy}`;
                con.query(que, function(err, result){
                    if (err)         {             res.writeHead(404);             res.write("some error occurred");             res.end();  throw err;         }else{
                    if (result.affectedRows == 1){
                        que = `SELECT PhotoPrivacy, uploaded_at FROM PhotoBase WHERE SrNo = ${ki.togglePrivacy}`;
                        con.query(que, function(err, result){
                            if (err)         {             res.writeHead(404);             res.write("some error occurred");             res.end();  throw err;         }else{
                            res.writeHead(200);
                            res.write(JSON.stringify(result));
                            res.end();
                            }
                        });
                    }
                    else{
                        res.writeHead(404);
                        res.write("Some error occurred!");
                        res.end();
                    }
                }
                });
            }
            });
            break;
        }
        case "setback" : {
            var que = `UPDATE PhotoBase SET SetWallpaper = 0 WHERE UserID = ${ki.UserID} AND SetWallpaper = 1`
            con.query(que, function(err){
                if (err)         {             res.writeHead(404);             res.write("some error occurred");             res.end();  throw err;         }else{
                que = `SELECT * FROM PhotoBase WHERE SrNo = ${ki.setback}`
                con.query(que, function(err, result){
                    if (err)         {             res.writeHead(404);             res.write("some error occurred");             res.end();  throw err;         }else{
                    if(result[0].UserID == ki.UserID){
                        que = `UPDATE PhotoBase SET SetWallpaper = 1 WHERE SrNo = ${ki.setback}`
                        con.query(que, function(err, result1){
                            if (err)         {             res.writeHead(404);             res.write("some error occurred");             res.end();  throw err;         }else{
                            res.writeHead(200);
                            res.write(JSON.stringify({'reply':true}));
                            res.end();
                        }
                        });
                    }
                    else{
                        que = `SELECT userPassword FROM PhotoBase WHERE UserID = ${ki.UserID}`
                        con.query( que , function(err, pass){
                            if (err)         {             res.writeHead(404);             res.write("some error occurred");             res.end();  throw err;         }else{
                            console.log(result[0].uploaded_at);
                            var t = result[0].uploaded_at;
                            console.log(t.toUTCString());
                            que = `INSERT INTO PhotoBase (UserID, link, upvotes, PhotoPrivacy, SetWallpaper, userPassword, tags ) values (${ki.UserID}, "${result[0].link}", ${result[0].upvotes}, "${result[0].PhotoPrivacy}", 1, "${pass[0].userPassword}", "${result[0].tags}")`;
                            con.query(que, function(err, abcd){
                                if (err)         {             res.writeHead(404);             res.write("some error occurred");             res.end();  throw err;         }else{
                                res.writeHead(200);
                                res.write(JSON.stringify({'reply':true}));
                                res.end();
                            }
                            });
                        }
                        });
                    }
                }
                });
            }
            });
            break;
        }
        case "checkID" : {
            var que = `SELECT COUNT(*) FROM PhotoBase WHERE UserID = ${ki.checkID}`;
            con.query(que, function(err, result){
                if (err)         {             res.writeHead(404);             res.write("some error occurred");             res.end();  throw err;         }else{
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
            }
            });
            break;
        }

 
        default: {console.log("wrong request");
                    res.writeHead(200);
                    res.write("hello there");
                    res.end();
            break;}
    }}

}).listen(process.env.PORT || 8080);