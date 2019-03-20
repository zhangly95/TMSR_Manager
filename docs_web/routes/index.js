var express = require('express');
var router = express.Router();
var multer = require('multer');
var pg2 = require('./pgconn');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'TMSR-Documents 核能文档管理系统' });
});
router.get('/deviceOverView', function(req, res, next) {
  res.render('deviceOverView', { title: '设备概览' });
});
router.get('/system/:system_id', function(req, res, next) {
  res.render('system1',{system_id:req.params.system_id});
});
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'TMSR-核能管理系统' });
});

router.get('/signalSearch', function(req, res, next) {
  res.render('signalSearch', { title: 'TMSR-核能管理系统' });
});
router.get('/signalPaint', function(req, res, next) {
  res.render('signalPaint', { title: 'TMSR-核能管理系统' });
});
router.get('/userAdmin', function(req, res, next) {
  res.render('userAdmin', { title: 'TMSR-核能管理系统' });
});

router.get('/rootAdmin', function(req, res, next) {
  res.render('rootAdmin', { title: 'TMSR-核能管理系统' });
});


router.get('/lf1_primary', function(req, res, next) {
  res.render('lfprimary', { title: 'TMSR-Documents  LF1初步设计文件' });
});

router.get('/lf_primary_timeline/:fileindex', function (req, res, next) {
    res.render('page_lf_primary', { file_name: req.params.fileindex })
});

router.get('/lf1_note', function(req, res, next) {
  res.render('lfnote', { title: 'TMSR-Documents  LF1技术联系单' });
});

router.get('/add_new_contact', function (req, res, next) {
  // console.log(req.params)
  res.render('lfnewcontact');
})

//初设计文件时间轴的添加
router.get('/add_new_primary/:file_name', function (req, res, next) {
  // console.log(req.params)
  res.render('lfnewprimary', { title: req.params.file_name });
})


//工作联系单的保存路径
var storage3 = multer.diskStorage({
  destination: function (req, file, cb) {

    cb(null, process.cwd() + "/public/files/lf1/初步设计文件");    // 保存的路径，备注：需要自己创建
  },
  filename: function (req, file, cb) {
    // 将保存文件名设置为 时间戳+字段名 ，比如 1478521468943-技术需求
    //  filename2=file.originalname;
    //  filedate=Date.now();
    //  filename1=filedate+'-'+filename2;
    cb(null, Date.now() + '-' + file.originalname);
  }

});
//为数据库增加文件1
router.post('/lf_primary_add', multer({ storage: storage3 }).single('file'), function (req, res, next) {
  console.log(req.body);
  console.log(req.file);
  // console.log(process.cwd());
  var upfdate = Date.now();
  var newDate = new Date();
  var localOffset = newDate.getTimezoneOffset() * 60000;

  newDate.setTime(upfdate + localOffset);
  var filepath = "/files/lf1/初步设计文件/" + req.file.filename;

  var upftime = newDate.toISOString();

  sql = 'insert into primary_timeline (subject,origin_name,filename,file_addr,upload_date,status,note,timeline_type) values (\'' + req.body.subject + '\',\'' + req.file.filename + '\',\''  + req.body.filename + '\',\''  + filepath+ '\',\'' + upftime + '\',\'' + req.body.status + '\',\'' + req.body.note + '\',\'\')';


  console.log(sql);
  pg2.query(sql, function (result) { });
  Wurl = '/lf_primary_timeline/' + req.body.filename;
  res.redirect(Wurl);

})
router.post('/lf_primary_reply_add', multer({ storage: storage3 }).single('file'), function (req, res, next) {
  console.log(req.body);
  console.log(req.file);
  // console.log(process.cwd());
  var upfdate = Date.now();
  var newDate = new Date();
  var localOffset = newDate.getTimezoneOffset() * 60000;

  newDate.setTime(upfdate + localOffset);
  var filepath = "/files/lf1/初步设计文件/" + req.file.filename;

  var upftime = newDate.toISOString();

  sql = 'insert into primary_timeline (subject,origin_name,filename,file_addr,upload_date,status,note,timeline_type) values (\'' + req.body.subject + '\',\'' + req.file.filename + '\',\'' + req.body.filename + '\',\'' + filepath + '\',\'' + upftime + '\',\'' + req.body.status + '\',\'' + req.body.note + '\',\'timeline-inverted\')';


  console.log(sql);
  pg2.query(sql, function (result) { });
  Wurl = '/lf_primary_timeline/' + req.body.filename;
  res.redirect(Wurl);

})
//初设文件时间轴的答复
router.get('/add_primary_reply/:file_name', function (req, res, next) {
  // console.log(req.params)
  res.render('lfprimaryreply', { title: req.params.file_name });
})

