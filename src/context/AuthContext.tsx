import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, UserRole } from '../types/index.ts';
import { api, getStoredToken, getStoredUser, saveAuthData, clearAuthData } from '../services/api.ts';
import { sendMobileOtp, verifyMobileOtp, sendEmailOtp, verifyEmailOtp } from '../lib/supabase.ts';
import {
  auth,
  googleProvider,
  signInWithPopup,
  firebaseSignOut,
  syncUserProfileToDatabase,
} from '../lib/firebase.ts';
import type { OnboardingInput } from '../lib/validation/auth.ts';

interface VerifyAuthResult {
  user: User;
  onboardingCompleted: boolean;
  redirect: '/dashboard' | '/onboarding';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  sessionExpired: boolean;
  clearSessionExpired: () => void;
  sendPhoneOtp: (phone: string) => Promise<{ message: string; demoOtp?: string; expiresInSeconds?: number }>;
  verifyPhoneOtp: (phone: string, otp: string) => Promise<VerifyAuthResult>;
  sendEmailOtp: (email: string) => Promise<{ message: string; demoOtp?: string; expiresInSeconds?: number }>;
  verifyEmailOtp: (email: string, otp: string) => Promise<VerifyAuthResult>;
  signInWithGoogle: () => Promise<VerifyAuthResult>;
  completeOnboarding: (data: OnboardingInput) => Promise<User>;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; phone: string; password: string; role?: UserRole; clubWing?: string }) => Promise<void>;
  quickLogin: (role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(getStoredUser());
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sessionExpired, setSessionExpired] = useState<boolean>(false);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = getStoredToken();
      if (storedToken) {
        try {
          const freshUser = await api.getMe();
          setUser(freshUser);
        } catch {
          // Token expired or invalid
          clearAuthData();
          setUser(null);
          setToken(null);
          setSessionExpired(true);
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const clearSessionExpired = () => {
    setSessionExpired(false);
  };

  /**
   * Send OTP to Nepal mobile number (+977 96/97/98)
   */
  const handleSendPhoneOtp = async (phone: string) => {
    setIsLoading(true);
    try {
      const result = await sendMobileOtp(phone);
      return {
        message: result.message,
        demoOtp: result.demoOtp,
        expiresInSeconds: result.expiresInSeconds,
      };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Verify Nepal mobile number OTP
   * Flow: Verify OTP -> GET /me -> check if onboarding complete
   */
  const handleVerifyPhoneOtp = async (phone: string, otp: string): Promise<VerifyAuthResult> => {
    setIsLoading(true);
    try {
      const result = await verifyMobileOtp(phone, otp);
      const activeToken = result.token || `tok-${result.user?.id || 'usr'}-${Date.now()}`;
      setToken(activeToken);

      // GET /me to confirm full fresh profile and onboarding status
      let currentUser: User = result.user;
      try {
        currentUser = await api.getMe();
      } catch {
        // Fallback to returned user from verify
      }

      // CRITICAL: Persist authentication session to localStorage so onboarding is authorized
      saveAuthData(activeToken, currentUser);
      setUser(currentUser);
      setSessionExpired(false);

      // Persist authenticated profile to Firestore database
      try {
        await syncUserProfileToDatabase({
          id: currentUser.id,
          name: currentUser.name,
          email: currentUser.email,
          phone: currentUser.phone,
          role: currentUser.role,
          province: currentUser.province,
          district: currentUser.district,
          localLevel: currentUser.localLevel,
          ward: currentUser.ward,
          preferredLanguage: currentUser.preferredLanguage,
          onboardingCompleted: currentUser.onboardingCompleted,
          avatar: currentUser.avatar,
        });
      } catch (dbErr) {
        console.warn('Firestore database sync warning:', dbErr);
      }

      const isOnboarded = Boolean(currentUser.onboardingCompleted);
      const redirect = isOnboarded ? '/dashboard' : '/onboarding';

      return {
        user: currentUser,
        onboardingCompleted: isOnboarded,
        redirect,
      };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Send OTP to email fallback
   */
  const handleSendEmailOtp = async (email: string) => {
    setIsLoading(true);
    try {
      const result = await sendEmailOtp(email);
      return {
        message: result.message,
        demoOtp: result.demoOtp,
        expiresInSeconds: result.expiresInSeconds,
      };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Verify email OTP
   */
  const handleVerifyEmailOtp = async (email: string, otp: string): Promise<VerifyAuthResult> => {
    setIsLoading(true);
    try {
      const result = await verifyEmailOtp(email, otp);
      const activeToken = result.token || `tok-${result.user?.id || 'usr'}-${Date.now()}`;
      setToken(activeToken);

      let currentUser: User = result.user;
      try {
        currentUser = await api.getMe();
      } catch {
        // Fallback
      }

      // CRITICAL: Persist authentication session to localStorage so onboarding is authorized
      saveAuthData(activeToken, currentUser);
      setUser(currentUser);
      setSessionExpired(false);

      // Persist authenticated email profile to Firestore database
      try {
        await syncUserProfileToDatabase({
          id: currentUser.id,
          name: currentUser.name,
          email: currentUser.email,
          phone: currentUser.phone,
          role: currentUser.role,
          province: currentUser.province,
          district: currentUser.district,
          localLevel: currentUser.localLevel,
          ward: currentUser.ward,
          preferredLanguage: currentUser.preferredLanguage,
          onboardingCompleted: currentUser.onboardingCompleted,
          avatar: currentUser.avatar,
        });
      } catch (dbErr) {
        console.warn('Firestore database sync warning:', dbErr);
      }

      const isOnboarded = Boolean(currentUser.onboardingCompleted);
      const redirect = isOnboarded ? '/dashboard' : '/onboarding';

      return {
        user: currentUser,
        onboardingCompleted: isOnboarded,
        redirect,
      };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Sign In with Google via Firebase Auth and sync to Firestore
   */
  const handleSignInWithGoogle = async (): Promise<VerifyAuthResult> => {
    setIsLoading(true);
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      const gUser = cred.user;
      const email = gUser.email || '';
      const name = gUser.displayName || email.split('@')[0] || 'Nawa Yuwa Member';
      const phone = gUser.phoneNumber || '';
      const avatar = gUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80';

      let appUser: User;
      let userToken = '';
      try {
        const loginRes = await api.login(email, 'google-oauth-pass').catch(() => null);
        if (loginRes) {
          appUser = loginRes.user;
          userToken = loginRes.token;
        } else {
          const regRes = await api.register({
            name,
            email,
            phone,
            password: 'google-oauth-pass',
            role: 'member',
            clubWing: 'Youth & Civic Action Wing',
          });
          appUser = regRes.user;
          userToken = regRes.token;
        }
      } catch {
        appUser = {
          id: gUser.uid,
          name,
          email,
          phone,
          role: 'member',
          clubWing: 'Youth & Civic Action Wing',
          membershipId: `NYC-2026-${gUser.uid.slice(0, 4).toUpperCase()}`,
          joinedDate: new Date().toISOString().split('T')[0],
          status: 'active',
          avatar,
          bio: 'Nawa Yuwa Foundation Member',
          volunteerHours: 0,
          onboardingCompleted: false,
        };
        userToken = await gUser.getIdToken();
      }

      // Persist to Firestore database
      try {
        await syncUserProfileToDatabase({
          id: appUser.id,
          name: appUser.name,
          email: appUser.email,
          phone: appUser.phone,
          role: appUser.role,
          province: appUser.province,
          district: appUser.district,
          localLevel: appUser.localLevel,
          ward: appUser.ward,
          preferredLanguage: appUser.preferredLanguage,
          onboardingCompleted: appUser.onboardingCompleted,
          avatar: appUser.avatar,
        });
      } catch (dbErr) {
        console.warn('Firestore database sync warning:', dbErr);
      }

      saveAuthData(userToken, appUser);
      setUser(appUser);
      setToken(userToken);
      setSessionExpired(false);

      const isOnboarded = Boolean(appUser.onboardingCompleted);
      const redirect = isOnboarded ? '/dashboard' : '/onboarding';

      return {
        user: appUser,
        onboardingCompleted: isOnboarded,
        redirect,
      };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Complete Member Onboarding
   */
  const handleCompleteOnboarding = async (data: OnboardingInput): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await api.completeOnboarding(data);
      const activeToken = token || getStoredToken() || `tok-${res.user.id}-${Date.now()}`;
      saveAuthData(activeToken, res.user);
      setToken(activeToken);
      setUser(res.user);

      // Persist complete onboarding profile to Firestore database
      try {
        await syncUserProfileToDatabase({
          id: res.user.id,
          name: res.user.name,
          email: res.user.email,
          phone: res.user.phone,
          role: res.user.role,
          province: res.user.province,
          district: res.user.district,
          localLevel: res.user.localLevel,
          ward: res.user.ward,
          preferredLanguage: res.user.preferredLanguage,
          onboardingCompleted: true,
          avatar: res.user.avatar,
        });
      } catch (dbErr) {
        console.warn('Firestore database sync warning:', dbErr);
      }

      return res.user;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.login(email, password);
      setUser(res.user);
      setToken(res.token);
      setSessionExpired(false);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: { name: string; email: string; phone: string; password: string; role?: UserRole; clubWing?: string }) => {
    setIsLoading(true);
    try {
      const res = await api.register(data);
      setUser(res.user);
      setToken(res.token);
      setSessionExpired(false);
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = async (role: UserRole) => {
    setIsLoading(true);
    try {
      const res = await api.quickLogin(role);
      setUser(res.user);
      setToken(res.token);
      setSessionExpired(false);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await api.logout().catch(() => {});
      await firebaseSignOut(auth).catch(() => {});
    } finally {
      setUser(null);
      setToken(null);
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    const updated = await api.updateProfile(updates);
    setUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        sessionExpired,
        clearSessionExpired,
        sendPhoneOtp: handleSendPhoneOtp,
        verifyPhoneOtp: handleVerifyPhoneOtp,
        sendEmailOtp: handleSendEmailOtp,
        verifyEmailOtp: handleVerifyEmailOtp,
        signInWithGoogle: handleSignInWithGoogle,
        completeOnboarding: handleCompleteOnboarding,
        login,
        register,
        quickLogin,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
