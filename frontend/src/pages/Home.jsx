import { Link } from 'react-router-dom'
import { CreditCard, Brain, Shield, TrendingUp, ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white">
      {/* Navbar */}
      <nav className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="font-bold text-3xl tracking-tight">NeoBank</h1>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/login" className="font-medium hover:text-blue-400 transition">Login</Link>
            <Link 
              to="/register" 
              className="px-6 py-3 bg-white text-blue-950 font-semibold rounded-2xl hover:bg-blue-100 transition"
            >
              Open Free Account
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-6 pt-24 pb-20 text-center">
        <h1 className="text-6xl md:text-7xl font-bold leading-tight mb-6">
          Banking Reimagined<br />
          with <span className="text-blue-400">Artificial Intelligence</span>
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
          Apply for loans with instant AI decisions. Manage your money smarter and faster.
        </p>

        <div className="flex flex-col sm:flex-row gap-5 justify-center">
          <Link 
            to="/register"
            className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-lg font-semibold rounded-2xl transition flex items-center justify-center gap-3 group"
          >
            Get Started Free
            <ArrowRight className="group-hover:translate-x-1 transition" />
          </Link>
          <Link 
            to="/login"
            className="px-10 py-4 border border-white/30 hover:bg-white/10 text-lg font-semibold rounded-2xl transition"
          >
            Sign In
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-3xl p-10">
            <Brain className="w-12 h-12 text-violet-400 mb-6" />
            <h3 className="text-2xl font-semibold mb-3">AI Loan Predictor</h3>
            <p className="text-gray-300">Get instant approval prediction using our advanced machine learning model.</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-3xl p-10">
            <CreditCard className="w-12 h-12 text-blue-400 mb-6" />
            <h3 className="text-2xl font-semibold mb-3">Smart Banking</h3>
            <p className="text-gray-300">Deposit, withdraw, and track your accounts with real-time updates.</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-3xl p-10">
            <Shield className="w-12 h-12 text-emerald-400 mb-6" />
            <h3 className="text-2xl font-semibold mb-3">Secure &amp; Reliable</h3>
            <p className="text-gray-300">Bank-grade security with modern infrastructure and instant decisions.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 py-16 text-center">
        <p className="text-2xl font-medium mb-6">Ready to experience the future of banking?</p>
        <Link 
          to="/register"
          className="inline-flex items-center gap-3 px-10 py-4 bg-white text-blue-950 font-semibold rounded-2xl hover:bg-blue-100 transition text-lg"
        >
          Create Your Account Now
          <ArrowRight />
        </Link>
      </div>
    </div>
  )
}