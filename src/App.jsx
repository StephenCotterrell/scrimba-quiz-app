import './App.css'
import { useState, useEffect, useRef } from 'react';
import Question from './Question'

function App() {
	const [questions, setQuestions] = useState(null);
	const [selections, setSelections] = useState(null);
	const [isGameStarted, setIsGameStarted] = useState(false);
	const controllerRef = useRef(null);

	const isQuizOver = !!selections
	console.log(isQuizOver)

	const grade = selections 
					? selections.map((choice, i) => choice === questions[i].correct_answer)
					: null;

	const score = selections 
					? selections.reduce((acc, choice, i) => acc + (choice === questions[i].correct_answer ? 1 : 0), 0)
					: null;
	
	async function fetchQuestions() {
		if (controllerRef.current) {
			controllerRef.current.abort()
		}
		const controller = new AbortController()
		controllerRef.current = controller

		try {
			setQuestions([])
			setSelections(null)

			const res = await fetch("https://opentdb.com/api.php?amount=5",{
				signal: controller.signal,
			})
			if (!res.ok) {
				console.error(`HTTP ${res.status}`)
			}
			const data = await res.json()
			setQuestions(data.results.map(question => {
				return {
					...question,
					allAnswers: [question.correct_answer, ...question.incorrect_answers].sort(() => Math.random() - 0.5)
				}
			}))
		} catch (e) {
			if (e.name !== "AbortError") {
				console.error("Fetch failed: ", e)
			}
		} 
	}

	useEffect(() => {
		fetchQuestions()
		return () => {
			if (controllerRef.current) {
				controllerRef.current.abort()
			}
		}
	}, [])

	const questionComponents = questions && questions.map((questionObject, index) => {
		return (
			<Question key={index} id={index} questionObject={questionObject} selection={selections ? selections[index] : null} grade={grade ? grade[index] : null} />
		)
	})

	const handleCheckAnswers = (e) => {
		e.preventDefault()
		const formEl = e.currentTarget
		const formData = new FormData(formEl)
		const data = Object.values(Object.fromEntries(formData.entries()))
		setSelections(data)		
	}
	
	const startGame = () => {
		setIsGameStarted(true)
	}

	return (
		<>	
			<img className="corner bl" src="src/assets/blob1.svg" />
			<img className="corner tr" src="src/assets/blob2.svg" />

			{!isGameStarted && 
				<section className="intro-section">
					<h1>Quizzical</h1>
					<p>Some description if needed</p>
					<button onClick={startGame}>Start Quiz</button>
				</section>
			}
			
			{isGameStarted && <section className="questions">
				<form onSubmit={handleCheckAnswers}>
					{questionComponents}
					<div id="check-answers-section">
						{!isQuizOver && <button id="check-answers">Check Answers</button>}
					</div>
				</form>
			</section>
			}
			{isQuizOver && 
				<section className='quiz-over'> 
					<p>You scored {score}/{questions.length} correct answers</p>
					<button id="reset-quiz" onClick={fetchQuestions}>Play Again</button>
				</section>
			}
		</>
	)
}


export default App
