package com.credit.prediction.service;



import com.credit.prediction.Exception.InvalidCredentialsException;
import com.credit.prediction.model.Account;
import com.credit.prediction.model.User;
import com.credit.prediction.repository.AccountRepository;
import com.credit.prediction.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;

    public UserService(UserRepository userRepository,
                       AccountRepository accountRepository) {
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
    }


    public User register(User user) {

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User savedUser = userRepository.save(user);

        Account account = new Account();
        account.setAccountNumber("ACC" + System.currentTimeMillis());
        account.setBalance(0.0);
        account.setUser(savedUser);

        accountRepository.save(account);

        return savedUser;
    }


    public User login(String email, String password) {

        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = userOpt.get();

        if (!user.getPassword().equals(password)) {
            throw new InvalidCredentialsException("Invalid password or user not found");
        }

        return user;
    }
}