// import React from 'react';  // Add this import
// import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
// import { BrowserRouter } from 'react-router-dom';
// import Dashboard from './components/Dashboard';
// import { predict } from './Services/ECMOPredictionService';
// import MLLayer from './components/MLLayer/MLLayer';  // Add this if not already imported
// import $ from 'jquery';
// global.$ = global.jQuery = $;

// // Mock the prediction service
// jest.mock('./Services/ECMOPredictionService');

// describe('Dashboard Component', () => {
//   const mockValues = {
//     Hb: 12,
//     MVO2: 250,
//     DLCO: 20,
//     shunt_fraction: 30,
//     FDO2: 0.6,
//     LV_Contractility: 1,
//     RV_Contractility: 1,
//     HR: 80,
//     Lactate: 1
//   };

//   const mockSetValues = jest.fn();

//   beforeEach(() => {
//     predict.mockReset();
//     predict.mockResolvedValue([
//       { time: 0, flow: 4.5, pressure: 100, oxygen: 95 },
//       { time: 1, flow: 4.6, pressure: 102, oxygen: 96 }
//     ]);
//   });

//   test('renders all three layers', () => {
//     render(
//       <BrowserRouter>
//         <Dashboard
//           scenarioType="oxygenation"
//           currentStep={{ parameter: 'Hb' }}
//           values={mockValues}
//           setValues={mockSetValues}
//         />
//       </BrowserRouter>
//     );

//     expect(screen.getByText(/Data Layer/i)).toBeInTheDocument();
//     expect(screen.getByText(/ECMO Layer/i)).toBeInTheDocument();
//     expect(screen.getByText(/ML Layer/i)).toBeInTheDocument();
//   });

//   test('updates parameter value when slider changes', async () => {
//     render(
//       <BrowserRouter>
//         <Dashboard
//           scenarioType="oxygenation"
//           currentStep={{ parameter: 'Hb' }}
//           values={mockValues}
//           setValues={mockSetValues}
//         />
//       </BrowserRouter>
//     );

//     const slider = screen.getByRole('slider');
//     fireEvent.change(slider, { target: { value: 14 } });

//     expect(mockSetValues).toHaveBeenCalledWith(
//       expect.objectContaining({ Hb: 14 })
//     );
//   });

//   test('shows loading state while fetching predictions', async () => {
//     predict.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));

//     render(
//       <BrowserRouter>
//         <Dashboard
//           scenarioType="oxygenation"
//           currentStep={{ parameter: 'Hb' }}
//           values={mockValues}
//           setValues={mockSetValues}
//         />
//       </BrowserRouter>
//     );

//     const slider = screen.getByRole('slider');
//     fireEvent.change(slider, { target: { value: 14 } });

//     expect(screen.getByRole('progressbar')).toBeInTheDocument();
//   });
// });

// // src/__tests__/ECMOLayer.test.jsx
// describe('ECMOLayer Component', () => {
//   const mockValues = {
//     LV_Contractility: 1,
//     RV_Contractility: 1,
//     HR: 80,
//     Lactate: 1,
//     O2Sat: 98
//   };

//   test('renders ECMO visualization', () => {
//     render(<ECMOLayer values={mockValues} onParameterChange={jest.fn()} />);
    
//     expect(screen.getByAltText(/ECMO Cannulations/i)).toBeInTheDocument();
//     expect(screen.getByText(/Air-Oxygen Blender/i)).toBeInTheDocument();
//   });

//   test('switches between visualization modes', () => {
//     render(<ECMOLayer values={mockValues} onParameterChange={jest.fn()} />);
    
//     const cannulationsButton = screen.getByText(/Cannulations/i);
//     const circulationsButton = screen.getByText(/Circulations/i);

//     fireEvent.click(circulationsButton);
//     expect(screen.getByAltText(/ECMO Circulations/i)).toBeInTheDocument();

//     fireEvent.click(cannulationsButton);
//     expect(screen.getByAltText(/ECMO Cannulations/i)).toBeInTheDocument();
//   });
// });

// // src/__tests__/DataLayer.test.jsx
// describe('DataLayer Component', () => {
//   test('renders parameter controls for oxygenation scenario', () => {
//     render(
//       <DataLayer
//         scenarioType="oxygenation"
//         onParameterChange={jest.fn()}
//       />
//     );

//     expect(screen.getByText(/Hemoglobin/i)).toBeInTheDocument();
//     expect(screen.getByText(/Mixed Venous Oxygen/i)).toBeInTheDocument();
//     expect(screen.getByText(/Diffusing Capacity/i)).toBeInTheDocument();
//   });

//   test('calls onParameterChange when slider value changes', () => {
//     const mockOnChange = jest.fn();
//     render(
//       <DataLayer
//         scenarioType="oxygenation"
//         onParameterChange={mockOnChange}
//       />
//     );

//     const hbSlider = screen.getByLabelText(/Hemoglobin/i);
//     fireEvent.change(hbSlider, { target: { value: 14 } });

//     expect(mockOnChange).toHaveBeenCalledWith('Hb', 14);
//   });
// });

// // src/__tests__/MLLayer.test.jsx
// describe('MLLayer Component', () => {
//   const mockPredictions = [
//     { time: 0, flow: 4.5, pressure: 100, oxygen: 95 },
//     { time: 1, flow: 4.6, pressure: 102, oxygen: 96 }
//   ];

//   test('renders loading state', () => {
//     render(
//       <MLLayer
//         scenarioType="oxygenation"
//         currentStep={{ parameter: 'Hb' }}
//         loading={true}
//       />
//     );

//     expect(screen.getByRole('progressbar')).toBeInTheDocument();
//   });

//   test('renders predictions when available', () => {
//     render(
//       <MLLayer
//         scenarioType="oxygenation"
//         currentStep={{ parameter: 'Hb' }}
//         predictions={mockPredictions}
//         loading={false}
//       />
//     );

//     expect(screen.getByText(/Flow and Pressure/i)).toBeInTheDocument();
//     expect(screen.getByText(/Oxygen Saturation/i)).toBeInTheDocument();
//   });

//   test('shows error message when prediction fails', () => {
//     render(
//       <MLLayer
//         scenarioType="oxygenation"
//         currentStep={{ parameter: 'Hb' }}
//         error="Failed to fetch predictions"
//         loading={false}
//       />
//     );

//     expect(screen.getByText(/Failed to fetch predictions/i)).toBeInTheDocument();
//   });
// });