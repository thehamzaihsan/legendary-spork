import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentCancel = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col gap-4 items-center justify-center bg-black text-white">
      <div className="text-yellow-300">Payment canceled.</div>
      <button
        onClick={() => navigate('/')} 
        className="px-4 py-2 rounded bg-purple-600 hover:bg-purple-700"
      >
        Go back
      </button>
    </div>
  );
};

export default PaymentCancel;


