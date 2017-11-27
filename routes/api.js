var express = require('express');
var router = express.Router();
var mongoose = require( 'mongoose' );
var Posts = mongoose.model('Posts');

router.route('/posts/')
//gets all posts
  .get(function(req, res){
    Posts.find(function(err, post){
      if(err)
        res.send(err);
      res.json(post);
    });
  }); 

  router.route('/posts/:type/:year')
  //gets posts of specified type in a year
    .get(function(req, res){
        query = {
          "type": req.params.type,
          "timestamp": {
              "$gte": new Date(parseInt(req.params.year) - 1, 12, 01),
              "$lte": new Date(req.params.year, 11, 31)
          }
        };
        console.log(query);
        Posts.find(query, function(err, post){
            if(err)
                res.send(err);
          res.json(post);
        })
    }); 

  router.route('/posts/:type/:year/:month')
  //get posts of specified type in a year in a month
    .get(function(req, res){
        query = {
          "type": req.params.type,
          "timestamp": {
              "$gte": new Date(req.params.year, parseInt(req.params.month) - 1, 01),
              "$lt": new Date(req.params.year, parseInt(req.params.month), 01)
          }
        };
        console.log(query);
        Posts.find(query, function(err, post){
            if(err)
                res.json([]);
          res.json(post);
        })
    });

module.exports = router;
