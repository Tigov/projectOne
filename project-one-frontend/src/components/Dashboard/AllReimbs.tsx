import { useEffect, useState } from "react"
import axios from "axios"
import { Button, Table } from "react-bootstrap"
import "../Login/Login.css"
import { ReimbInterface } from "../../interfaces/ReimbInterface"
import { Link, useNavigate } from "react-router-dom"


export const AllReimbs: React.FC = () => {
    const[allReimbs, setAllReimbs] = useState<ReimbInterface[]>([])
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if(sessionStorage.getItem("userRole") !== "manager"){
            navigate("/login");
            return;
        }
        getAllReimbs();
    },[])

    const getAllReimbs = async () => {
        const response = await axios.get(`http://localhost:8080/reimb/manager`, {withCredentials:true});
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
        setAllReimbs(response.data);
    }

    const handleDelete = async (id:number) => {
        try{
            const response = await axios.delete("http://localhost:8080/reimb/" + id, {withCredentials:true})
            getAllReimbs();
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
            <h3 style={{ textAlign:"center"}}><strong>All Reimbursements</strong></h3>
            <div style={{width:"100%",  backgroundColor:"white", overflow: 'auto', maxHeight: '63vh'}}> 
                {errorMessage && <div className="alert alert-warning errorMessage">{errorMessage}</div>}
                    <Table striped bordered hover size="sm" style={{margin:"2rem", maxWidth:"1728px"}}>
                        <thead >
                            <tr>
                                <th style={{width: '20%'}}>Username</th>
                                <th style={{width: '20%'}}>Description</th>
                                <th style={{width: '20%'}}>Amount</th>
                                <th style={{width: '20%'}}>Status</th>
                                <th style={{width: '10%'}}>Action</th>

                            </tr>
                        </thead>
                        <tbody>
                            {allReimbs && allReimbs.length > 0 ? 
                            allReimbs.map((reimb, index) => 
                                <tr>
                                    <td style={{wordWrap: 'break-word'}}>
                                        {reimb.username}
                                    </td>
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

