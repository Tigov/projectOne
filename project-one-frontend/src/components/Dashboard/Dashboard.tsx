import { Button } from "react-bootstrap"
import { Collection } from "./Collection"
import { useEffect, useState } from "react"
import { AllUsers } from "./AllUsers";
import { Link, useNavigate } from "react-router-dom";

export const Dashboard: React.FC = () => {

    const[role,setRole] = useState<string>("employee");
    const navigate = useNavigate();

    useEffect(() => {
        if(sessionStorage.getItem("userRole") !== "employee" && sessionStorage.getItem("userRole") !== "manager" ){
            navigate("/login");
            return;
        }
        setRole(sessionStorage.getItem("userRole") as string);
    },[])

    if(role == "employee"){
        return (
            <div style={{margin:"8rem"}} className="d-flex flex-column justify-content-center align-items-center bg-light">
                <Link style={{position:"absolute", top:"30px",left:"20px"}} to={"/login"}>
                    <Button>Logout</Button>
                </Link>
                <h3 style={{ textAlign:"center"}}><strong>Your Reimbursements</strong></h3>
                <div style={{width:"100%", backgroundColor:"white",  maxHeight: '63vh'}}>
                    <div style={{width:"100%", backgroundColor:"white", overflow: 'auto', maxHeight: '63vh'}}>
                        <Collection />
                    </div>
                    <Link className="d-grid gap-2 mb-3" to="/create">
                        <Button size="lg">Create</Button>
                    </Link>
                </div>
            </div>
        )
    }
    else if (role=="manager"){
        return(
            <div style={{margin:"8rem"}} className="d-flex flex-column justify-content-center align-items-center bg-light">
                <Link style={{position:"absolute", top:"30px",left:"20px"}} to={"/login"}>
                    <Button>Logout</Button>
                </Link>
                <h3 style={{ textAlign:"center"}}><strong>All Users</strong></h3>
                <div style={{width:"100%", backgroundColor:"white",  maxHeight: '63vh'}}>
                    <div style={{width:"100%", backgroundColor:"white", overflow: 'auto', maxHeight: '63vh'}}>
                        <AllUsers />
                    </div>
                    <Link className="d-grid gap-2" to="/allReimbs">
                        <Button size="lg">View All Reimbursements</Button>
                    </Link>
                </div>
            </div>
        )
    }
   else{
    return(
        <div>
           No content
        </div>
    )
   }
}