import { FETCH_USER_LOGIN_SUCCESS } from "../action/userAction";
import { LOGOUT } from "../action/userAction";

const INITIAL_STATE = {
    account: {
        access_token: '',
        refresh_token: '',
        usename: '',
        image: '',
        role: ''
    },
    isAuthenticated: false
};

const userReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case FETCH_USER_LOGIN_SUCCESS:
            return {
                ...state, account: {
                    access_token: action?.payload?.DT?.access_token,
                    refresh_token: action?.payload?.DT?.refresh_token,
                    usename: action?.payload?.DT?.usename,
                    image: action?.payload?.DT?.image,
                    role: action?.payload?.DT?.role
                },
                isAuthenticated: true
            };

        case LOGOUT:
            return {
                ...state, account: {
                    access_token: '',
                    refresh_token: '',
                    usename: '',
                    image: '',
                    role: ''
             },
                isAuthenticated: false
            }

        default:
            return state;
    }
}

export default userReducer;