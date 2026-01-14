# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from your_model import ECMOStepPredictor
import numpy as np

app = Flask(__name__)
CORS(app)

# Initialize your predictor
predictor = ECMOStepPredictor()
predictor.load_datasets()
predictor.train_all_models()

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        prediction = predictor.predict_step(
            scenario=data['scenario'],
            step=data['parameter'],
            initial_value=data['value'],
            target_value=data['value'],
            initial_states={}
        )
        
        # Generate time series data
        timePoints = 20
        predictions = []
        for i in range(timePoints):
            predictions.append({
                'time': i,
                **prediction
            })
            
        return jsonify(predictions)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/model-info', methods=['GET'])
def get_model_info():
    try:
        scenarios = {
            'oxygenation': {
                'steps': ['Hb', 'FDO2', 'shunt_fraction', 'DLCO', 'MVO2'],
                'outputs': ['caSys_pO2', 'cvSys_pO2', 'caSys_O2sat', 
                           'cvSys_O2sat', 'bgDO2']
            },
            'hemodynamics': {
                'steps': ['arterial_resistance', 'venous_resistance', 'PVR', 'SVR'],
                'outputs': ['paosys', 'paodia', 'paoavg', 'left_flow', 
                           'right_flow', 'ecmoUnitFlow']
            }
        }
        return jsonify(scenarios)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)