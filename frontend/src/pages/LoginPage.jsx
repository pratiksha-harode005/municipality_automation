import React, { useState } from 'react';
import { Breadcrumb } from '../components/Breadcrumb';
import { ShieldCheck, Lock, User, Mail, Phone, MapPin, ArrowRight, Info, AlertTriangle, UserCheck, Briefcase, KeyRound, CheckCircle2, ArrowLeft, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMunicipalData } from '../context/DataContext';

export const LoginPage = ({ onNavigate, initialTab }) => {
  const { login, registerCitizen, resetPassword, authError, loading, usersList } = useAuth();
  const { showToast } = useMunicipalData();

  const [activeTab, setActiveTab] = useState(() => {
    if (initialTab) return initialTab;
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      if (path.startsWith('/signup') || path.startsWith('/register')) return 'register';
      if (path.startsWith('/forgot') || path.startsWith('/reset')) return 'forgot';
      const params = new URLSearchParams(window.location.search);
      if (params.get('tab') === 'register' || window.location.hash === '#register') return 'register';
      if (params.get('tab') === 'forgot' || window.location.hash === '#forgot') return 'forgot';
    }
    return 'login';
  });

  // Login Form State
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Citizen Registration Form State
  const [regForm, setRegForm] = useState({
    fullName: '',
    email: '',
    mobile: '',
    address: '',
    password: '',
    confirmPassword: ''
  });
  const [regError, setRegError] = useState('');

  // Forgot Password State
  const [forgotId, setForgotId] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);
  const [showForgotConfirmPassword, setShowForgotConfirmPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1 = Enter Email/User, 2 = Enter OTP & New Password
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');

  // Handle Login Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const res = await login(loginId, loginPassword);
    if (res.success) {
      showToast(`Welcome back, ${res.user.fullName}!`, 'success');
      onNavigate(res.redirectPath);
    }
  };

  // Handle Citizen Registration Submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegError('');

    if (regForm.password !== regForm.confirmPassword) {
      setRegError('Passwords do not match.');
      return;
    }
    if (regForm.password.length < 6) {
      setRegError('Password must be at least 6 characters.');
      return;
    }

    const res = await registerCitizen({
      fullName: regForm.fullName,
      email: regForm.email,
      mobile: regForm.mobile,
      address: regForm.address,
      password: regForm.password
    });

    if (res.success) {
      showToast(`Account created successfully! Welcome, ${res.user.fullName}.`, 'success');
      onNavigate(res.redirectPath);
    } else {
      setRegError(res.error);
    }
  };

  // Step 1: Verify Account & Send Verification Code
  const handleForgotVerify = (e) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');

    const clean = forgotId.trim().toLowerCase();
    if (!clean) {
      setForgotError('Please enter your registered email address or username.');
      return;
    }

    const found = usersList?.find(
      u => u.email.toLowerCase() === clean || u.username.toLowerCase() === clean
    );

    if (!found) {
      setForgotError(`No registered account found with "${forgotId}". Please check or register a new account.`);
      return;
    }

    // Generate simulated 6-digit OTP
    const demoOtp = '892014';
    setGeneratedOtp(demoOtp);
    setForgotOtp(demoOtp); // Auto-fill for quick testing
    setForgotNewPassword('');
    setForgotConfirmPassword('');
    setForgotStep(2);
    setForgotSuccess(`Account verified (${found.fullName})! A 6-digit security code has been sent.`);
    showToast(`Verification code sent to ${found.email} (Code: ${demoOtp})`, 'info');
  };

  // Step 2: Set New Password
  const handleForgotResetSubmit = async (e) => {
    e.preventDefault();
    setForgotError('');

    if (forgotOtp.trim() !== generatedOtp && forgotOtp.trim() !== '892014' && forgotOtp.trim() !== '123456') {
      setForgotError('Invalid verification security code. Please check and try again.');
      return;
    }

    if (forgotNewPassword.length < 6) {
      setForgotError('New password must be at least 6 characters.');
      return;
    }

    if (forgotNewPassword !== forgotConfirmPassword) {
      setForgotError('New passwords do not match.');
      return;
    }

    const res = await resetPassword(forgotId, forgotNewPassword);
    if (res.success) {
      showToast('Password reset successfully! Please sign in with your new password.', 'success');
      setLoginId(forgotId);
      setLoginPassword('');
      setForgotStep(1);
      setForgotId('');
      setForgotNewPassword('');
      setForgotConfirmPassword('');
      setActiveTab('login');
    } else {
      setForgotError(res.error);
    }
  };

  // Quick Demo Account Auto-Fill Helper
  const fillDemoAccount = (demoEmail, demoPassword) => {
    setActiveTab('login');
    setLoginId(demoEmail);
    setLoginPassword(demoPassword);
    showToast(`Loaded demo credentials for ${demoEmail}`);
  };

  return (
    <div id="main-content">
      {/* Page Hero */}
      <div className="page-hero">
        <div className="container">
          <Breadcrumb items={[{ label: 'Portal Authentication' }]} onNavigate={onNavigate} />
          <h1 className="page-hero-title">Municipal Portal Authentication</h1>
          <p style={{ color: '#cbd5e1', fontSize: '1.1rem', maxWidth: '650px' }}>
            Single Sign-On portal for Citizens, Ward Municipal Officers, Department Administrators, and Executive Leadership.
          </p>
        </div>
      </div>

      <section style={{ padding: '3.5rem 0', background: 'var(--color-bg-body)' }}>
        <div className="container" style={{ maxWidth: '1000px' }}>
          
          {/* Quick Demo Credentials Bar */}
          <div style={{ background: '#f0fdfa', border: '1px solid #99f6e4', padding: '1.25rem', borderRadius: '12px', marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <ShieldCheck size={20} style={{ color: '#0d9488' }} />
              <h4 style={{ margin: 0, color: '#0f766e', fontSize: '1rem', fontWeight: 700 }}>
                ⚡ Quick Demo Login Credentials (Click to Auto-Fill for Testing)
              </h4>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
              <button 
                onClick={() => fillDemoAccount('citizen@bbmp.gov.in', 'citizen123')}
                style={{ background: 'white', border: '1px solid #cbd5e1', padding: '0.65rem 0.85rem', borderRadius: '8px', textAlign: 'left', cursor: 'pointer' }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0284c7' }}>👤 ROLE 1: CITIZEN</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>citizen@bbmp.gov.in</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Pass: citizen123</div>
              </button>

              <button 
                onClick={() => fillDemoAccount('officer.ward112@bbmp.gov.in', 'officer123')}
                style={{ background: 'white', border: '1px solid #cbd5e1', padding: '0.65rem 0.85rem', borderRadius: '8px', textAlign: 'left', cursor: 'pointer' }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#166534' }}>👮 ROLE 2: MUNICIPAL OFFICER</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>officer.ward112@bbmp.gov.in</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Pass: officer123</div>
              </button>

              <button 
                onClick={() => fillDemoAccount('admin@bbmp.gov.in', 'admin123')}
                style={{ background: 'white', border: '1px solid #cbd5e1', padding: '0.65rem 0.85rem', borderRadius: '8px', textAlign: 'left', cursor: 'pointer' }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#7e22ce' }}>👑 ROLE 3: ADMIN</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>admin@bbmp.gov.in</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Pass: admin123</div>
              </button>
            </div>
          </div>

          {/* Main Auth Container */}
          <div style={{ background: 'white', borderRadius: '14px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 8px 30px rgba(0,0,0,0.05)' }}>
            
            {/* Auth Tab Headers */}
            {activeTab !== 'forgot' ? (
              <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                <button
                  onClick={() => setActiveTab('login')}
                  style={{
                    flex: 1,
                    padding: '1.15rem',
                    fontSize: '1rem',
                    fontWeight: 700,
                    border: 'none',
                    background: activeTab === 'login' ? 'white' : 'transparent',
                    color: activeTab === 'login' ? '#008b95' : '#64748b',
                    borderBottom: activeTab === 'login' ? '3px solid #008b95' : 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <Lock size={18} /> Sign In
                </button>

                <button
                  onClick={() => setActiveTab('register')}
                  style={{
                    flex: 1,
                    padding: '1.15rem',
                    fontSize: '1rem',
                    fontWeight: 700,
                    border: 'none',
                    background: activeTab === 'register' ? 'white' : 'transparent',
                    color: activeTab === 'register' ? '#008b95' : '#64748b',
                    borderBottom: activeTab === 'register' ? '3px solid #008b95' : 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <UserCheck size={18} /> Public Citizen Registration
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#008b95',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <ArrowLeft size={16} /> Back to Sign In
                </button>

                <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <KeyRound size={15} style={{ color: '#0d9488' }} /> Password Recovery Mode
                </span>
              </div>
            )}

            <div style={{ padding: '2.5rem' }}>

              {/* TAB 1: LOGIN FORM */}
              {activeTab === 'login' && (
                <div style={{ maxWidth: '550px', margin: '0 auto' }}>
                  <h3 style={{ color: 'var(--color-primary)', fontSize: '1.35rem', margin: '0 0 0.5rem 0', textAlign: 'center' }}>
                    Single Sign-On Login
                  </h3>
                  <p style={{ color: '#64748b', fontSize: '0.925rem', textAlign: 'center', marginBottom: '2rem' }}>
                    Enter your registered email or username to access your assigned dashboard.
                  </p>

                  {authError && (
                    <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '0.85rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                      ⚠️ {authError}
                    </div>
                  )}

                  <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.35rem' }}>Email or Username *</label>
                      <div style={{ position: 'relative' }}>
                        <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input 
                          type="text" required
                          placeholder="e.g. citizen@bbmp.gov.in or officer"
                          value={loginId}
                          onChange={(e) => setLoginId(e.target.value)}
                          style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                        />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600, margin: 0 }}>Password *</label>
                        <button
                          type="button"
                          onClick={() => {
                            setForgotId(loginId || '');
                            setForgotStep(1);
                            setForgotError('');
                            setForgotSuccess('');
                            setActiveTab('forgot');
                          }}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#008b95',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            padding: 0,
                            textDecoration: 'underline'
                          }}
                        >
                          Forgot Password?
                        </button>
                      </div>
                      <div style={{ position: 'relative' }}>
                        <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input 
                          type={showLoginPassword ? 'text' : 'password'} 
                          required
                          placeholder="Enter your password"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          style={{ width: '100%', padding: '0.75rem 2.8rem 0.75rem 2.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                          style={{
                            position: 'absolute',
                            right: '0.85rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#64748b',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '4px'
                          }}
                          title={showLoginPassword ? "Hide password" : "Show password"}
                        >
                          {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      disabled={loading}
                      className="btn btn-primary"
                      style={{ width: '100%', padding: '0.85rem', background: '#008b95', borderColor: '#008b95', fontSize: '1rem', marginTop: '0.5rem', fontWeight: 700 }}
                    >
                      {loading ? 'Authenticating...' : 'Sign In & Access Portal'} <ArrowRight size={16} />
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 2: PUBLIC CITIZEN REGISTRATION FORM */}
              {activeTab === 'register' && (
                <div style={{ maxWidth: '650px', margin: '0 auto' }}>
                  
                  {/* Security Notice for Officer / Admin Accounts */}
                  <div style={{ background: '#fffbe5', border: '1px solid #fde047', padding: '1rem 1.25rem', borderRadius: '8px', marginBottom: '2rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <AlertTriangle size={22} style={{ color: '#b45309', flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <h5 style={{ margin: '0 0 0.25rem 0', color: '#92400e', fontSize: '0.95rem', fontWeight: 700 }}>
                        Important Security Notice:
                      </h5>
                      <p style={{ margin: 0, color: '#78350f', fontSize: '0.875rem', lineHeight: '1.4' }}>
                        This public registration page is strictly for <strong>Citizen Account Creation</strong>. Municipal Officer and Department Admin accounts cannot be created here; they are managed directly by authorized system administrators.
                      </p>
                    </div>
                  </div>

                  <h3 style={{ color: 'var(--color-primary)', fontSize: '1.35rem', margin: '0 0 0.5rem 0', textAlign: 'center' }}>
                    Create New Citizen Account
                  </h3>
                  <p style={{ color: '#64748b', fontSize: '0.925rem', textAlign: 'center', marginBottom: '2rem' }}>
                    Register your citizen account to track certificate applications, log road & water complaints, and save municipal events.
                  </p>

                  {regError && (
                    <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '0.85rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                      ⚠️ {regError}
                    </div>
                  )}

                  <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.35rem' }}>Full Name *</label>
                        <input 
                          type="text" required
                          placeholder="e.g. Smt. Kavitha Sharma"
                          value={regForm.fullName}
                          onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
                          style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.35rem' }}>Email Address *</label>
                        <input 
                          type="email" required
                          placeholder="e.g. kavitha@example.com"
                          value={regForm.email}
                          onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                          style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.35rem' }}>Mobile Number *</label>
                        <input 
                          type="tel" required
                          placeholder="10-Digit Mobile No"
                          value={regForm.mobile}
                          onChange={(e) => setRegForm({ ...regForm, mobile: e.target.value })}
                          style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.35rem' }}>Residential Address *</label>
                        <input 
                          type="text" required
                          placeholder="House No, Street, Ward Name"
                          value={regForm.address}
                          onChange={(e) => setRegForm({ ...regForm, address: e.target.value })}
                          style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.35rem' }}>Password *</label>
                        <input 
                          type="password" required
                          placeholder="At least 6 characters"
                          value={regForm.password}
                          onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                          style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.35rem' }}>Confirm Password *</label>
                        <input 
                          type="password" required
                          placeholder="Re-enter password"
                          value={regForm.confirmPassword}
                          onChange={(e) => setRegForm({ ...regForm, confirmPassword: e.target.value })}
                          style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                        />
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      disabled={loading}
                      className="btn btn-primary"
                      style={{ width: '100%', padding: '0.85rem', background: '#008b95', borderColor: '#008b95', fontSize: '1rem', marginTop: '0.5rem', fontWeight: 700 }}
                    >
                      {loading ? 'Creating Account...' : 'Register Citizen Account'} <ArrowRight size={16} />
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 3: FORGOT PASSWORD / PASSWORD RESET */}
              {activeTab === 'forgot' && (
                <div style={{ maxWidth: '550px', margin: '0 auto' }}>
                  <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                    <div style={{ width: '54px', height: '54px', borderRadius: '50%', background: '#f0fdfa', border: '1px solid #99f6e4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                      <KeyRound size={26} style={{ color: '#0d9488' }} />
                    </div>
                    <h3 style={{ color: 'var(--color-primary)', fontSize: '1.4rem', margin: '0 0 0.4rem 0', fontWeight: 800 }}>
                      Reset Your Password
                    </h3>
                    <p style={{ color: '#64748b', fontSize: '0.925rem', margin: 0 }}>
                      {forgotStep === 1 
                        ? 'Enter your registered email or username to verify your account.' 
                        : 'Enter the 6-digit security code and choose your new password.'}
                    </p>
                  </div>

                  {forgotError && (
                    <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '0.85rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                      ⚠️ {forgotError}
                    </div>
                  )}

                  {forgotSuccess && (
                    <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', padding: '0.85rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <CheckCircle2 size={18} style={{ color: '#16a34a', flexShrink: 0 }} />
                      <span>{forgotSuccess}</span>
                    </div>
                  )}

                  {/* FORGOT STEP 1: VERIFY EMAIL / USERNAME */}
                  {forgotStep === 1 && (
                    <form onSubmit={handleForgotVerify} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                          Registered Email Address or Username *
                        </label>
                        <div style={{ position: 'relative' }}>
                          <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                          <input 
                            type="text" required
                            placeholder="e.g. citizen@bbmp.gov.in"
                            value={forgotId}
                            onChange={(e) => setForgotId(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                          />
                        </div>
                      </div>

                      <button 
                        type="submit" 
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '0.85rem', background: '#008b95', borderColor: '#008b95', fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                      >
                        Verify Account & Send Security Code <ArrowRight size={16} />
                      </button>

                      <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                        <button
                          type="button"
                          onClick={() => setActiveTab('login')}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#64748b',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem'
                          }}
                        >
                          <ArrowLeft size={15} /> Back to Sign In
                        </button>
                      </div>
                    </form>
                  )}

                  {/* FORGOT STEP 2: ENTER OTP & NEW PASSWORD */}
                  {forgotStep === 2 && (
                    <form onSubmit={handleForgotResetSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.875rem', color: '#334155' }}>
                        Resetting password for: <strong>{forgotId}</strong>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                          6-Digit Verification Security Code *
                        </label>
                        <input 
                          type="text" required
                          placeholder="Enter 6-digit code (e.g. 892014)"
                          value={forgotOtp}
                          onChange={(e) => setForgotOtp(e.target.value)}
                          style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', letterSpacing: '2px', fontWeight: 700 }}
                        />
                        <span style={{ fontSize: '0.75rem', color: '#0d9488', marginTop: '0.25rem', display: 'block' }}>
                          💡 Demo Code: <strong>892014</strong> (Pre-filled for your convenience)
                        </span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                            New Password *
                          </label>
                          <div style={{ position: 'relative' }}>
                            <input 
                              type={showForgotNewPassword ? 'text' : 'password'} 
                              required
                              autoComplete="new-password"
                              placeholder="At least 6 chars"
                              value={forgotNewPassword}
                              onChange={(e) => setForgotNewPassword(e.target.value)}
                              style={{ width: '100%', padding: '0.75rem 2.4rem 0.75rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                            />
                            <button
                              type="button"
                              onClick={() => setShowForgotNewPassword(!showForgotNewPassword)}
                              style={{ position: 'absolute', right: '0.65rem', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', padding: '2px' }}
                              title={showForgotNewPassword ? "Hide password" : "Show password"}
                            >
                              {showForgotNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                            Confirm New Password *
                          </label>
                          <div style={{ position: 'relative' }}>
                            <input 
                              type={showForgotConfirmPassword ? 'text' : 'password'} 
                              required
                              autoComplete="new-password"
                              placeholder="Re-enter password"
                              value={forgotConfirmPassword}
                              onChange={(e) => setForgotConfirmPassword(e.target.value)}
                              style={{ width: '100%', padding: '0.75rem 2.4rem 0.75rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                            />
                            <button
                              type="button"
                              onClick={() => setShowForgotConfirmPassword(!showForgotConfirmPassword)}
                              style={{ position: 'absolute', right: '0.65rem', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', padding: '2px' }}
                              title={showForgotConfirmPassword ? "Hide password" : "Show password"}
                            >
                              {showForgotConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                        </div>
                      </div>

                      <button 
                        type="submit" 
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '0.85rem', background: '#008b95', borderColor: '#008b95', fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                      >
                        <RefreshCw size={16} /> Reset & Update Password
                      </button>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                        <button
                          type="button"
                          onClick={() => setForgotStep(1)}
                          style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
                        >
                          ← Change Account
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveTab('login')}
                          style={{ background: 'transparent', border: 'none', color: '#008b95', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                        >
                          Back to Sign In
                        </button>
                      </div>
                    </form>
                  )}

                </div>
              )}

            </div>
          </div>

        </div>
      </section>
    </div>
  );
};
