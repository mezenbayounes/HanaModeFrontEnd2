import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function GoogleCallbackPage() {
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get('token');
    const userParam = searchParams.get('user');

    console.log('Google Callback Params:', { token, userParam });

    if (token && userParam) {
      try {
        // Decode Base64
        const jsonString = atob(userParam);
        console.log('Decoded JSON:', jsonString);
        
        const user = JSON.parse(jsonString);
        console.log('Parsed User:', user);
        
        login(token, user);
        
        console.log('Login successful, redirecting...');
        // Use hard redirect to ensure clean state
        window.location.href = '/';
      } catch (error: any) {
        console.error('Failed to parse user data:', error);
        setErrorMsg(`Error: ${error.message}`);
      }
    } else {
        console.error('Missing token or user param');
        setErrorMsg('Missing token or user param');
    }
  }, [searchParams, login, navigate]);

  if (errorMsg) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center text-red-600">
            <h2 className="text-xl font-bold mb-2">Login Failed</h2>
            <p>{errorMsg}</p>
            <button onClick={() => navigate('/user-login')} className="mt-4 text-blue-600 underline">Back to Login</button>
          </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900">Completing sign in...</h2>
      </div>
    </div>
  );
}
