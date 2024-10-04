import videoHomePage from '../../assets/video-homepage.mp4';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const HomePage = (props) => {

    const isAuthenticated = useSelector(state => state.user.isAuthenticated);
    const navigate = useNavigate();

    return (
        <>
            <div className="homepage-container">
                <div className='homepage-video'>
                    <video src={videoHomePage} autoPlay loop muted ></video>
                </div>
                <div className='homepage-content'>
                    <div className='title-one'>There's a better way to ask</div>
                    <div className='title-two'>You don't want to make a boring form.
                        And your audience won't answer one.
                        Create a typeform instead-and make everyone happy.
                    </div>
                    <div className='title-three'>
                        {isAuthenticated === false ?
                            <button onClick={() => navigate('/login')}> Get's stated - it's free</button>
                        :
                            <button onClick={() => navigate('/users')}>Doing Quiz Now</button>
                        }
                       
                    </div>
                </div>
                <div style={{ height: '500px' }}>
                    123312
                </div>
            </div>
        </>
    )
}

export default HomePage;