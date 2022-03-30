import React from 'react';
import { nanoid } from 'nanoid';

function Item(props) {
    const question = props.data.question.replace(/&quot;/g, '"').replace(/&#039;/g, "'");
    const choices = props.data.allChoices;

    return (
        <div className="item-list">
            <div className="question-title">{question}</div>
            <div className="choice-wrapper">
                {
                    choices.map(choice => {
                        const parsedChoice = choice.value.replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&eacute;/g, "é").replace(/&aacute;/g, "Á");
                        if (props.resultInfo.reviewStatus) {
                            const style = {
                                backgroundColor: (choice.correctAnswer) ? '#94D7A2'
                                    : (!choice.correctAnswer && choice.selected) && '#F8BCBC',
                                border: (choice.correctAnswer) ? '1px solid #94D7A2'
                                    : (!choice.correctAnswer && choice.selected) && '#F8BCBC',
                                opacity: (choice.correctAnswer) && '1',
                                cursor: 'default'
                            }

                            return (
                                <button className="question-choice-button disable" style={style} disabled={true}
                                        key={nanoid()} value={choice.value}>{parsedChoice}</button>
                            );
                        } else {
                            const style = {
                                backgroundColor: (props.data.answered && choice.selected) && '#D6DBF5',
                                border:(props.data.answered && choice.selected)  && '1px solid #D6DBF5',
                                opacity: '1',
                            }

                            return (
                                <button className="question-choice-button" style={style}
                                        onClick={(event) => props.saveAnswer(event, props.data.id, choice.choiceId)}
                                        key={nanoid()} value={choice.value}>{parsedChoice}</button>
                            );
                        }
                    })
                }
            </div>
        </div>
    );
}

export default Item;