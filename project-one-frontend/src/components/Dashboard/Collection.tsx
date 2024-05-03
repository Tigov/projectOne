import { useEffect, useState } from "react"
import { Reimb } from "../Reimb/Reimb"
import { ReimbInterface } from "../../interfaces/ReimbInterface"
import axios from "axios"
import "./Collection.css"

export const Collection: React.FC = () => {

    const[reimbArr, setReimbArr] = useState<ReimbInterface[]>([])

    useEffect(() => {
        getAllReimb();
    },[])
    const getAllReimb = async () => {
        const response = await axios.get("http://localhost:8080/reimb", {withCredentials:true});
        setReimbArr(response.data);
        console.log(response);
    }
    return(
        <div className="container text-center ">
            <div className="bg-light">
                <div className="bg-dark text-light w-100 d-flex justify-content-between p-1">
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Status</th>
                </div>
                <div className="d-flex flex-column">
                    {reimbArr.map((reimb, index) => 
                        <div><Reimb {...reimb }/><hr className="m-0"></hr></div>
                    )}
                </div>
            </div>
        </div>
    )
}

//https://mui.com/material-ui/react-table/