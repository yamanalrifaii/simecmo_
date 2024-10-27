import React from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';

const Home = () => {
  const scenarios = [
    {
      id: 'intro',
      title: 'What is ECMO?',
      description: 'Get introduced to ECMO, its components and how it works.',
      image: '/api/placeholder/600/400',
      color: 'from-red-500 to-red-700'
    },
    {
      id: 'acute-heart-failure',
      title: 'Acute Heart Failure',
      description: 'Simulate and manage a case of acute heart failure using ECMO.',
      image: '/api/placeholder/600/400',
      color: 'from-red-200 to-pink-200'
    },
    {
      id: 'chronic-heart-failure',
      title: 'Chronic Heart Failure',
      description: 'Explore long-term ECMO management in chronic heart failure patients.',
      image: '/api/placeholder/600/400',
      color: 'from-purple-200 to-indigo-200'
    },
    {
      id: 'cardiogenic-shock',
      title: 'Cardiogenic Shock',
      description: 'Handle a critical case of cardiogenic shock with ECMO support.',
      image: '/api/placeholder/600/400',
      color: 'from-green-200 to-teal-200'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 text-gray-800">
      <header className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-cyan-600">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-red">
            ECMO Simulation Platform
          </h1>
          <p className="mt-4 text-xl text-blue-100">
            Dive into realistic ECMO scenarios and enhance your skills in managing 
            complex cardiopulmonary conditions. Choose a scenario to begin your journey.
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold mb-12 text-center text-blue-800">Explore Scenarios</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
          {scenarios.map((scenario) => (
            <div key={scenario.id} className="transform transition duration-500 hover:scale-105">
              <Card className="bg-white border border-gray-200 overflow-hidden shadow-lg hover:shadow-2xl">
                <div className="relative">
                  <img src={scenario.image} alt={scenario.title} className="w-full h-48 object-cover" />
                  <div className={`absolute inset-0 bg-gradient-to-br ${scenario.color} opacity-75`}></div>
                  <h3 className="absolute bottom-4 left-4 text-2xl font-bold text-gray-800 drop-shadow-md">{scenario.title}</h3>
                </div>
                <div className="p-5">
                  <p className="text-gray-600 mb-4">{scenario.description}</p>
                  <Link to={`/scenarios/${scenario.id}`} className="inline-block">
                    <Button label="Start Scenario" icon="pi pi-play" className="p-button-rounded p-button-outlined p-button-primary" />
                  </Link>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </main>

      <footer className="mt-16 bg-gradient-to-r from-blue-600 to-cyan-600 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-blue-100">&copy; 2024 simECMO. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;