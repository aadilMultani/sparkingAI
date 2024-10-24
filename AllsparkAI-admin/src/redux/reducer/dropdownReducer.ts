import { createReducer } from "@reduxjs/toolkit";
import { GET_CITY_FAIL, GET_CITY_SUCCESS, GET_COUNTRY_FAIL, GET_COUNTRY_SUCCESS, GET_ROLE_FAIL, GET_ROLE_SUCCESS, GET_STATE_FAIL, GET_STATE_SUCCESS } from "redux/constant/dropdownConstant";

const initialState: any = {
    countries: [],
    states: [],
    cities: [],
    roles: []
};

export const dropdownReducer = createReducer(initialState, (builder) => {

    builder.addCase(GET_COUNTRY_SUCCESS, (state: any, action: any) => {
        return { ...state, countries: action?.payload, error: null }
    });

    builder.addCase(GET_STATE_SUCCESS, (state: any, action: any) => {
        return { ...state, states: action?.payload, error: null }
    });

    builder.addCase(GET_CITY_SUCCESS, (state: any, action: any) => {
        return { ...state, cities: action?.payload, error: null }
    });

    builder.addCase(GET_ROLE_SUCCESS, (state: any, action: any) => {
        return { ...state, roles: action?.payload, error: null }
    });

    builder.addCase(GET_COUNTRY_FAIL, (state: any, action: any) => {
        return { ...state, error: action?.payload?.message }
    });

    builder.addCase(GET_STATE_FAIL, (state: any, action: any) => {
        return { ...state, error: action?.payload?.message }
    });

    builder.addCase(GET_CITY_FAIL, (state: any, action: any) => {
        return { ...state, error: action?.payload?.message }
    });

    builder.addCase(GET_ROLE_FAIL, (state: any, action: any) => {
        return { ...state, error: action?.payload?.message }
    });
});