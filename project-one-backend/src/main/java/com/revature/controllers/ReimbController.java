package com.revature.controllers;


import com.revature.daos.ReimbDAO;
import com.revature.daos.UserDAO;
import com.revature.models.dtos.IncomingReimbDTO;
import com.revature.models.Reimbursement;
import com.revature.services.ReimbService;
import com.revature.services.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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


    @GetMapping
    public ResponseEntity<List<Reimbursement>> getAllReimb() {
        return ResponseEntity.ok(reimbDAO.findAll());
    }

    @GetMapping("/pending")
    public ResponseEntity<List<Reimbursement>> getAllPending(){
        return ResponseEntity.ok(reimbDAO.findByStatus("Pending"));
    }

    @PostMapping("")
    public ResponseEntity<?> createReimb(@RequestBody IncomingReimbDTO reimbDTO, HttpSession session){
        if (session.getAttribute("userId") == null) {
            return ResponseEntity.status(401).body("You must login.");
        }

        try {
            reimbDTO.setUserId((int)session.getAttribute("userId")); //get the current user and set to this reimb
            Reimbursement r = reimbService.createRiemb(reimbDTO);
            return ResponseEntity.status(201).body(r);
        }
        catch(Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PatchMapping("/{reimbId}")
    public ResponseEntity<Reimbursement> updateReimbStatus(@RequestBody String newStatus, @PathVariable int reimbId) {
        Optional<Reimbursement> r = reimbDAO.findById(reimbId);
        if (r.isEmpty()) return ResponseEntity.notFound().build();
        Reimbursement found = r.get();
        found.setStatus(newStatus);
        return ResponseEntity.status(202).body(reimbDAO.save(found));
    }
}
