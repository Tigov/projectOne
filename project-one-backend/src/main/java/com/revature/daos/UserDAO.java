package com.revature.daos;

import com.revature.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserDAO extends JpaRepository<User, Integer> {
    public Optional<User> findByUsernameAndPassword(String username, String password);
    public User findByUsername(String username);
}
