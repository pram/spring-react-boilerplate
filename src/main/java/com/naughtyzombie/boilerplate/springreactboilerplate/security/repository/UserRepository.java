package com.naughtyzombie.boilerplate.springreactboilerplate.security.repository;

import com.naughtyzombie.boilerplate.springreactboilerplate.model.security.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
}
