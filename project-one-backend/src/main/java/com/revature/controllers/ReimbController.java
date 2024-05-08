package com.revature.controllers;


import com.revature.daos.ReimbDAO;
import com.revature.daos.UserDAO;
import com.revature.models.dtos.IncomingReimbDTO;
import com.revature.models.Reimbursement;
import com.revature.models.dtos.OutgoingReimbDTO;
import com.revature.services.ReimbService;
import com.revature.services.UserService;
import jakarta.servlet.http.HttpSession;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.spec.ECField;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/reimb")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ReimbController {

    private ReimbService reimbService;
    private UserService userService;
    private ReimbDAO reimbDAO;
    private UserDAO userDAO;


    @Autowired
    public ReimbController(ReimbService reimbService, UserService userService, ReimbDAO reimbDAO, UserDAO userDAO) {
        this.reimbService = reimbService;
        this.userService = userService;
        this.reimbDAO = reimbDAO;
        this.userDAO = userDAO;
    }

    //get all reimbs in general
    @GetMapping("/manager")
    public ResponseEntity<?> getAllReimbManager(HttpSession session) {
        if (session.getAttribute("userId") == null) {
            return ResponseEntity.status(401).body("You must login.");
        }
        if (!userDAO.findById((int)session.getAttribute("userId")).get().getRole().equals("manager")) {
            return ResponseEntity.status(401).body("You are not authorized to alter this data.");
        }

        return ResponseEntity.ok(reimbService.getAll());
    }

    //get all reimbs for this user
    @GetMapping
    public ResponseEntity<?> getAllReimb(HttpSession session) {
        try{
            return ResponseEntity.ok(reimbService.getAllForUser((int)session.getAttribute("userId")));
        }
        catch(Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{reimbId}")
    public ResponseEntity<?> getReimbById(@PathVariable int reimbId, HttpSession session) {
        if (session.getAttribute("userId") == null) {
            return ResponseEntity.status(401).body("You must login.");
        }
        try{
            return ResponseEntity.ok(reimbService.getById(reimbId));
        }
        catch(Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/pending")
    public ResponseEntity<?> getAllPending(HttpSession session){
        if (session.getAttribute("userId") == null) {
            return ResponseEntity.status(401).body("You must login.");
        }
        return ResponseEntity.ok(reimbService.getAllPending());
    }

    @PostMapping
    public ResponseEntity<?> createReimb(@RequestBody IncomingReimbDTO reimbDTO, HttpSession session){
        if (session.getAttribute("userId") == null) {
            return ResponseEntity.status(401).body("You must login.");
        }

        try {
            reimbDTO.setUserId((int)session.getAttribute("userId")); //get the current user and set to this reimb
            Reimbursement r = reimbService.createRiemb(reimbDTO);
            return ResponseEntity.status(201).body("Created a reimbursement with an amount of " + r.getAmount() + " for user " + userDAO.findById((int)session.getAttribute("userId")).get().getUsername());
        }
        catch(Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping
    public ResponseEntity<?> updateEntireReimb(@RequestBody IncomingReimbDTO reimbDTO, HttpSession session){
        if (session.getAttribute("userId") == null) {
            return ResponseEntity.status(401).body("You must login.");
        }
        try{
            return ResponseEntity.ok(reimbService.updateReimb(reimbDTO));
        }
        catch(Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PatchMapping("/{reimbId}")
    public ResponseEntity<?> updateStatus(@PathVariable int reimbId,@RequestBody String newStatus, HttpSession session){
        if (session.getAttribute("userId") == null) {
            return ResponseEntity.status(401).body("You must login.");
        }
        if (!userDAO.findById((int)session.getAttribute("userId")).get().getRole().equals("manager")) {
            return ResponseEntity.status(401).body("You are not authorized to alter this data.");
        }
        try{
            return ResponseEntity.ok(reimbService.updateStatus(reimbId,newStatus));
        }
        catch(Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{reimbId}")
    public ResponseEntity<?> deleteReimb(@PathVariable int reimbId, HttpSession session) {
        if (session.getAttribute("userId") == null) {
            return ResponseEntity.status(401).body("You must login.");
        }
        try{
            return ResponseEntity.status(202).body(reimbService.deleteReimb(reimbId));
        }
        catch(Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
