import os
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split, KFold, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.multioutput import MultiOutputRegressor
from sklearn.metrics import r2_score, mean_squared_error
from typing import Dict, List, Tuple
from dataclasses import dataclass
import joblib 
from datetime import datetime

@dataclass
class StepConfig:
    """Configuration for each step in a scenario"""
    input_param: str
    output_params: List[str]
    param_range: Tuple[float, float]
    unit: str
    state_params: List[str] = None

    def __post_init__(self):
        if self.state_params is None:
            self.state_params = self.output_params

class ECMOStepPredictor:
    def __init__(self):
        self.scenario_configs = {
            'oxygenation': {
                'hb': StepConfig(
                    input_param='hemodynamics hb value',
                    output_params=['bgDO2', 'caSys_O2sat', 'cvSys_O2sat'],
                    param_range=(5.0, 20.0),
                    unit='g/dL'
                ),
                'mvo2': StepConfig(
                    input_param='hemodynamics mvo2 value',
                    output_params=['bgDO2', 'caSys_pO2', 'cvSys_pCO2', 'caSys_HCO3'],
                    param_range=(100.0, 1500.0),
                    unit='mL/min'
                ),
                'dlco': StepConfig(
                    input_param='hemodynamics dlco value',
                    output_params=['caSys_pO2', 'cvSys_pO2','caSys_pCO2', 'cvSys_pCO2'],
                    param_range=(1.0, 100.0),
                    unit='mL/min/mmHg'
                ),
                'shunt_fraction': StepConfig(
                    input_param='hemodynamics shuntfraction value',
                    output_params=['caSys_pO2', 'caSys_O2sat', 'cvSys_pO2', 'cvSys_O2sat', 'caSys_pH', 'cvSys_pH'],
                    param_range=(0.0, 100.0),
                    unit='%'
                ),
                'fdo2': StepConfig(
                    input_param='hemodynamics fdo2 value',
                    output_params=['caSys_pO2', 'cvSys_pO2', 'caSys_O2sat', 'cvSys_O2sat', 'bgDO2'],
                    param_range=(0.05, 1.00),
                    unit=''
                )
            },
            'hemodynamics': {
                'arterial_r': StepConfig(
                    input_param='arterial_r',
                    output_params=['paosys', 'paodia', 'paoavg', 'col', 'cor'],
                    param_range=(0.0, 60.0),
                    unit='mmHg·s/mL'
                ),
                'venous_r': StepConfig(
                    input_param='venous_r', 
                    output_params=['bgDO2','caSys_O2sat' ,'cvSys_O2sat', 'ecmoUnitFlow'],
                    param_range=(0.0, 600.00),
                    unit='mmHg·s/mL'
                ),
                'pvr': StepConfig(
                    input_param='cv pvr value',
                    output_params=['caSys_pCO2', 'cvSys_pO2', 'caSys_pH', 'caSys_HCO3'],
                    param_range=(0.0, 80.0),
                    unit='woods units'
                ),
                'svr': StepConfig(
                    input_param='cv sysvr value',
                    output_params=['caSys_O2sat', 'caSys_pH', 'cvSys_HCO3'],
                    param_range=(0.0, 100.0),
                    unit='woods units'
                )
            }, 
             'cardiovascular': {
                'heart_rate': StepConfig(
                    input_param='cv heartrate value',
                    output_params=['ecmoUnitFlow', 'pcv', 'svr'],
                    param_range=(40.0, 210.0),
                    unit='bpm'
                ),
                'volume': StepConfig(
                    input_param='cv volume value',
                    output_params=['ecmop1', 'ppcw', 'ppasys', 'paodia', 'col', 'cor'],
                    param_range=(200.0, 5000.0),
                    unit='mL'
                ),
                'eeslv': StepConfig(
                    input_param='cv eeslv value',
                    output_params=['ecmoUnitFlow', 'caSys_O2sat', 'pcv', 'ppcw'],
                    param_range=(0.2, 10.0),
                    unit='mmHg/mL'
                ),
                'eesrv': StepConfig(
                    input_param='cv eesrv value',
                    output_params=['ppasys', 'ppcw', 'caSys_BE', 'bgDO2'],
                    param_range=(0.5, 5.0),
                    unit='mmHg/mL'
                )
            },
            'ecmoparameters': {
                'rpm': StepConfig(
                    input_param='ecmo speed',
                    output_params=['ppadia','caSys_pO2', 'cvSys_pO2', 'caSys_pCO2'],
                    param_range=(0.6, 6.7),
                    unit='RPM'
                ),
                'oxygenator_resistance': StepConfig(
                    input_param='hemodynamics bgrgasexchange value',
                    output_params=['ecmoUnitFlow', 'caSys_O2sat', 'cvSys_O2sat', 'caSys_pO2', 'cvSys_pO2', 'bgDO2'],
                    param_range=(0.0, 200.0),
                    unit='mmHg/L/min'
                ),
                'sweep_flow': StepConfig(
                    input_param='hemodynamics sweep value',
                    output_params=['caSys_BE', 'caSys_pH', 'cvSys_pH', 'bgDO2', 'caSys_pO2', 'cvSys_pO2'],
                    param_range=(0.0, 10.0),
                    unit='L/min'
                ),
                'diffusion': StepConfig(
                    input_param='hemodynamics bgdiffusion value',
                    output_params=['caSys_pO2', 'cvSys_pO2', 'bgDO2', 'paodia'],
                    param_range=(0.0001, 0.01),
                    unit='L/min'
                )
            }
        }
        
        self.models = {}
        self.scalers = {}
        self.metrics = {}
        self.datasets = {}
        self.loaded_datasets = False

        self.models_dir = None  # Will store path to saved models
        
    def save_models(self, directory: str = 'saved_models'):
        """Save trained models and scalers to disk"""
        try:
            # Create models directory if it doesn't exist
            os.makedirs(directory, exist_ok=True)
            self.models_dir = directory
            
            # Save each model and its scalers
            for (scenario, parameter), model in self.models.items():
                model_path = os.path.join(directory, f"{scenario}_{parameter}")
                
                # Get associated scalers
                scalers = self.scalers.get((scenario, parameter))
                metrics = self.metrics.get((scenario, parameter))
                
                # Save everything for this model
                save_data = {
                    'model': model,
                    'scalers': scalers,
                    'metrics': metrics,
                    'config': self.scenario_configs[scenario][parameter]
                }
                
                joblib.dump(save_data, f"{model_path}.joblib")
                log(f"Saved model for {scenario}-{parameter}")
                
            # Save overall metrics
            metrics_path = os.path.join(directory, "scenario_metrics.joblib")
            joblib.dump(self.calculate_scenario_metrics(), metrics_path)
            
            log(f"All models saved to {directory}")
            return True
            
        except Exception as e:
            log(f"Error saving models: {str(e)}")
            return False
            
    def load_models(self, directory: str = 'saved_models'):
        """Load trained models and scalers from disk"""
        try:
            if not os.path.exists(directory):
                log(f"Model directory {directory} does not exist")
                return False

            self.models_dir = directory
            self.models = {}
            self.scalers = {}
            self.metrics = {}

            # Load each model file
            for filename in os.listdir(directory):
                if filename.endswith('.joblib') and filename != "scenario_metrics.joblib":
                    model_path = os.path.join(directory, filename)

                    # Extract scenario and parameter from filename
                    base_name = filename[:-7]  # Remove .joblib
                    scenario, parameter = base_name.split('_', 1)

                    # Normalize names
                    scenario = scenario.lower()
                    parameter = parameter.lower()

                    try:
                        # Load saved data
                        save_data = joblib.load(model_path)

                        # Store model and associated data
                        self.models[(scenario, parameter)] = save_data['model']
                        self.scalers[(scenario, parameter)] = save_data['scalers']
                        self.metrics[(scenario, parameter)] = save_data['metrics']

                        log(f"Successfully loaded model for {scenario}-{parameter}")
                    except Exception as e:
                        log(f"Error loading model {filename}: {str(e)}")
                        continue

            log(f"Loaded {len(self.models)} models from {directory}")
            return True

        except Exception as e:
            log(f"Error in load_models: {str(e)}")
            return False


            
    def models_exist(self, directory: str = 'saved_models') -> bool:
        """Check if saved models exist"""
        try:
            if not os.path.exists(directory):
                return False
            
            # Check if any model files exist
            model_files = [f for f in os.listdir(directory) if f.endswith('.joblib')]
            return len(model_files) > 0
            
        except Exception:
            return False

    def load_datasets(self):
        """Initialize dataset paths and structure"""
        if self.loaded_datasets:
            return

        try:
            current_dir = os.path.dirname(os.path.abspath(__file__))
            base_datasets_dir = os.path.join(current_dir, 'datasets')
            
            # Create scenario directories
            scenario_dirs = {
                'oxygenation': os.path.join(base_datasets_dir, 'oxygenation'),
                'hemodynamics': os.path.join(base_datasets_dir, 'hemodynamics'),
                'cardiovascular': os.path.join(base_datasets_dir, 'cardiovascular'),
                'ecmoParameters': os.path.join(base_datasets_dir, 'ecmo')
            }
            
            for directory in scenario_dirs.values():
                os.makedirs(directory, exist_ok=True)

            # Define dataset paths
            self.datasets = {
                'oxygenation': {
                    'hb': os.path.join(scenario_dirs['oxygenation'], 'Generated_hb_dataset_1000.csv'),
                    'mvo2': os.path.join(scenario_dirs['oxygenation'], 'MVO2_Generated_Dataset.csv'),
                    'dlco': os.path.join(scenario_dirs['oxygenation'], 'DLCO_1000_Generated.csv'),
                    'shunt_fraction': os.path.join(scenario_dirs['oxygenation'], 'Generated_Dataset_Shunt_Fraction_1000.csv'),
                    'fdo2': os.path.join(scenario_dirs['oxygenation'], 'Generated_Dataset_with_Incremental_FDO2_Values_and_Variability.csv')
                },
                'hemodynamics': {
                    'arterial_r': os.path.join(scenario_dirs['hemodynamics'], 'Generated_Dataset_for_Arterial_R_1000.csv'),
                    'venous_r': os.path.join(scenario_dirs['hemodynamics'], 'Generated_Venous_R_Dataset_1000.csv'),
                    'pvr': os.path.join(scenario_dirs['hemodynamics'], 'Generated_PVR_Dataset_1000.csv'),
                    'svr': os.path.join(scenario_dirs['hemodynamics'], 'Generated_SVR_Dataset.csv')
                }, 
                'cardiovascular': {
                    'heart_rate': os.path.join(scenario_dirs['cardiovascular'], 'Generated_Heart_Rate_Dataset_1000.csv'),
                    'volume': os.path.join(scenario_dirs['cardiovascular'], 'Volume_1000.csv'),
                    'eeslv': os.path.join(scenario_dirs['cardiovascular'], 'Generated_CV_EESLV_Dataset_1000.csv'),
                    'eesrv': os.path.join(scenario_dirs['cardiovascular'], 'RV_Cont_1000.csv')
                },
                'ecmoparameters': {
                    'rpm': os.path.join(scenario_dirs['ecmoParameters'], 'RPM- ECMOSPEED-1000.csv'),
                    'oxygenator_resistance': os.path.join(scenario_dirs['ecmoParameters'],'Generated_Dataset_Oxygenator.csv'),
                    'sweep_flow': os.path.join(scenario_dirs['ecmoParameters'],'generated_sweep_dataset_1000.csv'),
                    'diffusion': os.path.join(scenario_dirs['ecmoParameters'], 'Generated_Dataset_Diffusion_1000 (2).csv')
                }
            }
            
            self.loaded_datasets = True
            print("Dataset paths initialized successfully")
            
        except Exception as e:
            print(f"Error initializing dataset paths: {str(e)}")
            raise

    def load_specific_dataset(self, scenario: str, parameter: str) -> pd.DataFrame:

        """Load a specific dataset when needed"""
        if not self.loaded_datasets:
            self.load_datasets()
        
        # Normalize parameter name to lowercase
        parameter = parameter.lower()
        scenario = scenario.lower()
            
        dataset_path = self.datasets[scenario][parameter]
        return pd.read_csv(dataset_path)

    def generate_training_data(self, data: pd.DataFrame, config: StepConfig) -> Tuple[pd.DataFrame, pd.DataFrame]:
        """Generate training data with state information"""
        X_cols = ['parameter_value']
        state_cols = config.state_params
        
        X_list = []
        y_list = []
        
        for i in range(len(data) - 1):
            X_row = [data.iloc[i][config.input_param]]  # Current parameter value
            X_row.extend(data.iloc[i][state_cols])      # Current states
            X_list.append(X_row)
            
            y_list.append(data.iloc[i + 1][config.output_params])
        
        columns = ['parameter_value'] + [f'initial_{col}' for col in state_cols]
        X = pd.DataFrame(X_list, columns=columns)
        y = pd.DataFrame(y_list, columns=config.output_params)
        
        return X, y

    def train_model_with_states(self, scenario: str, parameter: str):
        try:
            data = self.load_specific_dataset(scenario, parameter)
            config = self.scenario_configs[scenario][parameter]
            
            # Generate and prepare training data
            X, y = self.generate_training_data(data, config)
            
            input_scaler = StandardScaler()
            output_scaler = StandardScaler()
            
            X_scaled = input_scaler.fit_transform(X)
            y_scaled = output_scaler.fit_transform(y)
            
            X_train, X_test, y_train, y_test = train_test_split(
                X_scaled, y_scaled, test_size=0.2, random_state=42
            )
            
            base_model = GradientBoostingRegressor(
                n_estimators=50,
                max_depth=3,
                learning_rate=0.05,
                subsample=0.8,
                min_samples_split=10,
                min_samples_leaf=5,
                random_state=42
            )
            
            #cross-validation
            kf = KFold(n_splits=10, shuffle=True, random_state=42)
            model = MultiOutputRegressor(base_model)
            cv_scores = cross_val_score(model, X_scaled, y_scaled, cv=kf, scoring='r2')
            
            model.fit(X_train, y_train)
            
            y_train_pred = model.predict(X_train)
            y_test_pred = model.predict(X_test)
            
            metrics = {
                'train_r2': r2_score(y_train, y_train_pred, multioutput='uniform_average'),
                'train_mse': mean_squared_error(y_train, y_train_pred, multioutput='uniform_average'),
                'test_r2': r2_score(y_test, y_test_pred, multioutput='uniform_average'),
                'test_mse': mean_squared_error(y_test, y_test_pred, multioutput='uniform_average'),
                'cv_r2_mean': cv_scores.mean(),
                'cv_r2_std': cv_scores.std()
            }
            
            # Store model, scalers, and metrics
            key = (scenario.lower(), parameter)
            self.models[key] = model
            self.scalers[key] = {'input': input_scaler, 'output': output_scaler}
            self.metrics[key] = metrics
            
            print(f"Successfully trained model for {scenario}-{parameter}")
            print(f"Cross-validation R² score: {cv_scores.mean():.4f} (±{cv_scores.std():.4f})")
            
        except Exception as e:
            print(f"Error training model for {scenario}-{parameter}: {str(e)}")
            raise

    def predict_step_with_states(self, scenario: str, parameter: str, 
                               value: float, current_states: Dict[str, float]) -> Dict[str, float]:
        """Make prediction using parameter value and current states"""
        key = (scenario.lower(), parameter)
        if key not in self.models:
            raise ValueError(f"No model found for {scenario}-{parameter}")
            
        config = self.scenario_configs[scenario][parameter]
        model = self.models[key]
        scalers = self.scalers[key]
        
        # Prepare input vector
        input_data = [value]  # Parameter value
        for state_param in config.state_params:
            input_data.append(current_states.get(state_param, 0.0))
            
        # Scale input and predict
        X = np.array([input_data])
        X_scaled = scalers['input'].transform(X)
        y_scaled = model.predict(X_scaled)
        y = scalers['output'].inverse_transform(y_scaled)
        
        return dict(zip(config.output_params, y[0]))

    def predict_parameter_change(self, scenario: str, parameter: str, 
                         current_value: float, target_value: float, 
                         initial_states: Dict[str, float], 
                         time_points: int = 20) -> List[Dict]:
        """Predict parameter changes over time with state progression"""
        try:
            # Normalize scenario and parameter names
            scenario = scenario.lower()
            parameter = parameter.lower()

            # Validate model existence
            key = (scenario, parameter)
            if key not in self.models:
                log(f"No model found for {scenario}-{parameter}")
                raise ValueError(f"No model found for {scenario}-{parameter}")

            # Validate config existence
            config = self.scenario_configs.get(scenario, {}).get(parameter)
            if not config:
                log(f"No configuration found for {scenario}-{parameter}")
                raise ValueError(f"No configuration found for {scenario}-{parameter}")

            # Validate initial states
            required_states = set(config.output_params)
            provided_states = set(initial_states.keys())
            if not required_states.issubset(provided_states):
                missing = required_states - provided_states
                log(f"Missing required states: {missing}")
                raise ValueError(f"Missing required states: {missing}")

            # Validate value ranges
            if not (config.param_range[0] <= target_value <= config.param_range[1]):
                log(f"Target value {target_value} outside valid range {config.param_range}")
                raise ValueError(f"Target value outside valid range")

            predictions = []
            step_size = (target_value - current_value) / time_points
            current_states = initial_states.copy()

            # Initial state
            predictions.append({
                'time': 0,
                'input_value': float(current_value),
                **{k: float(v) for k, v in current_states.items()}
            })

            # Generate predictions
            for i in range(1, time_points + 1):
                value = current_value + (step_size * i)
                try:
                    prediction = self.predict_step_with_states(
                        scenario, parameter, value, current_states
                    )
                    current_states.update(prediction)
                    predictions.append({
                        'time': i,
                        'input_value': float(value),
                        **{k: float(v) for k, v in prediction.items()}
                    })
                except Exception as e:
                    log(f"Error in prediction step {i}: {str(e)}")
                    raise

            return predictions

        except Exception as e:
            log(f"Error in predict_parameter_change: {str(e)}")
            raise

    def evaluate_model(self, scenario: str, parameter: str) -> Dict[str, Dict[str, float]]:
        """Evaluate model performance for each output parameter"""
        try:
            data = self.load_specific_dataset(scenario, parameter)
            config = self.scenario_configs[scenario][parameter]
            
            X, y = self.generate_training_data(data, config)
            
            key = (scenario.lower(), parameter)
            if key not in self.models:
                raise ValueError(f"No trained model found for {scenario}-{parameter}")
                
            model = self.models[key]
            scalers = self.scalers[key]
            
            # Split and scale data
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42
            )
            
            X_train_scaled = scalers['input'].transform(X_train)
            X_test_scaled = scalers['input'].transform(X_test)
            y_train_scaled = scalers['output'].transform(y_train)
            y_test_scaled = scalers['output'].transform(y_test)
            
            # Make predictions
            y_train_pred_scaled = model.predict(X_train_scaled)
            y_test_pred_scaled = model.predict(X_test_scaled)
            
            # Transform predictions back
            y_train_pred = scalers['output'].inverse_transform(y_train_pred_scaled)
            y_test_pred = scalers['output'].inverse_transform(y_test_pred_scaled)
            y_train_true = scalers['output'].inverse_transform(y_train_scaled)
            y_test_true = scalers['output'].inverse_transform(y_test_scaled)
            
            # Calculate metrics for each output
            metrics = {}
            for i, output_param in enumerate(config.output_params):
                metrics[output_param] = {
                    'train_r2': r2_score(y_train_true[:, i], y_train_pred[:, i]),
                    'train_mse': mean_squared_error(y_train_true[:, i], y_train_pred[:, i]),
                    'train_rmse': np.sqrt(mean_squared_error(y_train_true[:, i], y_train_pred[:, i])),
                    'test_r2': r2_score(y_test_true[:, i], y_test_pred[:, i]),
                    'test_mse': mean_squared_error(y_test_true[:, i], y_test_pred[:, i]),
                    'test_rmse': np.sqrt(mean_squared_error(y_test_true[:, i], y_test_pred[:, i]))
                }
            
            return metrics
            
        except Exception as e:
            print(f"Error evaluating model for {scenario}-{parameter}: {str(e)}")
            raise

    def train_all_models(self):
        """Train all models with state handling"""
        if not self.loaded_datasets:
            self.load_datasets()
            
        for scenario, parameters in self.scenario_configs.items():
            for parameter in parameters:
                print(f"Training model for {scenario}-{parameter}")
                try:
                    self.train_model_with_states(scenario, parameter)
                except Exception as e:
                    print(f"Error training {scenario}-{parameter}: {str(e)}")

    def calculate_scenario_metrics(self) -> Dict[str, Dict[str, float]]:
        """Calculate average metrics for each scenario"""
        scenario_metrics = {}

        for scenario, parameters in self.scenario_configs.items():
            metrics_data = {
                'test_mse': [],
                'test_r2': [],
                'train_mse': [],
                'train_r2': [],
                'cv_r2': []
            }
            
            for parameter_name in parameters:
                key = (scenario.lower(), parameter_name)
                if key in self.metrics:
                    metrics = self.metrics[key]
                    metrics_data['test_mse'].append(metrics['test_mse'])
                    metrics_data['test_r2'].append(metrics['test_r2'])
                    metrics_data['train_mse'].append(metrics['train_mse'])
                    metrics_data['train_r2'].append(metrics['train_r2'])
                    metrics_data['cv_r2'].append(metrics['cv_r2_mean'])
            
            if any(metrics_data.values()):  # If we have any metrics
                scenario_metrics[scenario] = {
                    'avg_test_mse': np.mean(metrics_data['test_mse']),
                    'avg_test_r2': np.mean(metrics_data['test_r2']),
                    'avg_train_mse': np.mean(metrics_data['train_mse']),
                    'avg_train_r2': np.mean(metrics_data['train_r2']),
                    'avg_cv_r2': np.mean(metrics_data['cv_r2'])
                }
            else:
                scenario_metrics[scenario] = None

        return scenario_metrics

    def get_detailed_metrics_report(self) -> pd.DataFrame:
        """Generate a detailed metrics report as a DataFrame"""
        rows = []
        
        for scenario, parameters in self.scenario_configs.items():
            for parameter in parameters:
                try:
                    metrics = self.evaluate_model(scenario, parameter)
                    
                    for output_param, output_metrics in metrics.items():
                        row = {
                            'Scenario': scenario,
                            'Parameter': parameter,
                            'Output': output_param,
                            'Train R²': output_metrics['train_r2'],
                            'Train RMSE': output_metrics['train_rmse'],
                            'Test R²': output_metrics['test_r2'],
                            'Test RMSE': output_metrics['test_rmse']
                        }
                        rows.append(row)
                except Exception as e:
                    print(f"Error getting metrics for {scenario}-{parameter}: {str(e)}")
                    continue
        
        return pd.DataFrame(rows).sort_values(['Scenario', 'Parameter', 'Output'])

    def generate_summary_report(self):
        """Generate and print a comprehensive summary report"""
        print("\n=== ECMO Model Performance Summary ===\n")
        
        # Overall scenario metrics
        scenario_metrics = self.calculate_scenario_metrics()
        for scenario, metrics in scenario_metrics.items():
            print(f"\n{scenario.upper()} Scenario Summary:")
            print("-" * 50)
            if metrics:
                print(f"Training Performance:")
                print(f"  R² Score: {metrics['avg_train_r2']:.4f}")
                print(f"  MSE: {metrics['avg_train_mse']:.4f}")
                print(f"\nTesting Performance:")
                print(f"  R² Score: {metrics['avg_test_r2']:.4f}")
                print(f"  MSE: {metrics['avg_test_mse']:.4f}")
                print(f"\nCross-Validation R²: {metrics['avg_cv_r2']:.4f}")
            else:
                print("  No metrics available")
        
        # Parameter-specific metrics
        print("\nParameter-Level Performance:")
        print("-" * 50)
        for scenario in self.scenario_configs:
            print(f"\n{scenario.upper()} Parameters:")
            for param, metrics in self.metrics.items():
                if param[0] == scenario.lower():
                    print(f"\n{param[1]}:")
                    print(f"  Test R²: {metrics['test_r2']:.4f}")
                    print(f"  CV R²: {metrics['cv_r2_mean']:.4f} (±{metrics['cv_r2_std']:.4f})")
