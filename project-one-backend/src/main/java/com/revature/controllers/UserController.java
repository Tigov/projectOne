package com.revature.controllers;

import com.revature.daos.ReimbDAO;
import com.revature.daos.UserDAO;
import com.revature.models.Reimbursement;
import com.revature.models.User;
import com.revature.models.dtos.IncomingUserDTO;
import com.revature.services.UserService;
import org.postgresql.util.PSQLException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/users")
public class UserController {

    private UserService userService;
    private ReimbDAO reimbDAO;
    private UserDAO userDAO;

    @Autowired
    public UserController(UserService userService, ReimbDAO reimbDAO, UserDAO userDAO) {
        this.userService = userService;
        this.reimbDAO = reimbDAO;
        this.userDAO = userDAO;
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers(){
        return ResponseEntity.ok(userDAO.findAll());
    }

    @GetMapping("/{userId}")
    public ResponseEntity<User> getUser(@PathVariable int userId){
        Optional<User> u = userDAO.findById(userId);
        if (u.isEmpty()) return ResponseEntity.notFound().build();

        return ResponseEntity.ok(u.get());
    }

    @GetMapping("/{userId}/reimb")
    public ResponseEntity<List<Reimbursement>> getAllUserReimb(@PathVariable int userId) {
        Optional<User> u = userDAO.findById(userId);
        if(u.isEmpty()) return ResponseEntity.notFound().build();

        return ResponseEntity.ok(u.get().getAllReimbursements());
    }

    @PostMapping
    public ResponseEntity<String> createUser(@RequestBody IncomingUserDTO userDTO){
        try{
            userService.createUser(userDTO);
            return ResponseEntity.status(201).body(userDTO.getUsername() + " was created.");
        }
        catch(IllegalArgumentException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
        catch(Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PatchMapping("/{userId}")
    public ResponseEntity<User> updateUserRole(@RequestBody String newRole, @PathVariable int userId){
        Optional<User> u = userDAO.findById(userId);
        if (u.isEmpty()) return ResponseEntity.notFound().build();

        User found = u.get();
        found.setRole(newRole);
        found = userDAO.save(found);
        return ResponseEntity.status(202).body(found);
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<User> deleteUser(@PathVariable int userId){
        Optional<User> u = userDAO.findById(userId);
        if (u.isEmpty()) return ResponseEntity.notFound().build();

        userDAO.deleteById(userId);
        return ResponseEntity.ok(u.get());
    }

}
