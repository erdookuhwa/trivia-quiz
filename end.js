const username = document.getElementById('username');
const saveScoreBtn = document.getElementById('saveScoreBtn');
const finalScore = document.getElementById('finalScore');
const mostRecentScore = localStorage.getItem('mostRecentScore');

const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

const MAX_HIGH_SCORES = 5; // we want to save & display only the top 5 high scorers

finalScore.innerText = mostRecentScore;


username.addEventListener('keyup', () => {
  console.log(username.value);
  saveScoreBtn.disabled = !username.value;
});

saveHighScore = e => { // using prevent def b/c by def, forms usually post to another page after click
  console.log("clicked the save button");
  e.preventDefault();

  const score = {
    // score: Math.floor(Math.random() * 50),
    score: mostRecentScore,
    name: username.value
  };
  highScores.push(score);

  highScores.sort( (a,b) => { // this sort fxn can be reduced to highScores.sort( (a,b) => b.score - a.score)
    return b.score - a.score;
  });

  highScores.splice(5); // cut off from array at the fifth index

  localStorage.setItem("highScores", JSON.stringify(highScores)); // to save in localStorage
  window.location.assign("index.html"); // so it returns home once score is saved

};
