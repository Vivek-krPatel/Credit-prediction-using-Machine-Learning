import axios from 'axios'

const API_BASE = 'http://localhost:8080/api'

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const authService = {
  register: (data) => api.post('/users/signup', data),
  login: (data) => api.post('/users/login', data),
}

export const accountService = {
  getAccounts: (userId) => api.get(`/accounts/${userId}`),
  
  deposit: (accountNumber, amount) => 
    api.post(`/accounts/deposit?accountNumber=${accountNumber}&amount=${amount}`),
  
  withdraw: (accountNumber, amount) => 
    api.post(`/accounts/withdraw?accountNumber=${accountNumber}&amount=${amount}`),
}

export const loanService = {
  applyLoan: (userId, data) => api.post(`/loans/apply/${userId}`, data),
  getLoans: (userId) => api.get(`/loans/${userId}`),
}

export const predictionService = {
  predictLoan: (features) => api.post('/predict', features), 
  // features must be an array of 8 numbers in this exact order:
  // [age, sex, job, housing, savingsLevel, checkingLevel, creditAmount, duration]
}

export default api