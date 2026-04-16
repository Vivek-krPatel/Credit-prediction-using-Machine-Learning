import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { LogOut, Home, CreditCard, Brain, User } from 'lucide-react'
import { toast } from 'sonner'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/')
  }

  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-3xl tracking-tight text-gray-900">NeoBank</h1>
            <p className="text-xs text-gray-500 -mt-1">AI Powered Banking</p>
          </div>
        </div>

        {user ? (
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium transition">
              <Home className="w-5 h-5" />
              Dashboard
            </Link>

            <Link to="/apply-loan" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium transition">
              <CreditCard className="w-5 h-5" />
              Apply Loan
            </Link>

            <Link to="/predict-loan" className="flex items-center gap-2 text-gray-700 hover:text-violet-600 font-medium transition">
              <Brain className="w-5 h-5" />
              AI Predictor
            </Link>

            <div className="flex items-center gap-4 pl-6 border-l">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div className="hidden md:block">
                  <p className="font-semibold text-sm">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-5 py-2.5 text-red-600 hover:bg-red-50 rounded-2xl transition font-medium"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link 
              to="/login" 
              className="px-6 py-2.5 font-medium text-gray-700 hover:text-blue-600 transition"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-2xl transition"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}