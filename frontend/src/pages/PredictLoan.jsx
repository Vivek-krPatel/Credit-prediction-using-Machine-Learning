import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { predictionService } from '../services/api'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import { toast } from 'sonner'
import { Brain, ArrowRight, RotateCcw } from 'lucide-react'

export default function PredictLoan() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [features, setFeatures] = useState({
    age: '',
    sex: '1',        // 1 = male, 0 = female 
    job: '',
    housing: '1',
    savingsLevel: '',
    checkingLevel: '',
    creditAmount: '',
    duration: ''
  })

  const [result, setResult] = useState(null)

  const predictMutation = useMutation({
    mutationFn: (featureArray) => predictionService.predictLoan(featureArray),
    onSuccess: (response) => {
      setResult(response.data)
      toast.success(response.data.success ? "Prediction Complete" : "Prediction Failed")
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to get prediction")
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()

    
    const featureArray = [
      parseFloat(features.age),
      parseFloat(features.sex),
      parseFloat(features.job),
      parseFloat(features.housing),
      parseFloat(features.savingsLevel),
      parseFloat(features.checkingLevel),
      parseFloat(features.creditAmount),
      parseFloat(features.duration)
    ]

    
    if (featureArray.some(isNaN)) {
      toast.error("Please fill all fields with valid numbers")
      return
    }

    predictMutation.mutate(featureArray)
  }

  const resetForm = () => {
    setFeatures({
      age: '', sex: '1', job: '', housing: '1', savingsLevel: '',
      checkingLevel: '', creditAmount: '', duration: ''
    })
    setResult(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-white rounded-3xl shadow-xl p-10">
          <div className="text-center mb-10">
            <div className="mx-auto w-20 h-20 bg-violet-100 rounded-2xl flex items-center justify-center mb-6">
              <Brain className="w-12 h-12 text-violet-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">AI Loan Predictor</h1>
            <p className="text-gray-600 mt-3">Enter details to get instant ML-based loan approval prediction</p>
          </div>

          {!result ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Age</label>
                  <input type="number" required className="w-full px-5 py-3 border rounded-2xl" 
                    value={features.age} onChange={(e) => setFeatures({...features, age: e.target.value})} />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Sex (1 = Male, 0 = Female)</label>
                  <select className="w-full px-5 py-3 border rounded-2xl" 
                    value={features.sex} onChange={(e) => setFeatures({...features, sex: e.target.value})}>
                    <option value="1">Male</option>
                    <option value="0">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Job Level</label>
                  <input type="number" required className="w-full px-5 py-3 border rounded-2xl" 
                    value={features.job} onChange={(e) => setFeatures({...features, job: e.target.value})} />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Housing (1 = Own, 0 = Rent)</label>
                  <select className="w-full px-5 py-3 border rounded-2xl" 
                    value={features.housing} onChange={(e) => setFeatures({...features, housing: e.target.value})}>
                    <option value="1">Own</option>
                    <option value="0">Rent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Savings Level</label>
                  <input type="number" required className="w-full px-5 py-3 border rounded-2xl" 
                    value={features.savingsLevel} onChange={(e) => setFeatures({...features, savingsLevel: e.target.value})} />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Checking Level</label>
                  <input type="number" required className="w-full px-5 py-3 border rounded-2xl" 
                    value={features.checkingLevel} onChange={(e) => setFeatures({...features, checkingLevel: e.target.value})} />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Credit Amount (₹)</label>
                  <input type="number" required className="w-full px-5 py-3 border rounded-2xl" 
                    value={features.creditAmount} onChange={(e) => setFeatures({...features, creditAmount: e.target.value})} />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Duration (Months)</label>
                  <input type="number" required className="w-full px-5 py-3 border rounded-2xl" 
                    value={features.duration} onChange={(e) => setFeatures({...features, duration: e.target.value})} />
                </div>
              </div>

              <button
                type="submit"
                disabled={predictMutation.isPending}
                className="w-full mt-8 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold py-4 rounded-2xl text-lg flex items-center justify-center gap-3 disabled:opacity-70"
              >
                {predictMutation.isPending ? "Running AI Model..." : "Get Prediction"}
                <ArrowRight className="w-6 h-6" />
              </button>
            </form>
          ) : (
            <div className="text-center py-8">
              <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 ${result.success && result.prediction === "Approved" ? "bg-green-100" : "bg-red-100"}`}>
                <Brain className={`w-14 h-14 ${result.success && result.prediction === "1" ? "text-green-600" : "text-red-600"}`} />
              </div>

              <h2 className="text-3xl font-bold mb-2">{result.prediction}</h2>
              <p className="text-gray-600 text-lg">{result.prediction === "1" ? "Your loan application has been approved!" : "Your loan application has been rejected."}</p>

              <button
                onClick={resetForm}
                className="mt-10 flex items-center gap-2 mx-auto px-8 py-3 bg-gray-100 hover:bg-gray-200 rounded-2xl font-medium"
              >
                <RotateCcw className="w-5 h-5" /> Try Another Prediction
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}