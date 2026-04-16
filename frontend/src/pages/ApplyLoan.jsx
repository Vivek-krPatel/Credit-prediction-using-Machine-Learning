import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { loanService } from '../services/api'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import { toast } from 'sonner'
import { CreditCard, CheckCircle, XCircle, RotateCcw, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ApplyLoan() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const [formData, setFormData] = useState({
    requestedAmount: '',
    duration: ''
  })

  const [result, setResult] = useState(null)   // ← Will store the loan response

  const applyMutation = useMutation({
    mutationFn: (data) => loanService.applyLoan(user.id, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries(['loans', user.id])
      setResult(response.data)        // Save full response to show nice result screen
      toast.success(`Loan ${response.data.status}`)
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Failed to submit loan application")
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.requestedAmount || !formData.duration) {
      toast.error("Please fill all fields")
      return
    }

    applyMutation.mutate({
      requestedAmount: Number(formData.requestedAmount),
      duration: Number(formData.duration)
    })
  }

  const resetForm = () => {
    setFormData({ requestedAmount: '', duration: '' })
    setResult(null)
  }

  // Show Result Screen after submission
  if (result) {
    const isApproved = result.status === "APPROVED"

    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="max-w-2xl mx-auto px-6 py-16">
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
            <div className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-8 ${isApproved ? 'bg-green-100' : 'bg-red-100'}`}>
              {isApproved ? 
                <CheckCircle className="w-16 h-16 text-green-600" /> : 
                <XCircle className="w-16 h-16 text-red-600" />
              }
            </div>

            <h1 className="text-5xl font-bold mb-3">
              {isApproved ? "Loan Approved!" : "Loan Rejected"}
            </h1>
            
            <p className="text-2xl text-gray-600 mb-10">
              {isApproved 
                ? "Congratulations! Your loan application has been approved." 
                : "Sorry, your loan application did not meet our criteria."}
            </p>

            <div className="bg-gray-50 rounded-2xl p-8 mb-10 text-left max-w-md mx-auto">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Requested Amount</span>
                  <span className="font-semibold">₹{result.requestedAmount?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Duration</span>
                  <span className="font-semibold">{result.duration} months</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status</span>
                  <span className={`font-bold ${isApproved ? 'text-green-600' : 'text-red-600'}`}>
                    {result.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={resetForm}
                className="flex items-center justify-center gap-2 px-8 py-4 border border-gray-300 rounded-2xl font-medium hover:bg-gray-50 transition"
              >
                <RotateCcw className="w-5 h-5" />
                Apply Again
              </button>

              <Link
                to="/dashboard"
                className="flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl font-medium hover:bg-blue-700 transition"
              >
                Go to Dashboard
                <ArrowLeft className="w-5 h-5 rotate-180" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Form Screen (shown before submission)
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="bg-white rounded-3xl shadow-xl p-10">
          <div className="text-center mb-10">
            <div className="mx-auto w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
              <CreditCard className="w-12 h-12 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Apply for Loan</h1>
            <p className="text-gray-600 mt-3">Fill the details below to submit your loan request</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Requested Amount (₹)</label>
              <input
                type="number"
                required
                className="w-full px-6 py-4 text-2xl border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="50000"
                value={formData.requestedAmount}
                onChange={(e) => setFormData({ ...formData, requestedAmount: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration in Months</label>
              <input
                type="number"
                required
                className="w-full px-6 py-4 text-2xl border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="24"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={applyMutation.isPending}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-5 rounded-2xl text-lg flex items-center justify-center gap-3 disabled:opacity-70 mt-6"
            >
              {applyMutation.isPending ? "Submitting Application..." : "Submit Loan Application"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}