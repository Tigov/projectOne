package com.revature.models.dtos;



import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class IncomingReimbDTO {

    private int userId;

    private String description;

    private double amount;

    private String status; //always pending by default

}
