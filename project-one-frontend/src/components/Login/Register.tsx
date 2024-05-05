import { useNavigate } from "react-router-dom"
import "./Login.css"
import { useState } from "react";
import { UserInterface } from "../../interfaces/UserInterface";
import axios from "axios";


export const Register: React.FC = () => {
    let confirmPassword = "";
    const[user, setUser] = useState<UserInterface>({
        username: "",
        password: "",
        role:"employee",
        firstName: "",
        lastName: "",
    });

    const [errorMessage, setErrorMessage] = useState("");


    const navigate = useNavigate();

    const storeValues = (input:any) => {
        let passwordStore:string = "";
        if(input.target.name === "username"){
            setUser((user) => ({...user, username:input.target.value}))
        }
        else if (input.target.name === "password") {
            setUser((user) => ({...user, password:input.target.value}))
            passwordStore = user.password;
        }
        else if(input.target.name === "firstName"){
            setUser((user) => ({...user, firstName:input.target.value}))
        }
        else if(input.target.name === "lastName"){
            setUser((user) => ({...user, lastName:input.target.value}))
        }
        else if (input.target.name === "confirmPassword") {
            confirmPassword = input.target.value;
        }
    }
 
    const registerSubmit = async() => {
        if (confirmPassword != user.password) {
            setErrorMessage("Passwords must match.");
            setTimeout(() => {
                setErrorMessage("");
            }, 3000);
            return;
        }
        const response = await axios.post("http://localhost:8080/users", user, {withCredentials:true})
        .then(response => {navigate("/login")})
        .catch((error) =>{
            setErrorMessage(error.response.data);
            setTimeout(() => {
                setErrorMessage("");
            }, 3000);
        });
    
    }

    return (
        <div className="login bg-light text-dark d-flex justify-content-center align-items-center vh-100">
            {errorMessage && <div className="alert alert-warning errorMessage">{errorMessage}</div>}
            <div className="card text-container p-5">
                <h1 className="text-primary ">Register</h1>

                <div className="input-container my-4">
                    <input type="text" placeholder="First Name" name="firstName" className="form-control mb-3" onChange={storeValues}/>
                    <input type="text" placeholder="Last Name" name="lastName" className="form-control  mb-3" onChange={storeValues}/>
                    <input type="text" placeholder="Username" name="username" className="form-control mb-3" required onChange={storeValues}/>
                    <input type="password" placeholder="Password" name="password" className="form-control mb-3"  required onChange={storeValues}/>
                    <input type="password" placeholder="Confirm Password" name="confirmPassword" className="form-control " onChange={storeValues} required/>
                </div>
                <div className="button-container">
                    <button className="btn btn-primary w-100" onClick={registerSubmit}>Submit</button>
                    <button className="btn btn-secondary w-100 " onClick={() => navigate("/login")}>Back</button>
                </div>
            </div>
        </div>
    )

}
