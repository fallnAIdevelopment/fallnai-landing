import React, { useEffect, useRef, useState } from 'react';
import { 
  ChevronDown, 
  Gamepad2, 
  Layers, 
  Bot, 
  Cpu, 
  ArrowRight, 
  Server, 
  Globe, 
  TerminalSquare
} from 'lucide-react';

// --- Cinematic Background Component ---
// Simulates a 3D neural/spatial field to match FallnAI's focus on high-fidelity 3D and AI.
const CinematicBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Particle class for 3D projection simulation
    class Particle {
      constructor() {
        this.x = (Math.random() - 0.5) * canvas.width * 2;
        this.y = (Math.random() - 0.5) * canvas.height * 2;
        this.z = Math.random() * 2000;
        this.pz = this.z;
      }

      update(speed) {
        this.z -= speed;
        if (this.z < 1) {
          this.z = 2000;
          this.x = (Math.random() - 0.5) * canvas.width * 2;
          this.y = (Math.random() - 0.5) * canvas.height * 2;
          this.pz = this.z;
        }
      }

      draw() {
        // Perspective projection
        let fov = 250;
        let scale = fov / (fov + this.z);
        let x2d = this.x * scale + canvas.width / 2;
        let y2d = this.y * scale + canvas.height / 2;

        let pScale = fov / (fov + this.pz);
        let px2d = this.x * pScale + canvas.width / 2;
        let py2d = this.y * pScale + canvas.height / 2;

        this.pz = this.z;

        const opacity = Math.max(0, 1 - this.z / 2000);
        
        ctx.beginPath();
        ctx.moveTo(px2d, py2d);
        ctx.lineTo(x2d, y2d);
        // FallnAI color palette: Deep Cyans and Purples
        ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`; 
        ctx.lineWidth = scale * 2.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(x2d, y2d, scale * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56, 189, 248, ${opacity})`;
        ctx.fill();
      }
    }

    // Initialize particles
    for (let i = 0; i < 400; i++) {
      particles.push(new Particle());
    }

    let speed = 2;
    let targetSpeed = 2;

    // Smooth speed transitions on scroll
    const handleScroll = () => {
      targetSpeed = 2 + (window.scrollY * 0.05);
    };
    window.addEventListener('scroll', handleScroll);

    const animate = () => {
      ctx.fillStyle = 'rgba(2, 6, 23, 0.2)'; // Deep slate tailwind color with trails
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      speed += (targetSpeed - speed) * 0.1; // Lerp speed
      targetSpeed = Math.max(2, targetSpeed * 0.95); // Decay back to base speed

      particles.forEach(p => {
        p.update(speed);
        p.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full pointer-events-none z-0 bg-slate-950"
    />
  );
};

// --- Reusable UI Components ---

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b border-white/0 ${scrolled ? 'bg-slate-950/80 backdrop-blur-md border-white/10 py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-sky-500 flex items-center justify-center">
            <span className="text-white font-bold text-xl">F</span>
          </div>
          <span className="text-white font-semibold tracking-wide text-xl">FallnAI</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-slate-300">
          <a href="#about" className="hover:text-white transition-colors">About</a>
          <a href="#builders" className="hover:text-white transition-colors">Builders</a>
          <a href="#ecosystem" className="hover:text-white transition-colors">Ecosystem</a>
          <a href="#research" className="hover:text-white transition-colors">Research</a>
        </div>
        <button className="px-5 py-2 text-sm font-medium text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-full backdrop-blur-sm transition-all">
          Access Platform
        </button>
      </div>
    </nav>
  );
};

