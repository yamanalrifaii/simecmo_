import React, { useState } from 'react';
import { Steps } from 'primereact/steps';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Slider } from 'primereact/slider';
import Dashboard from './Dashboard';

const ScenarioStepper = ({ scenario, values, setValues }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleParameterChange = (param, value) => {
    setValues(prev => ({ ...prev, [param]: value }));
  };

  const renderStep = (step) => {
    if (step.id === 'intro') {
      return (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{scenario.title}</h2>
          <p className="text-gray-600">{scenario.introduction}</p>
          <Dashboard values={values} setValues={setValues} />
        </div>
      );
    }

    if (step.id === 'conclusion') {
      return (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Summary</h2>
          <p className="text-gray-600">{scenario.conclusion}</p>
          <Dashboard values={values} setValues={setValues} />
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <h3 className="text-lg font-medium">{step.title}</h3>
        <div className="flex items-center space-x-4">
          <Slider 
            value={values[step.parameter] || 0}
            onChange={(e) => handleParameterChange(step.parameter, e.value)}
            min={step.range.min}
            max={step.range.max}
            step={step.range.step}
            className="w-full"
          />
          <span className="text-sm text-gray-600">
            {values[step.parameter]?.toFixed(2)} {step.unit}
          </span>
        </div>
        <Dashboard values={values} setValues={setValues} />
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-8">
      <Steps
        model={scenario.steps.map(step => ({ label: step.label }))}
        activeIndex={activeIndex}
        onSelect={(e) => setActiveIndex(e.index)}
        readOnly={false}
        className="custom-stepper"
      />
      
      <Card className="w-full">
        {renderStep(scenario.steps[activeIndex])}
      </Card>

      <div className="flex justify-between pt-4">
        <Button
          label="Back"
          icon="pi pi-arrow-left"
          className={activeIndex === 0 ? 'hidden' : 'p-button-secondary'}
          onClick={() => setActiveIndex(prev => Math.max(prev - 1, 0))}
        />
        <Button
          label={activeIndex === scenario.steps.length - 1 ? "Finish" : "Next"}
          icon={activeIndex === scenario.steps.length - 1 ? "pi pi-check" : "pi pi-arrow-right"}
          iconPos="right"
          onClick={() => setActiveIndex(prev => Math.min(prev + 1, scenario.steps.length - 1))}
        />
      </div>
    </div>
  );
};

export default ScenarioStepper;