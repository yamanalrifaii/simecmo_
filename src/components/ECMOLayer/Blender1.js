import React, { useEffect, useRef } from 'react';
import $ from 'jquery';
import 'jquery-knob';
import '../../css/Blender.css';

function Blender1({ 
    fdo2, 
    sweep, 
    onFdo2Change, 
    onSweepChange,
    disabled = false 
}) {
    const knobRef = useRef(null);

    useEffect(() => {
        const $knob = $(knobRef.current);
        $knob.knob({
            min: 0,
            max: 100,
            width: 130,
            height: 130,
            fgColor: '#991b1b',
            bgColor: '#ecf0f1',
            thickness: 0.2,
            angleOffset: -125,
            angleArc: 250,
            step: 1,
            displayInput: false,
            readOnly: disabled,
            change: function(value) {
                onFdo2Change(value / 100);
            },
            // Inside the useEffect hook, update the draw function:
draw: function() {
    this.cursorExt = 1;
    this.g.lineWidth = 2;
    this.o.cursor = true;

    const labels = [0.00, 0.21, 0.30, 0.40, 0.50, 0.60, 0.70, 0.80, 0.90, 1.00];
    const valueIndex = labels.findIndex(label => label >= this.cv / 100);
    const lowerLabel = labels[Math.max(0, valueIndex - 1)];
    const upperLabel = labels[valueIndex];
    const valueFraction = (this.cv / 100 - lowerLabel) / (upperLabel - lowerLabel);
    const lowerIndex = Math.max(0, valueIndex - 1);
    const upperIndex = valueIndex;
    
    const getAngleForIndex = (index) => this.startAngle + (index / (labels.length - 1)) * this.angleArc;
    const lowerAngle = getAngleForIndex(lowerIndex);
    const upperAngle = getAngleForIndex(upperIndex);
    const valueAngle = lowerAngle + (upperAngle - lowerAngle) * valueFraction;

    // Foreground arc
    this.g.beginPath();
    this.g.strokeStyle = disabled ? '#cccccc' : '#991b1b';
    this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, this.startAngle, valueAngle);
    this.g.stroke();

    // Background arc
    this.g.beginPath();
    this.g.strokeStyle = '#ecf0f1';
    this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, valueAngle, this.endAngle);
    this.g.stroke();

    // Draw pointer/arrow
    const x1 = this.xy + (this.radius - 20) * Math.cos(valueAngle);
    const y1 = this.xy + (this.radius - 20) * Math.sin(valueAngle);
    const x2 = this.xy + this.radius * Math.cos(valueAngle);
    const y2 = this.xy + this.radius * Math.sin(valueAngle);
    this.g.beginPath();
    this.g.moveTo(x1, y1);
    this.g.lineTo(x2, y2);
    this.g.strokeStyle = disabled ? '#cccccc' : '#e74c3c';
    this.g.lineWidth = 0.5;
    this.g.stroke();

    // Draw value labels and indicator lines with adjusted positioning
    labels.forEach((label, index) => {
        const labelAngle = getAngleForIndex(index);
        
        // Draw indicator line
        const innerX = this.xy + (this.radius - 25) * Math.cos(labelAngle);
        const innerY = this.xy + (this.radius - 25) * Math.sin(labelAngle);
        const outerX = this.xy + this.radius * Math.cos(labelAngle);
        const outerY = this.xy + this.radius * Math.sin(labelAngle);
        this.g.beginPath();
        this.g.moveTo(innerX, innerY);
        this.g.lineTo(outerX, outerY);
        this.g.strokeStyle = disabled ? '#cccccc' : '#000';
        this.g.lineWidth = 1;
        this.g.stroke();

        // Calculate label position with more spacing
        const labelRadius = this.radius - 35;  // Increased distance from center
        const labelX = this.xy + labelRadius * Math.cos(labelAngle);
        const labelY = this.xy + labelRadius * Math.sin(labelAngle);
        
        // Set smaller font size and handle text alignment
        this.g.fillStyle = disabled ? '#cccccc' : '#000';
        this.g.font = '7px Arial';  // Reduced font size
        this.g.textAlign = 'center';  // Center align text
        this.g.textBaseline = 'middle';  // Vertically center text
        
        // Add background for better readability
        const labelText = label.toFixed(2);
        const metrics = this.g.measureText(labelText);
        const padding = 1;
        
        // Draw white background for text
        this.g.fillStyle = '#ffffff';
        this.g.fillRect(
            labelX - metrics.width/2 - padding,
            labelY - 4,
            metrics.width + padding * 2,
            8
        );
        
        // Draw text
        this.g.fillStyle = disabled ? '#cccccc' : '#000';
        this.g.fillText(labelText, labelX, labelY);
    });
}
        });

        return () => {
            $knob.knob('destroy');
        };
    }, [disabled, onFdo2Change]);

    const handleSweepChange = (increment) => {
        if (disabled) return;
        const newValue = Math.round((sweep + increment) * 2) / 2;
        const clampedValue = Math.max(0, Math.min(10, newValue));
        onSweepChange(clampedValue);
    };

    const sweepHeight = `${(sweep / 10) * 100}%`;

    return (
        <div className="blender-container bg-white p-2 rounded-lg shadow-md" 
            style={{ 
                width: '220px', 
                fontSize: '14px', 
                position: 'absolute', 
                zIndex: 10,
                opacity: disabled ? 0.7 : 1
            }}>            
            <div className='text-dark-grey text-sm font-bold mb-4 text-center'>Air-Oxygen Blender</div>
            <div className="blender-controls flex justify-between">
                <div className="control-group">
                    <div className="mb-6">FdO2</div>
                    <div className="fdo2-control">
                        <input 
                            ref={knobRef} 
                            value={Math.round(fdo2 * 100)} 
                            onChange={(e) => {
                                if (disabled) return;
                                const value = parseFloat(e.target.value);
                                onFdo2Change(value / 100);
                            }}
                        />
                    </div>
                </div>
                <div className="control-group">
                    <div className="mb-2">Sweep</div>
                    <div className="sweep-control">
                        <div className="progress-bar h-20 w-4">
                            <div 
                                className={`progress ${disabled ? 'bg-gray-400' : 'bg-red'}`} 
                                style={{height: sweepHeight}}
                            />
                        </div>
                        <div className="button-group mt-2">
                            <button 
                                onClick={() => handleSweepChange(-0.5)} 
                                disabled={disabled}
                                className={disabled ? 'opacity-50 cursor-not-allowed' : ''}
                            >-</button>
                            <button 
                                onClick={() => handleSweepChange(0.5)} 
                                disabled={disabled}
                                className={disabled ? 'opacity-50 cursor-not-allowed' : ''}
                            >+</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="value-displays flex justify-between text-m mt-4">
                <div className="lcd-display">FdO2: {fdo2.toFixed(2)}</div>
                <div className="lcd-display">Sweep: {sweep.toFixed(1)}</div>
            </div>
        </div>
    );
}

export default Blender1;