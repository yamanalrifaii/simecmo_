import React from 'react';
import { ChevronRight, AlertTriangle, Activity, TrendingUp, Stethoscope } from 'lucide-react';

const InterpretationPanel = ({ interpretation }) => {
  // Function to split interpretation text into sections
  const parseInterpretation = (text) => {
    if (!text || typeof text !== 'string') {
        return {};
    }

    const sections = {
        physiological: [],
        trends: [],
        clinical: [],
        concerns: []
    };

    let currentSection = null;
    const lines = text.split('\n');

    lines.forEach(line => {
        const trimmedLine = line.trim().toLowerCase();
        
        // More flexible section detection
        if (trimmedLine.match(/1\.|\bphysiological|impact/i)) {
            currentSection = 'physiological';
        } else if (trimmedLine.match(/2\.|\bkey trends|\btrends|\bmonitored/i)) {
            currentSection = 'trends';
        } else if (trimmedLine.match(/3\.|\bclinical|implications/i)) {
            currentSection = 'clinical';
        } else if (trimmedLine.match(/4\.|\bconcerns|\brecommendations/i)) {
            currentSection = 'concerns';
        } else if (trimmedLine && currentSection) {
            // More flexible point detection
            if (trimmedLine.match(/^[-•\d\.\s]/) || trimmedLine.length > 10) {
                sections[currentSection].push(line.replace(/^[-•\d\.\s]+/, '').trim());
            }
        }
    });

    return sections;
};

  const renderSection = (title, icon, items, color) => {
    if (!items || items.length === 0) return null;

    return (
      <div className="p-4 border-b border-gray-200 last:border-b-0">
        <div className="flex items-center gap-2 mb-3">
          {icon}
          <h3 className="font-medium text-blue-900">{title}</h3>
        </div>
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={index} className="flex items-start gap-2 text-gray-700">
              <ChevronRight className={`w-4 h-4 mt-1 flex-shrink-0 ${color}`} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const sections = parseInterpretation(interpretation);

  if (!sections || Object.values(sections).every(section => section.length === 0)) {
    return (
      <div className="p-4 text-gray-500 text-center">
        No interpretation available
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-blue-50 p-4 border-b border-blue-100">
        <h2 className="text-lg font-semibold text-blue-900">Clinical Interpretation</h2>
      </div>
      
      <div className="divide-y divide-gray-200">
        {renderSection(
          "Physiological Impact",
          <Activity className="w-5 h-5 text-blue-600" />,
          sections.physiological,
          "text-blue-500"
        )}
        
        {renderSection(
          "Key Trends",
          <TrendingUp className="w-5 h-5 text-green-600" />,
          sections.trends,
          "text-green-500"
        )}
        
        {renderSection(
          "Clinical Implications",
          <Stethoscope className="w-5 h-5 text-purple-600" />,
          sections.clinical,
          "text-purple-500"
        )}
        
        {renderSection(
          "Concerns & Recommendations",
          <AlertTriangle className="w-5 h-5 text-orange-600" />,
          sections.concerns,
          "text-orange-500"
        )}
      </div>
    </div>
  );
};

export default InterpretationPanel;