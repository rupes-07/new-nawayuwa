import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { normalizeToNepalE164 } from './validation/auth.ts';

// Client-safe publishable configuration only
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('your-project') &&
    supabaseUrl.startsWith('https://')
  );
};

export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export interface OtpSendResult {
  success: boolean;
  message: string;
  demoOtp?: string; // Provided in dev / demo mode for seamless user testing
  expiresInSeconds?: number;
}

export interface OtpVerifyResult {
  success: boolean;
  token: string;
  user: any;
  onboardingCompleted: boolean;
  message?: string;
}

/**
 * Sends OTP to a Nepal mobile number.
 * Uses Supabase Auth if publishable credentials are configured,
 * otherwise routes to the robust local backend OTP service.
 */
export async function sendMobileOtp(rawPhone: string): Promise<OtpSendResult> {
  const e164Phone = normalizeToNepalE164(rawPhone);

  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase.auth.signInWithOtp({
      phone: e164Phone,
    });
    if (error) {
      throw new Error(error.message);
    }
    return {
      success: true,
      message: `Verification code sent via SMS to ${e164Phone}`,
    };
  }

  // Fallback to civic backend OTP provider
  const res = await fetch('/api/auth/otp/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: e164Phone }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Failed to send verification code. Please check your network.');
  }

  return {
    success: true,
    message: data.message || `Verification code sent to ${e164Phone}`,
    demoOtp: data.demoOtp,
    expiresInSeconds: data.expiresInSeconds || 300,
  };
}

/**
 * Verifies mobile OTP.
 */
export async function verifyMobileOtp(rawPhone: string, otp: string): Promise<OtpVerifyResult> {
  const e164Phone = normalizeToNepalE164(rawPhone);

  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase.auth.verifyOtp({
      phone: e164Phone,
      token: otp,
      type: 'sms',
    });
    if (error) {
      if (error.message.toLowerCase().includes('expired')) {
        throw new Error('Verification code has expired. Please request a new code.');
      }
      throw new Error(error.message || 'Invalid verification code. Please try again.');
    }

    const session = data.session;
    const token = session?.access_token || '';

    // Fetch /me to check onboarding status
    const meRes = await fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const meData = await meRes.json().catch(() => ({}));

    return {
      success: true,
      token,
      user: meData.user || {
        id: session?.user.id,
        phone: e164Phone,
        name: session?.user.user_metadata?.full_name || '',
        onboardingCompleted: Boolean(session?.user.user_metadata?.onboardingCompleted),
      },
      onboardingCompleted: Boolean(meData.user?.onboardingCompleted ?? session?.user.user_metadata?.onboardingCompleted),
    };
  }

  // Fallback to civic backend OTP provider
  const res = await fetch('/api/auth/otp/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: e164Phone, otp }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Failed to verify OTP');
  }

  return {
    success: true,
    token: data.token,
    user: data.user,
    onboardingCompleted: Boolean(data.user?.onboardingCompleted),
    message: data.message,
  };
}

/**
 * Sends OTP to email address as fallback.
 */
export async function sendEmailOtp(email: string): Promise<OtpSendResult> {
  const cleanEmail = email.trim().toLowerCase();

  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase.auth.signInWithOtp({
      email: cleanEmail,
    });
    if (error) {
      throw new Error(error.message);
    }
    return {
      success: true,
      message: `Verification code sent to ${cleanEmail}`,
    };
  }

  const res = await fetch('/api/auth/otp/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: cleanEmail }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Failed to send verification code. Please check your email and network.');
  }

  return {
    success: true,
    message: data.message || `Verification code sent to ${cleanEmail}`,
    demoOtp: data.demoOtp,
    expiresInSeconds: data.expiresInSeconds || 300,
  };
}

/**
 * Verifies email OTP.
 */
export async function verifyEmailOtp(email: string, otp: string): Promise<OtpVerifyResult> {
  const cleanEmail = email.trim().toLowerCase();

  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase.auth.verifyOtp({
      email: cleanEmail,
      token: otp,
      type: 'email',
    });
    if (error) {
      if (error.message.toLowerCase().includes('expired')) {
        throw new Error('Verification code has expired. Please request a new code.');
      }
      throw new Error(error.message || 'Invalid verification code.');
    }

    const session = data.session;
    const token = session?.access_token || '';

    const meRes = await fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const meData = await meRes.json().catch(() => ({}));

    return {
      success: true,
      token,
      user: meData.user || {
        id: session?.user.id,
        email: cleanEmail,
        name: session?.user.user_metadata?.full_name || '',
        onboardingCompleted: Boolean(session?.user.user_metadata?.onboardingCompleted),
      },
      onboardingCompleted: Boolean(meData.user?.onboardingCompleted ?? session?.user.user_metadata?.onboardingCompleted),
    };
  }

  const res = await fetch('/api/auth/otp/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: cleanEmail, otp }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Failed to verify OTP');
  }

  return {
    success: true,
    token: data.token,
    user: data.user,
    onboardingCompleted: Boolean(data.user?.onboardingCompleted),
    message: data.message,
  };
}
