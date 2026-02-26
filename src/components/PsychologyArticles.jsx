import React from 'react';

const PsychologyArticles = ({ currentFilter }) => {
  const [articles, setArticles] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  // Curated article links for each category
  const articleLinks = {
    'all': [
      { id: 1, title: 'Mental Health Basics', author: 'Psychology Today', summary: 'Comprehensive guide to understanding mental health and wellness.', source: 'https://www.psychologytoday.com/us/basics/mental-health' },
      { id: 2, title: 'Mental Wellness Resources', author: 'Mind', summary: 'Information and resources for better mental health.', source: 'https://www.mind.org.uk/information-support/' }
    ],
    'anxiety': [
      { id: 1, title: 'Understanding Anxiety Disorders', author: 'Mayo Clinic', summary: 'Symptoms, causes, and treatment options for anxiety.', source: 'https://www.mayoclinic.org/diseases-conditions/anxiety/symptoms-causes/syc-20350961' },
      { id: 2, title: 'Anxiety Management Techniques', author: 'Psychology Today', summary: 'Evidence-based strategies to manage anxiety.', source: 'https://www.psychologytoday.com/us/basics/anxiety' }
    ],
    'depression': [
      { id: 1, title: 'Depression Facts and Figures', author: 'Mind', summary: 'Understanding depression and its impact.', source: 'https://www.mind.org.uk/information-support/types-of-mental-health-problems/depression/' },
      { id: 2, title: 'Depression Guide', author: 'Mayo Clinic', summary: 'Symptoms, diagnosis, and treatment approaches.', source: 'https://www.mayoclinic.org/diseases-conditions/depression/symptoms-causes/syc-20350057' }
    ],
    'stress': [
      { id: 1, title: 'Stress Management Guide', author: 'American Psychological Association', summary: 'Techniques to manage and reduce stress.', source: 'https://www.apa.org/topics/stress' },
      { id: 2, title: 'Student Stress Resources', author: 'Mind', summary: 'Coping with stress as a student.', source: 'https://www.mind.org.uk/information-support/types-of-mental-health-problems/stress/' }
    ],
    'relationships': [
      { id: 1, title: 'Healthy Relationships Guide', author: 'Psychology Today', summary: 'Building and maintaining healthy relationships.', source: 'https://www.psychologytoday.com/us/basics/relationships' },
      { id: 2, title: 'Relationship Advice', author: 'Mind', summary: 'Support for relationship challenges and conflicts.', source: 'https://www.mind.org.uk/information-support/relationships/' }
    ],
    'self_esteem': [
      { id: 1, title: 'Building Self-Esteem', author: 'Psychology Today', summary: 'How to develop and maintain healthy self-worth.', source: 'https://www.psychologytoday.com/us/basics/self-esteem' },
      { id: 2, title: 'Self-Esteem and Confidence', author: 'Mind', summary: 'Practical tips for improving confidence.', source: 'https://www.mind.org.uk/information-support/types-of-mental-health-problems/self-harm/self-esteem/' }
    ],
    'academic': [
      { id: 1, title: 'Academic Stress and Health', author: 'American Psychological Association', summary: 'Managing academic pressure and stress.', source: 'https://www.apa.org/topics/school-psychology' },
      { id: 2, title: 'Student Mental Health', author: 'Mind', summary: 'Mental health support for students.', source: 'https://www.mind.org.uk/information-support/guides-to-support-and-services/workplace-mental-health/' }
    ],
    'sleep': [
      { id: 1, title: 'Understanding Sleep', author: 'Sleep Foundation', summary: 'Sleep science and sleep hygiene practices.', source: 'https://www.sleepfoundation.org/sleep-categories' },
      { id: 2, title: 'Better Sleep Tips', author: 'Mayo Clinic', summary: 'Practical advice for improving sleep quality.', source: 'https://www.mayoclinic.org/diseases-conditions/insomnia/diagnosis-treatment/drc-20355107' }
    ]
  };

  React.useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      const articles = articleLinks[currentFilter] || articleLinks['all'];
      setArticles(articles);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [currentFilter]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading articles...</p>
      </div>
    );
  }

  return (
    <div className="mb-8" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0), rgba(239,246,255,0.7))', borderRadius: '1rem', padding: '1rem' }}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {articles.map(article => (
          <div key={article.id} className="bg-white rounded-lg shadow-md p-6 card-hover" style={{ boxShadow: '0 18px 36px rgba(99,102,241,0.18)' }}>
            <h4 className="text-lg font-semibold text-gray-900 mb-1">{article.title}</h4>
            <p className="text-indigo-600 text-sm font-medium mb-2">{article.author}</p>
            <p className="text-gray-600 text-sm mb-3 line-clamp-3">{article.summary}</p>
            <a
              href={article.source}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ display: 'inline-block' }}
            >
              Read More ↗
            </a>
          </div>
        ))}
      </div>
      <div className="text-xs text-gray-500 mt-4 text-center">
        Curated resources from trusted mental health organizations
      </div>
    </div>
  );
};

export default PsychologyArticles;