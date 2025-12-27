import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function OAuth2Callback() {
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('Connecting to Google Drive...');

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Step 1: Get the authorization code from URL
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');

        if (error) {
          setStatus('error');
          setMessage(`Authorization failed: ${error}`);
          return;
        }

        if (!code) {
          setStatus('error');
          setMessage('No authorization code received');
          return;
        }

        // Step 2: Get current user
        const user = await base44.auth.me();

        // ===== CONFIGURATION SECTION =====
        // Update these values in Base44 Dashboard -> Settings -> Environment Variables
        // Or update them here directly (not recommended for security)
        
        const CLIENT_ID = '${GOOGLE_OAUTH_CLIENT_ID}'; // Set in Base44 secrets
        const CLIENT_SECRET = '${google_oauth_client_secret}'; // Set in Base44 secrets
        const REDIRECT_URI = 'https://breslov.base44.app/oauth2callback';
        
        // Scopes requested (add/remove as needed):
        // - https://www.googleapis.com/auth/drive.file (access files created by app)
        // - https://www.googleapis.com/auth/drive.readonly (read-only access)
        // - https://www.googleapis.com/auth/drive (full access)
        const SCOPES = [
          'https://www.googleapis.com/auth/drive.file',
          'https://www.googleapis.com/auth/drive.readonly'
        ];
        
        // ===== END CONFIGURATION SECTION =====

        setMessage('Exchanging authorization code for access token...');

        // Step 3: Exchange code for access token
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            code: code,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            redirect_uri: REDIRECT_URI,
            grant_type: 'authorization_code'
          })
        });

        if (!tokenResponse.ok) {
          const errorData = await tokenResponse.json();
          throw new Error(errorData.error_description || 'Failed to exchange code for token');
        }

        const tokenData = await tokenResponse.json();
        
        // Step 4: Calculate token expiration
        const expiresAt = new Date();
        expiresAt.setSeconds(expiresAt.getSeconds() + tokenData.expires_in);

        setMessage('Storing access token securely...');

        // Step 5: Store tokens in Base44
        const existingTokens = await base44.entities.GoogleDriveToken.filter({
          user_email: user.email
        });

        if (existingTokens.length > 0) {
          // Update existing token
          await base44.entities.GoogleDriveToken.update(existingTokens[0].id, {
            access_token: tokenData.access_token,
            refresh_token: tokenData.refresh_token || existingTokens[0].refresh_token,
            expires_at: expiresAt.toISOString(),
            scopes: tokenData.scope ? tokenData.scope.split(' ') : SCOPES
          });
        } else {
          // Create new token record
          await base44.entities.GoogleDriveToken.create({
            user_email: user.email,
            access_token: tokenData.access_token,
            refresh_token: tokenData.refresh_token,
            expires_at: expiresAt.toISOString(),
            scopes: tokenData.scope ? tokenData.scope.split(' ') : SCOPES
          });
        }

        setStatus('success');
        setMessage('Google Drive connected successfully!');

        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);

      } catch (error) {
        console.error('OAuth error:', error);
        setStatus('error');
        setMessage(error.message || 'Failed to complete authorization');
      }
    };

    handleOAuthCallback();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        {status === 'processing' && (
          <>
            <Loader2 className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-spin" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Connecting...</h2>
            <p className="text-slate-600">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Success!</h2>
            <p className="text-slate-600">{message}</p>
            <p className="text-sm text-slate-500 mt-4">Redirecting to dashboard...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Connection Failed</h2>
            <p className="text-slate-600 mb-4">{message}</p>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
            >
              Return to Dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
}