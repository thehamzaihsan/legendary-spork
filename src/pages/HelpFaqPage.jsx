import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const HelpFAQPage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeCategory, setActiveCategory] = useState('getting-started');
  const [openFAQ, setOpenFAQ] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const categories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: '🚀',
      description: 'New to Voodo Chats?'
    },
    {
      id: 'chat-features',
      title: 'Chat Features',
      icon: '💬',
      description: 'Learn about our chat options'
    },
    {
      id: 'privacy-safety',
      title: 'Privacy & Safety',
      icon: '🔐',
      description: 'Your security matters'
    },
    {
      id: 'technical',
      title: 'Technical Issues',
      icon: '⚙️',
      description: 'Troubleshooting help'
    },
    {
      id: 'account',
      title: 'Account Management',
      icon: '👤',
      description: 'Manage your experience'
    },
    {
      id: 'billing',
      title: 'Billing & Premium',
      icon: '💎',
      description: 'Premium features & payments'
    }
  ];

  const faqs = {
    'getting-started': [
      {
        question: "How do I start chatting on Voodo Chats?",
        answer: "Simply visit our homepage, enter your interests in the search bar, select your preferred chat type (text or video), agree to our terms, and click 'Start Chatting'. Our matching system will connect you with someone who shares your interests within seconds."
      },
      {
        question: "Do I need to create an account?",
        answer: "No account required for basic anonymous chatting! You can start connecting immediately. However, creating an account allows you to save preferences, access chat history, and unlock premium features."
      },
      {
        question: "What makes Voodo Chats different from other chat platforms?",
        answer: "Voodo Chats combines anonymity with meaningful connections. Our unique matching algorithm connects you based on shared interests while maintaining complete privacy until you choose to reveal more about yourself."
      },
      {
        question: "Is Voodo Chats free to use?",
        answer: "Yes! Basic text and video chatting is completely free. We also offer premium features like priority matching, advanced filters, and enhanced privacy controls for users who want an even better experience."
      },
      {
        question: "What age restrictions apply?",
        answer: "Users must be at least 18 years old to access video chat features. Text chat is available for users 16+ with parental consent. We verify age through various methods to ensure compliance."
      }
    ],
    'chat-features': [
      {
        question: "How does the matching system work?",
        answer: "Our AI-powered matching algorithm analyzes your interests, preferences, and activity patterns to connect you with compatible users. The more you use the platform, the better our matches become."
      },
      {
        question: "Can I choose between text and video chat?",
        answer: "Absolutely! You can select your preferred chat mode before starting. You can also switch between text and video during a conversation if both users agree."
      },
      {
        question: "How do I end a chat session?",
        answer: "Simply click the 'End Chat' button or close your browser tab. Your conversation will end immediately, and you can start a new chat whenever you're ready."
      },
      {
        question: "Can I save or share conversations?",
        answer: "For privacy reasons, conversations are not automatically saved. However, premium users can opt to save their chat history. Screenshots or recordings require consent from all participants."
      },
      {
        question: "What languages does Voodo Chats support?",
        answer: "Currently, we support English, Spanish, French, German, Italian, Portuguese, and Japanese. Our AI can also provide real-time translation for cross-language conversations in premium mode."
      },
      {
        question: "How do interest tags work?",
        answer: "Interest tags help match you with like-minded people. You can add up to 10 tags describing your hobbies, interests, or what you'd like to talk about. The more specific your tags, the better your matches."
      }
    ],
    'privacy-safety': [
      {
        question: "How is my privacy protected?",
        answer: "We don't store conversations, require minimal personal information, and use end-to-end encryption. Your identity remains anonymous until you choose to share details. We also don't track your activity across other websites."
      },
      {
        question: "Can other users find my real identity?",
        answer: "No. Our system is designed to keep you completely anonymous. We don't share IP addresses, locations, or any identifying information between users. Only share what you're comfortable with."
      },
      {
        question: "How do I report inappropriate behavior?",
        answer: "Click the 'Report' button during any chat session or use the report feature in your chat history. Our moderation team reviews all reports within 24 hours and takes appropriate action."
      },
      {
        question: "What information do you collect about me?",
        answer: "We collect only essential information: your chosen interests, general location (country/region), and basic usage statistics to improve matching. We never collect personal details unless you voluntarily provide them."
      },
      {
        question: "Can I block specific users?",
        answer: "Yes! You can block users during or after a chat session. Blocked users won't be matched with you again. Premium users get advanced blocking options including keyword and behavior-based filters."
      },
      {
        question: "Is my location shared with other users?",
        answer: "We only share your general region (like 'California' or 'London') to help with matching. Your exact location is never revealed. You can also opt to hide your region completely in settings."
      }
    ],
    'technical': [
      {
        question: "My video chat isn't working. What should I do?",
        answer: "First, check your camera and microphone permissions in your browser settings. Ensure you have a stable internet connection. Try refreshing the page or switching browsers. If issues persist, contact our support team."
      },
      {
        question: "The website is loading slowly. How can I fix this?",
        answer: "Clear your browser cache and cookies, disable browser extensions temporarily, check your internet connection, and try using a different browser. Our servers are optimized for Chrome, Firefox, and Safari."
      },
      {
        question: "I'm having trouble connecting to chats. What's wrong?",
        answer: "This could be due to network restrictions, firewall settings, or high server traffic. Try using a VPN, switch networks, or wait a few minutes and try again. Contact support if the problem persists."
      },
      {
        question: "Which browsers are supported?",
        answer: "Voodo Chats works best on Chrome 90+, Firefox 88+, Safari 14+, and Edge 90+. We recommend keeping your browser updated for the best experience and security."
      },
      {
        question: "Can I use Voodo Chats on mobile devices?",
        answer: "Yes! Our platform is fully responsive and works on all mobile browsers. We're also developing dedicated iOS and Android apps, coming soon!"
      },
      {
        question: "Why am I getting connection errors?",
        answer: "Connection errors usually indicate network issues, browser compatibility problems, or server maintenance. Check our status page, try a different network, or contact support if the issue continues."
      }
    ],
    'account': [
      {
        question: "How do I create an account?",
        answer: "Click 'Sign Up' on the homepage, provide a username and email, and verify your email address. Account creation unlocks features like chat history, custom preferences, and premium options."
      },
      {
        question: "I forgot my password. How do I reset it?",
        answer: "Click 'Forgot Password' on the login page, enter your email address, and follow the reset instructions sent to your inbox. If you don't receive the email, check your spam folder."
      },
      {
        question: "How do I delete my account?",
        answer: "Go to Settings > Account > Delete Account. This action is irreversible and will permanently remove all your data, preferences, and chat history from our servers."
      },
      {
        question: "Can I change my username?",
        answer: "Free users can change their username once every 30 days. Premium users can change it anytime. Go to Settings > Profile > Edit Username to make changes."
      },
      {
        question: "How do I update my interests and preferences?",
        answer: "Visit Settings > Preferences to update your interests, chat preferences, notification settings, and privacy controls. Changes take effect immediately for future matches."
      },
      {
        question: "Why can't I access certain features?",
        answer: "Some features require account registration or premium membership. Age-restricted features (like video chat) require age verification. Check your account status and upgrade if needed."
      }
    ],
    'billing': [
      {
        question: "What premium features are available?",
        answer: "Premium includes priority matching, advanced filters, chat history, enhanced privacy controls, real-time translation, custom themes, and ad-free experience. See our pricing page for full details."
      },
      {
        question: "How much does premium cost?",
        answer: "We offer flexible plans: $4.99/month, $12.99/quarter, or $39.99/year. All plans include the same premium features with longer subscriptions offering better value."
      },
      {
        question: "How do I cancel my premium subscription?",
        answer: "Go to Settings > Billing > Manage Subscription. You can cancel anytime, and premium features remain active until your current billing period ends. No cancellation fees apply."
      },
      {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and various regional payment methods depending on your location."
      },
      {
        question: "Can I get a refund?",
        answer: "We offer a 7-day money-back guarantee for new premium subscriptions. Refunds are processed within 5-7 business days. Contact support with your subscription details to request a refund."
      },
      {
        question: "Do you offer student discounts?",
        answer: "Yes! Students get 50% off premium subscriptions with valid student email verification. The discount applies to monthly and annual plans. Verify your student status in Settings > Billing."
      }
    ]
  };

  const quickActions = [
    {
      title: "Start Your First Chat",
      description: "Jump right in and connect with someone new",
      icon: "💫",
      action: "Start Chatting"
    },
    {
      title: "Report an Issue",
      description: "Get help with problems or inappropriate behavior",
      icon: "🚨",
      action: "Report Issue"
    },
    {
      title: "Contact Support",
      description: "Speak directly with our support team",
      icon: "💬",
      action: "Contact Us"
    },
    {
      title: "Join Community",
      description: "Connect with other users in our forums",
      icon: "🌟",
      action: "Join Now"
    }
  ];

  const filteredFAQs = faqs[activeCategory]?.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="relative min-h-screen text-white font-sans overflow-hidden bg-gradient-to-br pt-24 from-purple-900 via-black to-fuchsia-900">
      
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.3),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(236,72,153,0.2),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.2),transparent_50%)]" />

      {/* Animated particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
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
              Help
            </span>{" "}
            <span className="text-white">&</span>{" "}
            <span className="bg-gradient-to-r from-fuchsia-400 to-purple-400 text-transparent bg-clip-text">
              FAQ
            </span>
          </h1>
          <p className="text-lg text-purple-200 leading-relaxed mb-8">
            Find answers to common questions and get the help you need to make the most of your Voodo Chats experience.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 bg-white/10 backdrop-blur border border-purple-500/30 rounded-full text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 focus:bg-white/15 transition-all duration-300"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-400">
                🔍
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-6xl mx-auto mb-16"
        >
          <h2 className="text-2xl font-bold text-center mb-8 text-white">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 group cursor-pointer text-center"
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {action.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {action.title}
                </h3>
                <p className="text-purple-300 text-sm mb-4">
                  {action.description}
                </p>
                <button className="bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:from-purple-600 hover:to-fuchsia-600 transition-all duration-300">
                  {action.action}
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Categories Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-6xl mx-auto mb-12"
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`p-4 rounded-2xl border transition-all duration-300 text-center ${
                  activeCategory === category.id
                    ? 'bg-purple-500/20 border-purple-400/60 text-white'
                    : 'bg-white/5 border-purple-500/20 text-purple-300 hover:border-purple-400/40 hover:text-white'
                }`}
              >
                <div className="text-2xl mb-2">{category.icon}</div>
                <div className="text-sm font-semibold mb-1">{category.title}</div>
                <div className="text-xs opacity-80">{category.description}</div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="space-y-4">
            {filteredFAQs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl border border-purple-500/20 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-purple-500/10 transition-colors duration-200"
                >
                  <span className="text-white font-medium pr-4">{faq.question}</span>
                  <motion.span
                    animate={{ rotate: openFAQ === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-purple-400 text-xl flex-shrink-0"
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
                  <div className="px-6 pb-5 border-t border-purple-500/20">
                    <p className="text-purple-200 leading-relaxed pt-4">{faq.answer}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {filteredFAQs.length === 0 && searchQuery && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl text-white mb-2">No results found</h3>
              <p className="text-purple-300">Try adjusting your search terms or browse our categories above.</p>
            </motion.div>
          )}
        </motion.div>

        {/* Still Need Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-20"
        >
          <div className="bg-gradient-to-r from-purple-900/30 to-fuchsia-900/30 backdrop-blur-sm rounded-3xl p-8 border border-purple-500/20 max-w-2xl mx-auto">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-2xl font-bold mb-4 text-white">Still Need Help?</h3>
            <p className="text-purple-200 mb-6">
              Can't find what you're looking for? Our support team is here to help you 24/7.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white px-6 py-3 rounded-full font-semibold hover:from-purple-600 hover:to-fuchsia-600 transition-all duration-300 shadow-lg">
                Contact Support
              </button>
              <button className="bg-white/10 backdrop-blur text-white px-6 py-3 rounded-full font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20">
                Live Chat
              </button>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default HelpFAQPage;