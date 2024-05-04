import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserInterface } from "../../interfaces/UserInterface";
import { ReimbInterface } from "../../interfaces/ReimbInterface";
import axios from "axios";
import { Button } from "react-bootstrap";



export const EditUser: React.FC = () => {


    const { userId } = useParams();
    const [firstNameInput, setFNInput] = useState("");
    const [lastNameInput, setLNInput] = useState("");
    const [usernameInput, setUsername] = useState("");

    const [errorMessage, setErrorMessage] = useState("");


    const [newUser, setNewUser] = useState<UserInterface>({
        userId:0,
        username:"",
        firstName:"",
        lastName:"",
        role:"",
        password:""
    })

    const [usersReimbs, setUsersReimbs] = useState<ReimbInterface[]>([]);

    const getAllUserReimbs = async () => {
        console.log("Calling function here");
        try{
            const response = await axios.get(`http://localhost:8080/users/reimb/${userId}`, {withCredentials:true});
            setUsersReimbs(response.data);
            console.log(usersReimbs);
        }
        catch(error){
            console.log(error);
        }
    }

    const navigate = useNavigate();

    const storeValues = (input:any) => {
        if(input.target.name === "firstName"){
            setFNInput(input.target.value);
            setNewUser((user) => ({...user, firstName:input.target.value}))
        }
        else if (input.target.name === "lastName") {
            setLNInput(input.target.value);
            setNewUser((user) => ({...user, lastName:input.target.value}))
        }
        else if (input.target.name === "username") {
            setLNInput(input.target.value);
            setNewUser((user) => ({...user, username:input.target.value}))
        }
    }

    const getUser = async () => {
        const response = await axios.get(`http://localhost:8080/users/${userId}`, {withCredentials:true});
        let foundUser = response.data;
        setNewUser(foundUser); //set the new user with all previous entries on load.
        setFNInput(foundUser.firstName);
        setLNInput(foundUser.lastName);
        setUsername(foundUser.username);
    }

    useEffect(() => {
        getAllUserReimbs();
        getUser();
    },[])


    const submitEdit = async () => {
        try{
            const response = await axios.post("http://localhost:8080/users", newUser, {withCredentials:true});
            navigate("/dashboard");
        }
        catch(error){
            setErrorMessage(String(error));
            setTimeout(() => {
                setErrorMessage("");
            }, 2000);
            console.log(error)
            return;
        }
    }

    return (
        <div className="login bg-light text-dark d-flex justify-content-center align-items-center vh-100">
            {errorMessage && <div className="alert alert-warning errorMessage">{errorMessage}</div>}
            <div className="card text-container p-5">
                <h1 className="text-primary ">Update Employee</h1>
                <div className="input-container my-4">
                    <input required type="text" maxLength={30} value={firstNameInput} placeholder="First Name" name="firstName" className="form-control mb-3" onChange={storeValues}/>
                    <input required type="text" maxLength={30} value={lastNameInput} placeholder="Last Name" name="lastName" className="form-control  mb-3" onChange={storeValues}/>
                    <input required type="text" maxLength={30} value={usernameInput} placeholder="Username" name="username" className="form-control  mb-3" onChange={storeValues}/>
            
                </div>
                <Button className="mb-3" onClick={submitEdit}>Update</Button>
                <Button  className="btn btn-secondary" onClick={() => navigate("/dashboard")}>Cancel</Button>

            </div>
        </div>
    )

}