const FeatureCard = ({ icon: Icon, title, description, badge }) => (
  <div className="group relative p-1 rounded-2xl bg-gradient-to-b from-white/10 to-transparent hover:from-purple-500/30 hover:to-sky-500/10 transition-all duration-500">
    <div className="absolute inset-0 bg-slate-950/90 rounded-2xl backdrop-blur-xl -z-10"></div>
    <div className="h-full p-8 rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-sm flex flex-col">
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-sky-400 group-hover:text-purple-400 transition-colors duration-500 group-hover:scale-110">
          <Icon size={28} />
        </div>
        {badge && (
          <span className="px-3 py-1 text-xs font-semibold tracking-wider text-purple-300 bg-purple-500/20 border border-purple-500/30 rounded-full">
            {badge}
          </span>
        )}
      </div>
      <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">{title}</h3>
      <p className="text-slate-400 leading-relaxed flex-grow">{description}</p>
      <div className="mt-8 flex items-center gap-2 text-sky-400 font-medium group-hover:gap-4 transition-all duration-300 cursor-pointer">
        Explore {title} <ArrowRight size={16} />
      </div>
    </div>
  </div>
);

// --- Main Application ---

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-purple-500/30 overflow-x-hidden">
      <CinematicBackground />
      <NavBar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-6 pt-20 z-10">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-purple-400"></span>
            <span className="text-xs font-medium text-slate-300 tracking-wider uppercase">Advanced AI Software Engineering</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-500 tracking-tight mb-8 drop-shadow-2xl">
            Limitless Ideas. <br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-sky-400">
              Autonomous Execution.
            </span>
          </h1>
          
          <p className="text-lg md:text-2xl text-slate-400 max-w-3xl mb-12 leading-relaxed font-light">
            FallnAI develops advanced machine learning infrastructure that doesn't just assist—it builds. From fully autonomous AAA 3D game studios to complete application factories, we turn complex visions into deployed realities.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button className="px-8 py-4 bg-white text-slate-950 hover:bg-slate-200 font-bold rounded-full transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-105">
              Enter the Ecosystem
            </button>
            <button className="px-8 py-4 bg-white/5 border border-white/10 text-white hover:bg-white/10 font-bold rounded-full backdrop-blur-md transition-all hover:scale-105">
              Read our Research
            </button>
          </div>
        </div>

        <div className="absolute bottom-10 animate-bounce text-slate-500 cursor-pointer hover:text-white transition-colors">
          <a href="#builders"><ChevronDown size={32} /></a>
        </div>
      </section>

      {/* Builder Platforms Section */}
      <section id="builders" className="relative z-10 py-32 px-6 bg-slate-950/50 backdrop-blur-xl border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 md:w-2/3">
            <h2 className="text-sky-400 font-semibold tracking-widest uppercase text-sm mb-3">The Builders</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">Autonomous Digital Factories.</h3>
            <p className="text-xl text-slate-400 leading-relaxed">
              Our deep infrastructural work directly fuels our "builder" platforms. These are not mere code assistants; they are end-to-end autonomous studios designed to engineer raw concepts into deployable reality.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <FeatureCard 
              icon={Gamepad2}
              title="xGameBuilder"
              badge="Flagship"
              description="The world's first fully autonomous 3D game studio. Designed to take a user's core concept and engineer a complete, photorealistic, AAA-quality gaming experience optimized for any platform."
            />
            <FeatureCard 
              icon={Layers}
              title="xAppBuilder"
              description="A multi-platform software factory. This engine streamlines the traditional software lifecycle, autonomously writing, structuring, and deploying full web and native applications from the ground up."
            />
          </div>
        </div>
      </section>

      {/* Everyday Ecosystem Section */}
      <section id="ecosystem" className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto">
           <div className="mb-20 md:w-2/3 ml-auto text-left md:text-right">
            <h2 className="text-purple-400 font-semibold tracking-widest uppercase text-sm mb-3">The Ecosystem</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">Practical Everyday Workflows.</h3>
            <p className="text-xl text-slate-400 leading-relaxed">
              Beyond massive generative engines, FallnAI maintains a highly practical ecosystem of tools and agents designed to navigate and execute the complex tasks that standard AI models fail to complete.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <FeatureCard 
              icon={Globe}
              title="Generative AI Platform"
              description="A massive centralized utility hub. Currently hosting an expanding suite of over 50 distinct multimodal generation tools, giving users direct access to state-of-the-art models for diverse creative and analytical tasks."
            />
             <FeatureCard 
              icon={Bot}
              title="FallnAI TaskAgent"
              description="An omni-use AI acting as a sophisticated digital operative. Engineered specifically to handle edge cases, execute multi-step logic, and persist through complex workflows that break standard AI systems."
            />
          </div>
        </div>
      </section>

      {/* Research Section */}
      <section id="research" className="relative z-10 py-32 px-6 bg-gradient-to-b from-slate-950/0 via-purple-950/20 to-slate-950">
        <div className="max-w-7xl mx-auto relative">
          <div className="absolute inset-0 bg-blue-500/10 blur-[120px] rounded-full"></div>
          
          <div className="relative bg-slate-900/40 border border-white/10 rounded-3xl p-8 md:p-16 backdrop-blur-md overflow-hidden">
             {/* Decorative tech grid */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
              <div>
                <div className="flex items-center gap-3 text-sky-400 mb-6">
                  <Cpu size={24} />
                  <span className="font-semibold tracking-widest uppercase text-sm">FallnAI Research</span>
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                  Foundational ML Architecture & Infrastructure
                </h3>
                <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                  As a participant in <span className="text-white font-medium">Google's Cloud TPU Research program</span>, our engineering team tackles the raw infrastructure challenges required to make spatial and 3D generation viable at scale.
                </p>
                <div className="p-6 rounded-xl bg-black/40 border border-white/5 font-mono text-sm text-slate-300">
                  <div className="flex gap-2 mb-3">
                    <TerminalSquare size={16} className="text-purple-400"/>
                    <span className="text-purple-400">Latest Publication</span>
                  </div>
                  "An Architectural Framework and Infrastructure Optimization for High-Fidelity 3D Multimodal World Models on Cloud TPU Clusters"
                </div>
              </div>
              
              <div className="flex justify-center lg:justify-end">
                {/* Abstract Data Representation Art */}
                <div className="relative w-72 h-72 rounded-full border border-white/10 flex items-center justify-center bg-slate-950 shadow-[0_0_100px_rgba(139,92,246,0.15)]">
                  <div className="absolute inset-4 rounded-full border border-sky-500/30 animate-[spin_20s_linear_infinite]"></div>
                  <div className="absolute inset-8 rounded-full border border-purple-500/30 animate-[spin_15s_linear_infinite_reverse]"></div>
                  <div className="absolute inset-12 rounded-full border-t border-r border-white/20 animate-[spin_10s_linear_infinite]"></div>
                  <Server size={48} className="text-white/80 z-10" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 border-t border-white/10 bg-slate-950 text-slate-500 text-sm">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
             <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-purple-600 to-sky-500 flex items-center justify-center">
                <span className="text-white font-bold text-xs">F</span>
              </div>
              <span className="text-slate-200 font-semibold tracking-wide">FallnAI</span>
            </div>
            <p className="max-w-sm">Bridging the gap between heavy-duty AI/ML research and autonomous software creation.</p>
          </div>
          <div>
            <h4 className="text-slate-300 font-semibold mb-4">Platforms</h4>
            <ul className="space-y-2">
              <li><a href="https://xgamebuilder.com" className="hover:text-white transition-colors">xGameBuilder</a></li>
              <li><a href="https://xappbuilder.com" className="hover:text-white transition-colors">xAppBuilder</a></li>
              <li><a href="https://tools.fallnai.com" className="hover:text-white transition-colors">Generative Hub</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-slate-300 font-semibold mb-4">Organization</h4>
            <ul className="space-y-2">
              <li><a href="/research" className="hover:text-white transition-colors">Research</a></li>
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} FallnAI. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}


