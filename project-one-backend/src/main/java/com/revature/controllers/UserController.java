package com.revature.controllers;

import com.revature.daos.ReimbDAO;
import com.revature.daos.UserDAO;
import com.revature.models.Reimbursement;
import com.revature.models.User;
import com.revature.models.dtos.IncomingUserDTO;
import com.revature.models.dtos.OutgoingUserDTO;
import com.revature.services.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
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

    //method to get all users, only managers can do this
    @GetMapping
    public ResponseEntity<?> getAllUsers(HttpSession session){
        if (session.getAttribute("userId") == null) {
            return ResponseEntity.status(401).body("You must login.");
        }
        int userId = (int)session.getAttribute("userId");
        User current = userDAO.findById(userId).get();

        if(!current.getRole().equals( "manager")){
            return ResponseEntity.status(401).body("You are not authorized to view this data.");
        }
        return ResponseEntity.ok(userService.getAll());
    }

    //method to get all of the current logged in users reimbs
    @GetMapping("/reimb")
    public ResponseEntity<?> getAllUserReimb(HttpSession session) {
        if (session.getAttribute("userId") == null) {
            return ResponseEntity.status(401).body("You must login.");
        }
        int userId = (int)session.getAttribute("userId");

        try{
            return ResponseEntity.ok(userService.getUsersReimb(userId));
        }
        catch(Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @GetMapping("/reimb/{userId}") //get another persons reimbs
    public ResponseEntity<?> getAUsersReimb(@PathVariable int userId, HttpSession session) {
        if (session.getAttribute("userId") == null) {
            return ResponseEntity.status(401).body("You must login.");
        }
        try{
            return ResponseEntity.ok(userService.getUsersReimb(userId));
        }
        catch(Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{userId}") //get a users information
    public ResponseEntity<?> getUser(@PathVariable int userId, HttpSession session) {
        if (session.getAttribute("userId") == null) {
            return ResponseEntity.status(401).body("You must login.");
        }
        try{
            return ResponseEntity.ok(userService.getUser(userId));
        }
        catch(Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    //method to get all of the current logged in user's pending reimbs, user must be logged in
    @GetMapping("/reimb/pending")
    public ResponseEntity<?> getAllUserPending(HttpSession session) {
        if (session.getAttribute("userId") == null) {
            return ResponseEntity.status(401).body("You must login.");
        }
        int userId = (int)session.getAttribute("userId");

        try{
            return ResponseEntity.ok(userService.getUsersPendingReimb(userId));
        }
        catch(Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    //Get another users pending reimbs
    @GetMapping("/reimb/pending/{userId}")
    public ResponseEntity<?> getAllOtherUserPending(@PathVariable int userId ,HttpSession session) {
        if (session.getAttribute("userId") == null) {
            return ResponseEntity.status(401).body("You must login.");
        }
        try{
            return ResponseEntity.ok(userService.getUsersPendingReimb(userId));
        }
        catch(Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    //method to create a user, they do not need to login for this
    @PostMapping
    public ResponseEntity<String> createUser(@RequestBody IncomingUserDTO userDTO){
        try{
            userService.createUser(userDTO);
            return ResponseEntity.status(201).body(userDTO.getUsername() + " was created.");
        }
        catch(Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    //method to login the user and set the session information.
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody IncomingUserDTO userDTO, HttpSession session){
        try {
            User user = userService.loginUser(userDTO);
            session.setAttribute("userId", user.getUserId());
            session.setAttribute("username", user.getUsername());
            session.setAttribute("role", user.getRole());
            return ResponseEntity.ok(new OutgoingUserDTO(user.getUserId(), user.getFirstName(), user.getLastName(), user.getUsername(), user.getRole()));
        }
        catch(Exception e){
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    @PatchMapping("/{userId}")
    public ResponseEntity<?> updateUserRole(@RequestBody String newRole, @PathVariable int userId, HttpSession session){
        if (session.getAttribute("userId") == null) {
            return ResponseEntity.status(401).body("You must login.");
        }
        User curUser = userDAO.findById((int)session.getAttribute("userId")).get();
        if (!curUser.getRole().equals("manager")){
            return ResponseEntity.status(401).body("You must be a manager to update roles.");
        }
        if (userId == curUser.getUserId()){
            return ResponseEntity.badRequest().body("You cannot update your own role.");
        }
        Optional<User> u = userDAO.findById(userId);
        if (u.isEmpty()) return ResponseEntity.notFound().build();

        User found = u.get();
        found.setRole(newRole);
        found = userDAO.save(found);
        return ResponseEntity.status(202).body(found);
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable int userId, HttpSession session){
        if (session.getAttribute("userId") == null) {
            return ResponseEntity.status(401).body("You must login.");
        }
        int loggedInUserId = (int)session.getAttribute("userId");
        if (loggedInUserId == userId){
            return ResponseEntity.badRequest().body("You cannot delete your own account.");
        }
        try {
            return ResponseEntity.ok(userService.deleteUser(userId) + " was deleted.");
        }
        catch(Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
