import { useEffect, useState, useCallback } from 'react';
import Select from 'react-select';
import './Questions.scss';
import { BsPlusCircleFill } from "react-icons/bs";
import { AiFillMinusCircle } from "react-icons/ai";
import { RiImageAddFill } from "react-icons/ri";
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import Lightbox from "react-awesome-lightbox";
import { getAllQuizForAdmin } from "../../../../services/apiService";
import { postCreateNewQuestionForQuiz, postCreateNewAnswerForQuestion }
    from '../../../../services/apiService';
import { toast } from 'react-toastify';

const Questions = (props) => {

    const initQuestions = [
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
    ];

    const [questions, setQuestions] = useState(initQuestions);

    const [isPreviewImg, setIsPreviewImg] = useState(false);

    const [dataImgPreview, setDataImgPreview] = useState({
        title: '',
        url: ''
    })

    const [listQuiz, setListQuiz] = useState([]);

    const [selectedQuiz, setSelectedQuiz] = useState({});

    useEffect(() => {
        fetchQuiz();
    }, []);

    const fetchQuiz = useCallback(async () => {
        const res = await getAllQuizForAdmin();
        if (res && res.EC === 0) {
            let newQuiz = res.DT.map(item => {
                return {
                    value: item.id,
                    label: `${item.id} - ${item.description}`
                }
            })
            setListQuiz(newQuiz);
        }
    }, []);


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

    const handleSubmitQuestionForQuiz = async () => {
        // todo

        // validate quiz
        if (_.isEmpty(selectedQuiz)) {
            toast.error("Please choose a Quiz!")
            return;
        }

        // validate answer
        let isValidAnswer = true;
        let indexQuestion = 0, indexAnswer = 0;
        for (let i = 0; i < questions.length; i++) {

            for (let j = 0; j < questions[i].answers.length; j++) {
                if (!questions[i].answers[j].description) {
                    isValidAnswer = false;
                    indexAnswer = j;
                    break;
                }
            }
            indexQuestion = i;
            if (isValidAnswer === false) break;
        }

        if (isValidAnswer === false) {
            toast.error(`Not empty Answer ${indexAnswer + 1} at Question ${indexQuestion + 1}`)
            return;
        }

        // validate question
        let isValidQuestion = true;
        let indexQuest = 0;
        for (let i = 0; i < questions.length; i++) {
            if (!questions[i].description) {
                isValidQuestion = false
                indexQuest = i;
                break;
            }
        }

        if (isValidQuestion === false) {
            toast.error(`Not empty description for Question ${indexQuest + 1}`)
            return;
        }



        // submit questions
        for (const question of questions) {
            const q = await postCreateNewQuestionForQuiz(
                +selectedQuiz.value,
                question.description,
                question.imageFile
            );
            // submit answers
            for (const answer of question.answers) {
                await postCreateNewAnswerForQuestion(
                    answer.description, answer.isCorrect, q.DT.id
                )
            }
        }
        toast.success("Create questions and answers succed!")
        setQuestions(initQuestions);
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
                        options={listQuiz}
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