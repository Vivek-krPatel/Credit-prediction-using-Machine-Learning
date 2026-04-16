package com.credit.prediction.controller;

import com.credit.prediction.model.LoanApplication;
import com.credit.prediction.service.LoanService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/loans")
@CrossOrigin
public class LoanController {

    private final LoanService loanService;

    public LoanController(LoanService loanService) {
        this.loanService = loanService;
    }


    @PostMapping("/apply/{userId}")
    public LoanApplication applyLoan(
            @PathVariable Long userId,
            @RequestBody LoanRequest request) {

        return loanService.applyLoan(
                userId,
                request.getRequestedAmount(),
                request.getDuration()
        );
    }


    @GetMapping("/{userId}")
    public List<LoanApplication> getUserLoans(@PathVariable Long userId) {
        return loanService.getUserLoans(userId);
    }


    public static class LoanRequest {

        private Double requestedAmount;
        private Integer duration;

        public Double getRequestedAmount() {
            return requestedAmount;
        }

        public void setRequestedAmount(Double requestedAmount) {
            this.requestedAmount = requestedAmount;
        }

        public Integer getDuration() {
            return duration;
        }

        public void setDuration(Integer duration) {
            this.duration = duration;
        }
    }
}