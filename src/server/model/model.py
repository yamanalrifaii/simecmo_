import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, PolynomialFeatures
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.inspection import partial_dependence, permutation_importance
import itertools
import matplotlib.pyplot as plt
import seaborn as sns
from typing import Dict, List, Tuple
import os

class ECMOParameterModel:
    def __init__(self):
        # Enhanced scenarios with more complete parameter sets
        self.scenarios = {
            "oxygenation": {
                "parameter_sweeps": {
                    "Changing FIO2.csv": {
                        "sweep_parameter": "hemodynamics fio2 value",
                        "baseline_parameters": [
                            "hemodynamics fdo2 value",
                            "hemodynamics shuntfraction value",
                            "hemodynamics dlco value",
                            "hemodynamics mvo2 value",
                            "hemodynamics hb value"
                        ]
                    },
                    "Changing FDO2.csv": {
                        "sweep_parameter": "hemodynamics fdo2 value",
                        "baseline_parameters": [
                            "hemodynamics fio2 value",
                            "hemodynamics shuntfraction value",
                            "hemodynamics dlco value",
                            "hemodynamics mvo2 value",
                            "hemodynamics hb value"
                        ]
                    },
                    "Changing Shunt Fr.csv": {
                        "sweep_parameter": "hemodynamics shuntfraction value",
                        "baseline_parameters": [
                            "hemodynamics fio2 value",
                            "hemodynamics fdo2 value",
                            "hemodynamics dlco value",
                            "hemodynamics mvo2 value",
                            "hemodynamics hb value"
                        ]
                    },
                    "Changing DLCO.csv": {
                        "sweep_parameter": "hemodynamics dlco value",
                        "baseline_parameters": [
                            "hemodynamics fio2 value",
                            "hemodynamics fdo2 value",
                            "hemodynamics shuntfraction value",
                            "hemodynamics mvo2 value",
                            "hemodynamics hb value"
                        ]
                    }
                },
                "outputs": [
                    'caSys_pO2', 'cvSys_pO2',
                    'caSys_O2sat', 'cvSys_O2sat',
                    'bgDO2'
                ]
            },
            "hemodynamics": {
                "parameter_sweeps": {
                    "Changing Venous R.csv": {
                        "sweep_parameter": "hemodynamics bgrinflow value",
                        "baseline_parameters": [
                            "hemodynamics bgroutflow value",
                            "cv sysvr value",
                            "cv pulvr value"
                        ]
                    },
                    "Changing Arterial R.csv": {
                        "sweep_parameter": "hemodynamics bgroutflow value",
                        "baseline_parameters": [
                            "hemodynamics bgrinflow value",
                            "cv sysvr value",
                            "cv pulvr value"
                        ]
                    },
                    "Changing SVR.csv": {
                        "sweep_parameter": "cv sysvr value",
                        "baseline_parameters": [
                            "hemodynamics bgrinflow value",
                            "hemodynamics bgroutflow value",
                            "cv pulvr value"
                        ]
                    }
                },
                "outputs": [
                    'paosys', 'paodia', 'paoavg',
                    'left flow', 'right flow'
                ]
            },
            "blood_gas": {
                "parameter_sweeps": {
                    "Changing Hb.csv": {
                        "sweep_parameter": "hemodynamics hb value",
                        "baseline_parameters": [
                            "hemodynamics lactate value",
                            "hemodynamics hco3 value",
                            "hemodynamics abgph value"
                        ]
                    },
                    "Changing Lactate.csv": {
                        "sweep_parameter": "hemodynamics lactate value",
                        "baseline_parameters": [
                            "hemodynamics hb value",
                            "hemodynamics hco3 value",
                            "hemodynamics abgph value"
                        ]
                    }
                },
                "outputs": [
                    'caSys_pO2', 'cvSys_pO2',
                    'caSys_O2sat', 'cvSys_O2sat',
                    'bgDO2', 'bgLactate',
                    'caSys_pH', 'cvSys_pH'
                ]
            },
            "cardiovascular": {
                "parameter_sweeps": {
                    "Changing HR.csv": {
                        "sweep_parameter": "cv heartrate value",
                        "baseline_parameters": [
                            "cv volume value",
                            "eeslv",
                            "eesrv"
                        ]
                    },
                    "Changing Volume.csv": {
                        "sweep_parameter": "cv volume value",
                        "baseline_parameters": [
                            "cv heartrate value",
                            "eeslv",
                            "eesrv"
                        ]
                    },
                    "Changing LV contractility.csv": {
                        "sweep_parameter": "eeslv",
                        "baseline_parameters": [
                            "cv heartrate value",
                            "cv volume value",
                            "eesrv"
                        ]
                    }
                },
                "outputs": [
                    'left flow', 'right flow',
                    'paosys', 'paodia', 'paoavg',
                    'ecmoUnitFlow'
                ]
            }
        }
        
        self.models = {}
        self.interaction_cache = {}

    def load_and_process_sweeps(self, data_dir: str):

        print(f"Loading data from directory: {data_dir}")
        self.models = {}

        for scenario_name, scenario_config in self.scenarios.items():
            print(f"\nProcessing {scenario_name} scenario:")
            self.models[scenario_name] = {}

            for sweep_file, sweep_config in scenario_config["parameter_sweeps"].items():
                try:
                    # Load dataset
                    file_path = os.path.join(data_dir, sweep_file)
                    if not os.path.exists(file_path):
                        print(f"Warning: File not found: {file_path}")
                        continue

                    print(f"Loading {sweep_file}")
                    df = pd.read_csv(file_path)

                    # Get sweep parameter and its range
                    param = sweep_config["sweep_parameter"]
                    sweep_range = (df[param].min(), df[param].max())
                    print(f"Parameter {param} range: {sweep_range}")

                    # Get baseline values
                    baseline_values = {}
                    for baseline_param in sweep_config["baseline_parameters"]:
                        if baseline_param in df.columns:
                            unique_values = df[baseline_param].unique()
                            if len(unique_values) == 1:
                                baseline_values[baseline_param] = unique_values[0]
                            else:
                                baseline_values[baseline_param] = df[baseline_param].median()
                                print(f"Warning: {baseline_param} has multiple values, using median")
                        else:
                            print(f"Warning: Baseline parameter {baseline_param} not found in dataset")

                    # Store processed data
                    self.models[scenario_name][param] = {
                        'data': df,
                        'sweep_range': sweep_range,
                        'baseline_values': baseline_values,
                        'outputs': df[self.scenarios[scenario_name]['outputs']].columns.tolist()
                    }

                    print(f"Successfully processed {sweep_file}")
                    print(f"Baseline values: {baseline_values}")

                except Exception as e:
                    print(f"Error processing {sweep_file}: {str(e)}")

        print("\nData loading completed") 
            
    def analyze_parameter_interactions(self, scenario_name: str, param1: str, param2: str, n_points: int = 10) -> pd.DataFrame:
        """
        Analyze the interaction between two parameters using partial dependence
        """
        if scenario_name not in self.models:
            raise ValueError(f"No models found for scenario: {scenario_name}")
            
        # Create interaction key
        interaction_key = f"{param1}_{param2}"
        if interaction_key in self.interaction_cache:
            return self.interaction_cache[interaction_key]
            
        # Get sweep data for both parameters
        sweep1 = self.models[scenario_name].get(param1)
        sweep2 = self.models[scenario_name].get(param2)
        
        if not sweep1 or not sweep2:
            raise ValueError(f"Missing sweep data for parameters")
            
        # Generate parameter grids
        p1_range = np.linspace(sweep1['sweep_range'][0], sweep1['sweep_range'][1], n_points)
        p2_range = np.linspace(sweep2['sweep_range'][0], sweep2['sweep_range'][1], n_points)
        
        # Combine datasets
        combined_data = pd.concat([sweep1['data'], sweep2['data']], ignore_index=True)
        
        # Define feature columns in a consistent order
        feature_columns = [param1, param2] + sorted(list(sweep1['baseline_values'].keys()))
        
        # Train interaction model
        X = combined_data[feature_columns]  # Use consistent column order
        y = combined_data[self.scenarios[scenario_name]['outputs']]
        
        model = RandomForestRegressor(n_estimators=200, random_state=42)
        model.fit(X, y)
        
        # Calculate partial dependence
        param_grid = list(itertools.product(p1_range, p2_range))
        results = []
        
        for p1_val, p2_val in param_grid:
            # Create input data with baseline values
            input_data = {**sweep1['baseline_values'],
                        param1: p1_val,
                        param2: p2_val}
            
            # Create DataFrame with consistent column order
            X_pred = pd.DataFrame([input_data])[feature_columns]  # Ensure same column order as training
            pred = model.predict(X_pred)[0]
            
            results.append({
                param1: p1_val,
                param2: p2_val,
                **dict(zip(self.scenarios[scenario_name]['outputs'], pred))
            })
        
        interaction_df = pd.DataFrame(results)
        self.interaction_cache[interaction_key] = interaction_df
        
        return interaction_df
    
    def plot_interaction_heatmap(self, interaction_df: pd.DataFrame,
                               param1: str, param2: str,
                               output_var: str):
        """
        Plot interaction heatmap for two parameters
        """
        pivot_table = interaction_df.pivot(
            index=param1,
            columns=param2,
            values=output_var
        )
        
        plt.figure(figsize=(10, 8))
        sns.heatmap(pivot_table, cmap='viridis', annot=True, fmt='.2f')
        plt.title(f'Interaction Effect on {output_var}')
        plt.xlabel(param2)
        plt.ylabel(param1)
        plt.show()
        
    def calculate_interaction_strength(self, scenario_name: str,
                                    param1: str, param2: str) -> Dict[str, float]:
        """
        Calculate interaction strength using H-statistic
        """
        if scenario_name not in self.models:
            raise ValueError(f"No models found for scenario: {scenario_name}")
            
        sweep1 = self.models[scenario_name].get(param1)
        sweep2 = self.models[scenario_name].get(param2)
        
        combined_data = pd.concat([sweep1['data'], sweep2['data']], ignore_index=True)
        X = combined_data[[param1, param2] + list(sweep1['baseline_values'].keys())]
        y = combined_data[self.scenarios[scenario_name]['outputs']]
        
        # Create polynomial features to capture interactions
        poly = PolynomialFeatures(degree=2, interaction_only=True)
        X_poly = poly.fit_transform(X)
        
        # Train model with interaction terms
        model = RandomForestRegressor(n_estimators=200, random_state=42)
        model.fit(X_poly, y)
        
        # Calculate importance of interaction terms
        feature_names = poly.get_feature_names_out()
        interaction_term = f"{param1} {param2}"
        interaction_idx = [i for i, name in enumerate(feature_names) if interaction_term in name][0]
        
        interaction_strengths = {}
        for i, output in enumerate(self.scenarios[scenario_name]['outputs']):
            # Use permutation importance for interaction term
            perm_importance = permutation_importance(
                model, X_poly, y[output],
                n_repeats=10,
                random_state=42
            )
            interaction_strengths[output] = perm_importance.importances_mean[interaction_idx]
            
        return interaction_strengths
    
    def analyze_all_interactions(self, scenario_name: str):
        """
        Analyze all possible parameter interactions in a scenario
        """
        if scenario_name not in self.models:
            raise ValueError(f"No models found for scenario: {scenario_name}")
            
        parameters = list(self.models[scenario_name].keys())
        interaction_results = []
        
        for param1, param2 in itertools.combinations(parameters, 2):
            try:
                strengths = self.calculate_interaction_strength(scenario_name, param1, param2)
                
                for output, strength in strengths.items():
                    interaction_results.append({
                        'parameter1': param1,
                        'parameter2': param2,
                        'output': output,
                        'interaction_strength': strength
                    })
            except Exception as e:
                print(f"Error analyzing interaction between {param1} and {param2}: {str(e)}")
                
        return pd.DataFrame(interaction_results)

# Example usage
if __name__ == "__main__":
    model = ECMOParameterModel()
    
    # Load and process data
    data_dir = "simECMO/data"
    model.load_and_process_sweeps(data_dir)
    
    # Analyze interactions for oxygenation scenario
    scenario = "oxygenation"
    
    # Analyze specific parameter interaction
    interaction_data = model.analyze_parameter_interactions(
        scenario,
        "hemodynamics fio2 value",
        "hemodynamics shuntfraction value"
    )
    
    # Plot interaction heatmap
    model.plot_interaction_heatmap(
        interaction_data,
        "hemodynamics fio2 value",
        "hemodynamics shuntfraction value",
        "caSys_pO2"
    )
    
    # Analyze all interactions in scenario
    all_interactions = model.analyze_all_interactions(scenario)
    print("\nTop 5 strongest interactions:")
    print(all_interactions.sort_values('interaction_strength', ascending=False).head())
