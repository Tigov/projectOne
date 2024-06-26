import { useEffect, useState } from "react"
import axios from "axios"
import { Button, Table } from "react-bootstrap"
import "../Login/Login.css"
import { Link, useNavigate } from "react-router-dom"
import { UserInterface } from "../../interfaces/UserInterface"


export const AllUsers: React.FC = () => {

    const [errorMessage, setErrorMessage] = useState("");
    const[usersArr, setUsers] = useState<UserInterface[]>([])
    const navigate = useNavigate();
    useEffect(() => {
        if(sessionStorage.getItem("userRole") !== "manager"){
            navigate("/login");
            return;
        }
        getAllUsers();
    },[])
    const getAllUsers = async () => {
        const response = await axios.get("http://localhost:8080/users", {withCredentials:true});
        const sortedData = response.data.sort((a: UserInterface, b: UserInterface) => {
        if (a.userId && b.userId) {
                return a.userId - b.userId;
            } else {
                return 0;
            }
        });
        setUsers(response.data);
    }


    const handleDelete = async (id:number) => {
        try{
            const response = await axios.delete("http://localhost:8080/users/" + id, {withCredentials:true})
            getAllUsers();
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

    const handleRoleChange = async (userId: number, newRole: string) => {
        try {
            const response = await axios.patch(`http://localhost:8080/users/${userId}`, newRole, { withCredentials: true, headers: { 'Content-Type': 'text/plain' } });
            if (response.status === 202) {
                // Find the index of the updated user in usersArr
                const index = usersArr.findIndex(user => user.userId === userId);
                // Create a new array with the updated user
                const newUsersArr = [...usersArr];
                newUsersArr[index] = { ...newUsersArr[index], role: newRole };
                // Update the state
                setUsers(newUsersArr);
            }
        } catch(error:any){
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
    };


    return(
        <div style={{margin:"2rem"}}>
            {errorMessage && <div className="alert alert-warning errorMessage">{errorMessage}</div>}
            <Table striped bordered hover size="sm" >
                <thead >
                    <tr>
                        <th style={{width: '20%'}}>First Name</th>
                        <th style={{width: '20%'}}>Last Name</th>
                        <th style={{width: '20%'}}>Username</th>
                        <th style={{width: '20%'}}>Role</th>
                        <th style={{width: '15%'}}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {usersArr && usersArr.length > 0 ? 
                    usersArr.map((user, index) => 
                        <tr>
                            <td style={{wordWrap: 'break-word'}}>
                                {user.firstName}
                            </td>
                            <td style={{wordWrap: 'break-word'}}>
                                {user.lastName}
                            </td>
                            <td style={{wordWrap: 'break-word'}}>
                                {user.username}
                            </td>
                             <td style={{wordWrap: 'break-word'}}>
                                <select value={user.role} onChange={(e) => handleRoleChange(user.userId as number, e.target.value)}>
                                    <option value="employee">Employee</option>
                                    <option value="manager">Manager</option>
                                </select>
                            </td>
                            <td style={{wordWrap: 'break-word'}}>
                                <Link to={`/edit-user/${user.userId}`}>
                                    <Button className="btn btn-secondary"> Edit </Button>
                                </Link>
                                &nbsp;
                                <Link to={`/allUserPending/${user.userId}`}>
                                    <Button> Pending </Button>
                                </Link>
                                &nbsp;
                                <Button  className="btn btn-danger" onClick={() => handleDelete(user.userId as number)}> Delete </Button>
                            </td>
                        </tr>
                    ): "No data avaliable."}
                </tbody>
            </Table>
            <br />
        </div>
    )
}

