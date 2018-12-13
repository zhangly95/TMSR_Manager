var express = require('express');
var router = express.Router();
var multer = require('multer');
var pg2 = require('./pgconn');

router.get('/add_reply/:contact_name', function (req, res, next) {
    // console.log(req.params)
    res.render('lfcontactreply', { title: req.params.contact_name });
})
module.exports = router;
