package com.revature.models.dtos;


import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class OutgoingReimbDTO {
//    reimbId?:number,
//    description?:string,
//    amount:number,
//    status:string
    private int reimbId;
    private int userId;
    private String username;
    private double amount;
    private String description;
    private String status;

    //r.getReimbId(),r.getUserId(),r.getAmount(),r.getDescription(),r.getStatus()
    public OutgoingReimbDTO(int reimbId, int userId, double amount, String desc, String status, String username){
        this.reimbId= reimbId;
        this.userId=userId;
        this.amount =amount;
        this.description=desc;
        this.status=status;
        this.username=username;
    }
}
