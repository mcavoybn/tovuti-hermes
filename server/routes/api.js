const { json } = require('express');
var express = require('express');
var path = require('path');
var moment = require('moment');
var router = express.Router();
const RedisServer = require('redis-server');

function getNowDatetime () {
  var tz = TimeZone.getTimeZone("UTC");
  var df = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm'Z'"); // Quoted "Z" to indicate UTC, no timezone offset
  df.setTimeZone(tz);
  var nowAsISO = df.format(new Date());
  return nowAsISO;
}

// Start the redis server
const server = new RedisServer(6379);
server.open((err) => {
  if (err === null) {
    // Create a redis client and connect to the server
    const redis = require("redis");
    const redisClient = redis.createClient();
    redisClient.on("error", function(error) {
      console.error(error);
    });

    router.get('/comments/:articleId', async function(req, res, next) {
      // Connect to the db and retrieve comments based on the 
      // give params
      redisClient.get("comments" + req.params.articleId, (err, comments) => {
        if (err) {
          console.error(err);
          return;
        }
        comments = JSON.parse(comments);
        console.log(comments);
        console.log(Array.isArray(comments));
        if (!Array.isArray(comments)) {
          comments = [];
        }
        console.log(comments);
        res.status(200).json(comments);
      });
    });
    
    router.post('/comments', function(req, res, next) {
      // Connect to the db and create the comments
      const comment = req.body;
      console.log(comment);
      try {
        comment.datetime = moment.utc().format();
      } catch (err) {
        console.error(err);
      }
      
      redisClient.get("comments" + comment.articleId, (err, comments) => {
        if (err) {
          console.error(err);
          return;
        }
        comments = JSON.parse(comments);
        if (!Array.isArray(comments)) {
          comments = [];
        }
        console.log(comment);
        console.log(comments);
        comments.unshift(comment);
        redisClient.set("comments" + comment.articleId, JSON.stringify(comments), (err, _) => {
          if (err) {
            console.error(err);
            res.status(500).json({success: false, message: "There was an error sending the comment to the database."});
          }
          res.status(200).json({success: true});
        });
      });
      
    });
  }
});





module.exports = router;
