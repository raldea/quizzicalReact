import FrontPage from './FrontPage';
import QuizPage from './QuizPage';
import React from 'react';
import {nanoid} from 'nanoid';

function Main() {
    const [startQuiz, setStartQuiz] = React.useState(false);
    const [quiz, setQuiz] = React.useState([]);
    const [userAnswer, setUserAnswer] = React.useState([]);
    const allQuestionAnswered = quiz.every(currentValue => currentValue.answered === true);
    const [resultState, setResultState] = React.useState({reviewStatus: false, totalQuestions: 0, correctAnswer: 0});
    const [restartGame, setRestartGame] = React.useState(false);
    const [hideQuestions, setHideQuestions] = React.useState(false);

    React.useEffect(() => {
        const getQuestions = async () => {
            const getData = await fetch('https://opentdb.com/api.php?amount=5&difficulty=medium&type=multiple');
            const data = await getData.json();
            const dataResult = data.results;
            let initialUserAnswerValue = []

            for (let count = 0; count < dataResult.length; count++) {
                const choices = [...dataResult[count].incorrect_answers, dataResult[count].correct_answer];
                const objectChoice = [];
                const AnswerId = nanoid();

                for (let choiceCount = 0; choiceCount < choices.length; choiceCount++) {
                    objectChoice.push({
                        value: choices[choiceCount],
                        selected: false,
                        choiceId: nanoid(),
                        correctAnswer: dataResult[count].correct_answer === choices[choiceCount]
                    });
                }

                dataResult[count] = {...dataResult[count], allChoices: shuffle(objectChoice), id: AnswerId, answered: false};
                initialUserAnswerValue = [...initialUserAnswerValue, {id: AnswerId, value: ''}]
            }

            setResultState(prevResultState => {
                return ({
                    ...prevResultState,
                    totalQuestions: dataResult.length
                });
            })

            setUserAnswer(initialUserAnswerValue);
            setQuiz(dataResult);
            setHideQuestions(false);
        }

        function shuffle(array) {
            let currentIndex = array.length,  randomIndex;

            while (currentIndex !== 0) {

                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex--;

                [array[currentIndex], array[randomIndex]] = [
                    array[randomIndex], array[currentIndex]
                ];
            }

            return array;
        }

        setResultState({reviewStatus: false, totalQuestions: 0, correctAnswer: 0});

        getQuestions();

        return () => {};
    }, [restartGame]);

    React.useEffect(() => {
        const countCorrectAnswer = () => {
            setResultState(prevResult => {
                let totalCorrectScore = 0;

                quiz.map(item => {
                    item.allChoices.map((choice) => {
                        if (choice.selected && choice.correctAnswer) {
                            totalCorrectScore++;
                        }
                    });
                });

                return ({
                    ...prevResult,
                    correctAnswer: totalCorrectScore
                });
            });
        }

        countCorrectAnswer();

        return () => {};
    }, [quiz]);

    function onClickStartQuiz() {
        setStartQuiz(true);
    }

    function saveAnswer(event, id, choiceId) {
        const updateSetOfAnswer = [];
        const newAnswer = {
            id: id,
            value: event.target.value
        }

        for (let count = 0; count < userAnswer.length; count++) {
            if (userAnswer[count].id === id) {
                updateSetOfAnswer.push(newAnswer);
            } else {
                updateSetOfAnswer.push(userAnswer[count]);
            }
        }

        const updateQuiz = quiz.map(item => {
            if (item.id === id) {
                const updatedChoiceValue = item.allChoices.map((choice) => {
                    return ({
                        ...choice,
                        selected: choice.choiceId === choiceId
                    });
                });

                return ({
                    ...item,
                    answered: true,
                    allChoices: updatedChoiceValue
                });
            } else {
                return item;
            }
        });

        setQuiz(updateQuiz);
        setUserAnswer(updateSetOfAnswer);
    }

    function checkAnswer() {
        setResultState(prevResult => {
            return ({
                ...prevResult,
                reviewStatus: true
            });
        });
    }

    function onClickRestartGame() {
        setRestartGame(prevState => !prevState);
        setHideQuestions(true);
    }


    return (
        <div className="main-wrapper">
            {!startQuiz ? <FrontPage onClickStartQuiz={onClickStartQuiz} /> :
                <QuizPage quizList={quiz} saveAnswer={saveAnswer} checkAnswer={checkAnswer} hideStyle={hideQuestions}
                          allQuestionAnswered={allQuestionAnswered} resultInfo={resultState} onClickRestartGame={onClickRestartGame}/>}
        </div>
    );
}

export default Main;

