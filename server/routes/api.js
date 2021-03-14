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

    router.patch('/comments/rate/', function(req, res, next) {
      const { articleId, commentId, userId, direction } = req.body;
      // console.log('articleId: ');
      // console.log(articleId);
      // console.log('commentId: ');
      // console.log(userId);
      // console.log('userId: ');
      // console.log(commentId);
      // console.log('direction: ');
      // console.log(direction);
      
      redisClient.get("comments" + articleId, (err, comments) => {
        if (err) {
          console.error(err);
          return;
        }
        comments = JSON.parse(comments);
        if (!Array.isArray(comments)) {
          // The comments for this article havent been initialized yet,
          console.error("Trying to upvote comments that dont exist yet...");
          return;
        }

        // Get the comment with the id commentId
        let comment = comments[comments.findIndex(c => c.id == commentId)];
        if (!comment.userRatings) {
          comment.userRatings = {};
        }
        // If the user hasn't rated this comment yet, or their rating was in the opposite direction
        if (!comment.userRatings[userId] || comment.userRatings[userId] != direction) {
          if (direction == "up" && comment.userRatings[userId] != "up") {
            comment.rating += 1;
            comment.userRatings[userId] = "up";
          } 
          if (direction == "down" && comment.userRatings[userId] != "down") {
            comment.rating -= 1;
            comment.userRatings[userId] = "down";
          } 
        } else {
          // The user has already rated this comment in this direction, return
          res.status(200).json({success: false});
          return;
        }
        
        comments[comments.indexOf(c => c.id == commentId)] = comment;
        console.log(comments);
        redisClient.set("comments" + articleId, JSON.stringify(comments), (err, _) => {
          if (err) {
            console.error(err);
            res.status(500).json({
              success: false, 
              message: "There was an error updating the comment to the database."
            });
          } else {
           res.status(200).json({success: true});
          }
        });
      });
    });

    router.patch('/comments/reply/', function(req, res, next) {
      const { articleId, commentId, userId, replyData } = req.body;
      // console.log('articleId: ');
      // console.log(articleId);
      // console.log('commentId: ');
      // console.log(userId);
      // console.log('userId: ');
      // console.log(commentId);
      // console.log('replyData: ');
      // console.log(replyData);
      
      redisClient.get("comments" + articleId, (err, comments) => {
        if (err) {
          console.error(err);
          return;
        }
        comments = JSON.parse(comments);
        if (!Array.isArray(comments)) {
          // The comments for this article havent been initialized yet,
          console.error("Trying to upvote comments that dont exist yet...");
          return;
        }

        // Get the comment with the id commentId
        let comment = comments[comments.findIndex(c => c.id == commentId)];
        if (!comment.replies) {
          comment.replies = [];
        }
        comment.replies.unshift(commentData);
        comments[comments.indexOf(c => c.id == commentId)] = comment;
        console.log(comments);
        redisClient.set("comments" + articleId, JSON.stringify(comments), (err, _) => {
          if (err) {
            console.error(err);
            res.status(500).json({
              success: false, 
              message: "There was an error updating the comment to the database."
            });
          } else {
           res.status(200).json({success: true});
          }
        });
      });
    });
    
    router.post('/comments/:articleId', function(req, res, next) {
      const comment = req.body;
      console.log('req.body : ');
      console.log(req.body);
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
