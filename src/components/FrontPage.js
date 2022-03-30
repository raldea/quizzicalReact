import React from 'react';

function FrontPage(props) {
    return (
        <div className="start">
            <h1>Quizzical</h1>
            <p>Let's test you brain!</p>
            <button className="primary-button" onClick={props.onClickStartQuiz}>Start Quiz</button>
        </div>
    );
}

export default FrontPage;