def log(msg: str):
    print(f"[{datetime.now()}] {msg}")

def main():
    # Create predictor instance
    predictor = ECMOStepPredictor()

    # Load datasets and train models
    print("\n=== Training Models ===")
    predictor.load_datasets()
    predictor.train_all_models()
    predictor.save_models('saved_models')

    # Generate and print reports
    print("\nDetailed Model Performance:")
    print("-" * 50)
    metrics_df = predictor.get_detailed_metrics_report()
    print(metrics_df)

    # Generate summary report
    predictor.generate_summary_report()

    # Testing Section
    print("\n=== Testing Predictions ===")
    try:
        # Test case parameters
        scenario = "oxygenation"
        parameter = "hb"
        current_value = 12.0  # Starting hemoglobin value
        target_value = 15.0   # Target hemoglobin value
        
        # Initial states (matching the output parameters for oxygenation-hb)
        initial_states = {
            'bgDO2': 571.69,
            'caSys_O2sat': 99.86,
            'cvSys_O2sat': 67.15
        }

        print(f"\nTesting prediction for:")
        print(f"Scenario: {scenario}")
        print(f"Parameter: {parameter}")
        print(f"Change: {current_value} -> {target_value} {predictor.scenario_configs[scenario][parameter].unit}")
        print(f"Initial states: {initial_states}")

        # Get predictions
        predictions = predictor.predict_parameter_change(
            scenario=scenario,
            parameter=parameter,
            current_value=current_value,
            target_value=target_value,
            initial_states=initial_states
        )

        # Print results
        print("\nPrediction Results:")
        print("-" * 50)
        print("Initial values:")
        print(predictions[0])
        print("\nFinal values:")
        print(predictions[-1])

        # Print progression
        print("\nParameter Progression:")
        for i, pred in enumerate(predictions):
            print(f"Step {i}: Hb={pred['input_value']:.1f} -> DO2={pred['bgDO2']:.1f}, "
                  f"arterial O2 sat={pred['caSys_O2sat']:.1f}%, "
                  f"venous O2 sat={pred['cvSys_O2sat']:.1f}%")

    except Exception as e:
        print(f"Error during testing: {str(e)}")

if __name__ == "__main__":
    main()