package com.credit.prediction.repository;

import com.credit.prediction.model.LoanApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LoanRepository extends JpaRepository<LoanApplication, Long> {
    LoanApplication save(LoanApplication request);

    // Get all loans for a user
    List<LoanApplication> findByUserId(Long userId);

    // Filter loans by status (APPROVED / REJECTED)
    List<LoanApplication> findByStatus(String status);

    // Get user's approved loans
    List<LoanApplication> findByUserIdAndStatus(Long userId, String status);
}
