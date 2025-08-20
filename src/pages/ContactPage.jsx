import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ContactUs = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-900 via-black to-fuchsia-900 text-white font-sans overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.3),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(236,72,153,0.2),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.2),transparent_50%)]" />

      {/* Animated particles */}
      <div className="absolute inset-0 -z-5">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Cursor glow */}
      <motion.div
        className="absolute pointer-events-none -z-0"
        style={{
          left: mousePosition.x - 150,
          top: mousePosition.y - 150,
        }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="w-72 h-72 bg-gradient-to-r from-purple-500/20 to-fuchsia-500/20 rounded-full blur-3xl" />
      </motion.div>

      {/* Header */}
      <div className="relative z-10 pt-8 pb-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                <span className="text-xl">👻</span>
              </div>
              <span className="text-2xl font-bold">Voodo.</span>
            </div>
            <div className="flex items-center space-x-6">
              <a href="#" className="hover:text-purple-300 transition-colors">Community</a>
              <a href="#" className="hover:text-purple-300 transition-colors">Premium</a>
              <a href="#" className="hover:text-purple-300 transition-colors">Download</a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-purple-400 via-fuchsia-400 to-purple-600 text-transparent bg-clip-text">
              Get in Touch
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-fuchsia-500 mx-auto rounded-full mb-6" />
            <p className="text-xl text-purple-200/80 max-w-2xl mx-auto">
              Have questions, feedback, or need support? We're here to help make your Voodo experience magical.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="backdrop-blur-sm bg-white/5 rounded-3xl border border-purple-500/20 shadow-2xl shadow-purple-500/10 p-8"
            >
              <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-fuchsia-300">
                Send us a Message
              </h2>
              
              {submitted && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-green-900/30 to-purple-900/30 border border-green-500/30"
                >
                  <p className="text-green-300 font-semibold">✨ Message sent successfully!</p>
                  <p className="text-purple-200 text-sm mt-1">We'll get back to you within 24 hours.</p>
                </motion.div>
              )}

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-purple-300 font-medium mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-purple-900/20 border border-purple-500/30 text-white placeholder-purple-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-purple-300 font-medium mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-purple-900/20 border border-purple-500/30 text-white placeholder-purple-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-purple-300 font-medium mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-purple-900/20 border border-purple-500/30 text-white placeholder-purple-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label className="block text-purple-300 font-medium mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl bg-purple-900/20 border border-purple-500/30 text-white placeholder-purple-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <motion.button
                  onClick={handleSubmit}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-semibold shadow-lg shadow-purple-500/25 transition-all duration-300"
                >
                  Send Message ✨
                </motion.button>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-8"
            >
              
              {/* Quick Contact */}
              <div className="backdrop-blur-sm bg-white/5 rounded-3xl border border-purple-500/20 shadow-2xl shadow-purple-500/10 p-8">
                <h3 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-fuchsia-300">
                  Quick Contact
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 rounded-xl bg-purple-900/20 border border-purple-500/20">
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-lg">📧</span>
                    </div>
                    <div>
                      <p className="text-purple-300 font-medium">Email Support</p>
                      <a href="mailto:support@voodo.chat" className="text-purple-100 hover:text-purple-200 transition-colors">
                        support@voodo.chat
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 rounded-xl bg-purple-900/20 border border-purple-500/20">
                    <div className="w-10 h-10 bg-fuchsia-600 rounded-full flex items-center justify-center">
                      <span className="text-lg">💬</span>
                    </div>
                    <div>
                      <p className="text-purple-300 font-medium">Live Chat</p>
                      <p className="text-purple-100">Available 24/7</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="backdrop-blur-sm bg-white/5 rounded-3xl border border-purple-500/20 shadow-2xl shadow-purple-500/10 p-8">
                <h3 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-fuchsia-300">
                  Common Questions
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      question: "How do I report inappropriate behavior?",
                      answer: "Use the report button during any chat session or email us directly."
                    },
                    {
                      question: "Is my data safe on Voodo?",
                      answer: "Yes! We don't store your chats and prioritize your privacy."
                    },
                    {
                      question: "Can I delete my account?",
                      answer: "Contact us and we'll help you with account deletion."
                    },
                    {
                      question: "How do I become a premium member?",
                      answer: "Click the Premium button in the header to explore our plans."
                    }
                  ].map((faq, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="p-4 rounded-xl bg-purple-900/20 border border-purple-500/20"
                    >
                      <h4 className="text-purple-300 font-medium mb-2">{faq.question}</h4>
                      <p className="text-purple-200 text-sm">{faq.answer}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Response Time */}
              <div className="backdrop-blur-sm bg-white/5 rounded-3xl border border-purple-500/20 shadow-2xl shadow-purple-500/10 p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-lg">⚡</span>
                  </div>
                  <div>
                    <h4 className="text-purple-300 font-semibold">Quick Response</h4>
                    <p className="text-purple-200 text-sm">We typically respond within 24 hours</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 py-8 border-t border-purple-500/20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-purple-400/80 text-sm">
            © {new Date().getFullYear()} Voodo. All rights reserved. | 
            <a href="#" className="ml-2 hover:text-purple-300 transition-colors">Privacy Policy</a> | 
            <a href="#" className="ml-2 hover:text-purple-300 transition-colors">Terms of Service</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;