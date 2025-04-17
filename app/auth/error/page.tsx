'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = (error: string) => {
    switch (error) {
      case 'OAuthAccountNotLinked':
        return 'This email is already associated with another account. Please sign in with the correct provider.';
      case 'OAuthSignin':
        return 'Error in the OAuth sign-in process.';
      case 'OAuthCallback':
        return 'Error in the OAuth callback process.';
      case 'OAuthCreateAccount':
        return 'Could not create OAuth provider account.';
      case 'EmailCreateAccount':
        return 'Could not create email provider account.';
      case 'Callback':
        return 'Error in the OAuth callback handler route.';
      case 'OAuthAccountNotLinked':
        return 'Email on the account already exists with different credentials.';
      case 'EmailSignin':
        return 'Check your email address.';
      case 'CredentialsSignin':
        return 'Sign in failed. Check the details you provided are correct.';
      case 'SessionRequired':
        return 'Please sign in to access this page.';
      default:
        return 'An error occurred during authentication.';
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-center text-red-400 mb-8">Authentication Error</h1>
        <div className="text-blue-200 mb-8">
          {error && getErrorMessage(error)}
        </div>
        <div className="flex justify-center">
          <Link
            href="/"
            className="px-4 py-2 bg-blue-400 text-white rounded-md hover:bg-blue-500 transition-colors"
          >
            Return to Login
          </Link>
        </div>
      </div>
    </main>
  );
} 