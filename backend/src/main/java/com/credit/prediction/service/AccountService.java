package com.credit.prediction.service;

import com.credit.prediction.model.Account;
import com.credit.prediction.repository.AccountRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AccountService {

    private final AccountRepository repository;

    public AccountService(AccountRepository repository) {
        this.repository = repository;
    }

    public List<Account> getUserAccounts(Long userId) {
        return repository.findByUserId(userId);
    }

    public Account deposit(String accountNumber, double amount) {
        Account account = repository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        if (amount <= 0) {
            throw new RuntimeException("Amount must be positive");
        }

        account.setBalance(account.getBalance() + amount);
        return repository.save(account);
    }


    public Account withdraw(String accountNumber, double amount) {
        Account account = repository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        if (amount <= 0) {
            throw new RuntimeException("Amount must be positive");
        }

        if (account.getBalance() < amount) {
            throw new RuntimeException("Insufficient balance");
        }

        account.setBalance(account.getBalance() - amount);
        return repository.save(account);
    }
}