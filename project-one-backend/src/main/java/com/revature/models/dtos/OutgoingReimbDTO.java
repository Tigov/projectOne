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
    private double amount;
    private String description;
    private String status;
}
