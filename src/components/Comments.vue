<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <!-- @TODO add current user avatar here -->
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
          @click="addComment()"
          ref="postCommentButton"
        >Post Comment</v-btn>
         <v-btn
          class="float-right mr-2"
          @click="inputValue = '';showButtons = false"
        >Cancel</v-btn>
      </v-col>
    </v-row>
    <v-row v-for="comment in comments" :key="comment.id" class="herm-comment pa-2 ma-1">
      <v-col cols="12">
          <span class="herm-author-name">
            <!-- @TODO add commenter user avatar here -->
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
            <span @click="upvoteComment(comment)" class="material-icons herm-hover-grey-clickable">
              arrow_upward
            </span>
            <span @click="downvoteComment(comment)" class="material-icons herm-hover-grey-clickable">
              arrow_downward
            </span>
          </div>
          <div>
            <span class="herm-comment-subdued">View {{comment.replyCount || '0'}} replies <span class="material-icons herm-hover-grey-clickable">expand_more</span></span>
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

  .herm-hover-grey-clickable {
    color: gray;
    cursor: pointer;
    font-size: 1em;
  }
  .herm-hover-grey-clickable-icons:hover {
    color: black;
  }
</style>


<script>
  import apiClient from '../assets/js/apiClient';
  import moment from 'moment';
  import { v4 as uuidv4 } from 'uuid';

  const MAX_INPUT_CHARS = 1000;

  export default {
    name: 'Comments',

    data: () => ({
      comments: [],
      inputValue: "",
      inputRules: [v => v.length <= MAX_INPUT_CHARS || `Max ${MAX_INPUT_CHARS} characters`],
      showButtons: false,
      currentUserId: "",
      currentUser: {},
      currentArticleId: ""
    }),

    mounted: async function() {
      // @TODO need to figure out a way to authenticate
      // this stuff. Maybe jwt? Right now it would be easy
      // for someone to just drop in their own url params.
      const urlParams = new URLSearchParams(window.location.search);
      this.currentUserId = urlParams.get('userId');
      this.currentArticleId = urlParams.get('articleId');

       // Retrieve information about the author from tovutis api
      const currentUserData = await apiClient.getTovutiUserById(this.currentUserId);
      this.currentUser = currentUserData[0];

      // Load comments
      this.comments = await apiClient.getComments(this.currentArticleId);
    },

    methods: {
        addComment: async function () {
          if (this.inputValue.length > MAX_INPUT_CHARS) {
            return;
          }
          const postCommentOptions = {
            id: uuidv4(),
            text: this.inputValue,
            authorName: this.currentUser.Name,
            authorId: this.currentUser.Id,
            datetime: moment.utc().format()
          };
          var status = await apiClient.postComment(this.currentArticleId, this.currentAtricleId);
          if (status.success) {
            this.comments.unshift(postCommentOptions);
            this.showButtons = false;
            this.inputValue = "";
          } else {
            // Adding comment failed...
            console.error(status);
          }
        },
        async upvoteComment(comment) {
          console.log(comment);
          console.log('upvote comment clicked !');
          var status = await apiClient.upvoteComment(comment.id, this.currentArticleId, "up");
          if (status.success) {
            // Reflect changes in viewmodel
          } else {
            // Adding comment failed...
            console.error(status);
          }
        },
        async downvoteComment(comment) {
          console.log(comment);
          console.log('upvote comment clicked !');
          var status = await apiClient.upvoteComment(comment.id, this.currentArticleId, "down");
          if (status.success) {
            // Reflect changes in viewmodel
          } else {
            // Adding comment failed...
            console.error(status);
          }
        },
        replyToComment(comment) {
          console.log(comment);
          console.log('reply to comment clicked!');
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
