import resourcesHero from '../assets/resources-hero.png';

const ResourcesTab = () => {
  const resources = [
    {
      icon: '🏥',
      title: 'Health Center',
      description: 'Medical services and health screenings',
      phone: '(555) 123-4567'
    },
    {
      icon: '🚨',
      title: 'Crisis Hotline',
      description: '24/7 emergency mental health support',
      phone: '(555) 911-HELP'
    },
    {
      icon: '💊',
      title: 'Pharmacy',
      description: 'Prescription and over-the-counter medications',
      phone: '(555) 123-MEDS'
    },
    {
      icon: '🍎',
      title: 'Nutrition Services',
      description: 'Dietary consultations and meal planning',
      phone: '(555) 123-FOOD'
    },
    {
      icon: '🏃‍♂️',
      title: 'Recreation Center',
      description: 'Sports facilities and fitness programs',
      phone: '(555) 123-MOVE'
    },
    {
      icon: '📚',
      title: 'Wellness Library',
      description: 'Health education resources and materials',
      phone: '(555) 123-READ'
    }
  ];

  return (
    <div className="min-h-screen bg-transparent">
      {/* Hero Card - glass, no full-screen image */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="relative rounded-2xl overflow-hidden backdrop-blur-xl bg-white/6 border border-white/8 shadow-[0_30px_80px_rgba(15,23,42,0.6)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
            <div className="p-8 lg:p-12">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">Campus Resources & Support</h2>
              <p className="mt-3 text-slate-200/80 max-w-xl">Everything you need to thrive on campus — from medical services to recreation.</p>
            </div>
            <div className="p-6 lg:p-8">
              <div className="rounded-xl overflow-hidden border border-white/6">
                <img src={resourcesHero} alt="Campus" className="w-full h-52 sm:h-64 object-cover" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resources.map((resource, index) => (
            <div
              key={index}
              className="backdrop-blur-xl bg-white/8 border border-white/10 rounded-xl p-8 hover:bg-white/14 transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
            >
              <div className="w-14 h-14 bg-teal-400/20 rounded-xl flex items-center justify-center text-3xl mb-6">
                {resource.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{resource.title}</h3>
              <p className="text-slate-300/80 mb-6">{resource.description}</p>
              <div className="flex items-center text-teal-300 font-medium">
                <span className="mr-2">📞</span>
                {resource.phone}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResourcesTab;