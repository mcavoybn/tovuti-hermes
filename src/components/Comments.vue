<template>
  <v-container>
    <v-row v-if="!hasParams">
      <v-col cols="12">
        <!-- If we are missing url params, render nothing -->
      </v-col>
    </v-row>
    <v-row v-else>
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
    <v-row v-for="comment in comments" :key="comment.id" class="herm-comment pa-1 mb-2">
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
            <span class="herm-comment-rating">
              {{ comment.rating || "0" }}
            </span>
          </div>
          <div v-if="comment.replies && comment.replies.length > 0">
            <span class="herm-comment-subdued">View {{comment.replyCount || '0'}} replies <span class="material-icons herm-hover-grey-clickable">expand_more</span></span>
          </div>
      </v-col>
    </v-row>
  </v-container>
</template>


<style scoped>
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
      currentArticleId: "",
      hasParams: false
    }),

    async mounted() {
      // @TODO need to figure out a way to authenticate
      // this stuff. Maybe jwt? Right now it would be easy
      // for someone to just drop in their own user id which
      // would allow them to post as someone else.
      const urlParams = new URLSearchParams(window.location.search);
      this.currentUserId = urlParams.get('userId');
      this.currentArticleId = urlParams.get('articleId');
      if (!!this.currentUserId && !!this.currentArticleId) {
        this.hasParams = true;
      }

       // Retrieve information about the author from tovutis api
      const currentUserData = await apiClient.getTovutiUserById(this.currentUserId);
      this.currentUser = currentUserData[0];

      // Load comments
      this.comments = await apiClient.getComments(this.currentArticleId);
      console.log(this.comments);
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
            datetime: moment.utc().format(),
            rating: 0
          };
          var status = await apiClient.postComment(this.currentArticleId, postCommentOptions);
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
          var status = await apiClient.rateComment(this.currentArticleId, comment.id, this.currentUser.Id, "up");
          if (status.success) {
            // Reflect changes in viewmodel
            comment.rating += 1;
          } else {
            // Adding comment failed...
            console.error(status);
          }
        },
        async downvoteComment(comment) {
          var status = await apiClient.rateComment(this.currentArticleId, comment.id, this.currentUser.Id, "down");
          if (status.success) {
            // Reflect changes in viewmodel
            comment.rating -= 1;
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
