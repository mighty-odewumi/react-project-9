import { useEffect, useState } from "react";


export default function Quiz() {

  const [quiz, setQuiz] = useState(null);
  const [playAgain, setPlayAgain] = useState(false);
  const [togglePlayAgain, setTogglePlayAgain] = useState(playAgain); // Included this when I encountered a bug whereby the useEffect was being called when I set its dependency array to the value of playAgain initially. Shout out to the nice folks on Stack Overflow.

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showAnswerBtn, setShowAnswerBtn] = useState(true);
  const [active, setActive] = useState(true);
  const [score, setScore] = useState(0);
  const [buttonClickable, setButtonClickable] = useState(true);
  

  // This hook fetches data once
  // Added error handling to prevent errors filling up the UI
  useEffect(() => {
    fetch("https://opentdb.com/api.php?amount=5&category=18&difficulty=easy&type=multiple")
      .then(result => {
        if (!result.ok) {
          throw new Error("This is an HTTP error", result.status);
        }
        else {
          return result.json();
        }
      })
      .then(data => {
        // Had to move this here because we only want to call the randomize function once. Doing otherwise results in bugs like the options switching position everytime we click on any.
        const modifiedQuiz = data.results.map(eachQuiz => {
          const incorrectOptions = eachQuiz.incorrect_answers;
          const correctOption = eachQuiz.correct_answer;
          const options = incorrectOptions.concat(correctOption);
          const randomOptions = createRandomOptions(options);
          
          return {
            ...eachQuiz,
            options: randomOptions,
            correctOption: correctOption,
            clickedOptionIndex: -1, // Tracks the index of the clicked option in each question. Set to minus -1 to show that no option has been clicked yet.
          };
        });
        setQuiz(modifiedQuiz);
      })
      .catch(error => {
        console.error("An error occurred!", error);
        setQuiz(null);
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [togglePlayAgain])



  // Shuffles both the incorrect and correct answers
  function createRandomOptions(arr) {
      
    let copyOptions = [...arr];
    let randomOptionsArr = [];

    while (copyOptions.length > 0) {
      let randomIndex = Math.floor(Math.random() * copyOptions.length);
      randomOptionsArr.push(copyOptions[randomIndex]);
      copyOptions.splice(randomIndex, 1); 
    }

    return randomOptionsArr;
  }


  // Helps check for a click on our options and handles necessary logic
  function handleClick(option, position, questionIndex, event) {
    // checkEachAnswer(option, correctAnswer);
    setActive(false);
    setButtonClickable(true);
    userAnswers[questionIndex] = option; // Resets the option at the question's index with the new option we select until we move to a new question. Inspired by Stack Overflow.

    // Checks if the index of the current question when clicked is the index of the quiz rendered initially
    const updatedQuiz = quiz.map((eachQuiz, index) =>  
      index === questionIndex 
      ? {...eachQuiz, clickedOptionIndex: position} 
      : eachQuiz
    );
    setQuiz(updatedQuiz);
  }

  
  // console.log(score);

  // It was supposed to check if the clicked option is the correct one and also checks if it was already picked before and prevents it from being added to the userAnswer array but found a better way
  /* function checkEachAnswer(option, correctAnswer) {

    if (option === correctAnswer) {
      setScore(score + 1);  
    }

    else if (option !== correctAnswer && score > 0) {
      setScore(score - 1);
    }




     if (option === correctAnswer && !active) {
      console.log("Correct");
     
      // Check if clicked answer exists before and reset the value back to what was clicked to eliminate same answer repeated in the userAnswer array
      if (userAnswer.includes(option)) {
        let userAnsArrCopy = [...userAnswer];
        let index = userAnsArrCopy.findIndex(elem => elem);
        userAnsArrCopy[index] = option;
        
        setUserAnswer(prevValue => {
          return userAnsArrCopy;
        }); 
      }

      else {
        setUserAnswer(prevValue => {
          return [...prevValue, option];
        });
       
      }

    }
    else {
      console.log(option, "is incorrect", );

      setUserAnswer(prevValue => {
        return [...prevValue, prevValue[optIndex] = option]
      })
    } 
  } */


  const quizElements = quiz && quiz.map((eachQuiz, questionIndex) => {

    // Destructure each object
    const {question, options, correctOption, clickedOptionIndex} = eachQuiz;

    return (
      <>
        <div className="quiz-wrapper" key={questionIndex}>
          <p className="question">{question}</p>
          <ul>
            {quiz && options.map((option, index) => 
              {
                return (
                  <li key={option}>
                    <button
                      disabled={!buttonClickable}
                      className={
                        `option 
                        ${clickedOptionIndex === index
                          ? "active" : "" } 
                        ${showAnswer && option === correctOption
                          ? "correct" : "" }
                        ${showAnswer && option !== correctOption && active
                          ? "wrong" : "" }`
                      }
                      onClick={
                        () => 
                        handleClick(option, index, questionIndex)
                      }
                    >
                      {option}
                    </button>
                  </li>
                )
              })
            }
          </ul>
        </div>
        <div className="divider"></div>
      </>
    )
  });


  // console.log(userAnswers);


  // Displays the answers when we click on the Check Again button
  function displayAnswer() {
    setShowAnswer(true);
    setPlayAgain(true);
    setShowAnswerBtn(false);
    setButtonClickable(false);
    const matched = userAnswers.filter((elem, index) => {
      return elem === quiz[index].correct_answer;
    }); // Filters out the answers that match the correct answer initially stored with the question.

    setScore(matched.length);
    // console.log(matched);
  }


  // Responsible for the Play Again button
  function updatePlayAgain() {
    setTogglePlayAgain(!togglePlayAgain);
    setPlayAgain(false);
    setShowAnswer(false);
    setShowAnswerBtn(true);
    setUserAnswers([]);
    setScore(0);
    setButtonClickable(true);
  }


  return (
    <>
      {loading && <h3>Currently loading...</h3>}
      {error && <h3>An error occurred while fetching data! Please check your network connection</h3>}
      {quiz && <h1 className="topic">Topic: Computer Science</h1>}
      
      {quiz && quizElements}

      {showAnswer && <p>You scored {score} / {quiz.length}</p>}

      {quiz && showAnswerBtn && 
        <button 
          onClick={() => displayAnswer()}
          className="main-btn"
        >
          Check Answer
        </button>
      }

      {quiz && playAgain && 
        <button 
          onClick={() => updatePlayAgain()}
          className="main-btn"
        >
          Play Again
        </button>
      }
    </>
  )
}
