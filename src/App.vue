<template>
  <div id="app">
    <!-- <div class="score">Score: {{ score }}</div> -->
    <div class="score"></div>
    <flashcard :front="question" :back="answer"></flashcard>

    <div v-if="this.$store.state.cardFlipped">
      <button @click="correct">Next</button>
      <!-- <button @click="wrong">Wrong</button> -->
    </div>
  </div>
</template>

<script>
import flashcard from './components/Flashcard.vue'
export default {
  components: {
    flashcard,
  },
  data () {
    return {
      score: 0,
    }
  },
  computed: {
    question () {
      return this.$store.getters.currentQuestion // handled by vuex
    },
    answer () {
      return this.$store.getters.currentAnswer // handled by vuex
    },
  },
  methods: {
    correct () {
      this.$store.dispatch('correctAnswer') // handled by vuex
      this.score++
    },
    wrong () {
      this.$store.dispatch('wrongAnswer') // handled by vuex
    },
  },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

#score {
  font-size: 24px;
}
</style>
