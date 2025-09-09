import React from 'react'
import { decode } from 'html-entities'

export default function Question(props) {
    const { questionObject, id } = props
    const { question, correct_answer, incorrect_answers, allAnswers, grade } = questionObject


    const answersComponent = allAnswers.map((answer, index) => {
        const className = grade ? correct_answer === answer 
                            ? 'correct'
                            : grade === 'incorrect' 
                                ? 'incorrect over'
                                : grade === 'correct' 
                                    ? 'over'
                                    : 'over' : ''
        
        return (
            <React.Fragment key={index}>
                <input type='radio' id={answer} name={id} value={answer} disabled={grade ? true : false} required/>
                <label className={className} htmlFor={answer}>{decode(answer)}</label>
            </React.Fragment>
        )
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