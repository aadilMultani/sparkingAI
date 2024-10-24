import { LOGIN_FAIL, LOGIN_REQUEST, LOGIN_SUCCESS } from 'redux/constant/userConstant';
import { postApi } from '../../service/GlobleApi';

export const loginUser = async (user: any, dispatch: (action: any) => void) => {
    try {
        if (!user.email || !user.password) {
            throw new Error('Email and password are required');
        }

        dispatch({type: LOGIN_REQUEST});

        const response = await postApi('login', user);

        // if (!response.success) {
        //     throw new Error('Invalid API response');
        // }

        dispatch({ type: LOGIN_SUCCESS, payload: response });

        return response;
    } catch (error: any) {
        dispatch({ type: LOGIN_FAIL, payload: error });
    }
};