import { useEffect, useState } from "react"
import { ReimbInterface } from "../../interfaces/ReimbInterface"
import axios from "axios"
import { Button, Table } from "react-bootstrap"
import "../Login/Login.css"
import { Link, useNavigate } from "react-router-dom"

export const Collection: React.FC = () => {

    const [errorMessage, setErrorMessage] = useState("");
    const[reimbArr, setReimbArr] = useState<ReimbInterface[]>([])
    const navigate = useNavigate();
    useEffect(() => {
        if(sessionStorage.getItem("userRole") !== "employee" && sessionStorage.getItem("userRole") !== "manager" ){
            navigate("/login");
            return;
        }
        getAllReimb();
    },[])
    const getAllReimb = async () => {
    const response = await axios.get("http://localhost:8080/reimb", {withCredentials:true});
    const sortedData = response.data.sort((a: ReimbInterface, b: ReimbInterface) => {
        if (a.status === "DENIED" || a.status === "APPROVED") {
            return 1;
        } else if (b.status === "DENIED" || b.status === "APPROVED") {
            return -1;
        } else if (a.reimbId && b.reimbId) {
            return a.reimbId - b.reimbId;
        } else {
            return 0;
        }
        });
        setReimbArr(sortedData);
    }

    const handleDelete = async (id:number) => {
        try{
            const response = await axios.delete("http://localhost:8080/reimb/" + id, {withCredentials:true})
            getAllReimb();
        }
        catch(error){
            if(error instanceof Error){
                console.log(error);
                setErrorMessage(error.message);
            }
            else{
                console.log(error);
            }
        }
    }

    return(
        <div style={{margin:"2rem"}}>

            {errorMessage && <div className="alert alert-warning errorMessage">{errorMessage}</div>}
        
                <Table striped bordered hover size="sm" >
                    <thead >
                        <tr>
                            <th style={{width: '25%'}}>Description</th>
                            <th style={{width: '25%'}}>Amount</th>
                            <th style={{width: '25%'}}>Status</th>
                            <th style={{width: '15%'}}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reimbArr && reimbArr.length > 0 ? 
                        reimbArr.map((reimb, index) => 
                            <tr>
                                <td style={{wordWrap: 'break-word'}}>
                                    {reimb.description}
                                </td>
                                <td style={{wordWrap: 'break-word'}}>
                                    {reimb.amount}
                                </td>
                                <td style={{wordWrap: 'break-word'}}>
                                    {reimb.status}
                                </td>
                                <td style={{wordWrap: 'break-word'}}>
                                    {reimb.status !== "APPROVED" && reimb.status !== "DENIED" && (
                                        <Link to={`/edit-reimb/${reimb.reimbId}`}>
                                            <Button className="btn btn-secondary"> Edit </Button>
                                        </Link>
                                    )}
                                    &nbsp;
                                    <Button  className="btn btn-danger" onClick={() => handleDelete(reimb.reimbId as number)}> Delete </Button>
                                </td>
                            </tr>
                        ): "No data avaliable."}
                    </tbody>
                </Table>
            <br />
        </div>
    )
}

