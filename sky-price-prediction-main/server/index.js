const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Initialize express app
const app = express();
const PORT = 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Supabase client with the service role key
const supabaseUrl = 'https://ebdqegnqriyygghyrdou.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViZHFlZ25xcml5eWdnaHlyZG91Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTIxOTI4OCwiZXhwIjoyMDYwNzk1Mjg4fQ.duhSC0CtiPrl2RjYSj5cNR-Mhx8V5WszDZ1esdRBK1g';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Create a Python prediction script if it doesn't exist
const createPredictionScript = () => {
  const scriptPath = path.join(__dirname, 'predict.py');
  const modelPath = path.join(__dirname, 'flight.pkl');
  
  // Only create if it doesn't exist
  if (!fs.existsSync(scriptPath)) {
    const pythonScript = `
import sys
import json
import pickle
import numpy as np
import os

def predict_price(features):
    try:
        # Get the model path from the first command line argument
        model_path = sys.argv[2]
        
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
`;
    
    fs.writeFileSync(scriptPath, pythonScript);
    console.log('Created prediction script at:', scriptPath);
  }
};

// Create the prediction script on startup
createPredictionScript();

// Function to make predictions using the Python script
const predictPrice = (features) => {
  return new Promise((resolve, reject) => {
    const featuresJson = JSON.stringify(features);
    const pythonScriptPath = path.join(__dirname, 'predict.py');
    const modelPath = path.join(__dirname, 'flight.pkl');
    const command = `python3 "${pythonScriptPath}" '${featuresJson}' "${modelPath}"`;
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error('Prediction script error:', error);
        reject(error);
        return;
      }
      
      if (stderr) {
        console.error('Prediction script stderr:', stderr);
      }
      
      try {
        const result = JSON.parse(stdout.trim());
        resolve(result);
      } catch (e) {
        console.error('Error parsing prediction result:', e, stdout);
        reject(new Error('Failed to parse prediction result'));
      }
    });
  });
};

// Test endpoint to verify server is running
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Server is running', status: 'healthy' });
});

// Get available airlines for selected route
app.get('/api/available-airlines', async (req, res) => {
  try {
    const { from, to } = req.query;

    console.log(from)

    if (!from || !to) {
      return res.status(400).json({ 
        error: 'Both departure and destination airports are required' 
      });
    }

    console.log('Querying with params:', { from, to });

    // Query the flight_data_preprocessed table
    const { data, error } = await supabase
      .from('flight_data_preprocessed')
      .select('segmentsairlinename')
      .eq('startingairport', from)
      .eq('destinationairport', to);

    if (error) {
      console.error('Supabase query error:', error);
      throw error;
    }

    console.log('Query result:', data);

    // Extract unique airline names
    const airlines = [...new Set(data.map(item => item.segmentsairlinename))];

    console.log('Filtered airlines:', airlines);

    res.status(200).json({ airlines });
  } catch (error) {
    console.error('Error fetching available airlines:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint for predicting flight price
app.post('/api/predict-flight-price', async (req, res) => {
  try {
    const { startingAirport, destinationAirport, segmentsAirlineName } = req.body;
    
    // Validate required inputs
    if (!startingAirport || !destinationAirport || !segmentsAirlineName) {
      return res.status(400).json({
        error: 'Starting airport, destination airport, and airline are required'
      });
    }
    
    console.log('Prediction request for:', { startingAirport, destinationAirport, segmentsAirlineName });
    
    // Query the database to get matching flight data
    const { data, error } = await supabase
      .from('flight_data_preprocessed')
      .select('totaltraveldistance, segmentsdurationinseconds, travelduration, flightdateordinal, isbasiceconomy, segmentsdistance')
      .eq('startingairport', startingAirport)
      .eq('destinationairport', destinationAirport)
      .eq('segmentsairlinename', segmentsAirlineName)
      .limit(1);
      
    if (error) {
      console.error('Supabase query error:', error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      return res.status(404).json({
        error: 'No matching flight data found'
      });
    }
    
    console.log('Found flight data:', data[0]);
    
    // Label encoding for categorical variables
    // This mimics the Python LabelEncoder behavior by mapping unique values to integers
    
    // Create encodings (these would typically be from trained models)
    // The actual encodings should match your model's training encodings
    const airportEncoder = {};
    const airlineEncoder = {};
    
    // Precomputed airport encodings based on common US airports
    // In a production environment, these would be loaded from the model artifacts
    const airports = ['ATL', 'BOS', 'CLT', 'DEN', 'DFW', 'DTW', 'EWR', 'IAD', 'JFK', 'LAX', 'LGA', 'MIA', 'OAK', 'ORD', 'PHL', 'SFO'];
    airports.forEach((airport, index) => {
      airportEncoder[airport] = index;
    });
    
    // Precomputed airline encodings
    const airlines = [
      'Alaska Airlines', 'American Airlines', 'Boutique Air', 'Cape Air', 
      'Contour Airlines', 'Delta', 'Frontier Airlines', 'JetBlue Airways', 
      'Key Lime Air', 'Southern Airways Express', 'Spirit Airlines', 
      'Sun Country Airlines', 'United'
    ];
    airlines.forEach((airline, index) => {
      airlineEncoder[airline] = index;
    });
    
    // Get encoded values
    const startingAirportEncoded = airportEncoder[startingAirport] || 0;
    const destinationAirportEncoded = airportEncoder[destinationAirport] || 0;
    const airlineEncoded = airlineEncoder[segmentsAirlineName] || 0;
    
    // Extract values from the database result
    const flightData = data[0];
    
    // Create the feature array in the specified order with proper types
    const featureArray = [
      Math.round(flightData.totaltraveldistance || 0),                // totalTravelDistance
      Math.round(flightData.segmentsdurationinseconds || 0),          // segmentsDurationInSeconds
      Math.round(flightData.travelduration || 0),                     // travelDuration
      Math.round(flightData.flightdateordinal || 0),                  // flightDateOrdinal
      flightData.isbasiceconomy ? 1 : 0,                             // isBasicEconomy
      airlineEncoded,                                                // segmentsAirlineName (encoded)
      startingAirportEncoded,                                        // startingAirport (encoded)
      destinationAirportEncoded,                                     // destinationAirport (encoded)
      Math.round(flightData.segmentsdistance || 0),                  // segmentsDistance
      2                                                              // segmentsCabinCode (always 2)
    ];
    
    console.log('Encoded feature array:', featureArray);
    
    // Call the Python script to make a prediction
    try {
      const predictionResult = await predictPrice(featureArray);
      
      console.log('Prediction result:', predictionResult);
      
      if (predictionResult.error) {
        return res.status(500).json({ 
          error: `Prediction failed: ${predictionResult.error}` 
        });
      }
      
      // Return the prediction result along with features
      res.status(200).json({ 
        features: featureArray,
        predictedPrice: predictionResult.prediction,
        // Include the raw data for reference/debugging
        rawData: {
          flightData,
          encodings: {
            startingAirport: startingAirportEncoded,
            destinationAirport: destinationAirportEncoded,
            airline: airlineEncoded
          }
        }
      });
    } catch (predictionError) {
      console.error('Error during prediction:', predictionError);
      return res.status(500).json({ 
        error: `Failed to predict price: ${predictionError.message}`,
        features: featureArray
      });
    }
    
  } catch (error) {
    console.error('Error predicting flight price:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 
