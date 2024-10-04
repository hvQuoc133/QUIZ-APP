import { useState } from 'react';
import './Register.scss';
import { postRegister } from '../../services/apiService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { GoEye, GoEyeClosed } from "react-icons/go";
import { ImSpinner3 } from "react-icons/im";

const Register = (props) => {

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [isShowPassword, setIsShowPassword] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const handleRegister = async () => {
        //validate
        const isValidateEmail = validateEmail(email);
        if (!isValidateEmail) {
            toast.error('Invalid email!');
            return;
        }

        if (!username) {
            toast.error('Invalid username!');
            return;
        }

        if (!password) {
            toast.error('Invalid password!');
            return;
        }

        //start loading
        setIsLoading(true);

        //spin loading 2s
        await new Promise((resolve) => setTimeout(resolve, 2000));

        //submit apis
        let data = await postRegister(email, username, password);
        if (data && data.EC === 0) {
            toast.success('Register success');


            setTimeout(() => {
                navigate('/login');
            }, 2000);
        }

        if (data && +data.EC !== 0) {
            toast.error('Register failed!');
        }

        //login failed
        setIsLoading(false)
    }

    return (
        <div className="register-container">
            <div className="content-form col-4 mx-auto">
                <div className="title col-4 mx-auto">
                    Register Online Quizz
                </div>
                <div className="form-group">
                    <label htmlFor="">Email</label>
                    <input value={email} onChange={(event) => setEmail(event.target.value)} type={"email"} className="form-control" />
                </div>
                <div className="form-group">
                    <label htmlFor="">Username</label>
                    <input value={username} onChange={(event) => setUsername(event.target.value)} type={"username"} className="form-control" />
                </div>
                <div className="form-group pass-group">
                    <label htmlFor="">Password</label>
                    <input value={password} onChange={(event) => setPassword(event.target.value)}
                        type={isShowPassword ? 'text' : 'password'} className="form-control" />

                    {isShowPassword ?
                        <span className='icon-eye' onClick={() => setIsShowPassword(false)}><GoEye /></span>
                        :
                        <span className='icon-eye' onClick={() => setIsShowPassword(true)}><GoEyeClosed /></span>
                    }

                </div>
                <span className='forgot-password'>Forgot password?</span>
                <div>
                    <button onClick={() => handleRegister()} type="button" className='btn-submit'>
                        {isLoading ? <ImSpinner3 className='spin-icon' /> : 'Register'}
                        </button>
                </div>
            </div>
            <div className="footer">
                <span>Already have an account?</span>
                <button onClick={() => navigate('/login')}>Log In</button>
                <span className='backHome' onClick={() => navigate('/')}>Go home</span>
            </div>
        </div>
    )
}

export default Register;