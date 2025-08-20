import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
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
            Privacy Policy
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-fuchsia-500 mx-auto rounded-full mb-6" />
          <p className="text-xl text-purple-200/80 max-w-2xl mx-auto">
            Your privacy matters. Here's how we protect and respect your data.
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
            At <strong className="text-purple-300">Voodo Chats</strong>, your privacy is our top priority. This Privacy Policy explains how we handle, collect, use, and protect your information when you use our platform.
          </p>
        </motion.div>

        {/* Sections */}
        <div className="space-y-8">
          {[
            {
              title: "1. Information We Collect",
              content: (
                <div>
                  <p className="mb-4 text-purple-100">
                    We do not collect personally identifiable information. However, we may gather limited metadata such as:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {["Chat duration", "Device type", "Browser version", "Approximate region (non-identifiable)"].map((item, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-purple-900/20 border border-purple-500/10">
                        <div className="w-2 h-2 bg-purple-400 rounded-full" />
                        <span className="text-purple-200">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            },
            {
              title: "2. Use of Data",
              content: (
                <div>
                  <p className="mb-4 text-purple-100">
                    The metadata we collect is solely used for:
                  </p>
                  <div className="space-y-3">
                    {["Improving user experience", "Detecting abuse or misuse", "Enhancing performance and stability"].map((item, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-purple-900/20 border border-purple-500/10">
                        <div className="w-2 h-2 bg-fuchsia-400 rounded-full" />
                        <span className="text-purple-200">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            },
            {
              title: "3. Chat Privacy",
              content: (
                <div className="p-6 rounded-2xl bg-gradient-to-r from-green-900/20 to-purple-900/20 border border-green-500/20">
                  <p className="text-purple-100 text-lg">
                    All chat content — both video and text — is <strong className="text-green-300">not recorded, stored, or monitored</strong>. Your conversations remain strictly private and ephemeral.
                  </p>
                </div>
              )
            },
            {
              title: "4. Cookies & Tracking",
              content: (
                <p className="text-purple-100">
                  We do not use cookies for advertising or tracking. Only essential cookies may be used for basic session handling.
                </p>
              )
            },
            {
              title: "5. Third-Party Services",
              content: (
                <p className="text-purple-100">
                  Voodo may use third-party tools (e.g., analytics or hosting providers). These providers are compliant with global data protection regulations and do not have access to your personal data.
                </p>
              )
            },
            {
              title: "6. Data Security",
              content: (
                <p className="text-purple-100">
                  While no platform is 100% secure, we implement industry-standard measures to protect your data against unauthorized access or misuse.
                </p>
              )
            },
            {
              title: "7. Children's Privacy",
              content: (
                <div className="p-6 rounded-2xl bg-gradient-to-r from-red-900/20 to-purple-900/20 border border-red-500/20">
                  <p className="text-purple-100">
                    Voodo is not intended for children under 13. If we learn that we've inadvertently collected data from a child under 13, we will take immediate steps to delete that information.
                  </p>
                </div>
              )
            },
            {
              title: "8. Updates to This Policy",
              content: (
                <p className="text-purple-100">
                  This Privacy Policy may be updated occasionally. We recommend reviewing it periodically. Continued use of the platform indicates your acceptance of any changes.
                </p>
              )
            },
            {
              title: "9. Contact Us",
              content: (
                <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/20">
                  <p className="text-purple-100">
                    Questions or concerns? Reach out to us at{" "}
                    <a 
                      href="mailto:support@voodo.chat" 
                      className="text-blue-300 underline hover:text-blue-200 transition-colors duration-200"
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

export default PrivacyPolicy;