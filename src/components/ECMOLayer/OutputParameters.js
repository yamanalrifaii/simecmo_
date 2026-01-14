import React from 'react';

const OutputParameters = ({ hemodynamics, bloodGases, pressures, relevantParams = [] }) => {
  // Helper function to check if a parameter should be displayed
  const shouldShowParameter = (category, key, type = null) => {
    if (!relevantParams || relevantParams.length === 0) return true;

    const paramMappings = {
      bloodGases: {
        'DO2': 'bgDO2',
        'O2Sat': { arterial: 'caSys_O2sat', venous: 'cvSys_O2sat' },
        'pO2': { arterial: 'caSys_pO2', venous: 'cvSys_pO2' },
        'pH': { arterial: 'caSys_pH', venous: 'cvSys_pH' },
        'pCO2': { arterial: 'caSys_pCO2', venous: 'cvSys_pCO2' },
        'HCO3': { arterial: 'caSys_HCO3', venous: 'cvSys_HCO3' }, 
        'PCWP': 'ppcw' 
      },
      hemodynamics: {
        'systolic': 'paosys',
        'diastolic': 'paodia',
        'AoP': 'paoavg',
        'CO_LV': 'col',
        'CO_RV': 'cor', 
        'PCV': 'pcv', 
        'SVR' : 'svr'
      },
      pressures: {
        'Delta_P': 'ecmoUnitFlow', 
        'P1': 'ecmop1'
      }
    };

    const mapping = paramMappings[category]?.[key];
    if (!mapping) return false;

    if (typeof mapping === 'string') {
      return relevantParams.includes(mapping);
    }

    if (type && mapping[type]) {
      return relevantParams.includes(mapping[type]);
    }

    if (!type && typeof mapping === 'object') {
      return Object.values(mapping).some(param => relevantParams.includes(param));
    }

    return false;
  };

  const renderTwoColumnTable = (data, category) => {
    const relevantEntries = Object.entries(data).filter(([key]) => 
      shouldShowParameter(category, key)
    );

    if (relevantEntries.length === 0) return null;

    return (
      <div className="bg-white">
        <table className="w-full text-xs">
          <tbody>
            {Array(Math.ceil(relevantEntries.length / 2)).fill().map((_, rowIndex) => (
              <tr key={rowIndex}>
                {relevantEntries.slice(rowIndex * 2, rowIndex * 2 + 2).map(([key, value]) => (
                  <React.Fragment key={key}>
                    <td className="px-2 py-1 whitespace-nowrap text-sm font-medium text-gray-900">{key}</td>
                    <td className="px-2 py-1 whitespace-nowrap text-sm text-right text-gray-500">
                      {Number(value).toFixed(2)}
                    </td>
                  </React.Fragment>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderBloodGases = () => {
    const relevantBloodGases = Object.entries(bloodGases).filter(([key]) => 
      shouldShowParameter('bloodGases', key)
    );

    if (relevantBloodGases.length === 0) return null;

    return (
      <div className="bg-white">
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="px-2 py-1 text-left font-medium text-gray-500 uppercase tracking-wider"></th>
              <th className="px-2 py-1 text-left font-medium text-gray-500 uppercase tracking-wider">Arterial</th>
              <th className="px-2 py-1 text-center font-medium text-gray-500 uppercase tracking-wider">Venous</th>
            </tr>
          </thead>
          <tbody>
            {relevantBloodGases.map(([key, values]) => {
              if (!shouldShowParameter('bloodGases', key)) return null;

              return (
                <tr key={key}>
                  <td className="px-2 py-1 whitespace-nowrap text-sm font-medium text-gray-900">{key}</td>
                  {typeof values === 'object' ? (
                    <>
                      <td className="px-2 py-1 whitespace-nowrap text-sm text-right text-gray-500">
                        {shouldShowParameter('bloodGases', key, 'arterial') ? 
                          Number(values.arterial).toFixed(2) : '-'}
                      </td>
                      <td className="px-2 py-1 whitespace-nowrap text-sm text-right text-gray-500">
                        {shouldShowParameter('bloodGases', key, 'venous') ? 
                          Number(values.venous).toFixed(2) : '-'}
                      </td>
                    </>
                  ) : (
                    <td className="px-2 py-1 whitespace-nowrap text-sm text-center text-gray-500" colSpan="2">
                      {Number(values).toFixed(2)}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const hasRelevantBloodGases = Object.keys(bloodGases).some(key => 
    shouldShowParameter('bloodGases', key)
  );
  
  const hasRelevantHemodynamics = Object.keys(hemodynamics).some(key => 
    shouldShowParameter('hemodynamics', key)
  );
  
  const hasRelevantPressures = Object.keys(pressures).some(key => 
    shouldShowParameter('pressures', key)
  );

  return (
    <div className="p-2 bg-white rounded-lg shadow">
      {hasRelevantHemodynamics && (
        <div className="mb-4 rounded overflow-hidden">
          <div className="bg-gray-700 p-2">
            <h3 className="text-white text-sm font-semibold">Hemodynamics</h3>
          </div>
          {renderTwoColumnTable(hemodynamics, 'hemodynamics')}
        </div>
      )}

      {hasRelevantBloodGases && (
        <div className="mb-4 rounded overflow-hidden">
          <div className="bg-gray-700 p-2">
            <h3 className="text-white text-sm font-semibold">Blood Gases</h3>
          </div>
          {renderBloodGases()}
        </div>
      )}

      {hasRelevantPressures && (
        <div className="mb-4 rounded overflow-hidden">
          <div className="bg-gray-700 p-2">
            <h3 className="text-white text-sm font-semibold">Pressures</h3>
          </div>
          {renderTwoColumnTable(pressures, 'pressures')}
        </div>
      )}
    </div>
  );
};

export default OutputParameters;