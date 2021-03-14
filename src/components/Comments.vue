<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-textarea
          name="commentsInput"
          outlined
          counter
          :rules="inputRules"
          @focus="showButtons = true"
          label="Type your comment here..."
          v-model="inputValue"
        ></v-textarea>
      </v-col>
      <v-col cols="12" v-show="showButtons">
        <v-btn
         class="float-right"
          color="primary" 
          @click="postComment()"
          ref="postCommentButton"
        >Post Comment</v-btn>
         <v-btn
          class="float-right mr-2"
          @click="inputValue = '';showButtons = false"
        >Cancel</v-btn>
      </v-col>
    </v-row>
    <v-row v-for="comment in comments" :key="comment.id" class="herm-comment pa-2 ma-1">
      <v-col cols="6">
          <span class="herm-author-name">
            {{ comment.authorName }}
          </span>
          <span class="herm-comment-subdued" style="margin-left:10px">
            {{ getUserFriendlyDatetime(comment.datetime) }}
          </span>
      </v-col>
      <v-col cols="12" class="mb-0 pb-0">
          <div class="herm-comment-body" style="margin-bottom:20px">
            {{ comment.text }}
          </div>
          <div class="mt-2">
            <span @click="upvoteComment(comment)" class="material-icons herm-vote-icons">
              arrow_upward
            </span>
            <span @click="downvoteComment(comment)" class="material-icons herm-vote-icons">
              arrow_downward
            </span>
          </div>
          <div>
            <span class="herm-comment-subdued">View {{comment.replyCount || '0'}} replies <span class="material-icons herm-vote-icons">expand_more</span></span>
          </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<style scoped>

.herm-comment {
  border-radius:5px;
  border:1px solid lightgray;
}

.herm-comment-body {
  font-size:0.8em;
}

.herm-author-name {
  font-size: 0.9em;
  font-weight:450;
}

.herm-comment-subdued {
 color: gray;
  font-size: 0.8em;
}

.herm-vote-icons {
  color: gray;
  cursor: pointer;
  font-size: 1em;
}
.herm-vote-icons:hover {
  color: black;
}

</style>
<script>
import apiClient from '../assets/js/apiClient.js';
import moment from 'moment';

const MAX_INPUT_CHARS = 1000;

  export default {
    name: 'Comments',

    data: () => ({
      // Where the comments are stored!
      comments: [],
      // The value of the input
      inputValue: "",
      inputRules: [v => v.length <= MAX_INPUT_CHARS || `Max ${MAX_INPUT_CHARS} characters`],
      showButtons: false,
      // The id of the user posting the comment
      currentUserId: "",
      currentUser: {},
      // The id of the thing we are posting comments for
      currentArticleId: ""
    }),

    mounted: async function() {
      // @TODO need to figure out a way to authenticate
      // this stuff.

      // Retrieve information about the author from tovutis api
      this.currentUser = {
        name: "Ben McAvoy"
      }

      // load comments from api
      this.comments = await apiClient.getComments();
    },

    methods: {
        postComment: async function () {
          if (this.inputValue.length > MAX_INPUT_CHARS) {
            return;
          }
          // get the value of the text in the box
          console.log(this.postCommentButton);
          const postCommentOptions = {
            text: this.inputValue,
            authorName: this.currentUser.name
          };
          console.log(postCommentOptions);
          var status = await apiClient.postComment(postCommentOptions);
          console.log(status);
          if (status.success) {
            this.comments.push(postCommentOptions);
            this.showButtons = false;
            this.inputValue = "";
          }
        },
        upvoteComment(comment) {
          console.log(comment);
          console.log('upvote comment clicked !');
        },
        downvoteComment(comment) {
          console.log(comment);
          console.log('downvote comment clicked!');
        },
        getUserFriendlyDatetime(datetime) {
          if (!datetime) {
            return "";
          }

          return moment(datetime).fromNow();
        },
    }
  }
</script>
