import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)


function preloadSounds() {
  const dict = {
    e: "https://upload.wikimedia.org/wikipedia/commons/e/e7/E_morse_code.ogg",
    l: "https://upload.wikimedia.org/wikipedia/commons/a/a8/L_morse_code.ogg",
    o: "https://upload.wikimedia.org/wikipedia/commons/4/41/O_morse_code.ogg",
    p: "https://upload.wikimedia.org/wikipedia/commons/c/c6/P_morse_code.ogg",
    r: "https://upload.wikimedia.org/wikipedia/commons/e/ea/R_morse_code.ogg",
    t: "https://upload.wikimedia.org/wikipedia/commons/b/ba/T_morse_code.ogg",
    s: "https://upload.wikimedia.org/wikipedia/commons/d/d8/S_morse_code.ogg"
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
    cardFlipped: false, // Whether to show the question or answer
    questionsInCurrentCycle: []
  },
  getters: {
    currentQuestion (state) {
      return state.currentQuestion.question
    },
    currentAnswer (state) {
      if (state.cardFlipped) {
        // console.log('now should play:' + state.currentQuestion.answer);
        playLetter(state);
      }
      return state.currentQuestion.answer
    },
  },
  mutations: {
    // The changes to the state that we'll be making
    setUnanswered(state, questions) {
      state.unansweredQuestions = questions;
      state.questionsInCurrentCycle = shuffleArray([...questions]); // Initialize with shuffled questions
    },
    // pushUnanswered (state, question) {
    //   // When a question was answered incorrectly
    //   state.unansweredQuestions.push(question)
    // },
    // pushAnswered (state, question) {
    //   // When a question was answered correctly
    //   state.unansweredQuestions =
    //     state.unansweredQuestions.filter((q) => q !== question)
    //   state.answeredQuestions.push(question)
    //   state.unansweredQuestions.push(question)
    // },
    setCurrentQuestion (state, question) {
      // Setting the question to be rendered
      state.currentQuestion = question
      state.cardFlipped = false
    },
    flipCard (state) {
      state.cardFlipped = !state.cardFlipped
    },
    cycleQuestions(state) {
      if (state.questionsInCurrentCycle.length === 0) {
        state.questionsInCurrentCycle = shuffleArray([...state.unansweredQuestions]); // Reshuffle after cycle completion
      }
      state.currentQuestion = state.questionsInCurrentCycle.pop(); // Get the next question
      state.cardFlipped = false
    }

  },
  actions: {
    init(context) {
      context.commit('cycleQuestions');
    },
    correctAnswer(context) {
      context.commit('cycleQuestions');
    },
    wrongAnswer(context) {
      context.commit('cycleQuestions');
    },
  },
})

// function randomQuestion (context) {
//   const numQuestions = context.state.unansweredQuestions.length

//   if (numQuestions > 0) {
//     const randomIndex = Math.floor(numQuestions * Math.random())
//     return context.state.unansweredQuestions[randomIndex]
//   } else {
//     return null
//   }
// }

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
}
