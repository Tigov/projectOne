package com.revature.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.stereotype.Component;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Component
@Entity
@Table(name = "reimbursements")
public class Reimbursement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int reimbId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "userId")
    @JsonBackReference
    private User user;

    private String description;

    @Column(nullable = false)
    private double amount;

    @Column(nullable = false)
    private String status;

    @Transient
    public int getUserId() {
        return this.user.getUserId();
    }


    public Reimbursement(String description, double amount, String status, User user){
        this.description= description;
        this.amount=amount;
        this.status=status;
        this.user=user;
    }


}
