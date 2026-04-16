package com.credit.prediction.controller;

import com.credit.prediction.model.Account;
import com.credit.prediction.service.AccountService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@CrossOrigin
public class AccountController {

    private final AccountService service;

    public AccountController(AccountService service) {
        this.service = service;
    }

    @GetMapping("/{userId}")
    public List<Account> getAccounts(@PathVariable Long userId) {
        return service.getUserAccounts(userId);
    }

    @PostMapping("/deposit")
    public Account deposit(
            @RequestParam String accountNumber,
            @RequestParam double amount
    ) {
        return service.deposit(accountNumber, amount);
    }

    @PostMapping("/withdraw")
    public Account withdraw(
            @RequestParam String accountNumber,
            @RequestParam double amount
    ) {
        return service.withdraw(accountNumber, amount);
    }
}