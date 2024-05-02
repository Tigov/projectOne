package com.revature.services;

import com.revature.daos.UserDAO;
import com.revature.models.User;
import com.revature.models.dtos.IncomingUserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    private UserDAO userDAO;

    @Autowired
    public UserService(UserDAO userDAO) {
        this.userDAO = userDAO;
    }


    //create a user from a given user from the frontend
    public User createUser(IncomingUserDTO userDTO){
        //Check the username and password are not empty/null
        if(userDTO.getUsername().isBlank() || userDTO.getUsername() == null){
            throw new IllegalArgumentException("Username cannot be empty.");
        }
        if(userDTO.getPassword().isBlank() || userDTO.getPassword() == null){
            throw new IllegalArgumentException("Password cannot be empty.");
        }
        if(userDAO.findByUsername(userDTO.getUsername()) != null){ //username is unique
            throw new IllegalArgumentException("That username already exists.");
        }

        User newUser= new User(userDTO.getFirstName(), userDTO.getLastName(), userDTO.getUsername(), userDTO.getPassword(), userDTO.getRole());
        //save the user to the database and return that user at the same time
        return userDAO.save(newUser);
    }

    public User loginUser(IncomingUserDTO userDTO) {
        // Check for null or empty username and password
        if (userDTO.getUsername().isBlank() || userDTO.getPassword().isBlank()) {
            throw new IllegalArgumentException("Username or password cannot be empty.");
        }

        // Find user by username and password
        Optional<User> userOptional = userDAO.findByUsernameAndPassword(userDTO.getUsername(), userDTO.getPassword());

        // Check if user exists
        if (userOptional.isPresent()) {
            return userOptional.get();
        } else {
            throw new IllegalArgumentException("Invalid username or password.");
        }
    }



}
