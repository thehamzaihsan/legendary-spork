import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const TermsAndConditions = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen text-white font-sans overflow-hidden py-10 px-4 md:px-20">
      {/* Enhanced Background gradients */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-purple-900/40 via-black/95 to-fuchsia-900/40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(236,72,153,0.2),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.2),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(139,69,19,0.1),transparent_40%)]" />
      </div>

      {/* Animated particles */}
      <div className="absolute inset-0 -z-5">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Enhanced cursor glow */}
      <motion.div
        className="absolute pointer-events-none -z-0"
        style={{
          left: mousePosition.x - 200,
          top: mousePosition.y - 200,
        }}
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="w-96 h-96 bg-gradient-to-r from-purple-500/30 to-fuchsia-500/30 rounded-full blur-3xl" />
      </motion.div>

      {/* Container with glassmorphism effect */}
      <div className="relative max-w-4xl mx-auto backdrop-blur-sm bg-white/5 rounded-3xl border border-purple-500/20 shadow-2xl shadow-purple-500/10 p-8 md:p-12">
        
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-purple-400 via-fuchsia-400 to-purple-600 text-transparent bg-clip-text">
            Terms & Conditions
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-fuchsia-500 mx-auto rounded-full mb-6" />
          <p className="text-xl text-purple-200/80 max-w-2xl mx-auto">
            Your guide to using Voodo Chats responsibly and safely.
          </p>
        </motion.div>

        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12 p-6 rounded-2xl bg-gradient-to-r from-purple-900/30 to-fuchsia-900/30 border border-purple-500/20"
        >
          <p className="text-lg leading-relaxed text-purple-100">
            Welcome to <strong className="text-purple-300">Voodo Chats</strong> — where mystery meets meaningful connections. By accessing or using our platform, you agree to comply with and be bound by the following terms and conditions.
          </p>
        </motion.div>

        {/* Sections */}
        <div className="space-y-8">
          {[
            {
              title: "1. Eligibility",
              content: (
                <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/20">
                  <p className="text-purple-100">
                    You must be at least 13 years old to use Voodo Chats. If you are under the age of 18, you must have parental or guardian consent. By using this site, you confirm that you meet these requirements.
                  </p>
                </div>
              )
            },
            {
              title: "2. Privacy",
              content: (
                <div className="p-6 rounded-2xl bg-gradient-to-r from-green-900/20 to-purple-900/20 border border-green-500/20">
                  <p className="text-purple-100">
                    We respect your privacy. While chats are anonymous, please avoid sharing any personal information. We do not record or store your video or text chats. However, metadata (like chat duration or region) may be collected to improve our services.
                  </p>
                </div>
              )
            },
            {
              title: "3. User Conduct",
              content: (
                <div>
                  <p className="mb-4 text-purple-100">
                    To maintain a safe and respectful environment, please follow these guidelines:
                  </p>
                  <div className="space-y-3">
                    {[
                      "Do not engage in harmful, illegal, or abusive behavior",
                      "No nudity, sexual content, or harassment is allowed",
                      "Respect all users. Hate speech or discrimination will result in a ban",
                      "Impersonating others or using fake identities is strictly prohibited"
                    ].map((item, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-red-900/20 border border-red-500/10">
                        <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-purple-200">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            },
            {
              title: "4. Termination",
              content: (
                <div className="p-6 rounded-2xl bg-gradient-to-r from-orange-900/20 to-purple-900/20 border border-orange-500/20">
                  <p className="text-purple-100">
                    Voodo reserves the right to terminate or suspend access to any user who violates these terms, without prior notice or liability.
                  </p>
                </div>
              )
            },
            {
              title: "5. Disclaimer",
              content: (
                <div className="p-6 rounded-2xl bg-gradient-to-r from-yellow-900/20 to-purple-900/20 border border-yellow-500/20">
                  <p className="text-purple-100">
                    Voodo is provided "as-is" without warranties of any kind. We are not responsible for user behavior or any harm caused by interactions on the platform.
                  </p>
                </div>
              )
            },
            {
              title: "6. Changes to Terms",
              content: (
                <p className="text-purple-100">
                  These terms may be updated at any time. Continued use of the site after changes implies acceptance of the new terms. We encourage you to review this page regularly.
                </p>
              )
            },
            {
              title: "7. Contact Us",
              content: (
                <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-900/20 to-purple-900/20 border border-cyan-500/20">
                  <p className="text-purple-100">
                    If you have any questions about these Terms, feel free to contact our support team at{" "}
                    <a 
                      href="mailto:support@voodo.chat" 
                      className="text-cyan-300 underline hover:text-cyan-200 transition-colors duration-200"
                    >
                      support@voodo.chat
                    </a>.
                  </p>
                </div>
              )
            }
          ].map((section, index) => (
            <motion.section
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              className="space-y-4"
            >
              <h2 className="text-2xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-fuchsia-300 font-bold">
                {section.title}
              </h2>
              <div className="pl-6 border-l-2 border-purple-500/30">
                {section.content}
              </div>
            </motion.section>
          ))}
        </div>

        {/* Important Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-purple-900/40 to-fuchsia-900/40 border border-purple-400/30"
        >
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" />
            <h3 className="text-lg font-semibold text-purple-200">Important Notice</h3>
          </div>
          <p className="text-purple-100 text-sm">
            By continuing to use Voodo Chats, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. Your privacy and safety are our priority.
          </p>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="mt-16 pt-8 border-t border-purple-500/20 text-center"
        >
          <p className="text-purple-400/80 text-sm">
            © {new Date().getFullYear()} Voodo. All rights reserved.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsAndConditions;