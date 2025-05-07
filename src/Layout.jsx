import { Routes, Route } from "react-router-dom";
import App from './App.jsx'
import Admin from './components/Admin/Admin.jsx';
import User from './components/User/User.jsx';
import HomePage from './components/Home/HomePage.jsx';
import ManageUser from './components/Admin/Content/ManageUser.jsx';
import DashBoard from './components/Admin/Content/DashBoard.jsx';
import Login from './components/Auth/Login.jsx';
import { ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Register from "./components/Auth/Register.jsx";
import ListQuiz from "./components/User/ListQuiz.jsx";
import DetailQuiz from "./components/User/DetailQuiz.jsx";
import ManageQuiz from "./components/Admin/Content/Quiz/ManageQuiz.jsx";
import Questions from "./components/Admin/Content/Question/Questions.jsx";
import PrivateRoute from "./routes/PrivateRoute.jsx";
import React, { Suspense } from 'react';

const NotFound = () => {
    return(
        <div className="alert alert-danger">
            404.NOT FOUND DATA WITH YOUR CURRENT URL!
        </div>
    )
    
}

const Layout = (props) => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Routes>
                <Route path='/' element={<App />}>
                    <Route index element={<HomePage />} />
                    <Route path='/users' element={
                        <PrivateRoute>
                            <ListQuiz />
                        </PrivateRoute>
                    } />
                </Route>
                <Route path='/quiz/:id' element={<DetailQuiz />} />

                <Route path='admin' element={
                    <PrivateRoute>
                    <Admin />
                    </PrivateRoute>
                    } >
                    <Route index element={<DashBoard />} />
                    <Route path='manage-users' element={<ManageUser />} />
                    <Route path='manage-quizzes' element={<ManageQuiz />} />
                    <Route path='manage-questions' element={<Questions />} />
                </Route>

                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='*' element={<NotFound />} />
            </Routes>

            <ToastContainer
                position="top-right"
                autoClose={1500}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss = {false}
                draggable
                pauseOnHover = {false}
                theme="light"
                transition={Bounce}
            />
        </Suspense>
    )
}

export default Layout;