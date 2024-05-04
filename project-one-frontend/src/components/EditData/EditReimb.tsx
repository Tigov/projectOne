import { useEffect, useState } from "react";
import { ReimbInterface } from "../../interfaces/ReimbInterface";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "react-bootstrap";



export const EditReimb: React.FC = () => {

    const { id } = useParams();
    const [amountNumberInput, setAmountNumberInput] = useState("");
    const [descInput, setDescInput] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const[newReimb, setReimb] = useState<ReimbInterface>({
        reimbId:Number(id),
        amount:0,
        description:"",
        status:"pending"
    })
// Fetch the reimbursement when the component is mounted
    useEffect(() => {
        const fetchReimb = async () => {
            const response = await axios.get(`http://localhost:8080/reimb/${id}`, {withCredentials:true});
            const reimb = response.data;
            setReimb(reimb);
            setAmountNumberInput(String(reimb.amount));
            setDescInput(reimb.description);
        };
        fetchReimb();
    }, [id]);

    const navigate = useNavigate();
    
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

    const submitEdit = async() => {
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
        const response = await axios.put("http://localhost:8080/reimb", newReimb, {withCredentials:true})
        .then(response => {navigate("/dashboard")})
        .catch((error) =>{
            setErrorMessage(error.response.data);
            setTimeout(() => {
                setErrorMessage("");
            }, 2000);
        });
    }
    
    
    return(
        <div className="login bg-light text-dark d-flex justify-content-center align-items-center vh-100">
            {errorMessage && <div className="alert alert-warning errorMessage">{errorMessage}</div>}
            <div className="card text-container p-5">
                <h1 className="text-primary ">Update Reimbursement</h1>
                <div className="input-container my-4">
                    <input required type="text" maxLength={30} value={amountNumberInput} placeholder="1000" name="amount" className="form-control mb-3" onChange={storeValues}/>
                    <input required type="text" maxLength={30} value={descInput} placeholder="New Description" name="description" className="form-control  mb-3" onChange={storeValues}/>
                </div>
                <Button className="mb-3" onClick={submitEdit}>Update</Button>
                <Button  className="btn btn-secondary" onClick={() => navigate("/dashboard")}>Cancel</Button>

            </div>
        </div>
    )
}