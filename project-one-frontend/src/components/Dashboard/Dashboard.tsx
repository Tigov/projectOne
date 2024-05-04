import { Button, Navbar } from "react-bootstrap"
import { Collection } from "./Collection"
import { useEffect, useState } from "react"
import { AllUsers } from "./AllUsers";
import { Link } from "react-router-dom";
export const Dashboard: React.FC = () => {

    const[role,setRole] = useState<string>("employee");


    useEffect(() => {
        setRole(sessionStorage.getItem("userRole") as string);
    },[])

    if(role == "employee"){
        return (
            <div style={{margin:"8rem"}} className="d-flex flex-column justify-content-center align-items-center bg-light">
                <h3 style={{ textAlign:"center",marginTop:"5rem", marginLeft:"10rem",  marginRight:"10rem"}}><strong>Your Reimbursements</strong></h3>
                <div style={{width:"100%", backgroundColor:"white"}}>
                    <div style={{width:"100%", backgroundColor:"white", overflow: 'auto', maxHeight: '68vh'}}>
                        <Collection />
                    </div>
                    <Link className="d-grid gap-2" to="/create">
                        <Button size="lg">Create</Button>
                    </Link>
                </div>
            </div>
        )
    }
    else if (role=="manager"){
        return(
            <div>
                <div style={{margin:"8rem"}} className="d-flex flex-column justify-content-center align-items-center bg-light">
                    <h3 style={{ textAlign:"center",marginTop:"5rem", marginLeft:"10rem",  marginRight:"10rem"}}><strong>All Users</strong></h3>
                    <div style={{width:"100%", backgroundColor:"white"}}>
                        <div  style={{width:"100%", backgroundColor:"white", overflow: 'auto', maxHeight: '68vh'}}>
                            <AllUsers />
                        </div>
                        <Link className="d-grid gap-2" to="/create">
                            <Button size="lg">Create</Button>
                        </Link>
                    </div>
                    
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