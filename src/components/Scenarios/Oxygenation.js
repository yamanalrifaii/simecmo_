export const Oxygenation = {
  name: "Oxygenation",
  introduction: "The Oxygenation Scenario explores key parameters that affect the body's oxygen transport and utilization. By adjusting these parameters, users can gain insights into their impacts on oxygen delivery and overall respiratory function. The primary parameters included in this scenario are: Hemoglobin (Hb): A critical protein in red blood cells responsible for carrying oxygen from the lungs to tissues and transporting carbon dioxide back to the lungs. Changes in hemoglobin levels can significantly impact the body's oxygen-carrying capacity. Mixed Venous Oxygen (MVO2): Refers to the oxygen content in the blood returning to the heart after systemic circulation. This parameter helps indicate the balance between oxygen supply and demand in the body. Diffusing Capacity (DLCO): Measures the ability of the lungs to transfer oxygen from the air sacs into the blood. Modifications in diffusing capacity can affect the efficiency of gas exchange in the lungs. Shunt Fraction: Represents the portion of blood that bypasses oxygenation in the lungs and returns to systemic circulation without being oxygenated. A higher shunt fraction indicates reduced oxygen delivery to the body. Fraction of Delivered Oxygen (FDO2): The concentration of oxygen delivered to the patient or system. Adjusting this parameter affects the oxygen available for uptake by the lungs and tissues. This scenario allows users to interact with these parameters and observe their effects on the oxygenation process, providing a deeper understanding of how they contribute to the body's ability to maintain adequate oxygen levels and support metabolic demands.",
  conclusion: [
    "You've explored how different oxygenation parameters interact to maintain tissue oxygen delivery:", 
    "• Hemoglobin (Hb) directly affects bgDO2 and both arterial/venous oxygen saturation (caSys_O2sat, cvSys_O2sat)",
    "• Mixed Venous Oxygen (MVO2) influences bgDO2, arterial oxygen (caSys_pO2), and acid-base balance (cvSys_pCO2, caSys_HCO3)",
    "• Diffusing Capacity (DLCO) controls gas exchange efficiency, affecting both oxygen and CO2 levels in arterial and venous blood",
    "• Shunt Fraction impacts arterial/venous oxygenation and pH balance across the entire system",
    "• FDO2 directly controls oxygen availability, affecting both arterial and venous parameters and overall oxygen delivery",
    "Understanding these relationships is crucial for optimizing ECMO oxygenation support."
  ],  showVAECMOBox: true,
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
