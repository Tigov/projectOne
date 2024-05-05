import { useEffect, useState } from "react"
import { Button } from "react-bootstrap";
import { ReimbInterface } from "../../interfaces/ReimbInterface";
import "../Login/Login.css"
import { useNavigate } from "react-router-dom";
import axios from "axios";



export const CreateReimb: React.FC = () => {

    const [amountNumberInput, setAmountNumberInput] = useState("");
    const [descInput, setDescInput] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const[newReimb, setReimb] = useState<ReimbInterface>({
        amount:0,
        description:"",
        status:"PENDING"
    })

    const navigate = useNavigate();
    useEffect(() => {
         if(sessionStorage.getItem("userRole") !== "employee" && sessionStorage.getItem("userRole") !== "manager" ){
            navigate("/login");
            return;
        }
    })
    const storeValues = (input:any) => {
        if(input.target.name === "amount"){
            setAmountNumberInput(input.target.value);
            setReimb((reimb) => ({...reimb, amount:input.target.value}))
        }
        else if (input.target.name === "description") {
            setDescInput(input.target.value);
            setReimb((reimb) => ({...reimb, description:input.target.value}))
        }
        
    }
    const createSubmit = async() => {
        const regex = /^[0-9]*\.?[0-9]*$/;
        if(!regex.test(amountNumberInput)){
            setErrorMessage("Invalid input. Please enter only decimal numbers for the amount.");
            setTimeout(() => {
                setErrorMessage("");
            }, 3000);
            return;
        }
        if (descInput.toString().length == 0){
            setErrorMessage("Please provide a description.");
            setTimeout(() => {
                setErrorMessage("");
            }, 3000);
            return;
        }
        const response = await axios.post("http://localhost:8080/reimb", newReimb, {withCredentials:true})
        .then(response => {navigate("/dashboard")})
        .catch((error) =>{
            setErrorMessage(error.response.data);
            setTimeout(() => {
                setErrorMessage("");
            }, 3000);
        });
    }
    
    return(
    <div className="login bg-light text-dark d-flex justify-content-center align-items-center vh-100">
        {errorMessage && <div className="alert alert-warning errorMessage">{errorMessage}</div>}
        <div className="card text-container p-5">
            <h1 className="text-primary ">Create Reimbursement</h1>
            <div className="input-container my-4">
                <input required type="text" maxLength={30}  placeholder="1000" name="amount" className="form-control mb-3" onChange={storeValues}/>
                <input required type="text" maxLength={30} placeholder="New Description" name="description" className="form-control  mb-3" onChange={storeValues}/>
            </div>
            <Button className="mb-3" onClick={createSubmit}>Submit</Button>
            <Button  className="btn btn-secondary" onClick={() => navigate("/dashboard")}>Cancel</Button>
        </div>
    </div>

    )
}