//按钮补充联系单的路由
router.get('/add_new_subject/:contact_name', function (req, res, next) {
  // console.log(req.params)
  res.render('lfnewsubject', {title: req.params.contact_name});
})

//按钮回复联系单的路由
router.get('/add_reply/:contact_name', function (req, res, next) {
  // console.log(req.params)
  res.render('lfcontactreply', { title: req.params.contact_name }, function (err, html) {
    console.log(err);
  });
})



//工作联系单的保存路径
var storage1 = multer.diskStorage({
    destination: function (req, file, cb) {
      
      cb(null, process.cwd()+"/public/files/lf1/工作联系单");    // 保存的路径，备注：需要自己创建
     },
    filename: function (req, file, cb) {
      // 将保存文件名设置为 时间戳+字段名 ，比如 1478521468943-技术需求
      //  filename2=file.originalname;
      //  filedate=Date.now();
      //  filename1=filedate+'-'+filename2;
      cb(null, Date.now()+'-'+file.originalname);  
  }

});

//新建工作联系单
// var upload = multer({ dest: '/Users/hanlf/gitHub/docs_web/public/files' })
router.post('/lf_contract_add', multer({storage : storage1}).single('file'),function(req,res,next){
    console.log(req.body);
    console.log(req.file);
  // console.log(process.cwd());
    var upfdate=Date.now();
    var newDate = new Date();
    var localOffset = newDate.getTimezoneOffset() * 60000;
    
    newDate.setTime(upfdate+localOffset);
    var filepath ="/files/lf1/工作联系单/"+req.file.filename;
    
    var upftime = newDate.toISOString();
    
    sql='insert into param_requirement (subject,contact_from,contact_to,file_addr,name,re_sign_date,filename,note) values (\''+req.body.name+'\',\''+req.body.contact_from+'\',\''+req.body.contact_to+'\',\''+filepath+'\',\''+req.body.name+'\',\''+upftime+'\',\''+req.file.filename+'\',\''+req.body.note+'\')';


    console.log(sql);
    pg2.query(sql, function (result) {});
     Wurl = '/lfcontact/' + req.body.name;
    res.redirect(Wurl);

})





//补充联系单的添加路由
router.post('/lf_subject_add', multer({ storage: storage1 }).single('file'), function (req, res, next) {
  console.log(req.body);
  console.log(req.file);
  // console.log(process.cwd());
  var upfdate = Date.now();
  var newDate = new Date();
  var localOffset = newDate.getTimezoneOffset() * 60000;

  newDate.setTime(upfdate + localOffset);
  var filepath = "/files/lf1/工作联系单/" + req.file.filename;

  var upftime = newDate.toISOString();
  sql = 'insert into param_requirement (subject,contact_from,contact_to,file_addr,name,re_sign_date,filename,note) values (\'' + req.body.subject + '\',\'' + req.body.contact_from + '\',\'' + req.body.contact_to + '\',\'' + filepath + '\',\'' + req.body.name + '\',\'' + upftime + '\',\'' + req.file.filename + '\',\'' + req.body.note + '\')';


  console.log(sql);
  pg2.query(sql, function (result) { });
  Wurl = '/lfcontact/' + req.body.name;
  res.redirect(Wurl);

})

//回复联系单的添加路由
router.post('/lf_reply_add', multer({ storage: storage1 }).single('file'), function (req, res, next) {
  console.log(req.body);
  console.log(req.file);
  // console.log(process.cwd());
  var upfdate = Date.now();
  var newDate = new Date();
  newDate.setTime(upfdate);
  var filepath = "/files/lf1/工作联系单/" + req.file.filename;
  var upftime = newDate.toISOString();
  sql = 'insert into param_reply (subject,reply_from,file_addr,name,reply_date,filename,note) values (\'' + req.body.subject + '\',\'' + req.body.reply_from + '\',\'' + filepath + '\',\'' + req.body.name + '\',\'' + upftime + '\',\'' + req.file.filename + '\',\'' + req.body.note + '\')';


  console.log(sql);
  pg2.query(sql, function (result) { });
  Wurl = '/lfcontact/' + req.body.name;
  res.redirect(Wurl);

})

router.get('/proto/:system_name', function (req, res, next) {
  

    res.render('lfsystemdesign',{title:req.params.system_name});

});

module.exports = router;
