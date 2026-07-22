import { TrendingUp, Key, List, Store, ShoppingBag, PlusCircle, Activity, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const cards = [
    {
      title: 'Trend Analysis',
      subtitle: 'Discover what sells',
      icon: <TrendingUp className="w-12 h-12 text-zinc-300 group-hover:text-[#F1641E] transition-colors mb-4" />,
      link: '/reports',
      bg: 'bg-zinc-800'
    },
    {
      title: 'Keyword Analysis',
      subtitle: 'Most searched terms',
      icon: <Key className="w-12 h-12 text-zinc-300 group-hover:text-[#F1641E] transition-colors mb-4" />,
      link: '/reports',
      bg: 'bg-zinc-800'
    },
    {
      title: 'Listing Analysis',
      subtitle: 'Analyze competitors',
      icon: <List className="w-12 h-12 text-zinc-300 group-hover:text-[#F1641E] transition-colors mb-4" />,
      link: '/listings',
      bg: 'bg-zinc-800'
    },
    {
      title: 'Shop Analysis',
      subtitle: 'Track successful shops',
      icon: <Store className="w-12 h-12 text-zinc-300 group-hover:text-[#F1641E] transition-colors mb-4" />,
      link: '/listings',
      bg: 'bg-zinc-800'
    },
    {
      title: 'My Shop',
      subtitle: 'Your own metrics',
      icon: <ShoppingBag className="w-12 h-12 text-zinc-300 group-hover:text-[#F1641E] transition-colors mb-4" />,
      link: '/',
      bg: 'bg-zinc-800'
    },
    {
      title: 'Product Creation',
      subtitle: 'AI design & mockup',
      icon: <PlusCircle className="w-12 h-12 text-zinc-300 group-hover:text-[#F1641E] transition-colors mb-4" />,
      link: '/ai-studio',
      bg: 'bg-zinc-800'
    }
  ];

  return (
    <div className="w-full h-full flex flex-col space-y-12 pb-12">
      {/* Hero Banner Section */}
      <div className="bg-[#F1641E] rounded-xl overflow-hidden flex flex-col md:flex-row relative group min-h-[350px]">
        {/* Left text area */}
        <div className="flex-1 p-12 flex flex-col justify-center items-center text-center relative z-10 bg-[#F1641E]">
          <div className="mb-6 flex justify-center w-full">
            <img src="/logo01.png" alt="PODSY PRO Logo" className="w-64 max-w-full h-auto object-contain drop-shadow-lg" />
          </div>
          <p className="text-xl text-white font-medium max-w-md mx-auto mb-8">
            AI-Powered Etsy Sales & Analysis Assistant
          </p>
          <button className="bg-[#111] text-white px-6 py-3 rounded-full font-bold hover:bg-zinc-800 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform">
            Explore System
          </button>
        </div>

        {/* Right Info blocks - styled like Etsy photos but with icons/text */}
        <div className="flex-1 flex flex-col sm:flex-row gap-0">
          <div className="flex-1 bg-zinc-900 p-8 flex flex-col justify-end relative overflow-hidden group-hover:bg-zinc-800 transition-colors">
            <Cpu className="absolute -top-10 -right-10 w-48 h-48 text-zinc-800/50" />
            <h3 className="text-2xl font-bold text-white mb-2 relative z-10">Smart Analysis</h3>
            <p className="text-zinc-400 relative z-10">Process millions of data points instantly</p>
          </div>
          <div className="flex-1 bg-zinc-800 p-8 flex flex-col justify-end relative overflow-hidden group-hover:bg-zinc-700 transition-colors">
            <Activity className="absolute -top-10 -right-10 w-48 h-48 text-zinc-700/50" />
            <h3 className="text-2xl font-bold text-white mb-2 relative z-10">Continuous Tracking</h3>
            <p className="text-zinc-400 relative z-10">Spot trends before competitors</p>
          </div>
        </div>
      </div>

      {/* Main Tools Cards Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          Explore Tools
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {cards.map((card, i) => (
            <Link 
              key={i} 
              to={card.link}
              className="group flex flex-col relative overflow-hidden rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all hover:-translate-y-1 hover:shadow-2xl aspect-[3/4]"
            >
              <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
                {card.icon}
                <h3 className="font-bold text-white mb-1 group-hover:text-[#F1641E] transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-zinc-400">
                  {card.subtitle}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
