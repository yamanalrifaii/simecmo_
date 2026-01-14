export async function predict(scenario, parameter, targetValue, initialStates = {}) {
  try {
    // Normalize the parameter name
    const cleanParameter = parameter.toLowerCase().replace(/\s+/g, '_');

    // Explicitly fetch the current value for the parameter
    const currentValue = initialStates[parameter] || 0;

    console.log('Sending prediction request:', {
      scenario,
      parameter: cleanParameter,
      currentValue,
      targetValue,
      initialStates
    });

    const response = await fetch(`${BASE_URL}/api/predict`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        scenario: scenario.toLowerCase(),
        parameter: cleanParameter,
        initialValue: currentValue,
        targetValue: targetValue,
        initialStates: initialStates
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch predictions');
    }

    const data = await response.json();

    console.log('Received predictions:', data);
    return data;
  } catch (error) {
    console.error('Error in prediction service:', error);
    throw error;
  }
}
