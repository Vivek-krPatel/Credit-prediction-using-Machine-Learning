package com.credit.prediction.controller;

import com.credit.prediction.service.MLService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/predict")
@CrossOrigin
public class PredictionController {

    private final MLService mlService;

    public PredictionController(MLService mlService) {
        this.mlService = mlService;
    }

    @PostMapping
    public Map<String, Object> predict(@RequestBody double[] features) {

        String prediction = mlService.predict(features);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("prediction", prediction);
        response.put("message",
                prediction.equalsIgnoreCase("Approved")
                        ? "Loan is likely to be approved"
                        : "Loan is likely to be rejected"
        );

        return response;
    }
}