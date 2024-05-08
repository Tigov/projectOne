import { useEffect, useState } from "react"
import axios from "axios"
import { Button, Table } from "react-bootstrap"
import "../Login/Login.css"
import { Link, useNavigate, useParams } from "react-router-dom"
import { ReimbInterface } from "../../interfaces/ReimbInterface"


export const AllUserPending: React.FC = () => {
    const { userId } = useParams();
    const [errorMessage, setErrorMessage] = useState("");
    const[pendingReimbs, setPendingReimbs] = useState<ReimbInterface[]>([])

    const navigate = useNavigate();
    useEffect(() => {
        if(sessionStorage.getItem("userRole") !== "manager"){
            navigate("/login");
            return;
        }
        getAllPendingReimbs();
    },[])
    const getAllPendingReimbs = async () => {
        const response = await axios.get(`http://localhost:8080/users/reimb/pending/${userId}`, {withCredentials:true});
        const sortedData = response.data.sort((a: ReimbInterface, b: ReimbInterface) => {
        if (a.reimbId && b.reimbId) {
                return a.reimbId - b.reimbId;
            } else {
                return 0;
            }
        });
        setPendingReimbs(response.data);
    }

    const handleApprove = async (id:number) => {
        try {
            const response = await axios.patch(`http://localhost:8080/reimb/${id}`, "APPROVED", { withCredentials: true, headers: { 'Content-Type': 'text/plain' } });
            if (response.status === 200) {
                getAllPendingReimbs();
            }
        } catch (error) {
            if (error instanceof Error) {
                console.log(error);
                setErrorMessage(error.message);
            } else {
                console.log(error);
            }
        }
    }

    const handleDeny = async (id:number) => {
        try {
            const response = await axios.patch(`http://localhost:8080/reimb/${id}`, "DENIED", { withCredentials: true, headers: { 'Content-Type': 'text/plain' } });
            if (response.status === 200) {
                getAllPendingReimbs();
            }
        } catch (error:any) {
            if (error) {
                setErrorMessage(error.response.data);
                setTimeout(() => {
                    setErrorMessage("");
                }, 3000);
            } else {
                console.log(error);
            }
        }
    }

    const handleDelete = async (id:number) => {
        try{
            const response = await axios.delete("http://localhost:8080/reimb/" + id, {withCredentials:true})
            getAllPendingReimbs();
        }
        catch(error:any){
            if(error){
                setErrorMessage(error.response.data);
                setTimeout(() => {
                    setErrorMessage("");
                }, 3000);
            }
            else{
                console.log(error);
            }
        }
    }


    return(
        <div style={{margin:"8rem"}} className="d-flex flex-column justify-content-center align-items-center bg-light">
            <Link style={{position:"absolute", top:"30px",left:"20px"}} to={"/login"}>
                <Button>Logout</Button>
            </Link>
            <h3 style={{ textAlign:"center"}}><strong>Pending Reimbursements</strong></h3>
            <div style={{width:"100%",  backgroundColor:"white", overflow: 'auto', maxHeight: '63vh'}}> 
                {errorMessage && <div className="alert alert-warning errorMessage">{errorMessage}</div>}
                    <Table striped bordered hover size="sm" style={{margin:"2rem", maxWidth:"1728px"}}>
                        <thead >
                            <tr>
                                <th style={{width: '33%'}}>Description</th>
                                <th style={{width: '33%'}}>Amount</th>
                                <th style={{width: '15%'}}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingReimbs && pendingReimbs.length > 0 ? 
                            pendingReimbs.map((reimb, index) => 
                                <tr>
                                    <td style={{wordWrap: 'break-word'}}>
                                        {reimb.description}
                                    </td>
                                    <td style={{wordWrap: 'break-word'}}>
                                        {reimb.amount}
                                    </td>
                                    <td style={{wordWrap: 'break-word'}}>
                                        <Button className="btn btn-success" onClick={() => handleApprove(reimb.reimbId as number)}> Approve </Button>
                                        &nbsp;
                                        <Button className="btn btn-secondary"  onClick={() => handleDeny(reimb.reimbId as number)}> Deny </Button>
                                        &nbsp;
                                        <Button className="btn btn-danger"  onClick={() => handleDelete(reimb.reimbId as number)}> Delete </Button>
                                    </td>
                                </tr>
                            ): "No data avaliable."}
                        </tbody>
                    </Table>
                <br />
            </div>
        </div>
    )
}

