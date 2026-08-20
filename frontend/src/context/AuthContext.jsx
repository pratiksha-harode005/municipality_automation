import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const USERS_STORAGE_KEY = 'bbmp_portal_users_v3';
const CURRENT_USER_KEY = 'bbmp_portal_current_user_v3';
const CURRENT_TOKEN_KEY = 'bbmp_portal_token_v3';

// Pre-seeded Demo Accounts for the 4 Roles
const INITIAL_DEMO_USERS = [
  {
    id: 'user-citizen-1',
    email: 'citizen@bbmp.gov.in',
    username: 'citizen',
    password: 'citizen123',
    fullName: 'Smt. Kavitha R.',
    role: 'citizen',
    mobile: '98450 11223',
    address: '14th Cross, Malleshwaram, Ward 112, Bengaluru',
    createdAt: '2026-08-01'
  },
  {
    id: 'user-citizen-pratiksha',
    email: 'pratiksha@bbmp.gov.in',
    username: 'pratiksha',
    password: 'pratiksha123',
    fullName: 'Pratiksha',
    role: 'citizen',
    mobile: '98765 43210',
    address: '12th Main, Malleshwaram, Ward 112, Bengaluru',
    createdAt: '2026-08-18'
  },
  {
    id: 'user-citizen-prit',
    email: 'prit@bbmp.gov.in',
    username: 'prit',
    password: 'prit123',
    fullName: 'Prit',
    role: 'citizen',
    mobile: '98765 43211',
    address: 'Sector 2, HSR Layout, Ward 174, Bengaluru',
    createdAt: '2026-08-18'
  },
  {
    id: 'user-citizen-poobi',
    email: 'poobi@bbmp.gov.in',
    username: 'poobi',
    password: 'poobi123',
    fullName: 'Poobi',
    role: 'citizen',
    mobile: '98765 43212',
    address: '100ft Road, Indiranagar, Ward 84, Bengaluru',
    createdAt: '2026-08-18'
  },
  // 6 Official Municipal Officers Across Civil & Medical Departments
  {
    id: 'user-officer-1',
    email: 'officer.ward112@bbmp.gov.in',
    username: 'officer',
    password: 'officer123',
    fullName: 'Er. Rajesh Kumar',
    role: 'officer',
    departmentId: 'dept-civil',
    department: 'Civil Department',
    assignedService: '1. Road & Streetlight Complaints',
    ward: 'Ward 112 (Malleshwaram)',
    mobile: '94806 88112',
    status: 'active',
    createdAt: '2026-07-15'
  },
  {
    id: 'user-officer-2',
    email: 'officer.water@bbmp.gov.in',
    username: 'officer_water',
    password: 'officer123',
    fullName: 'Er. Suresh Gowda',
    role: 'officer',
    departmentId: 'dept-civil',
    department: 'Civil Department',
    assignedService: '2. Water & Sewerage Services',
    ward: 'Ward 84 (Indiranagar)',
    mobile: '94806 88113',
    status: 'active',
    createdAt: '2026-07-16'
  },
  {
    id: 'user-officer-3',
    email: 'officer.sanitation@bbmp.gov.in',
    username: 'officer_sanitation',
    password: 'officer123',
    fullName: 'Sri Ramesh Patil',
    role: 'officer',
    departmentId: 'dept-civil',
    department: 'Civil Department',
    assignedService: '3. Waste Management & Sanitation',
    ward: 'Ward 174 (HSR Layout)',
    mobile: '94806 88114',
    status: 'active',
    createdAt: '2026-07-17'
  },
  {
    id: 'user-officer-4',
    email: 'officer.vital@bbmp.gov.in',
    username: 'officer_vital',
    password: 'officer123',
    fullName: 'Dr. Ananya Sharma',
    role: 'officer',
    departmentId: 'dept-medical',
    department: 'Medical Department',
    assignedService: '4. Birth & Death Certificates',
    ward: 'Ward 112 (Malleshwaram)',
    mobile: '94806 88115',
    status: 'active',
    createdAt: '2026-07-18'
  },
  {
    id: 'user-officer-5',
    email: 'officer.health@bbmp.gov.in',
    username: 'officer_health',
    password: 'officer123',
    fullName: 'Dr. Vikram Hegde',
    role: 'officer',
    departmentId: 'dept-medical',
    department: 'Medical Department',
    assignedService: '4. Birth & Death Certificates',
    ward: 'Ward 150 (Bellandur)',
    mobile: '94806 88116',
    status: 'active',
    createdAt: '2026-07-19'
  },
  {
    id: 'user-officer-6',
    email: 'officer.civil@bbmp.gov.in',
    username: 'officer_civil',
    password: 'officer123',
    fullName: 'Er. Manjunath Swamy',
    role: 'officer',
    departmentId: 'dept-civil',
    department: 'Civil Department',
    assignedService: 'All Civil Services',
    ward: 'All Wards (Central Headquarter)',
    mobile: '94806 88117',
    status: 'active',
    createdAt: '2026-07-20'
  },
  {
    id: 'user-superadmin-1',
    email: 'admin@bbmp.gov.in',
    username: 'admin',
    password: 'admin123',
    fullName: 'Administrator',
    role: 'super_admin',
    department: 'Greater Bengaluru Authority',
    mobile: '080 2297 5555',
    status: 'active',
    createdAt: '2026-01-01'
  }
];

export const AuthProvider = ({ children }) => {
  // Initialize users list with fallback merging
  const [usersList, setUsersList] = useState(() => {
    try {
      let merged = [...INITIAL_DEMO_USERS];
      
      ['bbmp_portal_users_v3', 'bbmp_portal_users_v2', 'bbmp_portal_users_v1', 'bbmp_portal_users'].forEach(storageKey => {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) {
              parsed.forEach(userObj => {
                // Ignore removed obsolete dept_admin demo accounts
                if (userObj && userObj.email) {
                  const emailLower = userObj.email.toLowerCase();
                  if (emailLower === 'dept.pwd@bbmp.gov.in' || emailLower === 'dept.revenue@bbmp.gov.in' || userObj.role === 'dept_admin') {
                    return;
                  }
                  if (!merged.some(u => u.email.toLowerCase() === emailLower)) {
                    merged.push(userObj);
                  }
                }
              });
            }
          } catch (err) {}
        }
      });

      // Ensure all initial demo users (including all 6 official municipal officers) are present in the list
      INITIAL_DEMO_USERS.forEach(demoUser => {
        const idx = merged.findIndex(u => u.email.toLowerCase() === demoUser.email.toLowerCase());
        if (idx === -1) {
          merged.push(demoUser);
        } else {
          // Merge updated department and assigned service
          merged[idx] = { ...demoUser, ...merged[idx] };
        }
      });

      // Filter out any leftover obsolete accounts
      merged = merged.filter(u => {
        const emailLower = u.email?.toLowerCase();
        return emailLower !== 'dept.pwd@bbmp.gov.in' && emailLower !== 'dept.revenue@bbmp.gov.in' && u.role !== 'dept_admin';
      });

      return merged;
    } catch (e) {
      console.error("Failed to parse stored users:", e);
    }
    return INITIAL_DEMO_USERS;
  });

  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(CURRENT_USER_KEY);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem(CURRENT_TOKEN_KEY) || null;
  });

  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Sync usersList with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(usersList));
    } catch (e) {
      console.error("Failed to save users database:", e);
    }
  }, [usersList]);

  // Listen to cross-tab storage changes for real-time live sync
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === USERS_STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            const cleaned = parsed.filter(u => {
              const emailLower = u.email?.toLowerCase();
              return emailLower !== 'dept.pwd@bbmp.gov.in' && emailLower !== 'dept.revenue@bbmp.gov.in' && u.role !== 'dept_admin';
            });
            setUsersList(cleaned);
          }
        } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Sync current user with localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  }, [user]);

  // Sync token with localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem(CURRENT_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(CURRENT_TOKEN_KEY);
    }
  }, [token]);

  // LOGIN FUNCTION
  const login = async (loginId, password) => {
    setLoading(true);
    setAuthError(null);

    const cleanId = (loginId || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    // 1. Match against active users database
    let found = usersList.find(
      u => (u.email?.toLowerCase() === cleanId || 
            (u.username && u.username.toLowerCase() === cleanId) ||
            (u.fullName && u.fullName.toLowerCase() === cleanId)) && 
           (u.password === password || u.password === cleanPass)
    );

    // 2. Demo accounts fallback check
    if (!found) {
      found = INITIAL_DEMO_USERS.find(
        u => (u.email?.toLowerCase() === cleanId || 
              (u.username && u.username.toLowerCase() === cleanId) ||
              (u.fullName && u.fullName.toLowerCase() === cleanId)) && 
             (u.password === password || u.password === cleanPass)
      );
      if (found) {
        setUsersList(prev => [...prev.filter(u => u.email.toLowerCase() !== found.email.toLowerCase()), found]);
      }
    }

    // 3. Fallback check for demo accounts default password
    if (!found) {
      const demoMatch = INITIAL_DEMO_USERS.find(
        u => u.email?.toLowerCase() === cleanId || (u.username && u.username.toLowerCase() === cleanId)
      );
      if (demoMatch && (demoMatch.password === password || demoMatch.password === cleanPass)) {
        found = demoMatch;
        setUsersList(prev => [...prev.filter(u => u.email.toLowerCase() !== found.email.toLowerCase()), found]);
      }
    }

    if (found) {
      const generateToken = `jwt-token-${found.role}-${Date.now()}`;
      setUser(found);
      setToken(generateToken);
      setLoading(false);

      // Determine default dashboard route
      let redirectPath = '/citizen-dashboard';
      if (found.role === 'officer') redirectPath = '/officer-dashboard';
      if (found.role === 'dept_admin') redirectPath = '/dept-admin-dashboard';
      if (found.role === 'super_admin') redirectPath = '/super-admin-dashboard';

      return { success: true, user: found, redirectPath };
    } else {
      const errorMsg = 'Invalid username/email or password.';
      setAuthError(errorMsg);
      setLoading(false);
      return { success: false, error: errorMsg };
    }
  };

  // PUBLIC CITIZEN REGISTRATION FUNCTION (Strictly sets role = 'citizen')
  const registerCitizen = async ({ fullName, email, mobile, address, password }) => {
    setLoading(true);
    setAuthError(null);

    const cleanEmail = email.trim().toLowerCase();

    // Check if email already exists
    const exists = usersList.some(u => u.email.toLowerCase() === cleanEmail);
    if (exists) {
      const errorMsg = `An account with email ${cleanEmail} already exists.`;
      setAuthError(errorMsg);
      setLoading(false);
      return { success: false, error: errorMsg };
    }

    const newCitizen = {
      id: `citizen-${Date.now()}`,
      email: cleanEmail,
      username: cleanEmail.split('@')[0],
      password,
      fullName,
      role: 'citizen', // Strictly Citizen role
      mobile,
      address: address || 'Bengaluru, Karnataka',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setUsersList(prev => [newCitizen, ...prev]);

    // Auto login after registration
    const generateToken = `jwt-token-citizen-${Date.now()}`;
    setUser(newCitizen);
    setToken(generateToken);
    setLoading(false);

    return { success: true, user: newCitizen, redirectPath: '/citizen-dashboard' };
  };

  // ADMIN-ONLY USER CREATION FUNCTION (For Officers & System Admins)
  const createOfficerOrAdminAccount = async ({ fullName, email, role, department, assignedService, ward, mobile, password, status }) => {
    if (!user || (user.role !== 'super_admin' && user.role !== 'dept_admin')) {
      return { success: false, error: 'Unauthorized: Only Admins can create Officer & Admin accounts.' };
    }

    const cleanEmail = email.trim().toLowerCase();
    const exists = usersList.some(u => u.email.toLowerCase() === cleanEmail);
    if (exists) {
      return { success: false, error: `Account with email ${cleanEmail} already exists.` };
    }

    const newUser = {
      id: `user-${role}-${Date.now()}`,
      email: cleanEmail,
      username: cleanEmail.split('@')[0],
      password,
      fullName,
      role: role || 'officer', // 'officer' or 'super_admin'
      department: department || 'Civil Department',
      assignedService: assignedService || 'All Department Services',
      ward: ward || 'Ward 112 (Malleshwaram)',
      mobile: mobile || '94806 00000',
      status: status || 'active',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setUsersList(prev => [newUser, ...prev]);
    return { success: true, user: newUser };
  };

  // UPDATE USER ACCOUNT (Admin only)
  const updateUser = (userId, updatedFields) => {
    setUsersList(prev => prev.map(u => {
      if (u.id === userId) {
        const updated = { ...u, ...updatedFields };
        if (user && user.id === userId) {
          setUser(updated);
        }
        return updated;
      }
      return u;
    }));
    return { success: true };
  };

  // TOGGLE USER ACTIVE / INACTIVE STATUS
  const toggleUserStatus = (userId) => {
    setUsersList(prev => prev.map(u => {
      if (u.id === userId) {
        const newStatus = u.status === 'inactive' ? 'active' : 'inactive';
        const updated = { ...u, status: newStatus };
        if (user && user.id === userId) {
          setUser(updated);
        }
        return updated;
      }
      return u;
    }));
  };

  // RESET PASSWORD FUNCTION
  const resetPassword = async (loginId, newPassword) => {
    setLoading(true);
    setAuthError(null);

    const clean = loginId.trim().toLowerCase();
    const userIndex = usersList.findIndex(
      u => u.email.toLowerCase() === clean || u.username.toLowerCase() === clean
    );

    if (userIndex === -1) {
      const errorMsg = 'No account found with this email or username.';
      setAuthError(errorMsg);
      setLoading(false);
      return { success: false, error: errorMsg };
    }

    const updatedUser = {
      ...usersList[userIndex],
      password: newPassword
    };

    const updatedList = [...usersList];
    updatedList[userIndex] = updatedUser;
    setUsersList(updatedList);
    setLoading(false);

    return { success: true, user: updatedUser };
  };

  // DELETE USER ACCOUNT (Admin only)
  const deleteUser = (userId) => {
    setUsersList(prev => prev.filter(u => u.id !== userId));
  };

  // LOGOUT FUNCTION
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(CURRENT_TOKEN_KEY);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: !!user && !!token,
      isCitizen: user?.role === 'citizen',
      isOfficer: user?.role === 'officer',
      isDeptAdmin: user?.role === 'dept_admin',
      isSuperAdmin: user?.role === 'super_admin',
      usersList,
      loading,
      authError,
      login,
      registerCitizen,
      createOfficerOrAdminAccount,
      updateUser,
      toggleUserStatus,
      deleteUser,
      resetPassword,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: null,
      token: null,
      isAuthenticated: false,
      isCitizen: false,
      isOfficer: false,
      isDeptAdmin: false,
      isSuperAdmin: false,
      usersList: INITIAL_DEMO_USERS,
      loading: false,
      authError: null,
      login: async () => ({ success: false }),
      registerCitizen: async () => ({ success: false }),
      createOfficerOrAdminAccount: async () => ({ success: false }),
      resetPassword: async () => ({ success: false }),
      logout: () => {}
    };
  }
  return context;
};
