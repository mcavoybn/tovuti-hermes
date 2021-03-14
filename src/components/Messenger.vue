<template>
  <v-container>
  </v-container>
</template>

<script>
// import apiClient from '../assets/js/apiClient.js';

  export default {
    name: 'Messages',

    data: () => ({
      messages: [
        {
          id: 0,
          author_id: 100,
          text: 'I like it. really nice.good stuff',
          datetime: '3/13/2021 12:00:00',
          edited: false
        }
      ],
    }),

    mounted: () => {
      // load message history from api
    },

    sockets: {
        connect: function () {
            console.log('socket connected')
        },
        customEmit: function (data) {
            console.log('this method was fired by the socket server. eg: io.emit("customEmit", data)')
        }
    },
    
    methods: {
        clickButton: function (data) {
            // $socket is socket.io-client instance
            this.$socket.emit('emit_method', data)
        }
    }


  }
</script>
