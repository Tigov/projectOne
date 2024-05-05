package com.revature.services;

import com.revature.daos.ReimbDAO;
import com.revature.daos.UserDAO;
import com.revature.models.dtos.IncomingReimbDTO;
import com.revature.models.Reimbursement;
import com.revature.models.User;
import com.revature.models.dtos.OutgoingReimbDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ReimbService {

    UserDAO userDAO;
    ReimbDAO reimbDAO;

    @Autowired
    public ReimbService(UserDAO userDAO, ReimbDAO reimbDAO) {
        this.userDAO = userDAO;
        this.reimbDAO = reimbDAO;
    }

    public Reimbursement createRiemb(IncomingReimbDTO reimbDTO) {
        //check the data
        if (reimbDTO.getAmount() == 0 ) { //set default values of amount to 1.00, 0 is null for integer
            throw new IllegalArgumentException("You must provide a valid amount");
        }
        if (reimbDTO.getStatus().isBlank()) {
            throw new IllegalArgumentException("You must provide a valid status");
        }

        Reimbursement r = new Reimbursement( //this reimb does not have DB properties like id, user it belongs to
                reimbDTO.getDescription(),reimbDTO.getAmount(),reimbDTO.getStatus(),null
        );

        User u = userDAO.findById(reimbDTO.getUserId()).get();
        r.setUser(u);
        return reimbDAO.save(r);
    }

    public OutgoingReimbDTO updateReimb(IncomingReimbDTO reimbDTO){
        Reimbursement found = reimbDAO.findById(reimbDTO.getReimbId()).get();
        //check the data
        if (reimbDTO.getAmount() == 0 ) { //set default values of amount to 1.00, 0 is null for integer
            throw new IllegalArgumentException("You must provide a valid amount");
        }
        if (reimbDTO.getStatus().isBlank()) {
            throw new IllegalArgumentException("You must provide a valid status");
        }

        found.setAmount(reimbDTO.getAmount());
        found.setDescription(reimbDTO.getDescription());
        found.setStatus(reimbDTO.getStatus());

        Reimbursement saved = reimbDAO.save(found);

        return new OutgoingReimbDTO(saved.getReimbId(), saved.getUserId(), saved.getAmount(), saved.getDescription(),saved.getStatus(),saved.getUser().getUsername());
    }

    public List<OutgoingReimbDTO> getAll(){
        List<Reimbursement> allReimb = reimbDAO.findAll();
        List<OutgoingReimbDTO> allReturned = new ArrayList<>();

        for (Reimbursement r : allReimb) {
            OutgoingReimbDTO outgoing = new OutgoingReimbDTO(r.getReimbId(),r.getUserId(),r.getAmount(),r.getDescription(),r.getStatus(),r.getUser().getUsername());
            allReturned.add(outgoing);
        }
        return allReturned;
    }


    public List<OutgoingReimbDTO> getAllForUser(int userId){
        if(userDAO.findById(userId).isEmpty()){
            throw new IllegalArgumentException("That user does not exist.");
        }
        List<Reimbursement> allReimb = reimbDAO.findAllByUserUserId((userId));
        List<OutgoingReimbDTO> allReturned = new ArrayList<>();

        for (Reimbursement r : allReimb) {
            OutgoingReimbDTO outgoing = new OutgoingReimbDTO(r.getReimbId(),r.getUserId(),r.getAmount(),r.getDescription(),r.getStatus(),r.getUser().getUsername());
            allReturned.add(outgoing);
        }
        return allReturned;
    }

    public List<OutgoingReimbDTO> getAllPending(){
        List<Reimbursement> allReimb = reimbDAO.findByStatus("PENDING");
        List<OutgoingReimbDTO> allReturned = new ArrayList<>();

        for (Reimbursement r : allReimb) {
            OutgoingReimbDTO outgoing = new OutgoingReimbDTO(r.getReimbId(),r.getUserId(),r.getAmount(),r.getDescription(),r.getStatus(),r.getUser().getUsername());
            allReturned.add(outgoing);
        }
        return allReturned;
    }

    public OutgoingReimbDTO updateStatus(int reimbId, String newStatus){
        Optional<Reimbursement> r = reimbDAO.findById(reimbId);
        if (r.isEmpty()) {
            throw new IllegalArgumentException("That reimbursement doesn't exist.");
        }
        if(!(newStatus.equals("APPROVED") || newStatus.equals("DENIED"))){
            throw new IllegalArgumentException("Status must be only APPROVED or DENIED.");
        }
        Reimbursement found = r.get();
        found.setStatus(newStatus);
        Reimbursement savedR = reimbDAO.save(found);
        return new OutgoingReimbDTO(savedR.getReimbId(), savedR.getUserId(), savedR.getAmount(), savedR.getDescription(), savedR.getStatus(),savedR.getUser().getUsername());
    }

    public String deleteReimb(int reimbId){
        Optional<Reimbursement> r = reimbDAO.findById(reimbId);
        if (r.isEmpty()){
            throw new IllegalArgumentException("That reimbursement doesn't exist.");
        }
        r.get().getUser().getAllReimbursements().remove(r.get());
        reimbDAO.deleteById(r.get().getReimbId()); //delete it
        return "Reimbursement with amount " + r.get().getAmount() + " from user " + r.get().getUser().getUsername() + " has been deleted.";
    }

    public OutgoingReimbDTO getById(int reimbId){
        Optional<Reimbursement> r = reimbDAO.findById(reimbId);
        if (r.isEmpty()){
            throw new IllegalArgumentException("That reimbursement doesn't exist.");
        }
        return new OutgoingReimbDTO(r.get().getReimbId(),r.get().getUserId(),r.get().getAmount(), r.get().getDescription(), r.get().getStatus(),r.get().getUser().getUsername());
    }
}
