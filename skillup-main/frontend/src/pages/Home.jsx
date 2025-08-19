import { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import SkillUpLogo from "../components/skilluplogo";
import ParticleBackground from "../components/ParticleBackground";
import AnimatedBackground from "../components/AnimatedBackground";
import FAQ from "../components/FAQ";
import { 
  Star, 
  Trophy, 
  Target, 
  Zap, 
  Users, 
  BookOpen,
  Award,
  TrendingUp,
  Sparkles,
  Rocket
} from 'lucide-react';

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      duration: 0.6,
      type: "spring",
      stiffness: 100
    } 
  },
};

const floating = {
  initial: { y: 0, rotate: 0 },
  animate: {
    y: [0, -20, 0],
    rotate: [0, 5, -5, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const BeautifulButton = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [ripples, setRipples] = useState([]);
  const buttonRef = useRef(null);
  const navigate = useNavigate();

  const addRipple = (e) => {
    const rect = buttonRef.current.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.5;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    const newRipple = {
      id: Date.now(),
      x,
      y,
      size,
    };
    
    setRipples([...ripples, newRipple]);
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 1000);
  };

  return (
    <motion.button
      ref={buttonRef}
      className="relative overflow-hidden px-10 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-red-500 via-red-600 to-red-700 shadow-2xl border border-red-400/50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => {
        addRipple(e);
        navigate('/signup');
      }}
      whileHover={{
        scale: 1.05,
        boxShadow: "0 20px 40px -5px rgba(239, 68, 68, 0.5), 0 10px 20px -5px rgba(0, 0, 0, 0.2)",
        transition: { duration: 0.3 }
      }}
      whileTap={{ 
        scale: 0.98,
        boxShadow: "0 10px 20px -5px rgba(239, 68, 68, 0.4)"
      }}
    >
      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
        animate={{
          x: isHovered ? ["100%", "-100%"] : "-100%",
          transition: { 
            duration: 1.5, 
            repeat: isHovered ? Infinity : 0,
            ease: "easeInOut" 
          }
        }}
      />
      
      {/* Sparkle effects */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      {ripples.map(ripple => (
        <motion.span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full"
          style={{
            left: `${ripple.x}px`,
            top: `${ripple.y}px`,
            width: `${ripple.size}px`,
            height: `${ripple.size}px`,
            transform: 'translate(-50%, -50%)',
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      ))}

      <div className="relative z-10 flex items-center justify-center gap-3">
        <motion.div
          animate={{
            rotate: isHovered ? [0, 360] : 0,
            scale: isHovered ? [1, 1.2, 1] : 1,
            transition: { 
              duration: 0.8,
              repeat: isHovered ? Infinity : 0,
              ease: "easeInOut"
            }
          }}
        >
          <Rocket className="w-5 h-5" />
        </motion.div>
        <span className="text-lg">Get Started with SkillUp</span>
        <motion.div
          animate={{
            x: isHovered ? [0, 8, 0] : 0,
            transition: { 
              duration: 1,
              repeat: isHovered ? Infinity : 0,
              ease: "easeInOut"
            }
          }}
        >
          <Sparkles className="w-5 h-5" />
        </motion.div>
      </div>

      <motion.div 
        className="absolute inset-0 border-2 border-transparent rounded-2xl"
        animate={{
          borderColor: isHovered ? "rgba(255, 255, 255, 0.6)" : "rgba(255, 255, 255, 0.2)",
          boxShadow: isHovered ? "inset 0 0 20px rgba(255, 255, 255, 0.2)" : "none",
          transition: { duration: 0.3 }
        }}
      />
    </motion.button>
  );
};

const FeatureCard = ({ icon: Icon, title, description, delay = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="group relative p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 cursor-pointer overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{
        scale: 1.05,
        y: -10,
        boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.15)",
        transition: { duration: 0.3 }
      }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-red-600/10 opacity-0 group-hover:opacity-100"
        transition={{ duration: 0.3 }}
      />
      
      <motion.div
        className="relative z-10"
        animate={{
          scale: isHovered ? 1.1 : 1,
          rotate: isHovered ? [0, -5, 5, 0] : 0,
        }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-12 h-12 mb-4 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
          <Icon className="w-6 h-6 text-white" />
        </div>
      </motion.div>
      
      <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-red-600 transition-colors duration-300">
        {title}
      </h3>
      <p className="text-gray-600 text-sm leading-relaxed">
        {description}
      </p>

      <motion.div
        className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-red-400/20 to-transparent rounded-full -translate-y-10 translate-x-10 opacity-0 group-hover:opacity-100"
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

export default function Home() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);

  const features = [
    {
      icon: Target,
      title: "Goal Tracking",
      description: "Set and track your learning goals with precision and motivation."
    },
    {
      icon: Trophy,
      title: "Earn Rewards",
      description: "Unlock achievements and badges as you progress through your journey."
    },
    {
      icon: TrendingUp,
      title: "Progress Analytics",
      description: "Visualize your growth with detailed analytics and insights."
    },
    {
      icon: Users,
      title: "Community",
      description: "Connect with fellow learners and share your achievements."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col overflow-hidden relative">
      <AnimatedBackground />
      <ParticleBackground />
      
      {/* Navbar */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="relative z-30 flex justify-between items-center p-6 backdrop-blur-md bg-white/90 shadow-lg border-b border-gray-200/50"
      >
        <SkillUpLogo />
        <motion.div className="flex items-center space-x-6">
          <Link 
            to="/login" 
            className="relative text-red-600 font-semibold px-4 py-2 rounded-lg group overflow-hidden"
          >
            <motion.span 
              className="absolute inset-0 bg-red-50 opacity-0 group-hover:opacity-100 rounded-lg"
              transition={{ duration: 0.3 }}
            />
            <span className="relative z-10">Log In</span>
            <motion.div 
              className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 group-hover:w-full transition-all duration-300"
            />
          </Link>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              to="/signup" 
              className="relative bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-lg font-semibold shadow-lg overflow-hidden group"
            >
              <motion.span 
                className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
              <span className="relative z-10">Sign Up</span>
            </Link>
          </motion.div>
        </motion.div>
      </motion.nav>    

      {/* Main Content */}
      <div className="flex-grow flex relative">
        {/* Left Content */}
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="relative z-20 w-1/2 flex flex-col items-center justify-center text-center px-12 py-16 bg-gradient-to-br from-white/95 via-slate-50/90 to-slate-100/85 backdrop-blur-sm"
          style={{ y: y1 }}
        >
          <motion.div
            variants={item}
            className="mb-8"
          >
            <motion.h1 
              className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              Build Skills That{' '}
              <motion.span 
                className="relative inline-block"
                whileHover={{ scale: 1.1 }}
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-600 to-red-700">
                  Matter!
                </span>
                <motion.div
                  className="absolute -inset-2 bg-gradient-to-r from-red-400/20 to-red-600/20 rounded-lg -z-10"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.span>
            </motion.h1>
          </motion.div>
          
          <motion.p 
            variants={item}
            className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl leading-relaxed"
          >
            Join SkillUp to track your learning goals, earn XP, and grow your skillset with every step. 
            Set ambitious goals, track meaningful progress, and earn beautiful badges as you transform into your best self.
          </motion.p>
          
          <motion.div variants={item} className="mb-12">
            <BeautifulButton />
          </motion.div>

          {/* Feature Cards */}
          <motion.div 
            variants={item}
            className="grid grid-cols-2 gap-4 max-w-lg"
          >
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={index * 0.1}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* Right Content with Enhanced Visuals */}
        <motion.div
          initial={{ scale: 0, opacity: 0, x: 100 }}
          animate={{ scale: 1, opacity: 1, x: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 100, 
            damping: 20,
            delay: 0.2
          }}
          className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-br from-red-500 via-red-600 to-red-700 overflow-hidden"
          style={{
            clipPath: "polygon(25% 0, 100% 0%, 100% 100%, 15% 100%, 0% 50%)",
            y: y2
          }}
        >
          {/* Animated background patterns */}
          <div className="absolute inset-0">
            <motion.div
              className="absolute top-10 right-10 w-32 h-32 border-4 border-white/20 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute bottom-20 right-20 w-24 h-24 border-2 border-white/30 rounded-full"
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
          </div>

          {/* Floating Achievement Badge */}
          <motion.div
            variants={floating}
            initial="initial"
            animate="animate"
            className="absolute top-[20%] left-[20%] group cursor-pointer"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <div className="w-48 h-44 bg-white rounded-2xl shadow-2xl p-6 border-4 border-yellow-400">
              <div className="flex items-center justify-between mb-3">
                <Award className="w-8 h-8 text-yellow-500" />
                <Star className="w-6 h-6 text-yellow-400 fill-current" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">JavaScript Master</h3>
              <p className="text-sm text-gray-600 mb-3">Completed 50 challenges</p>
              <div className="flex items-center">
                <div className="bg-green-100 px-2 py-1 rounded-full">
                  <span className="text-xs font-semibold text-green-800">+500 XP</span>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Floating Progress Card */}
          <motion.div
            variants={floating}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.5 }}
            className="absolute top-[55%] left-[35%] group cursor-pointer"
            whileHover={{ scale: 1.1, rotate: -5 }}
          >
            <div className="w-52 h-48 bg-white rounded-2xl shadow-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="w-8 h-8 text-blue-500" />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-3 h-3 bg-green-400 rounded-full"
                />
              </div>
              <h3 className="font-bold text-gray-800 mb-3">Weekly Progress</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Goals</span>
                  <span className="font-semibold">7/10</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "70%" }}
                    transition={{ duration: 2, delay: 1 }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Keep going!</span>
                  <Zap className="w-4 h-4 text-yellow-500" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Floating Learning Card */}
          <motion.div
            variants={floating}
            initial="initial"
            animate="animate"
            transition={{ delay: 1 }}
            className="absolute top-[75%] left-[10%] group cursor-pointer"
            whileHover={{ scale: 1.1, rotate: 3 }}
          >
            <div className="w-44 h-36 bg-white rounded-2xl shadow-2xl p-5">
              <div className="flex items-center mb-3">
                <BookOpen className="w-6 h-6 text-purple-500 mr-2" />
                <span className="text-sm font-semibold text-gray-800">Daily Study</span>
              </div>
              <div className="text-2xl font-bold text-purple-600 mb-1">2h 45m</div>
              <div className="text-xs text-gray-500 mb-2">+15 min from yesterday</div>
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-6 bg-purple-200 rounded"
                    animate={{
                      height: [24, Math.random() * 20 + 10, 24],
                      backgroundColor: [
                        "rgb(196 181 253)", 
                        "rgb(147 51 234)", 
                        "rgb(196 181 253)"
                      ]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* FAQ Section */}
      <FAQ />
    </div>
  );
}