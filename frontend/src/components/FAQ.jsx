import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronDown, 
  Trophy, 
  Star, 
  Zap, 
  Target, 
  Award, 
  TrendingUp,
  Sparkles
} from 'lucide-react';

const FAQ = () => {
  const [openItems, setOpenItems] = useState(new Set());
  const navigate = useNavigate();


  const toggleItem = (index) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  const faqData = [
    {
      icon: Zap,
      question: "How do I earn XP (Experience Points)?",
      answer: "You earn XP primarily by checking in on your goals daily. You get a base of +10 XP for each daily check-in, plus a bonus of +2 XP for every consecutive day in that goal's streak. For example, a check-in on day 5 of a streak earns you 18 XP (10 base + 8 bonus).",
      gradient: "from-yellow-400 to-orange-500"
    },
    {
      icon: Trophy,
      question: "How does the leveling system work?",
      answer: "Your level increases as you accumulate XP. The XP required to level up grows exponentially, meaning early levels are quick and later levels require more dedication. The system automatically calculates your current level based on your total XP.",
      gradient: "from-blue-400 to-purple-600"
    },
    {
      icon: Target,
      question: "What are goals and how do they work?",
      answer: "Goals are your personal learning objectives (e.g., 'Learn React'). You can set a title, description, and timeline. Your main interaction is performing a 'daily check-in' on a goal to log your progress and earn XP.",
      gradient: "from-green-400 to-teal-500"
    },
    {
      icon: Star,
      question: "How do streaks work?",
      answer: "A streak tracks your consistency for a single goal. To maintain a streak, you must check in on that specific goal every day. If you miss a day for a particular goal, that goal's streak resets to zero. Your overall streak is the highest streak you currently have across all your goals.",
      gradient: "from-pink-400 to-red-500"
    },
    {
      icon: Award,
      question: "What are badges and how do I earn them?",
      answer: "Badges are achievements awarded for hitting specific milestones. You can earn them by reaching certain levels (e.g., Level 5, 10), completing a number of goals (e.g., your 1st, 5th), or maintaining long streaks (e.g., 3-day, 7-day).",
      gradient: "from-indigo-400 to-blue-600"
    },
    {
      icon: TrendingUp,
      question: "How is my progress tracked?",
      answer: "Your progress is tracked on your Stats page. It features an XP chart to visualize your experience gained over the past week and a streak calendar that highlights every day you've successfully completed a check-in.",
      gradient: "from-emerald-400 to-cyan-500"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-blue-200/30 to-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-r from-pink-200/30 to-yellow-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-green-200/20 to-blue-200/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>
          
          <h2 className="text-5xl font-bold bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Everything you need to know about XP, levels, goals, and making the most of your SkillUp journey
          </p>
        </motion.div>

        {/* FAQ Items */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-4xl mx-auto space-y-6"
        >
          {faqData.map((item, index) => {
            const Icon = item.icon;
            const isOpen = openItems.has(index);
            
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group"
              >
                <motion.div
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
                  whileHover={{ y: -2 }}
                >
                  <motion.button
                    onClick={() => toggleItem(index)}
                    className="w-full p-6 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="flex items-center space-x-4">
                      <motion.div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-r ${item.gradient} flex items-center justify-center shadow-lg`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </motion.div>
                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                        {item.question}
                      </h3>
                    </div>
                    
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="flex-shrink-0"
                    >
                      <ChevronDown className="w-6 h-6 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </motion.div>
                  </motion.button>
                  
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6">
                          <div className="pl-16">
                            <motion.p
                              initial={{ y: -10, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.1 }}
                              className="text-gray-600 leading-relaxed text-lg"
                            >
                              {item.answer}
                            </motion.p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 rounded-3xl p-8 max-w-2xl mx-auto shadow-2xl">
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to Start Your Journey?
            </h3>
            <p className="text-blue-100 text-lg mb-6 leading-relaxed">
              Join thousands of users who are already leveling up their skills and achieving their goals!
            </p>
            <motion.button
            onClick={() => navigate('/login')}
              className="bg-white text-blue-600 font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Get Started Today
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
