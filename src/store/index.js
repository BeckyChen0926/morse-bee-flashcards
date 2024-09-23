import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)


function preloadSounds() {
  const dict = {
    a: "https://upload.wikimedia.org/wikipedia/commons/f/f3/A_morse_code.ogg",
    b: "https://upload.wikimedia.org/wikipedia/commons/b/b1/B_morse_code.ogg",
  }
  for (const letter in dict) {
    const audio = new Audio();
    audio.src = dict[letter];
    audio.load();
  }
}

preloadSounds();

async function playLetter(state) {
  var aooo = new Audio(state.currentQuestion.audio); // path to file
  console.log(state.currentQuestion.audio);
  aooo.play();
  console.log("now playing: " + state.currentQuestion.answer);

}

export default new Vuex.Store({
  state: {
    // The state that we want to track in this application
    unansweredQuestions: [], // Pool of questions to be shown to the user
    answeredQuestions: [], // Questions that have been correctly answered
    currentQuestion: {
      question: 'Sample question',
      answer: 'Sample answer',
      audio: 'https://upload.wikimedia.org/wikipedia/commons/f/f3/A_morse_code.ogg'
    }, // Will be overwritten immediately
    cardFlipped: false // Whether to show the question or answer
  },
  getters: {
    currentQuestion (state) {
      return state.currentQuestion.question
    },
    currentAnswer (state) {
      if (state.cardFlipped) {
        console.log('now should play:' + state.currentQuestion.answer);
        playLetter(state);
      }
      return state.currentQuestion.answer
    },
  },
  mutations: {
    // The changes to the state that we'll be making
    setUnanswered (state, questions) {
      // To intitially load the questions from the JSON file you made earlier
      state.unansweredQuestions = questions
    },
    pushUnanswered (state, question) {
      // When a question was answered incorrectly
      state.unansweredQuestions.push(question)
    },
    pushAnswered (state, question) {
      // When a question was answered correctly
      state.unansweredQuestions =
        state.unansweredQuestions.filter((q) => q !== question)
      state.answeredQuestions.push(question)
    },
    setCurrentQuestion (state, question) {
      // Setting the question to be rendered
      state.currentQuestion = question
      state.cardFlipped = false
    },
    flipCard (state) {
      state.cardFlipped = !state.cardFlipped
    },
  },
  actions: {
    init (context) {
      context.commit('setCurrentQuestion', randomQuestion(context))
    },
    correctAnswer (context) {
      const question = context.state.currentQuestion
      context.commit('pushAnswered', question)
      context.commit('setCurrentQuestion', randomQuestion(context))
    },
    wrongAnswer (context) {
      const question = context.state.currentQuestion
      context.commit('pushUnanswered', question)
      context.commit('setCurrentQuestion', randomQuestion(context))
    },
  },
})

function randomQuestion (context) {
  const numQuestions = context.state.unansweredQuestions.length

  if (numQuestions > 0) {
    const randomIndex = Math.floor(numQuestions * Math.random())
    return context.state.unansweredQuestions[randomIndex]
  } else {
    return null
  }
}
