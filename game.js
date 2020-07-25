const question = document.getElementById("question"); // this is referencing the id question in game.html and saving this id in question variable
const choices = Array.from(document.getElementsByClassName("choice-text")); // referencing choice-text class in game.html
const progressText = document.getElementById('progressText'); // referencing the questionCounter id in the hud-item class of game.html
const scoreText = document.getElementById('score'); // referencing the score id in the score section of the hud-item class of game.html
const progressBarFull = document.getElementById('progressBarFull'); // referencing the progressBarFull id from game.html
const loader = document.getElementById("loader");
const game = document.getElementById("game");

console.log(choices);

// defining variables to work with
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

// hard coding questions pool... which I have now moved to the questions.json file
let questions = [];
// write Promise for fetching questions
fetch("https://opentdb.com/api.php?amount=10")
.then(res => {
  return res.json();
})
.then(loadedQuestions => {
  console.log(loadedQuestions.results);

  questions = loadedQuestions.results.map( loadedQuestion => {
    const formattedQuestion = {
      question: loadedQuestion.question
    };

    const answerChoices = [... loadedQuestion.incorrect_answers]; // will copy array of incorrect answers
    formattedQuestion.answer = Math.floor(Math.random() * 3) + 1; // since we have 3 incorrect answers, want to randomize the index (choice) of the correct answer
    // next, need to put the right choice in the right index
    answerChoices.splice(formattedQuestion.answer - 1, 0, loadedQuestion.correct_answer) // the -1 b/c choices aren't zero-based but rather begin at 1... 0 b/c nothing is removed (spliced) out of array... then add correct answer

    answerChoices.forEach((choice, index) => {
      formattedQuestion["choice" + (index+1)] = choice;
    })
    
    return formattedQuestion;
  });

  //console.log(loadedQuestions);
  startGame();

})
.catch(err => {
  console.error(err);
});

// defining more constants
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 5; // questions.length

// define startGame fxn
startGame = () => {
  questionCounter = 0;
  score = 0;
  availableQuestions = [... questions]; // explode the questions-- i.e. it does a proper copy so we can tweak better
  console.log(availableQuestions);
  getNewQuestion(); // fxn to throw user new question
  game.classList.remove("hidden");
  loader.classList.add("hidden");
};

getNewQuestion = () => {
  if(availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
    // save scores to local storage
    localStorage.setItem("mostRecentScore", score);

    // go to end
    return window.location.assign('end.html'); // referencing the end.html file which handles end of game stats
  }
  questionCounter++;
  // code to update questionCounterText field as user progresses thru the quiz
  progressText.innerHTML = `Question ${questionCounter}/${MAX_QUESTIONS}`
  // updating progress bar 
  progressBarFull.style.width = `${(questionCounter/MAX_QUESTIONS) * 100 }%`;


  const questionIndex = Math.floor(Math.random() * availableQuestions.length); // randomly pick a question within length of the questions array
  currentQuestion = availableQuestions[questionIndex];
  question.innerHTML = currentQuestion.question;
  choices.forEach (choice => {
    const number = choice.dataset['number'];
    choice.innerHTML = currentQuestion['choice' + number];
  });
  availableQuestions.splice(questionIndex, 1); // this will get rid of question already asked

  acceptingAnswers = true; // after questions have been loaded, we can allow user to answer now
};

choices.forEach(choice => {
  choice.addEventListener('click', e => {
    if(!acceptingAnswers) return;

    acceptingAnswers = false;
    const selectedChoice = e.target;
    const selectedAnswer = selectedChoice.dataset['number'];
    //console.log(selectedAnswer == currentQuestion.answer); // will check if user's chosen answer is the correct answer

    //const classToApply = 'incorrect';
    //if (selectedAnswer == currentQuestion.answer) {
      //classToApply = 'correct';
    //}

    // Alternatively, using Tenary Operators
    const classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';
    // console.log(classToApply);

    // check if answer is correct, then call incrementScore fxn
    if (classToApply === 'correct') {
      incrementScore(CORRECT_BONUS);
    };
    selectedChoice.parentElement.classList.add(classToApply);
    // include timeout so effect is removed from choice after time elapses
    setTimeout( () => {
      // function to remove correctedness effect
      selectedChoice.parentElement.classList.remove(classToApply);
      getNewQuestion();
    }, 1000);
  });
});

// Make fxn to increment score as user traverses questions
incrementScore = num => {
  score += num;
  scoreText.innerText = score;
};
//startGame();
