var express = require('express');
var router = express.Router();
var pg1 = require('./pgconn');
var path = require('path');
var fs = require('fs');
var pg2 = require('./pg');

//遍历文件夹，获取所有文件夹里面的文件信息
/*
 * @param path 路径
 *
 */

function getFileList(path)
{
   var filesList = [];
   readFile(path,filesList);
   return filesList;
}

function getFile_reply(path) {
  var filesList = [];
  readFile_reply(path, filesList);
  return filesList;
}

//遍历读取文件
function readFile_reply(path,filesList)
{
   files = fs.readdirSync(path);//需要用到同步读取
   files.forEach(walk);
   function walk(file)
   {  
        states = fs.statSync(path+'/'+file);         
        if(states.isFile() && file.slice(0,2) == "回复")
        // {
        //     readFile(path+'/'+file,filesList);
        // }
        // else
        {   
            //创建一个对象保存信息
            var obj = new Object();
            obj.size = (states.size/1024/1024).toFixed(1);//文件大小，以字节为单位
            obj.name = file.slice(12,-4);//文件名
            obj.path = (path+'/'+file).slice(8); //文件绝对路径
            obj.mtime = states.mtime;
            obj.time = file.slice(3, 11);
            
            filesList.push(obj);
        }     
    }
}
function readFile(path, filesList) {
  files = fs.readdirSync(path);//需要用到同步读取
  files.forEach(walk);
  function walk(file) {
    states = fs.statSync(path + '/' + file);
    if (states.isFile() && file.slice(0, 2) != "回复")
    // {
    //     readFile(path+'/'+file,filesList);
    // }
    // else
    {
      //创建一个对象保存信息
      var obj = new Object();
      obj.size = (states.size / 1024 / 1024).toFixed(1);//文件大小，以字节为单位
      obj.name = file.slice(10, -4);//文件名
      obj.path = (path + '/' + file).slice(8); //文件绝对路径
      obj.mtime = states.mtime;
      obj.time = file.slice(1, 9);

      filesList.push(obj);
    }
  }
}
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// 获取初步设计文件目录视图数据
router.get('/lf1', function(req, res, next) {
  process.env.TZ = "Asia/Shanghai";
  sql ="select * from doc_view order by \"order\"";
  pg1.query(sql, function (result) {
  res.jsonp(result.rows);
  // console.log(result.rows); 

  });

});

router.get('/lf1_systems', function(req, res, next) {
  process.env.TZ = "Asia/Shanghai";
  sql ="select systems from systems order by parent";
  pg1.query(sql, function (result) {
  res.jsonp(result.rows);
  // console.log(result.rows); 

  });

});

router.get('/lf1_primary', function(req, res, next) {
  process.env.TZ = "Asia/Shanghai";
  sql ="select index,system, file_name, file_encode,editor,dead_line::date,version,doc_status from primary_design order by index";
  console.log(sql)
  pg1.query(sql, function (result) {
  res.jsonp(result.rows);
  // console.log(result.rows); 

  });

});

router.get('/lf1_system_design/:system_name', function(req, res, next) {
  process.env.TZ = "Asia/Shanghai";
  sql ='select index,system, file_name, file_encode,editor,dead_line::date,version,doc_status from primary_design where system= \''+req.params.system_name +'\' order by index';
  console.log(sql)
  pg1.query(sql, function (result) {
  res.jsonp(result.rows);
  // console.log(result.rows); 

  });

});

router.get('/input_file', function(req, res, next) {
  // fs.readdir("./public/files/TMSR-LF1工程/初步设计/01.设计输入参数",function(err,files){
    // console.log(files);
    filelist=getFileList("./public/files/TMSR-LF1工程/初步设计/01.设计输入参数");
    res.jsonp(filelist);
  });

router.get('/lf1_note', function (req, res, next) {
  // fs.readdir("./public/files/TMSR-LF1工程/初步设计/01.设计输入参数",function(err,files){
  // console.log(files);
  filelist = getFileList("./public/files/TMSR-LF1工程/接口文件/技术通知单");
  res.jsonp(filelist);
});

