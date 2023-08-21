import { useState } from "react";
import Quiz from "./components/Quiz";

const quizId = [
  {"id": 0},
  {"id": 1},
  {"id": 2},
  {"id": 3},
  {"id": 4},
]

export default function App() {
  
  const [startQuiz, setStartQuiz] = useState(false);

  function loadQuiz() {
    // console.log(startQuiz);
    setStartQuiz(true);
  }


  return (
    <>
      {!startQuiz && 
        <div className="intro-container">
        
          <div className="intro-screen">
            <h1>SmartU</h1>
            <button className="start-btn" onClick={loadQuiz}>
              Go to Quiz
            </button>
          </div>
        
        </div>}

      {startQuiz && 
        <main> 
          <Quiz key={quizId.map(myId => myId.id)}/>
        </main>
      }
    </>
  );
}
