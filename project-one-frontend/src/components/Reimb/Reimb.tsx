import axios from "axios"
import { useEffect, useState } from "react"
import { ReimbInterface } from "../../interfaces/ReimbInterface"
import "../Dashboard/Collection.css"
//these are the reimbursment object rows themselves
//
export const Reimb: React.FC<ReimbInterface> = (incomingReimb) =>{

    //  reimbId?:number,
    // description?:string,
    // amount:number,
    // status:string
    const[reimb, setReimb] = useState<ReimbInterface>({
        reimbId: -1,
        description: "",
        amount: 0,
        status: "pending"
    })

    useEffect(() => {
        setReimb({
            reimbId: incomingReimb.reimbId,
            description: incomingReimb.description,
            amount: incomingReimb.amount,
            status: incomingReimb.status
        })
    }, [])

    return(
        <div >
            <div className=" d-flex justify-content-left">
            <div className="" style={{ width: '65%', textAlign: 'left' , paddingLeft:10}}>{reimb.description}</div>
            <div style={{ width: '33%', textAlign: 'left' }}>{reimb.amount}</div>
            <div style={{ width: '33%', textAlign: 'right', paddingRight:10 }}>{reimb.status}</div>
                {/* only show button if they are a manager (role in sessionStorage)
                <button className="btn btn-primary mr-2">Approve</button>
                <button className="btn btn-info">Deny</button> */}
            </div>
        </div>

    )
}