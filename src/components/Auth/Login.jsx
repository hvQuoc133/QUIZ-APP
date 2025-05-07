import { useState } from 'react';
import './Login.scss';
import { postLogin } from '../../services/apiService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { doLogin } from '../../redux/action/userAction';
import { ImSpinner3 } from "react-icons/im";

const Login = (props) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const handleLogin = async () => {
        //validate
        const isValidateEmail = validateEmail(email);
        if (!isValidateEmail) {
            toast.error('Invalid email!');
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
        let data = await postLogin(email, password);
        if (data && data.EC === 0) {
            dispatch(doLogin(data))
            toast.success('Login success');


            setTimeout(() => {
                navigate('/');
            }, 2000);
        }

        if (data && +data.EC !== 0) {
            toast.error('Login failed!');
            setPassword("");
        }

        //login failed
        setIsLoading(false);
    }

    const handleKeyDown = (event) => {
        if(event && event.key === 'Enter'){
            handleLogin();
        }
    }

    return (
        <div className="login-container">
            <div className="content-form col-4 mx-auto">
                <div className="title col-4 mx-auto">
                    Login Online Quizz
                </div>
                <div className="form-group">
                    <label htmlFor="">Email</label>
                    <input value={email} onChange={(event) => setEmail(event.target.value)} type={"email"} className="form-control" />
                </div>
                <div className="form-group">
                    <label htmlFor="">Password</label>
                    <input value={password} onChange={(event) => setPassword(event.target.value)} type={"password"}
                     className="form-control" 
                     onKeyDown={(event) => handleKeyDown(event)}
                     />
                </div>
                <span className='forgot-password'>Forgot password?</span>
                <div>
                    <button onClick={() => handleLogin()} type="button" className='btn-submit'>
                        
                        {isLoading && isLoading ? <ImSpinner3 className='spin-icon' /> : 'Login'}
                        </button>
                </div>
            </div>
            <div className="footer">
                <span>Don't have an account yet?</span>
                <button onClick={() => navigate('/register')}>Sign Up</button>
                <span className='backHome' onClick={() => navigate('/')}>Go home</span>
            </div>
        </div>
    )
}

export default Login;