import { useState, useEffect, useCallback } from 'react';
import Select from 'react-select';
import { getAllQuizForAdmin, getAllUsers } from '../../../../../services/apiService';

const AssigQuestion = () => {


    const [listQuiz, setListQuiz] = useState([]);
    const [selectedQuiz, setSelectedQuiz] = useState({});

    const [listUser, setListUser] = useState([]);
    const [selectedUser, setSelectedUser] = useState({});

    useEffect(() => {
        fetchQuiz();
        fetchUser();
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

    const fetchUser = useCallback(async () => {
        const res = await getAllUsers();
        if (res && res.EC === 0) {
            let newQuiz = res.DT.map(item => {
                return {
                    value: item.id,
                    label: `${item.id} - ${item.username} - ${item.email}`
                }
            })
            setListUser(newQuiz);
        }
    }, []);

    return (
        <div className='assign-quiz-container row'>
            <div className="col-6 form-group selected-content">
                <div className='title-select'>Select Quiz: </div>
                <Select
                    defaultValue={selectedQuiz}
                    onChange={setSelectedQuiz}
                    options={listQuiz}
                />
            </div>
            <div className="col-6 form-group selected-content">
                <div className='title-select'>Select User: </div>
                <Select
                    defaultValue={selectedUser}
                    onChange={setSelectedUser}
                    options={listUser}
                />
            </div>
            <div>
                <button className='btn btn-success mt-3'>Assign</button>
            </div>
        </div>
    )
}

export default AssigQuestion;