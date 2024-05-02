package com.revature.services;

import com.revature.daos.ReimbDAO;
import com.revature.daos.UserDAO;
import com.revature.models.dtos.IncomingReimbDTO;
import com.revature.models.Reimbursement;
import com.revature.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
}
