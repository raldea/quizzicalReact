import React from 'react';
import Item from './Item';
import { nanoid } from 'nanoid';

function QuizPage(props) {
    const quizList = props.quizList;

    const hideStyle = {
        display: props.hideStyle ? 'none' : 'block'
    }

    return (
        <div className="quiz-button-container" style={hideStyle}>
            <div className="quiz-main-container">
                {
                    quizList.map((item, index) => {
                        return (
                            <Item data={quizList[index]} key={nanoid()} saveAnswer={props.saveAnswer} resultInfo={props.resultInfo} />
                        );
                    })
                }
            </div>

            <div className="button-control-wrapper">
                {props.resultInfo.reviewStatus ?
                    <>
                        <div className="message-score">{`You scored ${props.resultInfo.correctAnswer}/${props.resultInfo.totalQuestions} correct answers`}</div>
                        <button className="primary-button check-answer-button" onClick={props.onClickRestartGame}>Play Again</button>
                    </>
                    :
                    <button className="primary-button check-answer-button" onClick={props.checkAnswer}
                            disabled={!props.allQuestionAnswered}>Check Answers</button> }
            </div>
        </div>
    );
}

export default QuizPage;