package com.credit.prediction.repository;

import com.credit.prediction.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {

    // Get all accounts of a user
    List<Account> findByUserId(Long userId);

    // Find account by account number
    Optional<Account> findByAccountNumber(String accountNumber);
}
