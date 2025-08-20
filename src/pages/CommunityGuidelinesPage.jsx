import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CommunityGuidelinesPage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const guidelines = [
    {
      icon: "🛡️",
      title: "Respect & Safety First",
      description: "Create a safe space for everyone",
      rules: [
        "Treat all users with respect and kindness",
        "No harassment, bullying, or discriminatory behavior",
        "Respect boundaries when others say no",
        "Report any inappropriate behavior immediately"
      ]
    },
    {
      icon: "🚫",
      title: "Prohibited Content",
      description: "Keep conversations appropriate",
      rules: [
        "No explicit sexual content or nudity",
        "No hate speech, racism, or discriminatory language",
        "No sharing of personal information without consent",
        "No spam, advertising, or promotional content"
      ]
    },
    {
      icon: "🔒",
      title: "Privacy Protection",
      description: "Your anonymity is sacred",
      rules: [
        "Don't pressure others to reveal personal information",
        "Never share screenshots without permission",
        "Respect the anonymous nature of conversations",
        "Don't attempt to identify or track other users"
      ]
    },
    {
      icon: "⚖️",
      title: "Legal Compliance",
      description: "Stay within legal boundaries",
      rules: [
        "Must be 18+ to use video chat features",
        "No illegal activities or content",
        "Comply with local laws and regulations",
        "No copyright infringement or piracy"
      ]
    },
    {
      icon: "🎭",
      title: "Authentic Interactions",
      description: "Be genuine in your connections",
      rules: [
        "Don't impersonate others or create fake personas",
        "Be honest about your intentions",
        "No catfishing or deceptive behavior",
        "Engage in meaningful conversations"
      ]
    },
    {
      icon: "⚡",
      title: "Platform Integrity",
      description: "Help us maintain a quality experience",
      rules: [
        "Don't attempt to hack or exploit the platform",
        "No automated bots or scripts",
        "Report bugs and technical issues responsibly",
        "Use the platform as intended"
      ]
    }
  ];

  const consequences = [
    {
      level: "Warning",
      description: "First-time minor violations receive a friendly reminder",
      color: "from-yellow-500 to-orange-500"
    },
    {
      level: "Temporary Ban",
      description: "Repeated violations result in temporary access suspension",
      color: "from-orange-500 to-red-500"
    },
    {
      level: "Permanent Ban",
      description: "Serious violations lead to permanent account termination",
      color: "from-red-500 to-red-700"
    }
  ];

  return (
    <div className="relative min-h-screen text-white font-sans overflow-hidden bg-gradient-to-br pt-24 from-purple-900 via-black to-fuchsia-900">
      
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.3),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(236,72,153,0.2),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.2),transparent_50%)]" />

      {/* Animated particles */}
      <div className="absolute inset-0">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Cursor glow */}
      <motion.div
        className="absolute pointer-events-none -z-0"
        style={{
          left: mousePosition.x - 200,
          top: mousePosition.y - 200,
        }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="w-96 h-96 bg-gradient-to-r from-purple-500/20 to-fuchsia-500/20 rounded-full blur-3xl" />
      </motion.div>

      <div className="relative z-10 px-4 md:px-8 py-12">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 to-fuchsia-400 text-transparent bg-clip-text">
              Community
            </span>{" "}
            <span className="text-white">Guidelines</span>
          </h1>
          <p className="text-lg text-purple-200 leading-relaxed">
            Welcome to the Voodo Chats community! These guidelines help us maintain a safe, 
            respectful, and magical environment where meaningful connections can flourish. 
            By using our platform, you agree to follow these community standards.
          </p>
        </motion.div>

        {/* Guidelines Grid */}
        <div className="max-w-7xl mx-auto mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guidelines.map((guideline, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 group cursor-pointer"
                onClick={() => setActiveSection(activeSection === index ? null : index)}
              >
                <div className="text-center mb-4">
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    {guideline.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {guideline.title}
                  </h3>
                  <p className="text-purple-300 text-sm">
                    {guideline.description}
                  </p>
                </div>

                <motion.div
                  initial={false}
                  animate={{
                    height: activeSection === index ? "auto" : 0,
                    opacity: activeSection === index ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-purple-500/20 pt-4 mt-4">
                    <ul className="space-y-2">
                      {guideline.rules.map((rule, ruleIndex) => (
                        <li key={ruleIndex} className="flex items-start text-sm text-purple-200">
                          <span className="text-purple-400 mr-2 mt-1">•</span>
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>

                <div className="text-center mt-4">
                  <motion.span
                    animate={{ rotate: activeSection === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-purple-400 text-sm"
                  >
                    Click to expand ↓
                  </motion.span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Enforcement Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-400 to-fuchsia-400 text-transparent bg-clip-text">
            Enforcement & Consequences
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {consequences.map((consequence, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                className="text-center"
              >
                <div className={`bg-gradient-to-r ${consequence.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <span className="text-white font-bold text-lg">{index + 1}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {consequence.level}
                </h3>
                <p className="text-purple-200 text-sm leading-relaxed">
                  {consequence.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Reporting Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <div className="bg-gradient-to-r from-red-900/30 to-pink-900/30 backdrop-blur-sm rounded-3xl p-8 border border-red-500/20">
            <div className="text-center">
              <div className="text-4xl mb-4">🚨</div>
              <h3 className="text-2xl font-bold mb-4 text-white">Report Violations</h3>
              <p className="text-red-200 mb-6 leading-relaxed">
                If you encounter behavior that violates these guidelines, please report it immediately. 
                Our moderation team reviews all reports within 24 hours and takes appropriate action.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg">
                  Report User
                </button>
                <button className="bg-white/10 backdrop-blur text-white px-6 py-3 rounded-full font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-purple-900/30 to-fuchsia-900/30 backdrop-blur-sm rounded-3xl p-8 border border-purple-500/20 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4 text-white">Ready to Connect Responsibly?</h3>
            <p className="text-purple-200 mb-6">
              By following these guidelines, you help create a magical experience for everyone in our community.
            </p>
            <button className="bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white px-8 py-3 rounded-full font-semibold hover:from-purple-600 hover:to-fuchsia-600 transition-all duration-300 shadow-lg hover:shadow-purple-500/25">
              Start Chatting Safely
            </button>
          </div>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="text-center mt-12 max-w-3xl mx-auto"
        >
          <p className="text-purple-300/70 text-sm leading-relaxed">
            These guidelines may be updated from time to time. We'll notify users of significant changes. 
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </motion.div>

      </div>
    </div>
  );
};

export default CommunityGuidelinesPage;