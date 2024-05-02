package com.revature.models.dtos;


import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class OutgoingUserDTO {

    private int userId;

    private String firstName;
    private String lastName;
    private String username;
    private String role;
}
