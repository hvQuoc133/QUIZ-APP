import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FcPlus } from "react-icons/fc";
import { toast } from 'react-toastify';
import Select from 'react-select';
import { postCreateNewQuiz } from '../../../../services/apiService';

const options = [
    { value: 'Easy', label: 'Easy' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Hard', label: 'Hard' },
];

const ModalCreatQuiz = (props) => {

    const { show, setShow, fetchQuiz } = props;

    const handleClose = () => {
        setShow(false);
        setName("");
        setDescription("");
        setImage("");
        setPreviewImage("");
    };

    const handleShow = () => setShow(true);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('');
    const [image, setImage] = useState("");
    const [previewImage, setPreviewImage] = useState("");

    const handleUploadImage = (event) => {
        if (event.target && event.target.files && event.target.files[0]) {
            setPreviewImage(URL.createObjectURL(event.target.files[0]));
            setImage(event.target.files[0]);
        } else {
            // setPreviewImage("");
        }
    }

    const handleSubmitQuiz = async () => {
        if (!name) {
            toast.error('Name Invalid')
            return;
        }
        if (!description) {
            toast.error('Description Invalid')
            return;
        }
        let res = await postCreateNewQuiz(description, name, type?.value, image);
        if (res && res.EC === 0) {
            toast.success(res.EM)
            handleClose();
            fetchQuiz();
        } else {
            toast.error(res.EM)
        }
    }

    return (
        <>
            <Modal className='modal-add-user' show={show} onHide={handleClose} size='lg' backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>Add New Quiz</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label">Name</label>
                            <input value={name} onChange={(event) => setName(event.target.value)} type="text" className="form-control" />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Description</label>
                            <input value={description} onChange={(event) => setDescription(event.target.value)} type="text" className="form-control" />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Difficulty</label>
                            <Select
                                onChange={setType}
                                defaultValue={type}
                                options={options}
                                placeholder="Select level"
                            />
                        </div>

                        <div className='col-md-12'>
                            <label className="form-label label-upload" htmlFor='labelUpload'>
                                <FcPlus />
                                Upload File Image
                            </label>
                            <input onChange={(event) => handleUploadImage(event)} type="file" id="labelUpload" hidden />
                        </div>

                        <div className='col-md-12 img-preview'>
                            {previewImage ?
                                <img src={previewImage} alt="" />
                                :
                                <span>Preview Image</span>
                            }
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose} >
                        Close
                    </Button>
                    <Button variant="success" onClick={() => handleSubmitQuiz()} >
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalCreatQuiz;