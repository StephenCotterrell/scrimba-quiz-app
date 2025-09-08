import React from 'react'
import { decode } from 'html-entities'

export default function Question(props) {
    const { questionObject } = props
    const { type, difficulty, category, question, correct_answer, incorrect_answers } = questionObject

    const allAnswers = [correct_answer, ...incorrect_answers]

    const answersComponent = allAnswers.map((answer, index) => {
        return <button key={index} className="answer-btn">{answer}</button>
    })


    return (
        <>
            <p>{decode(question)}</p>
            <div className="answers">
                {answersComponent}
            </div>
            <hr></hr>
        </>
    )
}