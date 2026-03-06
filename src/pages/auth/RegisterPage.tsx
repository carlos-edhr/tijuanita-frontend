import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useAuth } from '@/context/useAuth'
import { useNavigate, Link } from 'react-router-dom'
import gsap from 'gsap'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  ArrowRight,
  Shield,
  Cpu,
  Cloud,
  Bot,
  UserPlus,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { authService } from '@/services/authService'
import AppFooter from '@/components/AppFooter'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin()
}

const RegisterPage: React.FC = () => {
  const { registerUser } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showPassword2, setShowPassword2] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const sectionRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<HTMLDivElement>(null)

  // Generate particle positions using useMemo (outside of render)
  const particlePositions = useMemo(() => {
    return authService.generateParticlePositions(30)
  }, [])

  // Real-time validation using useMemo (derived state)
  const emailValid = useMemo(() => {
    if (email.length === 0) return null
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }, [email])

  const passwordValid = useMemo(() => {
    if (password.length === 0) return null
    const hasMinLength = password.length >= 8
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
    return hasMinLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar
  }, [password])

  const passwordMatch = useMemo(() => {
    if (password2.length === 0) return null
    return password === password2
  }, [password, password2])

  const getPasswordStrength = () => {
    if (password.length === 0) return 0
    
    let strength = 0
    if (password.length >= 8) strength += 1
    if (/[A-Z]/.test(password)) strength += 1
    if (/[a-z]/.test(password)) strength += 1
    if (/\d/.test(password)) strength += 1
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1
    
    return strength
  }

  useEffect(() => {
    if (!sectionRef.current) return

    // Animate particles
    if (particlesRef.current) {
      const particles = particlesRef.current.querySelectorAll('.particle')
      particles.forEach((particle, i) => {
        gsap.to(particle, {
          x: gsap.utils.random(-100, 100),
          y: gsap.utils.random(-100, 100),
          duration: gsap.utils.random(3, 6),
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.2
        })
      })
    }

    // Animate card entrance
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        {
          opacity: 0,
          y: 50,
          scale: 0.9,
          filter: 'blur(10px)'
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
          duration: 1,
          ease: "power3.out",
          delay: 0.3
        }
      )
    }

    // Animate background elements
    gsap.to('.floating-element', {
      y: 20,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setIsLoading(true)

    // Final validation
    if (emailValid === false) {
      setError('Please enter a valid email address')
      setIsLoading(false)
      return
    }
    
    if (passwordValid === false) {
      setError('Password does not meet requirements')
      setIsLoading(false)
      return
    }
    
    if (passwordMatch === false) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    const result = await registerUser(email, password, password2)

    if (result.success) {
      setSuccess('Registration successful! Redirecting to dashboard...')
      
      // Add success animation
      gsap.to(cardRef.current, {
        scale: 0.95,
        opacity: 0.8,
        duration: 0.3,
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          navigate('/dashboard', { replace: true })
        }
      })
    } else {
      setIsLoading(false)
      setError(result.message || 'Registration failed. Please try again.')
      
      // Add error shake animation
      gsap.to(cardRef.current, {
        x: -10,
        duration: 0.1,
        yoyo: true,
        repeat: 5,
        onComplete: () => {
          gsap.to(cardRef.current, { x: 0, duration: 0.1 })
        }
      })
    }
  }

  const passwordStrength = getPasswordStrength()
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500']
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong']

  return (
    <div 
      ref={sectionRef}
      className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#0a0a0a] via-black to-[#0a0a0a] flex flex-col"
    >
      <div className="flex-1 flex items-center justify-center p-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated Particles */}
        <div ref={particlesRef} className="absolute inset-0">
          {particlePositions.map((pos, i) => (
            <div
              key={i}
              className="particle absolute w-1 h-1 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20"
              style={{
                left: `${pos.left}%`,
                top: `${pos.top}%`,
              }}
            />
          ))}
        </div>

        {/* Floating Tech Elements */}
        <div className="absolute top-1/4 left-1/4 floating-element">
          <Cpu className="w-20 h-20 text-green-500/10" />
        </div>
        <div className="absolute bottom-1/4 right-1/4 floating-element" style={{ animationDelay: '1s' }}>
          <Cloud className="w-24 h-24 text-emerald-500/10" />
        </div>
        <div className="absolute top-1/2 left-1/3 floating-element" style={{ animationDelay: '2s' }}>
          <Bot className="w-16 h-16 text-teal-500/10" />
        </div>

        {/* Gradient Orbs */}
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
      </div>

      {/* Main Registration Card */}
      <div className="relative z-20 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-3 mb-6"
          >
            <div className="w-8 h-0.5 bg-gradient-to-r from-transparent via-green-500 to-transparent" />
            <h1 className="text-lg sm:text-xl font-medium text-white/70 tracking-widest">
              /// CREATE ACCOUNT
            </h1>
            <div className="w-8 h-0.5 bg-gradient-to-r from-transparent via-green-500 to-transparent" />
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold text-white mb-4"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
              New
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-400">
              {' '}Account
            </span>
          </motion.h2>
          
           <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-white/60 text-sm sm:text-base"
          >
            Join Via Recreativa to access our recreational routes and activities
          </motion.p>
        </div>

        {/* Registration Card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card 
            ref={cardRef}
            className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl relative overflow-hidden"
          >
            {/* Card Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-teal-500/5" />
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-green-500/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-teal-500/10 rounded-full blur-2xl" />

            <CardHeader className="relative z-10 pb-4">
              <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
                <UserPlus className="w-6 h-6 text-green-400" />
                Create Your Account
              </CardTitle>
              <CardDescription className="text-white/70">
                Fill in the details below to get started
              </CardDescription>
            </CardHeader>

            <CardContent className="relative z-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email" className="text-white/80 text-sm font-medium">
                      Email Address
                    </Label>
                    <AnimatePresence>
                      {emailValid !== null && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className={`flex items-center gap-1 text-xs ${emailValid ? 'text-green-400' : 'text-red-400'}`}
                        >
                          {emailValid ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                          {emailValid ? 'Valid email!' : 'Invalid email'}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
                    <div className="relative">
                       <Input
                        id="email"
                        type="email"
                        placeholder="tu.email@ejemplo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={false}
                        className="bg-white/5 border-white/20 text-white placeholder:text-white/60 h-12 rounded-lg pl-10 pr-4 focus:border-green-500 focus:ring-green-500 transition-all duration-300"
                      />
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <Mail className="w-5 h-5 text-white/60 group-focus-within:text-green-400 transition-colors" />
                      </div>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {emailValid === true && (
                          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        )}
                        {emailValid === false && (
                          <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-white/80 text-sm font-medium">
                      Password
                    </Label>
                    <AnimatePresence>
                      {passwordValid !== null && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className={`flex items-center gap-1 text-xs ${passwordValid ? 'text-green-400' : 'text-red-400'}`}
                        >
                          {passwordValid ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                          {passwordValid ? 'Strong password!' : 'Weak password'}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-lg blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="bg-white/5 border-white/20 text-white placeholder:text-white/60 h-12 rounded-lg pl-10 pr-12 focus:border-emerald-500 focus:ring-emerald-500 transition-all duration-300"
                      />
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <Lock className="w-5 h-5 text-white/60 group-focus-within:text-emerald-400 transition-colors" />
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    
                    {/* Password Requirements */}
                    <div className="mt-3 space-y-1">
                      <div className="text-xs text-white/60">
                        Password must contain:
                      </div>
                      <div className="grid grid-cols-2 gap-1 text-xs">
                        <div className={`flex items-center gap-1 ${password.length >= 8 ? 'text-green-400' : 'text-white/60'}`}>
                          {password.length >= 8 ? '✓' : '○'} 8+ characters
                        </div>
                        <div className={`flex items-center gap-1 ${/[A-Z]/.test(password) ? 'text-green-400' : 'text-white/60'}`}>
                          {/[A-Z]/.test(password) ? '✓' : '○'} Uppercase letter
                        </div>
                        <div className={`flex items-center gap-1 ${/[a-z]/.test(password) ? 'text-green-400' : 'text-white/60'}`}>
                          {/[a-z]/.test(password) ? '✓' : '○'} Lowercase letter
                        </div>
                        <div className={`flex items-center gap-1 ${/\d/.test(password) ? 'text-green-400' : 'text-white/60'}`}>
                          {/\d/.test(password) ? '✓' : '○'} Number
                        </div>
                        <div className={`flex items-center gap-1 ${/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'text-green-400' : 'text-white/60'}`}>
                          {/[!@#$%^&*(),.?":{}|<>]/.test(password) ? '✓' : '○'} Special character
                        </div>
                      </div>
                    </div>
                    
                    {/* Strength Indicator */}
                    <div className="mt-4 space-y-1">
                      <div className="flex justify-between text-xs text-white/60">
                        <span>Password Strength:</span>
                        <span className={passwordStrength >= 3 ? 'text-green-400' : passwordStrength >= 2 ? 'text-yellow-400' : 'text-red-400'}>
                          {strengthLabels[passwordStrength - 1] || 'None'}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((segment) => (
                          <div
                            key={segment}
                            className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden"
                          >
                            <motion.div
                              className={`h-full ${strengthColors[segment - 1]}`}
                              initial={{ width: 0 }}
                              animate={{ 
                                width: segment <= passwordStrength ? '100%' : '0%'
                              }}
                              transition={{ duration: 0.3, delay: segment * 0.05 }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password2" className="text-white/80 text-sm font-medium">
                      Confirm Password
                    </Label>
                    <AnimatePresence>
                      {passwordMatch !== null && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className={`flex items-center gap-1 text-xs ${passwordMatch ? 'text-green-400' : 'text-red-400'}`}
                        >
                          {passwordMatch ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                          {passwordMatch ? 'Passwords match!' : 'Passwords do not match'}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 rounded-lg blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
                    <div className="relative">
                      <Input
                        id="password2"
                        type={showPassword2 ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                        required
                        className="bg-white/5 border-white/20 text-white placeholder:text-white/60 h-12 rounded-lg pl-10 pr-12 focus:border-teal-500 focus:ring-teal-500 transition-all duration-300"
                      />
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <Lock className="w-5 h-5 text-white/60 group-focus-within:text-teal-400 transition-colors" />
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowPassword2(!showPassword2)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                      >
                        {showPassword2 ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Success Message */}
                <AnimatePresence>
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg"
                    >
                      <div className="flex items-center gap-2 text-green-300 text-sm">
                        <CheckCircle className="w-4 h-4" />
                        {success}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-3 bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-lg"
                    >
                      <div className="flex items-center gap-2 text-red-300 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Register Button */}
                <Button
                  type="submit"
                  disabled={isLoading || !email || !password || !password2 || !emailValid || !passwordValid || !passwordMatch}
                  className="w-full relative overflow-hidden group bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white font-semibold h-12 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
              </form>

              {/* Login Link */}
              <div className="mt-8 pt-6 border-t border-white/10 text-center">
                <p className="text-white/50 text-sm mb-4">
                  Already have an account?
                </p>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-lg transition-all duration-300 group"
                >
                  <Shield className="w-4 h-4" />
                  Sign in to your account
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Tech Stack Indicators */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-8 flex flex-wrap items-center justify-center gap-4"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs text-gray-300">
                    TIJUANA • RECREATION • COMMUNITY
                  </span>
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                </div>
                <div className="text-white/30 text-xs">
                  © {new Date().getFullYear()} Via Recreativa. All rights reserved.
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <AppFooter />
    </div>
  )
}

export default RegisterPage