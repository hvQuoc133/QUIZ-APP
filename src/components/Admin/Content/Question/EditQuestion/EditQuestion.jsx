import { useEffect, useState, useCallback } from 'react';
import Select from 'react-select';
import './EditQuestion.scss';
import { BsPlusCircleFill } from "react-icons/bs";
import { AiFillMinusCircle } from "react-icons/ai";
import { RiImageAddFill } from "react-icons/ri";
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import Lightbox from "react-awesome-lightbox";
import { getAllQuizForAdmin, postUpsertQA, getQuizWithQA } from '../../../../../services/apiService';
import { toast } from 'react-toastify';

const EditQuestion = (props) => {

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

    useEffect(() => {
        if(selectedQuiz && selectedQuiz.value){
            fetchQuizWithQA();
        }
    }, [selectedQuiz]);

    function dataURLtoFile(dataurl, filename) {
        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[arr.length - 1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    }

    const fetchQuizWithQA = async () => {
        let res = await getQuizWithQA(selectedQuiz.value);
        if (res && res.EC === 0) {
            // Convert base64 to File object
            let newQA = [];
            for (let i = 0; i < res.DT.qa.length; i++) {
                let q = res.DT.qa[i];
                if (q.imageFile) {
                    q.imageName = `Question-${q.id}.png`;
                    q.imageFile = dataURLtoFile(`data:image/png;base64,${q.imageFile}`, `Question-${q.id}.png`);
                } else {
                    q.imageName = 'Not file image';
                }
                newQA.push(q);
            }
            setQuestions(newQA);
        }
    };

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
        
        let questionsClone = _.cloneDeep(questions);
        for( let i = 0; i < questionsClone.length; i++){
            if(questionsClone[i].imageFile){
                questionsClone[i].imageFile = await toBase64(questionsClone[i].imageFile)
             }
        }

        let res = await postUpsertQA({
            quizId : selectedQuiz.value,
            questions: questionsClone
        });

        if(res && res.EC === 0){
            toast.success(res.EM)
            fetchQuizWithQA();
        }
    }

    const toBase64 = file => new Promise((resovle, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resovle(reader.result);
        reader.onerror = error => reject(error);
    })

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

export default EditQuestion;