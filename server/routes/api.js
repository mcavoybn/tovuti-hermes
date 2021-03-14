var express = require('express');
var router = express.Router();
var RedisServer = require('redis-server');

// Start the redis server and connect
const server = new RedisServer(6379);
server.open((err) => {
  if (err === null) {
    // Create a redis client
    const redis = require("redis");
    const redisClient = redis.createClient();
    redisClient.on("error", function(error) {
      console.error(error);
    });

    router.get('/comments/:articleId', function(req, res, next) {
      redisClient.get("comments" + req.params.articleId, (err, comments) => {
        if (err) {
          console.error(err);
          return;
        }
        comments = JSON.parse(comments);
        if (!Array.isArray(comments)) {
          // The comments for this article havent been initialized yet,
          comments = [];
        }
        console.log(comments);
        res.status(200).json(comments);
      });
    });

    router.get('/comments/upvote/:articleId/:commentId', function(req, res, next) {
      redisClient.get("comments" + req.params.articleId, (err, comments) => {
        if (err) {
          console.error(err);
          return;
        }
        comments = JSON.parse(comments);
        if (!Array.isArray(comments)) {
          // The comments for this article havent been initialized yet,
          comments = [];
        }
        comment = comments.find(c => c.id == req.params.commentId);
        console.log(comments);
        res.status(200).json(comments);
      });
    });
    
    router.post('/comments/:articleId', function(req, res, next) {
      const comment = req.body;
      // @TODO validation for comment
      redisClient.get("comments" + req.params.articleId, (err, comments) => {
        if (err) {
          console.error(err);
          return;
        }
        comments = JSON.parse(comments);
        if (!Array.isArray(comments)) {
          // The comments value for this value hasnt been initialized yet,
          comments = [];
        }
        // Put the comment at the front of the comments array
        comments.unshift(comment);
        console.log(comments);
        redisClient.set("comments" + req.params.articleId, JSON.stringify(comments), (err, _) => {
          if (err) {
            console.error(err);
            res.status(500).json({
              success: false, 
              message: "There was an error sending the comment to the database."
            });
          } else {
           res.status(200).json({success: true});
          }
        });
      });

    });
  }
});

module.exports = router;
