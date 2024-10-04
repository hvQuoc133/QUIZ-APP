import { useState, useEffect, useCallback } from 'react';
import './ManageQuiz.scss';
import { getAllQuizForAdmin } from "../../../../services/apiService";
import TableQuiz from './TableQuiz';
import ModalCreatQuiz from './ModalCreateQuiz';
import ModalUpdateQuiz from './ModalUpdateQuiz';
import ModalDeleteQuiz from './ModalDeleteQuiz';
import { Pagination } from 'react-bootstrap';

const ManageQuiz = (props) => {

    const [listQuiz, setListQuiz] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [quizzesPerPage] = useState(7);

    const indexOfLastQuiz = currentPage * quizzesPerPage;
    const indexOfFirstQuiz = indexOfLastQuiz - quizzesPerPage;
    const currentQuizzes = listQuiz.slice(indexOfFirstQuiz, indexOfLastQuiz);

    const totalPages = Math.ceil(listQuiz.length / quizzesPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const [showModalCreaterQuiz, setShowModalCreaterQuiz] = useState(false);
    const [showModalUpdateQuiz, setShowModalUpdateQuiz] = useState(false);
    const [showModalDeleteQuiz, setShowModalDeleteQuiz] = useState(false);
    const [dataUpdate, setDataUpdate] = useState({});
    const [dataDelete, setDataDelete] = useState({});

    useEffect(() => {
        fetchQuiz();
    }, []);

    const fetchQuiz = useCallback(async () => {
        const res = await getAllQuizForAdmin();
        if (res && res.EC === 0) {
            setListQuiz(res.DT);
        }
    }, []);

    const handleUpdateQuiz = (quizId) => {
        setDataUpdate(quizId);
        setShowModalUpdateQuiz(true);
    }

    const resetUpdateData = () => {
        setDataUpdate({});
    }

    const handleDeleteQuiz = (quizId) => {
        setShowModalDeleteQuiz(true);
        setDataDelete(quizId)
    }

    return (
        <div className="quiz-container">
            <div className="title">
                Manage Quiz
                <div className="btn-add-new">
                    <button className="btn btn-success" onClick={() => setShowModalCreaterQuiz(true)}>Add new quizzes</button>
                </div>
                <ModalCreatQuiz
                    show={showModalCreaterQuiz}
                    setShow={setShowModalCreaterQuiz}
                    fetchQuiz={fetchQuiz}
                />
                <ModalUpdateQuiz
                    show={showModalUpdateQuiz}
                    setShow={setShowModalUpdateQuiz}
                    dataUpdate={dataUpdate}
                    resetUpdateData={resetUpdateData}
                    fetchQuiz={fetchQuiz}
                />
                <ModalDeleteQuiz
                    show={showModalDeleteQuiz}
                    setShow={setShowModalDeleteQuiz}
                    dataDelete={dataDelete}
                    fetchQuiz={fetchQuiz}
                />
            </div>
            <hr />
            <div className="list-detail">
                {listQuiz && listQuiz.length > 0 ? (
                    <>
                        <TableQuiz
                            listQuiz={currentQuizzes}
                            handleUpdateQuiz={handleUpdateQuiz}
                            handleDeleteQuiz={handleDeleteQuiz}
                        />
                        <Pagination className='pagination-container'>
                            <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                                &lt; Prev
                            </Pagination.Prev>

                            {Array.from({ length: totalPages }, (_, index) => (
                                <Pagination.Item 
                                key={index} 
                                className={`page-item ${index + 1 === currentPage ? 'active' : ''}`} 
                                onClick={() => paginate(index + 1)}
                                >
                                    {index + 1}
                                </Pagination.Item>
                            ))}

                            <Pagination.Next onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
                                Next &gt;
                            </Pagination.Next>
                        </Pagination>
                    </>
                ) : (
                    <div>
                        Not found data
                    </div>
                )}
            </div>
        </div>
    )
}

export default ManageQuiz;
