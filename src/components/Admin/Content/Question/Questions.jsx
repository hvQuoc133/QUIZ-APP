import { useState } from 'react';
import Select from 'react-select';
import './Questions.scss';
import { BsPlusCircleFill } from "react-icons/bs";
import { AiFillMinusCircle } from "react-icons/ai";
import { RiImageAddFill } from "react-icons/ri";
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import Lightbox from "react-awesome-lightbox";

const Questions = (props) => {

    const options = [
        { value: 'chocolate', label: 'Chocolate' },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'vanilla', label: 'Vanilla' },
    ];

    const [selectedQuiz, setSelectedQuiz] = useState({});

    const [questions, setQuestions] = useState(
        [
            {
                id: uuidv4(),
                description: '',
                imageFile: '',
                imageName: '',
                answers: [
                    {
                        id: uuidv4(),
                        description: '',
                        isCorrect: false
                    }
                ]
            }
        ]
    )

    const [isPreviewImg, setIsPreviewImg] = useState(false);

    const [dataImgPreview, setDataImgPreview] = useState({
        title: '',
        url: ''
    })

    const handleAddRemoveQuestion = (type, id) => {
        if (type === 'ADD') {
            const newQuestion = {
                id: uuidv4(),
                description: '',
                imageFile: '',
                imageName: '',
                answers: [
                    {
                        id: uuidv4(),
                        description: '',
                        isCorrect: false
                    }
                ]
            }
            setQuestions([...questions, newQuestion]);
        };
        if (type === 'REMOVE') {
            let questionClone = _.cloneDeep(questions);
            questionClone = questionClone.filter(item => item.id !== id);
            setQuestions(questionClone);
        }
    }

    const handleAddRemoveAnswer = (type, questionId, answerId) => {
        let questionsClone = _.cloneDeep(questions);
        if (type === 'ADD') {
            const newAnswer =
            {
                id: uuidv4(),
                description: '',
                isCorrect: false
            };
            let index = questionsClone.findIndex(item => item.id === questionId);
            questionsClone[index].answers.push(newAnswer);
            setQuestions(questionsClone);
        }
        if (type === 'REMOVE') {
            let index = questionsClone.findIndex(item => item.id === questionId);
            questionsClone[index].answers =
                questionsClone[index].answers.filter(item => item.id !== answerId);
            setQuestions(questionsClone);
        }
    }

    const handleOnchange = (type, questionId, value) => {
        if (type === 'QUESTION') {
            let questionsClone = _.cloneDeep(questions);
            let index = questionsClone.findIndex(item => item.id === questionId);
            if (index > -1) {
                questionsClone[index].description = value;
                setQuestions(questionsClone);
            }


        }

    }

    const handleOnchangeFileQuestion = (questionId, event) => {
        let questionsClone = _.cloneDeep(questions);

        let index = questionsClone.findIndex(item => item.id === questionId);
        if (index > -1 && event.target && event.target.files && event.target.files[0]) {
            questionsClone[index].imageFile = event.target.files[0];
            questionsClone[index].imageName = event.target.files[0].name;
            setQuestions(questionsClone);
        }
    }

    const handleAnswerQuestion = (type, answerId, questionId, value) => {
        let questionsClone = _.cloneDeep(questions);
        let index = questionsClone.findIndex(item => item.id === questionId);
        if (index > -1) {
            questionsClone[index].answers = questionsClone[index].answers.map(answer => {
                if (answer.id === answerId) {
                    if (type === 'CHECKBOX') {
                        answer.isCorrect = value;
                    }
                    if (type === 'INPUT') {
                        answer.description = value;
                    }
                }
                return answer;
            })

            setQuestions(questionsClone);
        }
    }

    const handleSubmitQuestionForQuiz = () => {
        alert('me')
    }

    const handlePreviewImg = (questionId) => {
        let questionsClone = _.cloneDeep(questions);
        let index = questionsClone.findIndex(item => item.id === questionId);
        if (index > -1) {
            setDataImgPreview({
                url: URL.createObjectURL(questionsClone[index].imageFile),
                title: questionsClone[index].imageName
            })
            setIsPreviewImg(true);
        }
    }

    return (
        <div className="questions-container">
            <div className="title">
                Manage Question
            </div>

            <hr />

            <div className="add-new-question">
                <div className="col-6 form-group selected-content">
                    <div className='title-select'>Select Quiz: </div>
                    <Select
                        defaultValue={selectedQuiz}
                        onChange={setSelectedQuiz}
                        options={options}
                    />
                </div>
                {
                    questions && questions.length > 0
                    && questions.map((question, index) => {
                        return (
                            <div key={question.id} className='q-main mb-4'>
                                <div className='question-content'>
                                    <div className='title-question'>Add Question:</div>
                                    <div className='input-group'>
                                        <div className="form-floating description-content">
                                            <input
                                                type="type"
                                                className="form-control"
                                                placeholder='description'
                                                value={question.description}
                                                onChange={(event) => handleOnchange('QUESTION', question.id, event.target.value)}
                                            />
                                            <label>Question {index + 1} description</label>
                                        </div>

                                        <div className='group-upload'>
                                            <label htmlFor={`${question.id}`} className='lable-upload'><RiImageAddFill className='image-upload' /></label>
                                            <input
                                                id={`${question.id}`}
                                                type="file"
                                                hidden
                                                onChange={(event) => handleOnchangeFileQuestion(question.id, event)}
                                            />
                                            <span>{question.imageName ? <span style={{ cursor: 'pointer' }} onClick={() => handlePreviewImg(question.id)}>{question.imageName}</span> : 'Not file image'}</span>
                                        </div>
                                        <div className="btn-group-question">
                                            <span onClick={() => handleAddRemoveQuestion('ADD', '')}>
                                                <BsPlusCircleFill className='icon-add' />
                                            </span>
                                            {questions.length > 1 &&
                                                <span onClick={() => handleAddRemoveQuestion('REMOVE', question.id)}>
                                                    <AiFillMinusCircle className='icon-del' />
                                                </span>
                                            }
                                        </div>
                                    </div>
                                </div>
                                {
                                    question.answers && question.answers.length > 0
                                    && question.answers.map((answer, index) => {
                                        return (
                                            <div key={answer.id} className="answers-content">
                                                <input
                                                    className="form-check-input iscorrect"
                                                    type="checkbox"
                                                    checked={answer.isCorrect}
                                                    onChange={(event) => handleAnswerQuestion('CHECKBOX', answer.id, question.id, event.target.checked)}
                                                />
                                                <div className="form-floating description-content">
                                                    <input
                                                        value={answer.description}
                                                        type="text"
                                                        className="form-control custom-input"
                                                        placeholder="Description"
                                                        onChange={(event) => handleAnswerQuestion('INPUT', answer.id, question.id, event.target.value)}
                                                    />
                                                    <label>Answers {index + 1}</label>
                                                </div>
                                                <div className="btn-group-answers">
                                                    <span onClick={() => handleAddRemoveAnswer('ADD', question.id)}>
                                                        <BsPlusCircleFill className='icon-add' />
                                                    </span>
                                                    {question.answers.length > 1 &&
                                                        <span onClick={() => handleAddRemoveAnswer('REMOVE', question.id, answer.id,)}>
                                                            <AiFillMinusCircle className='icon-del' />
                                                        </span>
                                                    }
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        )
                    })
                }
                
                {
                    questions && questions.length > 0 &&
                    <div>
                        <button onClick={() => handleSubmitQuestionForQuiz()} className='btn btn-success'>Save Question</button>
                    </div>

                }

                {isPreviewImg === true &&
                    <Lightbox
                        image={dataImgPreview.url}
                        title={dataImgPreview.title}
                        onClose={() => setIsPreviewImg(false)}
                    >
                    </Lightbox>
                }
            </div>
        </div>
    )
}

export default Questions;