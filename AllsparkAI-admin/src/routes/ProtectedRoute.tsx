import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import paths from "./paths";
// import { useSelector } from "react-redux";

const ProtectedRoute = ({ Component }: { Component: React.ReactNode }) => {
    const navigate = useNavigate();
    // const { loading, user } = useSelector((state:any) => state.authReducer);
    // console.log("loading" ,loading);
    // console.log("user" ,user);
    

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate(`${paths.login}`);
        }
    }, []);

    return (
        <>
            {Component}
        </>
    )
}

export default ProtectedRoute;