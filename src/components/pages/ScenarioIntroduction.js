import React from 'react';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import '../../css/ScenarioIntroduction.css';

const ScenarioIntroduction = ({ scenario }) => {
  const scenarios = {
    oxygenation: {
      title: "Understanding Oxygen Transport & Delivery",
      description: "Master the key parameters that influence oxygen delivery in ECMO therapy",
      parameters: [
        {
          name: "Hemoglobin (Hb)",
          description: "The oxygen-carrying protein in red blood cells",
          range: "5.0-20.0 g/dL",
          icon: "🔴"
        },
        {
          name: "Mixed Venous Oxygen (MVO₂)",
          description: "Reflects tissue oxygen extraction and utilization",
          range: "100-1500 mL/min",
          icon: "🔄"
        },
        {
          name: "Diffusing Capacity (DLCO)",
          description: "Measures gas transfer efficiency in the lungs",
          range: "1.0-100.0 mL/min/mmHg",
          icon: "🫁"
        },
        {
          name: "Shunt Fraction",
          description: "Blood bypassing pulmonary oxygenation",
          range: "0-100%",
          icon: "↗️"
        },
        {
          name: "Fraction of Delivered O₂ (FDO₂)",
          description: "Concentration of oxygen delivered to patient",
          range: "0.05-1.00",
          icon: "💨"
        }
      ]
    },
    hemodynamics: {
      title: "Mastering Blood Flow Dynamics",
      description: "Explore how vascular resistance affects circulation in ECMO support",
      parameters: [
        {
          name: "Arterial Resistance",
          description: "Resistance in the arterial system affecting blood pressure",
          range: "0-60 mmHg·s/mL",
          icon: "🔺"
        },
        {
          name: "Venous Resistance",
          description: "Affects ECMO drainage and venous return",
          range: "0-600 mmHg·s/mL",
          icon: "🔻"
        },
        {
          name: "Pulmonary Vascular Resistance",
          description: "Resistance in pulmonary circulation",
          range: "0-80 woods units",
          icon: "🫀"
        },
        {
          name: "Systemic Vascular Resistance",
          description: "Total peripheral resistance in systemic circulation",
          range: "0-100 woods units",
          icon: "🔄"
        }
      ]
    },
    cardiovascular: {
      title: "Cardiovascular Function & Support",
      description: "Understand how cardiac parameters interact with ECMO therapy",
      parameters: [
        {
          name: "Heart Rate",
          description: "Fundamental rhythm of cardiac contraction",
          range: "40-210 bpm",
          icon: "💓"
        },
        {
          name: "Volume Status",
          description: "Blood volume affecting cardiac filling",
          range: "200-5000 mL",
          icon: "💧"
        },
        {
          name: "LV Contractility",
          description: "Left ventricular pumping strength",
          range: "0.2-10.0 mmHg/mL",
          icon: "💪"
        },
        {
          name: "RV Contractility",
          description: "Right ventricular pumping strength",
          range: "0.5-5.0 mmHg/mL",
          icon: "🫀"
        }
      ]
    },
    ecmoparameters: {
      title: "ECMO Machine Parameters",
      description: "Master the mechanical aspects of ECMO support",
      parameters: [
        {
          name: "Pump Speed",
          description: "Rotational speed of the centrifugal pump",
          range: "0.6-6.7 RPM",
          icon: "⚙️"
        },
        {
          name: "Oxygenator Resistance",
          description: "Resistance to blood flow through the oxygenator",
          range: "0-200 mmHg/L/min",
          icon: "🚧"
        },
        {
          name: "Sweep Gas Flow",
          description: "Fresh gas flow controlling gas exchange",
          range: "0-10 L/min",
          icon: "💨"
        },
        {
          name: "Membrane Diffusion",
          description: "Gas exchange efficiency through the membrane",
          range: "0.0001-0.01 L/min",
          icon: "🔄"
        }
      ]
    }
  };

  const scenarioData = scenarios[scenario];
  const parameterTemplate = (param) => (
    <div className="custom-card bg-[#374151] hover:bg-opacity-90 transition-all duration-300 border border-[#2E7CA5]/20 rounded-lg p-4">
      <div className="flex items-start gap-4">
        <div className="text-3xl">{param.icon}</div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-[#f4f4f5] mb-2">{param.name}</h3>
          <p className="text-[#f4f4f5]/80 text-sm mb-2">{param.description}</p>
          <div className="inline-block bg-[#2E7CA5] text-[#f4f4f5] px-2 py-1 rounded-md text-sm">
            Range: {param.range}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="custom-card bg-[#374151] rounded-lg shadow-xl border border-[#2E7CA5]/20">
        <div className="text-center py-6 border-b border-[#2E7CA5]/20">
          <div className="relative px-4">
            <h1 className="text-4xl font-bold text-[#f4f4f5] mb-4">
              {scenarioData.title}
              <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-[#991b1b]" />
            </h1>
            <p className="text-xl text-[#f4f4f5]/80">{scenarioData.description}</p>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {scenarioData.parameters.map((param, index) => (
              <div key={index}>
                {parameterTemplate(param)}
              </div>
            ))}
          </div>

          <Divider className="border-[#2E7CA5]/20" />

          <div className="mt-8 bg-[#374151] rounded-lg p-6 border border-[#2E7CA5]/20">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#991b1b] rounded-full">
                <div className="text-2xl">💡</div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-[#f4f4f5] mb-4">How to Use This Simulator</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-[#2E7CA5] rounded-full" />
                      <span className="text-[#f4f4f5]/80">Adjust parameters in the ECMO layer</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-[#2E7CA5] rounded-full" />
                      <span className="text-[#f4f4f5]/80">Watch the ECMO circuit visualization update in real-time</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-[#2E7CA5] rounded-full" />
                      <span className="text-[#f4f4f5]/80">Monitor ML predictions in the ML layer</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-[#2E7CA5] rounded-full" />
                      <span className="text-[#f4f4f5]/80">Follow the step-by-step guide for each parameter</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScenarioIntroduction;