import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { accountService } from '../services/api'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import { CreditCard, DollarSign, ArrowUpRight, ArrowDownRight, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

export default function Dashboard() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const [showDepositModal, setShowDepositModal] = useState(false)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState(null)
  const [amount, setAmount] = useState('')

  const { 
    data: response, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['accounts', user?.id],
    queryFn: () => accountService.getAccounts(user?.id),
    enabled: !!user?.id,
  })


  const accounts = Array.isArray(response?.data) ? response?.data : []

  const totalBalance = accounts.reduce((sum, acc) => {
    return sum + (Number(acc?.balance) || 0)
  }, 0)


  const depositMutation = useMutation({
    mutationFn: ({ accountNumber, amount }) => accountService.deposit(accountNumber, amount),
    onSuccess: () => {
      queryClient.invalidateQueries(['accounts', user.id])
      toast.success('Deposit successful!')
      setShowDepositModal(false)
      setAmount('')
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Deposit failed')
  })

  
  const withdrawMutation = useMutation({
    mutationFn: ({ accountNumber, amount }) => accountService.withdraw(accountNumber, amount),
    onSuccess: () => {
      queryClient.invalidateQueries(['accounts', user.id])
      toast.success('Withdrawal successful!')
      setShowWithdrawModal(false)
      setAmount('')
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Withdrawal failed')
  })

  const openDeposit = (account) => {
    setSelectedAccount(account)
    setShowDepositModal(true)
  }

  const openWithdraw = (account) => {
    setSelectedAccount(account)
    setShowWithdrawModal(true)
  }

  const handleTransaction = (type) => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid positive amount")
      return
    }
    const numAmount = parseFloat(amount)

    if (type === 'deposit') {
      depositMutation.mutate({ accountNumber: selectedAccount.accountNumber, amount: numAmount })
    } else {
      withdrawMutation.mutate({ accountNumber: selectedAccount.accountNumber, amount: numAmount })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900">
            Welcome back, {user?.name?.split(" ")[0] || 'User'} 👋
          </h1>
          <p className="text-gray-600 mt-2">Manage your accounts and transactions</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-3xl p-8 shadow-sm border bank-card">
            <div className="flex justify-between">
              <div>
                <p className="text-gray-500">Total Balance</p>
                <p className="text-4xl font-semibold mt-4">₹{totalBalance.toLocaleString()}</p>
              </div>
              <DollarSign className="w-12 h-12 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm border bank-card">
            <div className="flex justify-between">
              <div>
                <p className="text-gray-500">Active Accounts</p>
                <p className="text-4xl font-semibold mt-4">{accounts.length}</p>
              </div>
              <CreditCard className="w-12 h-12 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm border bank-card flex items-center justify-center">
            <a 
              href="/predict-loan" 
              className="flex items-center gap-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-medium hover:scale-105 transition"
            >
              AI Loan Eligibility Checker
            </a>
          </div>
        </div>

        {/* Accounts List */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Your Accounts ({accounts.length})
          </h2>

          {isLoading ? (
            <div className="bg-white rounded-3xl p-12 text-center">Loading your accounts...</div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-3xl p-10 text-red-700">
              Failed to load accounts: {error.message}
            </div>
          ) : accounts.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {accounts.map((account) => (
                <div key={account.id} className="bg-white rounded-3xl p-8 shadow-sm border bank-card">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500">Account Number</p>
                      <p className="font-mono text-2xl font-semibold tracking-wider mt-1">
                        {account.accountNumber}
                      </p>
                    </div>
                    <CreditCard className="w-10 h-10 text-blue-600" />
                  </div>

                  <div className="mt-10">
                    <p className="text-sm text-gray-500">Current Balance</p>
                    <p className="text-5xl font-bold text-green-600 mt-1">
                      ₹{Number(account.balance || 0).toLocaleString()}
                    </p>
                  </div>

                  <div className="mt-8 flex gap-4">
                    <button 
                      onClick={() => openDeposit(account)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-2xl flex items-center justify-center gap-2 transition"
                    >
                      <ArrowUpRight className="w-5 h-5" /> Deposit
                    </button>
                    <button 
                      onClick={() => openWithdraw(account)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-2xl flex items-center justify-center gap-2 transition"
                    >
                      <ArrowDownRight className="w-5 h-5" /> Withdraw
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-20 text-center">
              <CreditCard className="w-20 h-20 mx-auto text-gray-300 mb-6" />
              <p className="text-2xl font-medium text-gray-700">No accounts found</p>
            </div>
          )}
        </div>
      </div>

      {/* Deposit Modal */}
      {showDepositModal && selectedAccount && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md">
            <h3 className="text-2xl font-semibold mb-2">Deposit Money</h3>
            <p className="text-gray-600 mb-6">Account: <span className="font-mono">{selectedAccount.accountNumber}</span></p>
            
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-6 py-4 text-2xl border rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 mb-8"
            />

            <div className="flex gap-4">
              <button onClick={() => {setShowDepositModal(false); setAmount('')}} className="flex-1 py-3 border rounded-2xl">
                Cancel
              </button>
              <button 
                onClick={() => handleTransaction('deposit')}
                disabled={depositMutation.isPending}
                className="flex-1 py-3 bg-green-600 text-white rounded-2xl disabled:opacity-70"
              >
                {depositMutation.isPending ? 'Processing...' : 'Deposit'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal - similar structure */}
      {showWithdrawModal && selectedAccount && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md">
            <h3 className="text-2xl font-semibold mb-2">Withdraw Money</h3>
            <p className="text-gray-600 mb-6">Account: <span className="font-mono">{selectedAccount.accountNumber}</span></p>
            
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-6 py-4 text-2xl border rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500 mb-8"
            />

            <div className="flex gap-4">
              <button onClick={() => {setShowWithdrawModal(false); setAmount('')}} className="flex-1 py-3 border rounded-2xl">
                Cancel
              </button>
              <button 
                onClick={() => handleTransaction('withdraw')}
                disabled={withdrawMutation.isPending}
                className="flex-1 py-3 bg-red-600 text-white rounded-2xl disabled:opacity-70"
              >
                {withdrawMutation.isPending ? 'Processing...' : 'Withdraw'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}