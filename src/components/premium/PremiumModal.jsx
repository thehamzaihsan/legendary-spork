import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { premiumApi } from "../../services/premiumApi";
import { useSocket } from "../../hooks/useSocket";
import { usePremiumStatus } from "../../hooks/usePremiumStatus";

// Import badge images
import arcaneBadge from "../../assets/arcanebadge.png";
import bronzeBadge from "../../assets/bronzebadge.png";
import goldBadge from "../../assets/goldbadge.png";

const PremiumModal = ({ isOpen, onClose }) => {
  const [selectedPlan, setSelectedPlan] = useState("30min");
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Premium status hook
  const { isPremium, refreshPremiumStatus } = usePremiumStatus();
  const { socket } = useSocket();

  // Plans shown to the user
  const plans = {
    "30min": {
      name: "30 Minutes Boost",
      tier: "Bronze",
      price: 5.0,
      badge: bronzeBadge,
      features: [
        "Get priority matching",
        "Match with users that match your preferences",
        "Ad-free experience",
        "Enhanced matching algorithm",
        "Premium chat features",
      ],
    },
    "1hour": {
      name: "1 Hour Boost",
      tier: "Gold",
      price: 8.99,
      badge: goldBadge,
      features: [
        "All 30min features",
        "Double the boosted time",
        "Extended preference settings",
      ],
    },
    "24hour": {
      name: "24 Hours Boost",
      tier: "Arcane",
      price: 14.99,
      badge: arcaneBadge,
      features: [
        "All 1 hour features",
        "Whole day of premium access",
        "Save your preferences for future sessions",
      ],
    },
  };

  const handlePaymentSuccess = (activationData) => {
    setPaymentSuccess(true);
    setPaymentError(null);

    // Refresh premium status to reflect changes
    refreshPremiumStatus();

    // Notify socket if connected (used by matching priority)
    if (socket) {
      socket.emit("setPremiumStatus", {
        isPremium: true,
        expiryDate: activationData?.expiry_time || activationData?.endAt,
      });
    }

    setTimeout(() => {
      onClose();
    }, 1500);
  };

  const handlePaymentError = (errorMessage) => {
    setPaymentError(errorMessage);
    setPaymentSuccess(false);
  };

  const startCheckout = async () => {
    try {
      setIsProcessing(true);
      setPaymentError(null);
      const idempotencyKey = (crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2));
      const successUrl = `${window.location.origin}/payment/success?plan=${selectedPlan}&session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${window.location.origin}/payment/cancel`;
      const { checkoutUrl } = await premiumApi.createCheckout({
        planId: selectedPlan,
        successUrl,
        cancelUrl,
        idempotencyKey,
      });
      window.location.href = checkoutUrl;
    } catch (e) {
      handlePaymentError(e?.response?.data?.message || e.message || 'Failed to start checkout');
    } finally {
      setIsProcessing(false);
    }
  };

  const backdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
  const modalVariants = {
    hidden: { scale: 0.8, opacity: 0, y: 50 },
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    exit: { scale: 0.8, opacity: 0, y: 50, transition: { duration: 0.2, ease: "easeOut" } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-xl p-2 sm:p-4"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={backdropVariants}
          onClick={onClose}
        >
          <motion.div
            className="relative bg-[#0d0721]/80 backdrop-blur-2xl w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg rounded-2xl p-4 sm:p-6 overflow-hidden text-white border border-white/20 shadow-2xl shadow-purple-500/20 z-[105] max-h-[95vh] overflow-y-auto"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/10 rounded-2xl pointer-events-none"></div>

            <button
              onClick={onClose}
              className="absolute top-2 right-2 sm:top-3 sm:right-3 z-[110] flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 bg-gray-800/80 rounded-full text-gray-300 hover:text-white hover:bg-gray-700 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center mb-4 sm:mb-6 pt-2">
              <div className="flex justify-center mb-2">
                <div className="text-3xl sm:text-4xl md:text-5xl">🐼</div>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-fuchsia-200 text-transparent bg-clip-text">
                Voodo Premium
              </h2>
              <p className="text-purple-300 mt-1 sm:mt-2 text-sm sm:text-base">Enhance your experience with premium</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2 mb-4 sm:mb-6">
              {Object.keys(plans).map((planId) => (
                <motion.button
                  key={planId}
                  onClick={() => setSelectedPlan(planId)}
                  className={`relative p-3 sm:p-3 rounded-lg border ${
                    selectedPlan === planId ? "border-purple-400 bg-purple-900/40" : "border-gray-700 bg-black/40 hover:border-gray-500"
                  } transition-all duration-200 flex flex-col items-center justify-center min-h-[100px] sm:min-h-[120px]`}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <img src={plans[planId].badge} alt={`${plans[planId].name} badge`} className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mb-1 sm:mb-2 object-contain" />
                  <div
                    className={`text-xs font-bold mb-1 px-2 py-0.5 rounded-full ${
                      planId === "30min"
                        ? "bg-amber-600/20 text-amber-300 border border-amber-500/30"
                        : planId === "1hour"
                        ? "bg-yellow-500/20 text-yellow-300 border border-yellow-400/30"
                        : "bg-purple-600/20 text-purple-300 border border-purple-500/30"
                    }`}
                  >
                    {plans[planId].tier}
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-center leading-tight">{plans[planId].name}</p>
                  <p className="text-sm sm:text-lg font-bold">${plans[planId].price.toFixed(2)}</p>
                  {selectedPlan === planId && <motion.div className="absolute inset-0 border-2 border-purple-500 rounded-lg" layoutId="selectedPlan" initial={false} />}
                </motion.button>
              ))}
            </div>

            <div className="mb-4 sm:mb-6 bg-black/20 backdrop-blur-sm p-3 sm:p-4 rounded-lg border border-white/10">
              <h3 className="text-base sm:text-lg font-semibold mb-2">What you'll get:</h3>
              <ul className="space-y-1 sm:space-y-2">
                {plans[selectedPlan].features.map((feature, index) => (
                  <motion.li key={index} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="flex items-start">
                    <svg className="w-4 h-4 text-purple-400 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs sm:text-sm leading-relaxed">{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {isPremium ? (
              <div className="text-center py-3">
                <div className="bg-green-500/20 backdrop-blur-sm text-green-300 py-3 px-4 rounded-md mb-4 border border-green-500/20">
                  <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-sm sm:text-base">You already have an active premium plan!</p>
                </div>
                <button onClick={onClose} className="w-full py-3 rounded-md bg-gradient-to-r from-purple-600 to-fuchsia-500 hover:from-purple-700 hover:to-fuchsia-600 text-white font-medium transition-all duration-300 text-sm sm:text-base">
                  Continue
                </button>
              </div>
            ) : paymentSuccess ? (
              <div className="text-center py-4">
                <div className="bg-green-500/20 backdrop-blur-sm text-green-300 py-3 px-4 rounded-md mb-4 border border-green-500/20">
                  <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-sm sm:text-base">Premium activated successfully!</p>
                </div>
              </div>
            ) : (
              <div className="w-full rounded-md overflow-hidden">
                <button
                  onClick={startCheckout}
                  disabled={isProcessing}
                  className="w-full py-3 rounded-md bg-gradient-to-r from-purple-600 to-fuchsia-500 hover:from-purple-700 hover:to-fuchsia-600 text-white font-medium transition-all duration-300 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Redirecting…' : `Pay $${plans[selectedPlan].price.toFixed(2)} with Stripe`}
                </button>
              </div>
            )}

            {paymentError && (
              <div className="mt-3 text-red-400 text-xs sm:text-sm text-center">
                <p>{paymentError}</p>
              </div>
            )}

            <p className="text-[10px] sm:text-xs text-gray-400 mt-3 sm:mt-4 text-center leading-relaxed">
              By purchasing, you agree to our Terms of Service.
              <br />
              Premium features are non-refundable.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PremiumModal;
