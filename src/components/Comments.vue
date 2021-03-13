<template>
  <v-container>
    <v-row v-for="comment in comments" :key="comment.id">
      <v-col cols="12">
          {{ comment.author }}
      </v-col>
      <v-col cols="12">
          {{ comment.text }}
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// import apiClient from '../assets/js/apiClient.js';

  export default {
    name: 'Comments',

    data: () => ({
      comments: [
        {
          id: 0,
          blog_post_id: 1,
          instance_id: 2,
          author: "Ben McAvoy",
          author_id: 100,
          text: 'I like it. really nice.good stuff',
          datetime: '3/13/2021',
          edited: false
        }
      ],
    }),

    mounted: () => {
      // load comments from api
      // this.comments = apiClient.getComments()
    }
  }
</script>
