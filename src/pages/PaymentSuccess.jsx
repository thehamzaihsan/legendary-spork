import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { premiumApi } from '../services/premiumApi.js';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sessionId = params.get('session_id');
    const planId = params.get('plan');
    const idempotencyKey = sessionStorage.getItem('last_idempotency_key') || undefined;

    const verify = async () => {
      try {
        setVerifying(true);
        const redirectUrl = `${window.location.origin}/premium/thanks`;
        const resp = await premiumApi.verifyCheckout({
          stripeSessionId: sessionId,
          expectedPlanId: planId,
          redirectUrl,
          idempotencyKey,
        });
        if (resp?.success) {
          // Navigate to final page or close modal; here we just go back to home/community
          navigate('/');
        } else {
          setError('Verification not completed yet. Please refresh if needed.');
        }
      } catch (e) {
        setError(e?.response?.data?.message || e.message || 'Verification failed');
      } finally {
        setVerifying(false);
      }
    };

    if (sessionId && planId) verify();
    else {
      setError('Missing session information in URL');
      setVerifying(false);
    }
  }, [location, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      {verifying ? (
        <div>Verifying your payment…</div>
      ) : error ? (
        <div className="text-red-400">{error}</div>
      ) : (
        <div>Payment verified. Redirecting…</div>
      )}
    </div>
  );
};

export default PaymentSuccess;


