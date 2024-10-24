import { GET_CITY_FAIL, GET_CITY_SUCCESS, GET_COUNTRY_FAIL, GET_COUNTRY_SUCCESS, GET_ROLE_FAIL, GET_ROLE_SUCCESS, GET_STATE_SUCCESS } from "redux/constant/dropdownConstant";
import { getApi } from "service/GlobleApi"


export const fetchCountries = async (dispatch: (action: any) => void) => {
    try {

        const response = await getApi('get-country');
        dispatch({ type: GET_COUNTRY_SUCCESS, payload: response?.data });

    } catch (error: any) {
        dispatch({ type: GET_COUNTRY_FAIL, payload: error.response.data.message });
    }
};

export const fetchStates = async (dispatch: (action: any) => void) => {
    try {

        const response = await getApi('get-allState');
        dispatch({ type: GET_STATE_SUCCESS, payload: response?.data });

    } catch (error: any) {
        dispatch({ type: GET_COUNTRY_FAIL, payload: error.response.data.message });
    }
};

export const fetchCities = async (dispatch: (action: any) => void) => {
    try {

        const response = await getApi('get-allCities');
        dispatch({ type: GET_CITY_SUCCESS, payload: response?.data });

    } catch (error: any) {
        dispatch({ type: GET_CITY_FAIL, payload: error.response.data.message });
    }
};

export const fetchRoles = async (dispatch: (action: any) => void) => {
    try {

        const response = await getApi('get-role');
        dispatch({ type: GET_ROLE_SUCCESS, payload: response?.data });

    } catch (error: any) {
        dispatch({ type: GET_ROLE_FAIL, payload: error.response.data.message });
    }
}
