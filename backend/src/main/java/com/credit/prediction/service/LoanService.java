package com.credit.prediction.service;

import com.credit.prediction.model.Account;
import com.credit.prediction.model.LoanApplication;
import com.credit.prediction.model.User;
import com.credit.prediction.repository.AccountRepository;
import com.credit.prediction.repository.LoanRepository;
import com.credit.prediction.repository.UserRepository;
import org.springframework.stereotype.Service;



import java.util.List;

@Service
public class LoanService {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final LoanRepository loanRepository;
    private final FeatureBuilder featureBuilder;
    private final MLService mlService;

    public LoanService(UserRepository userRepository,
                       AccountRepository accountRepository,
                       LoanRepository loanRepository,
                       FeatureBuilder featureBuilder,
                       MLService mlService) {

        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.loanRepository = loanRepository;
        this.featureBuilder = featureBuilder;
        this.mlService = mlService;
    }


    public LoanApplication applyLoan(Long userId,
                                     Double requestedAmount,
                                     Integer duration) {


        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Account account = accountRepository.findByUserId(userId)
                .stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Account not found"));


        LoanApplication loan = new LoanApplication();
        loan.setUser(user);
        loan.setRequestedAmount(requestedAmount);
        loan.setDuration(duration);


        double[] features = featureBuilder.buildFeatures(user, account, loan);


        String prediction = mlService.predict(features);


        loan.setStatus(
                prediction.equals("1") ||
                        prediction.equalsIgnoreCase("approved")
                        ? "APPROVED"
                        : "REJECTED"
        );


        return loanRepository.save(loan);
    }


    public List<LoanApplication> getUserLoans(Long userId) {
        return loanRepository.findByUserId(userId);
    }
}