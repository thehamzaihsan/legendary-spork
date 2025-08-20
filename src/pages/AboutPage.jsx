import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const AboutPage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const teamMembers = [
    {
      name: "Alex Chen",
      role: "Founder & CEO",
      department: "Leadership",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Sarah Johnson",
      role: "Lead Developer",
      department: "Engineering",
      image: "https://images.unsplash.com/photo-1494790108755-2616b332c1cd?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Marcus Rivera",
      role: "UI/UX Designer",
      department: "Design",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Emma Thompson",
      role: "Product Manager",
      department: "Product",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "David Park",
      role: "Backend Engineer",
      department: "Engineering",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Lisa Rodriguez",
      role: "Community Manager",
      department: "Community",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "James Wilson",
      role: "Security Engineer",
      department: "Security",
      image: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Maya Patel",
      role: "Data Analyst",
      department: "Analytics",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
    }
  ];

  const faqs = [
    {
      question: "What makes Voodo Chats different?",
      answer: "Voodo Chats combines the thrill of mystery with meaningful connections. Our unique anonymous chat system lets you connect with people based on shared interests without revealing your identity until you choose to."
    },
    {
      question: "How does the matching system work?",
      answer: "Our advanced algorithm matches you with people who share similar interests and preferences. You can specify your interests, and we'll find compatible chat partners for both text and video conversations."
    },
    {
      question: "Is my privacy protected?",
      answer: "Absolutely. We don't record or store your conversations. All chats are ephemeral and your identity remains anonymous until you decide to share it. Your privacy is our top priority."
    },
    {
      question: "Can I choose between text and video chat?",
      answer: "Yes! You can select your preferred chat mode - text chat for those who prefer typing, or video chat for face-to-face conversations. Both options maintain your anonymity initially."
    }
  ];

  const [openFAQ, setOpenFAQ] = useState(null);

  return (
    <div className="relative min-h-screen text-white font-sans overflow-hidden bg-gradient-to-br pt-24 from-purple-900 via-black to-fuchsia-900">
      
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.3),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(236,72,153,0.2),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.2),transparent_50%)]" />

      {/* Animated particles */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
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
  className="text-center mb-16"
>
  <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-fuchsia-400 text-transparent bg-clip-text">
    Meet the team that makes
  </h2>
  <h2 className="text-3xl md:text-4xl font-bold mb-6">
    the <span className="italic bg-gradient-to-r from-purple-400 to-fuchsia-400 text-transparent bg-clip-text">magic</span> happen
  </h2>

  {/* ⬆️ Added `mb-6` to h2 to separate from the paragraph below */}

  <p className="text-lg text-white font-medium mt-4">
    We're passionate about creating meaningful connections in the digital world. <br /> 
    Our team combines creativity, technology, and a touch of mystery to bring you Voodo Chats.
  </p>
</motion.div>


        {/* Team Grid */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="relative mb-4">
                  <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-purple-500/30 group-hover:border-purple-400/60 transition-all duration-300">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-fuchsia-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-purple-500/20 group-hover:border-purple-400/40 transition-all duration-300">
                  <h3 className="text-lg font-semibold text-white mb-1">{member.name}</h3>
                  <p className="text-purple-300 text-sm mb-1">{member.role}</p>
                  <span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-200 text-xs rounded-full">
                    {member.department}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-4xl mx-auto"
        >
          <h3 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-fuchsia-400 text-transparent bg-clip-text">
            Frequently Asked Questions
          </h3>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl border border-purple-500/20 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-purple-500/10 transition-colors duration-200"
                >
                  <span className="text-white font-medium">{faq.question}</span>
                  <motion.span
                    animate={{ rotate: openFAQ === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-purple-400 text-xl"
                  >
                    ↓
                  </motion.span>
                </button>
                
                <motion.div
                  initial={false}
                  animate={{
                    height: openFAQ === index ? "auto" : 0,
                    opacity: openFAQ === index ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-4">
                    <p className="text-purple-200 leading-relaxed">{faq.answer}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center mt-20"
        >
          <div className="bg-gradient-to-r from-purple-900/30 to-fuchsia-900/30 backdrop-blur-sm rounded-3xl p-8 border border-purple-500/20 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4 text-white">Ready to Experience the Magic?</h3>
            <p className="text-purple-200 mb-6">
              Join thousands of users who have discovered meaningful connections through Voodo Chats.
            </p>
            <button className="bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white px-8 py-3 rounded-full font-semibold hover:from-purple-600 hover:to-fuchsia-600 transition-all duration-300 shadow-lg hover:shadow-purple-500/25">
              Start Chatting Now
            </button>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default AboutPage;