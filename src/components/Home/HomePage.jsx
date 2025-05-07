import videoHomePage from '../../assets/video-homepage.mp4';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';

const HomePage = (props) => {

    const isAuthenticated = useSelector(state => state.user.isAuthenticated);
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <>
            <div className="homepage-container">
                <div className='homepage-video'>
                    <video src={videoHomePage} autoPlay loop muted ></video>
                </div>
                <div className='homepage-content'>
                    <div className='title-one'>
                        
                        {t('homepage.title1')}
                        </div>
                    <div className='title-two'>
                        {t('homepage.title2')}
                    </div>
                    <div className='title-three'>
                        {isAuthenticated === false ?
                            <button onClick={() => navigate('/login')}> {t('homepage.title3')}</button>
                        :
                            <button onClick={() => navigate('/users')}> {t('homepage.title4')}</button>
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