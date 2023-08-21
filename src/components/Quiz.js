import { useEffect, useState } from "react";


export default function Quiz() {

  const [quiz, setQuiz] = useState(null);
  const [playAgain, setPlayAgain] = useState(false);
  const [togglePlayAgain, setTogglePlayAgain] = useState(playAgain); // Included this when I encountered a bug whereby the useEffect was being called when I set its dependency array to the value of playAgain initially. Shout out to the nice folks on Stack Overflow.

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [userAnswer, setUserAnswer] = useState(() => []);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showAnswerBtn, setShowAnswerBtn] = useState(true);
   

  // This hook fetches data once
  // Added error handling to prevent errors filling up the UI
  useEffect(() => {
    fetch("https://opentdb.com/api.php?amount=10&category=18&difficulty=hard&type=multiple")
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

  // Helps check for a click on our options and handles necessary functions
  function handleClick(option, correctAnswer, position, questionIndex) {
    checkEachAnswer(option, correctAnswer, position);

    // Checks if the index of the current question when clicked is the index of the quiz rendered initially
    const updatedQuiz = quiz.map((eachQuiz, index) =>  
      index === questionIndex 
      ? {...eachQuiz, clickedOptionIndex: position} 
      : eachQuiz);
    setQuiz(updatedQuiz);
  }


   // Checks if the clicked option is the correct one and also checks if it was already picked before and prevents it from being added to the userAnswer array
  function checkEachAnswer(option, correctAnswer, optIndex) {


    console.log(optIndex);

    if (option === correctAnswer) {
      console.log("Correct");
      // setColorToggle(true);
     
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
      // setColorToggle(false);
    }

    // I could try it this way or I could just set it and target the active state in the pure css file.
    // And then check to see if showAnswer is true and display a different color for those we got right or wrong.

    // I can move this styles variable into  outside of this function and then use an if statement to check if option is correct, then declare a variable to check if showAnswer is true, and set a color, else, we set a different color
    
  }


  const quizElements = quiz && quiz.map((eachQuiz, questionIndex) => {

    // Destructure each object
    const {question, options, correctOption, clickedOptionIndex} = eachQuiz;

    return (
      <>
        <div className="quiz-wrapper">
          <p className="question">{question}</p>
          <ul>
            {quiz && options.map((option, index) => 
              {
                return (
                  <li 
                    className={
                      `option 
                      ${clickedOptionIndex === index 
                        ? "active" : null } 
                      ${showAnswer && option === correctOption ? "correct" : ""}
                      ${showAnswer && option !== correctOption ? "wrong" : ""}`
                    }
                    key={index}
                    onClick={() => 
                      handleClick(option, correctOption, index, questionIndex)}
                  >
                    {option}
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

  console.log(userAnswer);


  // Displays the answers when we click on the Check Again button
  function displayAnswer() {
    setShowAnswer(true);
    setPlayAgain(true);
    setShowAnswerBtn(false);
  }


  // Responsible for the Play Again button
  function updatePlayAgain() {
    setTogglePlayAgain(!togglePlayAgain);
    setPlayAgain(false);
    setShowAnswer(false);
    setShowAnswerBtn(true);
    setUserAnswer([]);
  }

  return (
    <>
      {loading && <h3>Currently loading...</h3>}
      {error && <h3>An error occurred while fetching data!</h3>}
      {quiz && <h1 className="topic">Topic: Computer Science</h1>}
      
      {quiz && quizElements}

      {showAnswer && <p>You scored {userAnswer.length} / {quiz.length}</p>}

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