router.get('/lf1_contact_name', function (req, res, next) {
  // fs.readdir("./public/files/TMSR-LF1工程/初步设计/01.设计输入参数",function(err,files){
  // console.log(files);
  // filelist = getFileList("./public/files/TMSR-LF1工程/接口文件/工作联系单");
  // res.jsonp(filelist);
  // console.log(filelist);
  sql="select * from doc_contact_reply order by name;"
  process.env.TZ = "Asia/Shanghai";
  pg1.query(sql, function (result) {
  res.jsonp(result.rows);

  });


});

router.get('/lf1_reply', function (req, res, next) {
  // fs.readdir("./public/files/TMSR-LF1工程/初步设计/01.设计输入参数",function(err,files){
  // console.log(files);
  filelist = getFile_reply("./public/files/TMSR-LF1工程/接口文件/工作联系单");
  res.jsonp(filelist);
});


router.get('/lf_contact_req/:post_name', function (req, res, next) {
  // fs.readdir("./public/files/TMSR-LF1工程/初步设计/01.设计输入参数",function(err,files){
  // console.log(files);
  // filelist = getFileList("./public/files/TMSR-LF1工程/接口文件/工作联系单");
  // res.jsonp(filelist);
  // console.log(filelist);
  sql = 'select * from  param_requirement where name= \'' + req.params.post_name + '\';';
  console.log(sql);
  pg1.query(sql, function (result) {

    console.log(result.rows);

    res.jsonp(result.rows);
  });



});

router.get('/lf_contact_reply/:post_name', function (req, res, next) {
  // fs.readdir("./public/files/TMSR-LF1工程/初步设计/01.设计输入参数",function(err,files){
  // console.log(files);
  // filelist = getFileList("./public/files/TMSR-LF1工程/接口文件/工作联系单");
  // res.jsonp(filelist);
  // console.log(filelist);
  sql = 'select * from  param_reply where name= \'' + req.params.post_name + '\';';
  console.log(sql);
  pg1.query(sql, function (result) {

    console.log(result.rows);

    res.jsonp(result.rows);
  });



});


router.get('/lf_primary_timeline/:post_name', function (req, res, next) {
  // fs.readdir("./public/files/TMSR-LF1工程/初步设计/01.设计输入参数",function(err,files){
  // console.log(files);
  // filelist = getFileList("./public/files/TMSR-LF1工程/接口文件/工作联系单");
  // res.jsonp(filelist);
  console.log(req.params.post_name);
  sql = 'select * from  primary_timeline where filename= \'' + req.params.post_name + '\' order by upload_date ;';
  console.log(sql);
  pg1.query(sql, function (result) {

    console.log(result.rows);

    res.jsonp(result.rows);
  });



});

router.get('/device_system', function(req, res, next) {
  // process.env.TZ = "Asia/Shanghai";
  sql ="select * from system_list order by system_id asc";
  pg2.query(sql, function (result) {
  res.jsonp(result.rows);
  // console.log(result.rows); 
 
  });

});

router.get('/device_list', function(req, res, next) {
  // process.env.TZ = "Asia/Shanghai";
  sql ="select * from device_list order by device_id asc";
  pg2.query(sql, function (result) {
  res.jsonp(result.rows);
  // console.log(result.rows); 
 
  });

});

router.get('/device_by_system/:system_id', function(req, res, next) {
  // process.env.TZ = "Asia/Shanghai";
  sql = 'select * from device_list where system_id = \''+req.params.system_id +'\' order by device_id asc;';
  pg2.query(sql, function (result) {
  res.jsonp(result.rows);
  // console.log(result.rows); 
 
  });

});

router.get('/params_by_device', function(req, res, next) {
  // process.env.TZ = "Asia/Shanghai";
  sql ="select * from param_main where device_id = 0 order by index";
  pg2.query(sql, function (result) {
  res.jsonp(result.rows);
  // console.log(result.rows); 
 
  });

});

router.get('/search_system/:id', function(req, res, next) {
  // process.env.TZ = "Asia/Shanghai";
  console.log(req.params.system_id)
  sql = 'select * from system_list where system_id= \'' + req.params.id + '\' order by system_id ;';
  pg2.query(sql, function (result) {
  res.jsonp(result.rows);
 
  });

});

module.exports = router;
