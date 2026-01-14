
import React from 'react'; 
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ECMOLayer from './ECMOLayer';

describe('ECMOLayer Component', () => {
  test('ECMOLayer updates parameters correctly', () => {
    const onParameterChange = jest.fn();
    render(<ECMOLayer onParameterChange={onParameterChange} />);
    fireEvent.change(screen.getByLabelText('RPM'), {target: {value: '2000'}});
    expect(onParameterChange).toHaveBeenCalledWith('rpm', 2000);
  });

  // Add more tests here
});