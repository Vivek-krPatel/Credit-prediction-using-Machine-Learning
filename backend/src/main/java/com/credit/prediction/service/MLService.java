package com.credit.prediction.service;

import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

@Service
public class MLService {


    public String predict(double[] features) {

        try {
            ProcessBuilder pb = new ProcessBuilder();

            List<String> command = new ArrayList<>();
            command.add("venv\\Scripts\\python.exe");
            command.add("predict.py");

            for (double f : features) {
                command.add(String.valueOf(f));
            }

            pb.command(command);
            pb.redirectErrorStream(true);

            Process process = pb.start();

            BufferedReader reader = new BufferedReader(
                    new InputStreamReader(process.getInputStream())
            );

            String result = reader.readLine();

            process.waitFor();

            return result != null ? result.trim() : "0";

        } catch (Exception e) {
            throw new RuntimeException("ML prediction failed", e);
        }
    }
}