<template>
  <v-app>
    <v-main>
      <Comments />
    </v-main>
  </v-app>
</template>

<script>
import Comments from './components/Comments';

export default {
  name: 'App',

  components: {
    Comments,
  },

  data: () => ({
    //
  }),
};
</script>
