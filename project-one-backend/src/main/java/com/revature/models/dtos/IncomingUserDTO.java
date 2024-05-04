package com.revature.models.dtos;

import lombok.*;

//the user we recieve from the front end
//should not send unnecessary info
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class IncomingUserDTO {

    private String firstName;
    private String lastName;
    private String username;
    private String password;
    private String role; //by defualt this will be "employee", the only other role is manager
    private int userId;

}
