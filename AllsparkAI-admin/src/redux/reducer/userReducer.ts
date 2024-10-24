import { createReducer } from "@reduxjs/toolkit";
import { LOGIN_FAIL, LOGIN_REQUEST, LOGIN_SUCCESS } from "redux/constant/userConstant";

interface AuthState {
    loading: boolean,
    isAuthenticated: boolean
}

const initialState: AuthState = {
    loading: false,
    isAuthenticated: false
};

export const authReducer = createReducer(initialState, (builder) => {
    builder.addCase(LOGIN_REQUEST, (state) => {
        return { ...state, loading: true };
    });

    builder.addCase(LOGIN_SUCCESS, (state: any, action: any) => {
        return { ...state, loading: false, isAuthenticated: true, user: action.payload, error: null }
    });

    builder.addCase(LOGIN_FAIL, (state: any, action: any) => {
        return { ...state, loading: false, error: action.payload, isAuthenticated: false, user: null }
    });
});