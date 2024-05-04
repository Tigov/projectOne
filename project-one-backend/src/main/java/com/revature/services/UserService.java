package com.revature.services;

import com.revature.daos.ReimbDAO;
import com.revature.daos.UserDAO;
import com.revature.models.Reimbursement;
import com.revature.models.User;
import com.revature.models.dtos.IncomingUserDTO;
import com.revature.models.dtos.OutgoingReimbDTO;
import com.revature.models.dtos.OutgoingUserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

import java.util.Optional;

@Service
public class UserService {
    private UserDAO userDAO;
    private ReimbDAO reimbDAO;

    @Autowired
    public UserService(UserDAO userDAO, ReimbDAO reimbDAO) {
        this.userDAO = userDAO;
        this.reimbDAO = reimbDAO;
    }


    //create a user from a given user from the frontend
    public User createUser(IncomingUserDTO userDTO){
        Optional<User> found = userDAO.findById(userDTO.getUserId());
        if(found.isEmpty()){ //if user does not exist, create one
            //Check the username and password are not empty/null
            if(userDTO.getUsername().isBlank()){
                throw new IllegalArgumentException("Username cannot be empty.");
            }
            if(userDTO.getPassword().isBlank()){
                throw new IllegalArgumentException("Password cannot be empty.");
            }
            if(userDAO.findByUsername(userDTO.getUsername()) != null){ //username is unique
                throw new IllegalArgumentException("That username already exists.");
            }

            User newUser= new User(userDTO.getFirstName(), userDTO.getLastName(), userDTO.getUsername(), userDTO.getPassword(), userDTO.getRole());
            //save the user to the database and return that user at the same time
            return userDAO.save(newUser);
        }
        User foundUser = found.get();
        //if user already exists (update it)
        if(foundUser.getUsername().isBlank()){
            throw new IllegalArgumentException("Username cannot be empty.");
        }
        if(!userDTO.getUsername().equals(foundUser.getUsername())){
            foundUser.setUsername(userDTO.getUsername());
        }
        if(!userDTO.getFirstName().equals(foundUser.getFirstName())){
            foundUser.setFirstName(userDTO.getFirstName());
        }
        if(!userDTO.getLastName().equals(foundUser.getLastName())){
            foundUser.setLastName(userDTO.getLastName());
        }
        userDTO.setPassword(foundUser.getPassword());
        //if other inputs are not inputted, keep everything the same.
        User newUser= new User(foundUser.getUserId(), foundUser.getFirstName(), foundUser.getLastName(), foundUser.getUsername(), foundUser.getPassword(), foundUser.getRole());
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


    public List<OutgoingReimbDTO> getUsersReimb(int userId) {
        Optional<User> optUser = userDAO.findById(userId);
        if (optUser.isEmpty()){
            throw new IllegalArgumentException("That user does not exist.");
        }
        List<Reimbursement> allReimb =  optUser.get().getAllReimbursements();
        List<OutgoingReimbDTO> allReturned = new ArrayList<>();

        for (Reimbursement r : allReimb) {
            OutgoingReimbDTO outgoing = new OutgoingReimbDTO(r.getReimbId(),r.getUserId(),r.getAmount(),r.getDescription(),r.getStatus());
            allReturned.add(outgoing);
        }
        return allReturned;
    }


    public List<OutgoingReimbDTO> getUsersPendingReimb(int userId){
        List<Reimbursement> allPending = reimbDAO.findByUserUserIdAndStatus(userId, "pending");
        List<OutgoingReimbDTO> allReturned = new ArrayList<>();

        for (Reimbursement r : allPending) {
            OutgoingReimbDTO outgoing = new OutgoingReimbDTO(r.getReimbId(),r.getUserId(),r.getAmount(),r.getDescription(),r.getStatus());
            allReturned.add(outgoing);
        }
        return allReturned;
    }

    public List<OutgoingUserDTO> getAll(){
        List<User> allUsers = userDAO.findAll();
        List<OutgoingUserDTO> allReturned = new ArrayList<>();

        for (User u : allUsers) {
            OutgoingUserDTO outgoing = new OutgoingUserDTO(u.getUserId(),u.getFirstName(),u.getLastName(),u.getUsername(),u.getRole());
            allReturned.add(outgoing);
        }
        return allReturned;
    }


    public String deleteUser(int userId){
        Optional<User> u = userDAO.findById(userId);
        if (u.isEmpty()){
            throw new IllegalArgumentException("That user does not exist.");
        }
        userDAO.deleteById(userId);
        return u.get().getUsername(); //return the username of the deleted user for response messaging
    }

    public OutgoingUserDTO getUser(int userId){
        Optional<User> u = userDAO.findById(userId);
        if(u.isEmpty()){
            throw new IllegalArgumentException("That user does not exist.");
        }
        User user = u.get();
        return new OutgoingUserDTO(user.getUserId(),user.getFirstName(),user.getLastName(),user.getUsername(),user.getRole());
    }

}
