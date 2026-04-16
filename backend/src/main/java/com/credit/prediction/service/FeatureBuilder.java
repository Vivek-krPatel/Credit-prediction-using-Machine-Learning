package com.credit.prediction.service;

import com.credit.prediction.model.Account;
import com.credit.prediction.model.LoanApplication;
import com.credit.prediction.model.User;
import org.springframework.stereotype.Service;

@Service
public class FeatureBuilder {

    /**
     * Converts DB + request → ML feature vector
     * Must match training dataset EXACTLY in order
     */
    public double[] buildFeatures(User user,
                                  Account account,
                                  LoanApplication loan) {

        // -----------------------------
        // 1. BASIC USER FEATURES
        // -----------------------------
        int age = user.getAge() != null ? user.getAge() : 30;

        int sex = user.getGender() != null &&
                user.getGender().equalsIgnoreCase("male") ? 1 : 0;

        // -----------------------------
        // 2. ACCOUNT FEATURES (synthetic savings behavior)
        // -----------------------------
        double balance = account.getBalance() != null ? account.getBalance() : 0;

        int savingsLevel;
        if (balance > 10000) savingsLevel = 2;       // rich
        else if (balance > 5000) savingsLevel = 1;    // moderate
        else savingsLevel = 0;                        // low

        // checking account behavior (synthetic)
        int checkingLevel =
                balance > 3000 ? 1 : 0;

        // -----------------------------
        // 3. LOAN FEATURES (from request)
        // -----------------------------
        double creditAmount =
                loan.getRequestedAmount() != null ? loan.getRequestedAmount() : 0;

        int duration =
                loan.getDuration() != null ? loan.getDuration() : 12;

        // -----------------------------
        // 4. FIXED / ASSUMED FEATURES
        // (since dataset has them but DB doesn't)
        // -----------------------------
        // 4. DYNAMIC JOB FEATURE
        // -----------------------------
        int job;

        if (balance > 15000 && savingsLevel == 2) {
            job = 3; // high skill / stable income
        } else if (balance > 7000 && savingsLevel >= 1) {
            job = 2; // medium skill
        } else if (balance > 2000) {
            job = 1; // low skill
        } else {
            job = 0; // unemployed / very low income
        }
        int housing = balance > 0 ? 1 : 0;

        // -----------------------------
        // FINAL FEATURE VECTOR
        // ORDER MUST MATCH TRAINING DATASET
        // -----------------------------
        return new double[] {
                age,            // 0
                sex,            // 1
                job,            // 2
                housing,        // 3
                savingsLevel,   // 4
                checkingLevel,  // 5
                creditAmount,   // 6
                duration        // 7
        };
    }
}
