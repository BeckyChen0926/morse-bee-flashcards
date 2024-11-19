import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)


let urlParams = new URLSearchParams(window.location.search);
let pid = urlParams.get('PROLIFIC_PID');
let dayNum = urlParams.get('day');

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
  // console.log(state.currentQuestion.audio);
  aooo.play();
  // console.log("now playing: " + state.currentQuestion.answer);

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
    questionsInCurrentCycle: [],

    // for data tracking
    flipsPerLetter: { E: 0, L: 0, O: 0, P: 0, R: 0, T: 0, S: 0 },
    timePerLetter: { E: 0, L: 0, O: 0, P: 0, R: 0, T: 0, S: 0 },
    roundsPerLetter: 0,
    longestPause: 0,
    numLongPause: 0,
    lastInteractionTime: Date.now(), // To track pause times
    startTime: Date.now(),
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
    setUnanswered(state, questions) {
      state.unansweredQuestions = questions;
      state.questionsInCurrentCycle = shuffleArray([...questions]); // Initialize with shuffled questions
    },
    setCurrentQuestion (state, question) {
      // Setting the question to be rendered
      state.currentQuestion = question
      state.cardFlipped = false
    },
    flipCard (state) {
      let letter = state.currentQuestion.question
      // console.log(state.currentQuestion.question);
      state.cardFlipped = !state.cardFlipped
      state.flipsPerLetter[letter]++;

      const currentTime = Date.now();
      const duration = (currentTime - state.lastInteractionTime) / 1000; // convert ms to seconds
      state.timePerLetter[letter] += duration;

      // Check for longest pause
      if (duration > 10) {
        state.numLongPause++;
        if (duration > state.longestPause) {
          state.longestPause = duration;
        }
      }
      state.lastInteractionTime = currentTime; // Reset interaction time

      // sendDataToSheet(pid, dayNum, 1, 'ELOPRTS', state.flipsPerLetter, state.timePerLetter, state.roundsPerLetter, state.longestPause, state.numLongPause);
      // test with http://localhost:8080/?PROLIFIC_PID=6789&day=3
    },
    cycleQuestions(state) {
      if (state.questionsInCurrentCycle.length === 0) {
        state.roundsPerLetter++;
        sendDataToSheet(pid, dayNum, 'ELOPRTS', state.flipsPerLetter, state.timePerLetter, state.roundsPerLetter, state.longestPause, state.numLongPause);
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

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
}



// longestpause = time of longest pau
// numlongpause = # of pause > 10s with no interaction
function sendDataToSheet(PID, dayNum, letters, flipsPerLetter, timePerLetter, roundsPerLetter, longestPause, numLongPause) {

  let res_key = ["PID", "day","letters", "flipsPerLetter", "timePerLetter", "roundsPerLetter", "longestPause","numLongPause"];
  let res_val = [PID, dayNum,letters,flipsPerLetter,timePerLetter,roundsPerLetter, longestPause, numLongPause];
  var script_result = {};

  res_key.forEach(function (k, i) {
    script_result[k] = res_val[i];
  })
  // console.log("----------------------------")
  // console.log(JSON.stringify(script_result));
  // console.log("----------------------------")

  const url = "  https://script.google.com/macros/s/AKfycby78n3_Vy8VE3_lriDWixa4Qt2JCDwCHKuQMDV8Vko_yDcNrwm4KQ-U8EETHnPXp6-B/exec";

  fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'no-cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow', // manual, *follow, error
    body: JSON.stringify(script_result)
  })
}

