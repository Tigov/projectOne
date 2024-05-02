import { useNavigate } from "react-router-dom"
import "./Login.css"
import { useState } from "react";
import { UserInterface } from "../../interfaces/UserInterface";
import axios from "axios";


export const Login: React.FC = () => {


    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");

    const[user, setUser] = useState<UserInterface>({
        username:"",
        password:""
    })

    const storeValues = (input:any) => {
        let passwordStore:string = "";
        if(input.target.name === "username"){
            setUser((user) => ({...user, username:input.target.value}))
        }
        else if (input.target.name === "password") {
            setUser((user) => ({...user, password:input.target.value}))
            passwordStore = user.password;
        }
    }
    
    const loginSubmit = async() => {
       
        const response = await axios.post("http://localhost:8080/users/login", user, {withCredentials:true})
        .then(response => {navigate("/reimb")})
        .catch((error) =>{
            console.log(error)
            setErrorMessage(error.response.data);
            setTimeout(() => {
                setErrorMessage("");
            }, 2000);
        });
    
    }


    return (
        <div className="login bg-light text-dark d-flex justify-content-center align-items-center vh-100">
            {errorMessage && <div className="alert alert-warning errorMessage">{errorMessage}</div>}
            <div className="card text-container p-5">
                <h1 className="text-primary" >Login</h1>
                <div className="input-container">
                    <input type="text" placeholder="Username" name="username" className="form-control mb-3 " onChange={storeValues} required/>
                    <input type="password" placeholder="Password" name="password" className="form-control mb-3" onChange={storeValues} required />
                </div>
                <div className="button-container">
                    <button className="btn btn-primary w-100 " onClick={loginSubmit}>Login</button>
                    <button className="btn btn-secondary w-100" onClick={() => navigate("/register")}>Register</button>
                </div>
            </div>
        </div>
    )


}
