let currentIndex = 0;
let correctAnswer = 0;
let countDownInterval;

let path;
let arr = [1, 2, 3, 4];

function getSelectValue() {
  let selectedValue = document.getElementById("quizCategory").value;
  path = `../${selectedValue}-sheet.json`;

  let chosenCatgSpan = document.querySelector(
    ".quiz .container .category .chosen-catg"
  );
  chosenCatgSpan.textContent = selectedValue;

  fetch(path)
    .then((x) => {
      let result = x.json();
      console.log("result: " + result);
      return result;
    })
    .then((result) => {
      // excute the function
      changeOrder(result);

      //create the current spans depends on length
      createSpans(9);

      // change the current Question
      changeQuestion(result, 9);

      timeCount(30, 9);

      let submitAnswer = document.querySelector(
        ".quiz .container .foot .submit span"
      );
      submitAnswer.addEventListener("click", () => {
        theQuizResult(result[currentIndex].right_answer, 9);

        currentIndex++;

        changeQuestion(result, 9);
        clearInterval(countDownInterval);
        timeCount(30, 9);

        showResults(9);
      });
    });
  document.querySelector(".options").style.display = "none";
  document.querySelector(".quiz").style.display = "block";
}

function createSpans(questionLength) {
  let numberOfQuestions = document.querySelector(
    ".quiz .container .head .text .num-questions span"
  );
  numberOfQuestions.textContent = questionLength;

  let spansContainer = document.querySelector(
    ".quiz .container .foot .time .all-questions-nums"
  );
  spansContainer.innerHTML = "";

  for (let i = 0; i < questionLength; i++) {
    let span = document.createElement("span");
    spansContainer.append(span);
  }
}

// shuffle the order range
function changeOrder(x) {
  for (let i = 0; i < x.length; i++) {
    let random = Math.floor(Math.random() * x.length);
    [x[i], x[random]] = [x[random], x[i]];
  }
}

function changeQuestion(result, qCount) {
  if (currentIndex < qCount) {
    clearData();
    let questionHeader = document.querySelector(".quiz .container .body h2");
    questionHeader.textContent = result[currentIndex].title;

    let questionAnswer = document.querySelector(".quiz .container .body ul");

    changeOrder(arr);

    for (let index = 0; index < 4; index++) {
      let theAnswerContainer = document.createElement("li");
      let answerNumber = `answer_${arr[index]}`;
      let radioInput = document.createElement("input");
      radioInput.type = "radio";
      radioInput.name = "reply";
      radioInput.id = answerNumber;
      radioInput.setAttribute("answer", result[currentIndex][answerNumber]);

      let answer = document.createElement("label");
      answer.textContent = result[currentIndex][answerNumber];
      answer.htmlFor = answerNumber;

      if (index === 0) {
        radioInput.checked = true;
      }

      theAnswerContainer.append(radioInput, answer);

      questionAnswer.append(theAnswerContainer);
    }
    addActiveToSpan();
  }
}

function addActiveToSpan() {
  let lightingSpans = document.querySelectorAll(
    ".quiz .container .foot .time .all-questions-nums span"
  );
  lightingSpans[currentIndex].classList.add("num-active");
}

function timeCount(duration, qCount) {
  if (currentIndex < qCount) {
    let spansTimer = document.querySelector(
      ".quiz .container .foot .time .clock span"
    );
    let min, sec;
    countDownInterval = setInterval(() => {
      min = parseInt(duration / 60);
      sec = parseInt(duration % 60);
      min = min < 10 ? `0${min}` : min;
      sec = sec < 10 ? `0${sec}` : sec;
      let theWholeTime = `${min}:${sec}`;

      spansTimer.textContent = theWholeTime;
      if (--duration < 0) {
        clearInterval(countDownInterval);
        let submitAnswer = document.querySelector(
          ".quiz .container .foot .submit span"
        );
        submitAnswer.click();
      }
    }, 1000);
  }
}

function clearData() {
  let questionAnswer = document.querySelectorAll(".quiz .container .body ul");
  questionAnswer.forEach((element) => {
    element.innerHTML = "";
  });

  let theQuestionHeader = document.querySelector(".quiz .container .body h2");
  theQuestionHeader.innerHTML = "";
}

function theQuizResult(Rightanswer, qCount) {
  let theChoosenAnswer;
  let questionAnswer = document.querySelectorAll(
    ".quiz .container .body ul li input"
  );

  questionAnswer.forEach((element) => {
    if (element.checked === true) {
      theChoosenAnswer = element.getAttribute("answer");
    }
  });

  if (theChoosenAnswer === Rightanswer) {
    correctAnswer++;
  }
}

function showResults(qcount) {
  let finalResult;
  if (currentIndex === qcount) {
    let body = document.querySelector(".quiz .container .body");
    body.remove();

    let foot = document.querySelector(".quiz .container .foot");
    foot.remove();

    let resultAns = document.querySelector(".quiz .container .result");

    resultAns.style.display = "block";

    let count = qcount;

    if (correctAnswer === count) {
      finalResult = `<span class="perfect">Perfect</span>, ${correctAnswer} From ${count}`;
    } else if (correctAnswer < count && correctAnswer > 5) {
      finalResult = `<span class="good">Good</span>, ${correctAnswer} From ${count}`;
    } else {
      finalResult = `<span class="bad">Bad</span>, ${correctAnswer} From ${count}`;
    }

    resultAns.innerHTML = finalResult;
  }
}
