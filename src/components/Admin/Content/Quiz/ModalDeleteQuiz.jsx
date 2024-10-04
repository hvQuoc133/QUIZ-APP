import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { deleteQuiz } from '../../../../services/apiService';
import { toast } from 'react-toastify';

const ModalDeleteQuiz = (props) => {
    const { show, setShow, dataDelete } = props;

    const handleClose = () => setShow(false);

    const handleDeleteQuiz = async () => {
        let data = await deleteQuiz(dataDelete.id);
        if (data && data.EC === 0) {
            toast.success('Delete quiz success');
            handleClose();
            props.fetchQuiz();
        }

        if (data && data.EC !== 0) {
            toast.error('Delete quiz failed');
        }

    }

    return (
        <>
            <Modal show={show} onHide={handleClose} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>Delete Quiz</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure to delete this quiz: <b>{dataDelete && dataDelete.name ? dataDelete.name : ""}</b> </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cannel
                    </Button>
                    <Button variant="danger" onClick={() => handleDeleteQuiz()}>
                        Delete Quiz
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalDeleteQuiz;