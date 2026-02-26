import React from 'react';

const PsychologyArticles = ({ currentFilter }) => {
  const [articles, setArticles] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  // Static articles for each category
  const staticArticles = {
    'all': [
      { id: 1, title: 'Understanding Mental Health: A Comprehensive Guide', author: 'Psychology Today', summary: 'Explore the fundamentals of mental health and wellness strategies.', source: '#' }
    ],
    'anxiety': [
      { id: 1, title: 'Managing Anxiety: Evidence-Based Techniques', author: 'Mental Health Foundation', summary: 'Learn practical strategies to manage anxiety effectively.', source: '#' }
    ],
    'depression': [
      { id: 1, title: 'Depression and Recovery: Finding Hope', author: 'MIND', summary: 'Understanding depression and pathways to recovery and support.', source: '#' }
    ],
    'stress': [
      { id: 1, title: 'Stress Management for Students', author: 'Campus Wellness', summary: 'Effective stress relief techniques tailored for academic life.', source: '#' }
    ],
    'relationships': [
      { id: 1, title: 'Building Healthy Relationships', author: 'Psychology Central', summary: 'Key principles for developing strong, positive relationships.', source: '#' }
    ],
    'self_esteem': [
      { id: 1, title: 'Boosting Self-Esteem and Confidence', author: 'Self Development Hub', summary: 'Practical ways to build self-worth and confidence.', source: '#' }
    ],
    'academic': [
      { id: 1, title: 'Academic Success and Mental Wellness', author: 'Student Health Services', summary: 'Balancing academic pressure with mental health.', source: '#' }
    ],
    'sleep': [
      { id: 1, title: 'Sleep Hygiene: The Foundation of Health', author: 'Sleep Foundation', summary: 'Improve sleep quality with proven sleep hygiene practices.', source: '#' }
    ]
  };

  React.useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      const articles = staticArticles[currentFilter] || staticArticles['all'];
      setArticles(articles);
      setLoading(false);
    }, 500);

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
            {article.source && article.source !== '#' && (
              <a
                href={article.source}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ display: 'inline-block' }}
              >
                Read Full Article ↗
              </a>
            )}
          </div>
        ))}
      </div>
      <div className="text-xs text-gray-500 mt-4 text-center">
        Psychology Article Resources
      </div>
    </div>
  );
};

export default PsychologyArticles;