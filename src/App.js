import { useState } from "react";
import Quiz from "./components/Quiz";


export default function App() {
  
  const [startQuiz, setStartQuiz] = useState(false);

  function loadQuiz() {
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
          <Quiz />
        </main>
      }
    </>
  );
}
