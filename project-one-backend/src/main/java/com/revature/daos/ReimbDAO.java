package com.revature.daos;

import com.revature.models.Reimbursement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReimbDAO extends JpaRepository<Reimbursement, Integer> {
    List<Reimbursement> findByStatus(String status);
}
