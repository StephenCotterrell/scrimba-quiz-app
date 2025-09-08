import './App.css'
import { useState, useEffect } from 'react';
import { decode } from 'html-entities';
import Question from './Question'

function App() {
  const [quizQuestions, setQuizQuestions] = useState([])
  console.log(quizQuestions)

  useEffect(() => {
    const controller = new AbortController() 
    const signal = controller.signal

    fetch("https://opentdb.com/api.php?amount=10", {signal})
      .then(res => res.json())
      .then(data => {
        setQuizQuestions(data.results)
      })
      .catch(err => {
        if (err.name !== "AbortError") {
          console.error("Fetch failed: ", err)
        }
      })

      return () => controller.abort()
  }, [])

  const questionComponents = quizQuestions && quizQuestions.map((questionObject, index) => {
    return (
      <Question key={index} questionObject={questionObject}/>
    )
  })

  return (
    <>
      <section className="intro-section">
        <h1>Quizzical</h1>
        <p>Some description if needed</p>
        <button>Start Quiz</button>
      </section>
      <img className="corner bl" src="src/assets/blob1.svg" />
      <img className="corner tr" src="src/assets/blob2.svg" />
      <section className="questions">
        {questionComponents}
      </section>
    </>
  )
}


export default App
