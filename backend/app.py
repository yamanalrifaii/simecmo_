from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
from dotenv import load_dotenv
import sys, os
from datetime import datetime
from models.predictor import ECMOStepPredictor

load_dotenv()
app = Flask(__name__)
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

# Initialize predictor at startup
predictor = None

def initialize_predictor():
    global predictor
    try:
        predictor = ECMOStepPredictor()
        predictor.load_datasets()
        predictor.train_all_models()
        log("ML model initialized successfully")
    except Exception as e:
        log(f"Error initializing ML model: {str(e)}")
        raise

CORS(app, resources={r"/api/*": {
    "origins": ["http://localhost:3000"],
    "methods": ["GET", "POST", "OPTIONS"],
    "allow_headers": ["Content-Type", "Authorization"],
    "expose_headers": ["Content-Type"],
    "supports_credentials": True,
    "max_age": 120
}}, supports_credentials=True)

def log(msg):
    print(f"[{datetime.now()}] {msg}", flush=True)

@app.route('/api/interpret', methods=['POST', 'OPTIONS'])
def interpret():
    if request.method == 'OPTIONS': 
        return '', 204
    try:
        data = request.json
        if not data: 
            raise ValueError("No JSON data received")
        
        prompt = f"""
            Scenario: {data.get('scenarioType', 'Unknown')}
            Parameter Changed: {data.get('parameter', 'Unknown')}
            Initial Values: {format_values(data.get('initialValues', {}))}
            Final Values: {format_values(data.get('finalValues', {}))}
            Parameter Change:
            - From: {data.get('parameterChange', {}).get('from', 'Unknown')}
            - To: {data.get('parameterChange', {}).get('to', 'Unknown')}

            Please analyze these changes by providing distinct sections for:

            1. PHYSIOLOGICAL IMPACT:
            - List the direct physiological effects
            
            2. KEY TRENDS:
            - Describe the observed changes in monitored values
            
            3. CLINICAL IMPLICATIONS:
            - Explain the medical significance
            
            4. CONCERNS AND RECOMMENDATIONS:
            - List any potential issues and suggested actions
            
            Format each section with bullet points starting with '-' for better readability.
        """

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an ECMO specialist assistant."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=500
        )
        return jsonify({'interpretation': response.choices[0].message.content})
    except Exception as e:
        log(f"Error in interpretation: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/predict', methods=['POST', 'OPTIONS'])
def predict():
    if request.method == 'OPTIONS': 
        return '', 204
    
    try:
        if predictor is None:
            initialize_predictor()

        data = request.get_json()
        log(f"Received prediction request: {data}")

        scenario = data.get('scenario', '').lower()
        parameter = data.get('parameter', '').lower()  # Force lowercase
        log(f"Looking for model with key: {scenario}-{parameter}")
        initial_value = float(data.get('initialValue', 0))
        target_value = float(data.get('targetValue', 0))
        initial_states = data.get('initialStates', {})

        # Get scenario config
        if scenario not in predictor.scenario_configs:
            return jsonify({'error': f'Invalid scenario: {scenario}'}), 400

        if parameter not in predictor.scenario_configs[scenario]:
            return jsonify({'error': f'Invalid parameter: {parameter}'}), 400

        config = predictor.scenario_configs[scenario][parameter]


        # Get predictions using the model's method
        predictions = predictor.predict_parameter_change(
            scenario=scenario,
            parameter=parameter,
            current_value=initial_value,
            target_value=target_value,
            initial_states=initial_states
        )

        log(f"Generated predictions: First={predictions[0]}, Last={predictions[-1]}")
        return jsonify(predictions)

    except Exception as e:
        log(f"Prediction error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/model-info', methods=['GET'])
def get_model_info():
    try:
        if predictor is None:
            initialize_predictor()
            
        # Get available scenarios and their configurations
        model_info = {}
        for scenario, params in predictor.scenario_configs.items():
            model_info[scenario] = {
                'parameters': {},
                'outputs': set()
            }
            for param_name, config in params.items():
                model_info[scenario]['parameters'][param_name] = {
                    'range': config.param_range,
                    'unit': config.unit,
                    'outputs': config.output_params
                }
                model_info[scenario]['outputs'].update(config.output_params)
            
            # Convert outputs set to list for JSON serialization
            model_info[scenario]['outputs'] = list(model_info[scenario]['outputs'])
            
        return jsonify(model_info)
    except Exception as e:
        log(f"Error getting model info: {str(e)}")
        return jsonify({'error': str(e)}), 500

def format_values(values):
    return '\n'.join([f"- {k}: {v}" for k, v in values.items()]) if values else "None"

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'predictor_initialized': predictor is not None,
        'predictor_models_loaded': bool(predictor.models if predictor else False),
        'scenarios_available': list(predictor.scenario_configs.keys()) if predictor else [],
        'openai_configured': bool(client.api_key)
    })

if __name__ == '__main__':
    try:
        log("Starting Flask server...")
        initialize_predictor()
        app.run(host='localhost', port=5000, debug=True)
    except Exception as e:
        log(f"Server startup error: {str(e)}")