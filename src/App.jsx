import './App.css'
import { useState, useEffect, useRef } from 'react';
import Question from './Question'

function App() {
	const [quizQuestions, setQuizQuestions] = useState([])
	const [loading, setLoading] = useState(false)
	const [err, setErr] = useState(null)
	const controllerRef = useRef(null)

	async function fetchQuestions() {
		if (controllerRef.current) {
			controllerRef.current.abort()
		}
		const controller = new AbortController()

		try {
			setLoading(true)
			setErr(null)
			setQuizQuestions([])

			const res = await fetch("https://opentdb.com/api.php?amount=5",{
				signal: controller.signal,
			})
			if (!res.ok) {
				throw new Error(`HTTP ${res.status}`)
			}
			const data = await res.json()
			setQuizQuestions(data.results.map(question => {
				return {
					...question,
					allAnswers: [question.correct_answer, ...question.incorrect_answers].sort(() => Math.random() - 0.5)
				}
			}))
		} catch (e) {
			if (e.name !== "AbortError") {
				setErr(e)
			}
		} finally {
			setLoading(false)
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



	const questionComponents = quizQuestions && quizQuestions.map((questionObject, index) => {
		return (
			<Question key={index} id={index} questionObject={questionObject} />
		)
	})

	const handleCheckAnswers = (e) => {
		e.preventDefault()
		const formEl = e.currentTarget
		const formData = new FormData(formEl)
		const data = Object.fromEntries(formData.entries())

		setQuizQuestions(prev => {
			return prev.map((question, index) => {
				return {
					...question,
					grade: data[index] === question.correct_answer ? "correct" : "incorrect"
				}
			})
		})
	}

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
				<form onSubmit={handleCheckAnswers}>
					{questionComponents}
					<div id="check-answers-section">
						<button id="check-answers">Check Answers</button>
					</div>
				</form>
			</section>
		</>
	)
}


export default App
