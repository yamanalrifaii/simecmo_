export const AcuteHeartFailureScenario = {
  name: "Acute Heart Failure",
  introduction: "Acute heart failure (AHF) is a critical condition in which the heart suddenly becomes unable to pump enough blood to meet the body's needs. This could result from various conditions such as myocardial infarction (heart attack), severe arrhythmia, or decompensated chronic heart failure. In an ECMO (Extracorporeal Membrane Oxygenation) setting, AHF often requires immediate intervention to stabilize the patient by supporting heart and lung function externally. This simulation demonstrates how an ECMO circuit can be used to manage a patient in acute heart failure. The scenario includes various parameters related to the patient's heart function, blood gases, and lung function, allowing the user to understand how to adjust these parameters to improve the patient's condition.",
  conclusion: "Successful management of acute heart failure using ECMO involves careful monitoring of parameters, adjusting oxygen delivery, and supporting cardiac function.",
  showVAECMOBox: true,
  instructions: [
    {
      text: "Observe the initial patient parameters in the Data Layer. These parameters are reflective of a critically ill patient with acute heart failure. Start by assessing lung parameters such as FDO2 and Sweep, as well as heart-related parameters such as LV and RV contractility.",
      position: { top: '10%', left: '5%', width: '20%', height: '80%' }
    },
    {
      text: "Note the reduced LV and RV contractility in the ECMO Layer. These low values indicate that the heart is struggling to maintain proper blood flow. Begin by adjusting ECMO support to help offload the heart.",
      position: { top: '40%', left: '30%', width: '40%', height: '30%' }
    },
    {
      text: "Check the increased heart rate and rising lactate levels in the Data Layer. Elevated heart rate and lactate levels indicate poor tissue oxygenation. Gradually adjust the sweep gas and ECMO flow rates to improve oxygen delivery.",
      position: { top: '50%', left: '5%', width: '20%', height: '10%' }
    },
    {
      text: "Monitor the rising lactate levels in the ECMO Layer. Lactate is an indicator of tissue perfusion. If lactate levels continue to rise, increase oxygen delivery and ECMO support.",
      position: { top: '70%', left: '60%', width: '20%', height: '20%' }
    },
    {
      text: "Adjust ECMO settings as needed in the ECMO Layer. Once the patient stabilizes, you can fine-tune parameters such as FDO2 and flow rate to maintain stable oxygen levels and hemodynamics.",
      position: { top: '20%', left: '30%', width: '40%', height: '60%' }
    }
  ],
  simulationLogic: (setValues) => {
    setValues(prev => ({
      ...prev,
      LV_Contractility: 0.3,
      RV_Contractility: 0.4,
      HR: 120,
      Lactate: prev.Lactate + 2,
    }));
  },
};
