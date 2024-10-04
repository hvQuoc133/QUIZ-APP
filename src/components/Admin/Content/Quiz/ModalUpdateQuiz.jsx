import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FcPlus } from "react-icons/fc";
import { toast } from 'react-toastify';
import Select from 'react-select';
import { putUpdateQuiz } from '../../../../services/apiService';
import _ from 'lodash';

const options = [
    { value: 'Easy', label: 'Easy' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Hard', label: 'Hard' },
];

const ModalUpdateQuiz = (props) => {

    const { show, setShow, dataUpdate, fetchQuiz } = props;

    const handleClose = () => {
        setShow(false);
        setName("");
        setDescription("");
        setImage("");
        setType("");
        setPreviewImage("");
        props.resetUpdateData();
    };

    const handleShow = () => setShow(true);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('');
    const [image, setImage] = useState("");
    const [previewImage, setPreviewImage] = useState("");

    useEffect(() => {
        if (!_.isEmpty(dataUpdate)) {
            //update state
            setName(dataUpdate.name);
            setDescription(dataUpdate.description);
            setType(dataUpdate.type || dataUpdate.difficulty);
            setImage("");
            if (dataUpdate.image) {
                setPreviewImage(`data:image/jpeg;base64,${dataUpdate.image}`);
            }
        }

    }, [dataUpdate]);

    const handleUploadImage = (event) => {
        if (event.target && event.target.files && event.target.files[0]) {
            setPreviewImage(URL.createObjectURL(event.target.files[0]));
            setImage(event.target.files[0]);
        } else {
            // setPreviewImage("");
        }
    }

    const handleUpdateQuiz = async () => {
        if (!name) {
            toast.error('Name Invalid')
            return;
        }
        if (!description) {
            toast.error('Description Invalid')
            return;
        }

        const selectedType = type?.value || dataUpdate.difficulty;

        let data = await putUpdateQuiz(dataUpdate.id, description, name, selectedType, image);
        if (data && data.EC === 0) {
            toast.success('Update quiz success');
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
                    <Modal.Title>Update Quiz</Modal.Title>
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
                                options={options}
                                value={options.find(option => option.value === (type?.value || dataUpdate.difficulty))}
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
                    <Button variant="success" onClick={() => handleUpdateQuiz()} >
                        Update
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalUpdateQuiz;