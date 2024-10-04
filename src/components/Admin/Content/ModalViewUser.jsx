import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import _ from 'lodash';

const ModalViewUser = (props) => {

    const { show, setShow, dataView } = props;

    const handleClose = () => {
        setShow(false);
        setEmail("");
        setPassword("");
        setUsername("");
        setRole("USER")
        setImage("");
        setPreviewImage("");
        props.resetDataView();
    };

    const handleShow = () => setShow(true);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [role, setRole] = useState("USER");
    const [image, setImage] = useState("");
    const [previewImage, setPreviewImage] = useState("");

    useEffect(() => {
        if (!_.isEmpty(dataView)) {
            //update state
            setEmail(dataView.email);
            setUsername(dataView.username);
            setRole(dataView.role)
            setImage("");
            if (dataView.image) {
                setPreviewImage(`data:image/jpeg;base64,${dataView.image}`);
            }
        }

    }, [dataView]);

    return (
        <>
            <Modal className='modal-add-user' show={show} onHide={handleClose} size='lg' backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>View users</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label">Email</label>
                            <input disabled value={email} onChange={(event) => setEmail(event.target.value)} type="email" className="form-control" />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Password</label>
                            <input disabled value={password} onChange={(event) => setPassword(event.target.value)} type="password" className="form-control" />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Username</label>
                            <input disabled value={username} onChange={(event) => setUsername(event.target.value)} type="text" className="form-control" />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Role</label>
                            <select disabled value={role} onChange={(event) => setRole(event.target.value)} className="form-select">
                                <option value="USER">USER</option>
                                <option value="ADMIN">ADMIN</option>
                            </select>
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
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalViewUser;