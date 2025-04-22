import sys
import json
import pickle
import numpy as np
import os

def predict_price(features):
    try:
        # Get the model path from the command line argument
        model_path = sys.argv[2] if len(sys.argv) > 2 else 'server/flight.pkl'
        
        # Print debug to stderr instead of stdout
        print(f"Loading model from: {model_path}", file=sys.stderr)
        
        # Load the model
        with open(model_path, 'rb') as f:
            model = pickle.load(f)
        
        # Convert input to numpy array
        features_array = np.array(features).reshape(1, -1)
        
        # Make prediction
        prediction = model.predict(features_array)
        
        # Return the prediction
        return {"prediction": float(prediction[0])}
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    # Read input features from command line argument
    features_json = sys.argv[1]
    features = json.loads(features_json)
    
    # Make prediction
    result = predict_price(features)
    
    # Output result as JSON
    print(json.dumps(result))
