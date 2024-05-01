package com.revature.controllers;


import com.revature.daos.ReimbDAO;
import com.revature.daos.UserDAO;
import com.revature.models.Reimbursement;
import com.revature.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/reimb")
public class ReimbController {

    private ReimbDAO reimbDAO;
    private UserDAO userDAO;


    @Autowired
    public ReimbController(ReimbDAO reimbDAO, UserDAO userDAO) {
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

    @PostMapping("/{userId}")
    public ResponseEntity<Reimbursement> createReimb(@RequestBody Reimbursement reimb, @PathVariable int userId){
        Optional<User> u = userDAO.findById(userId);
        if (u.isEmpty()) return ResponseEntity.notFound().build();

        reimb.setUser(u.get());

        Reimbursement r = reimbDAO.save(reimb);
        if (r == null) return ResponseEntity.badRequest().build();
        return ResponseEntity.status(201).body(r);
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
