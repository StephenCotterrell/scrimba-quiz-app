import React from 'react'
import { decode } from 'html-entities'

export default function Question(props) {
    const { questionObject, selection, grade, id } = props
    const { question, correct_answer, allAnswers } = questionObject

    const answersComponent = allAnswers.map((answer, index) => {
        const inputId = `${id}__opt_${index}`
        const groupName = `q_${id}`
        
        const className = selection
            ?   answer === correct_answer 
                ? 'correct'
                : answer === selection
                    ? 'incorrect over'
                    : 'over'
            : ''
        
        return (
            <React.Fragment key={index}>
                <input type='radio'
                    id={inputId}
                    name={groupName}
                    value={answer}
                    disabled={!!grade}
                    required
                />
                <label className={className} htmlFor={inputId}>
                    {decode(answer)}
                </label>
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