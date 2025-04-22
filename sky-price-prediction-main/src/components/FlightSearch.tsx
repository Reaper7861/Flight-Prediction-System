import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import DateSelector from "./DateSelector";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { PlaneTakeoff, PlaneLanding, Calculator } from "lucide-react";

const airports = [
  { value: "ATL", label: "Atlanta (ATL)" },
  { value: "BOS", label: "Boston (BOS)" },
  { value: "CLT", label: "Charlotte (CLT)" },
  { value: "DEN", label: "Denver (DEN)" },
  { value: "DFW", label: "Dallas/Fort Worth (DFW)" },
  { value: "DTW", label: "Detroit (DTW)" },
  { value: "EWR", label: "Newark (EWR)" },
  { value: "IAD", label: "Washington Dulles (IAD)" },
  { value: "JFK", label: "New York JFK (JFK)" },
  { value: "LAX", label: "Los Angeles (LAX)" },
  { value: "LGA", label: "New York LaGuardia (LGA)" },
  { value: "MIA", label: "Miami (MIA)" },
  { value: "OAK", label: "Oakland (OAK)" },
  { value: "ORD", label: "Chicago O'Hare (ORD)" },
  { value: "PHL", label: "Philadelphia (PHL)" },
  { value: "SFO", label: "San Francisco (SFO)" }
];

const airlines = [
  { value: "alaska", label: "Alaska Airlines" },
  { value: "american", label: "American Airlines" },
  { value: "boutique", label: "Boutique Air" },
  { value: "cape", label: "Cape Air" },
  { value: "contour", label: "Contour Airlines" },
  { value: "delta", label: "Delta" },
  { value: "frontier", label: "Frontier Airlines" },
  { value: "jetblue", label: "JetBlue Airways" },
  { value: "keylime", label: "Key Lime Air" },
  { value: "southern", label: "Southern Airways Express" },
  { value: "spirit", label: "Spirit Airlines" },
  { value: "suncountry", label: "Sun Country Airlines" },
  { value: "united", label: "United" }
];

const economyOptions = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

const FlightSearch = () => {
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [departDate, setDepartDate] = useState<Date | undefined>(undefined);
  const [returnDate, setReturnDate] = useState<Date | undefined>(undefined);
  const [airline, setAirline] = useState("");
  const [economy, setEconomy] = useState("yes");
  const [availableAirlines, setAvailableAirlines] = useState<string[]>([]);
  const [predictionResult, setPredictionResult] = useState<number[] | null>(null);
  const [predictedPrice, setPredictedPrice] = useState<number | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch available airlines when both airports are selected
  useEffect(() => {
    const fetchAvailableAirlines = async () => {
      if (departure && destination) {
        try {
          const response = await fetch(
            `http://localhost:8000/api/available-airlines?from=${departure}&to=${destination}`
          );
          
          if (!response.ok) {
            throw new Error('Failed to fetch airlines');
          }

          const data = await response.json();
          setAvailableAirlines(data.airlines);
          setAirline(""); // Reset airline selection when airports change
        } catch (error) {
          console.error('Error fetching airlines:', error);
        }
      }
    };

    fetchAvailableAirlines();
  }, [departure, destination]);

  const handleSearchClick = async () => {
    // Reset previous results and errors
    setPredictionResult(null);
    setPredictedPrice(null);
    setError(null);
    setIsPredicting(true);

    // Get the selected airline's full name
    const selectedAirline = airlines.find(a => a.value === airline)?.label || "";

    try {
      const response = await fetch('http://localhost:8000/api/predict-flight-price', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startingAirport: departure,
          destinationAirport: destination,
          segmentsAirlineName: selectedAirline
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to predict flight price');
      }

      const data = await response.json();
      console.log('Prediction result:', data);
      setPredictionResult(data.features);
      setPredictedPrice(data.predictedPrice);
    } catch (error) {
      console.error('Error predicting flight price:', error);
      setError(typeof error === 'object' && error !== null ? (error as Error).message : 'Unknown error occurred');
    } finally {
      setIsPredicting(false);
    }
  };

  // Filter airlines based on available options
  const filteredAirlines = airlines.filter(a => 
    availableAirlines.includes(a.label)
  );

  return (
    <Card className="glass-card w-full max-w-4xl mx-auto overflow-hidden">
      <CardContent className="p-6 md:p-8">
        <div className="space-y-6">
          <div className="flex flex-wrap md:flex-nowrap gap-4">
            <div className="w-full md:w-1/2 space-y-2">
              <div className="flex items-center mb-1">
                <div className="bg-sky-light rounded-full p-1.5 mr-2">
                  <PlaneTakeoff className="text-sky h-5 w-5" />
                </div>
                <Label>From</Label>
              </div>
              <Select value={departure} onValueChange={setDeparture}>
                <SelectTrigger className="border-sky-light hover:bg-sky-light/10 hover:text-sky-dark transition-all">
                  <SelectValue placeholder="Select departure airport" />
                </SelectTrigger>
                <SelectContent>
                  {airports.map((airport) => (
                    <SelectItem key={airport.value} value={airport.value}>
                      {airport.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-1/2 space-y-2">
              <div className="flex items-center mb-1">
                <div className="bg-sky-light rounded-full p-1.5 mr-2">
                  <PlaneLanding className="text-sky h-5 w-5" />
                </div>
                <Label>To</Label>
              </div>
              <Select value={destination} onValueChange={setDestination}>
                <SelectTrigger className="border-sky-light hover:bg-sky-light/10 hover:text-sky-dark transition-all">
                  <SelectValue placeholder="Select destination airport" />
                </SelectTrigger>
                <SelectContent>
                  {airports.map((airport) => (
                    <SelectItem key={airport.value} value={airport.value}>
                      {airport.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-wrap md:flex-nowrap gap-4">
            <DateSelector
              label="Departure Date"
              date={departDate}
              onSelect={setDepartDate}
              className="w-full md:w-1/2"
            />
            <DateSelector
              label="Return Date"
              date={returnDate}
              onSelect={setReturnDate}
              className="w-full md:w-1/2"
              minDate={departDate}
            />
          </div>

          <div className="flex flex-wrap md:flex-nowrap gap-4">
            <div className="w-full md:w-1/2 space-y-2">
              <Label>Economy</Label>
              <Select value={economy} onValueChange={setEconomy}>
                <SelectTrigger className="border-sky-light hover:bg-sky-light/10 hover:text-sky-dark transition-all">
                  <SelectValue placeholder="Select economy option" />
                </SelectTrigger>
                <SelectContent>
                  {economyOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-1/2 space-y-2">
              <Label>Airline</Label>
              <Select 
                value={airline} 
                onValueChange={setAirline}
                disabled={!departure || !destination || filteredAirlines.length === 0}
              >
                <SelectTrigger className="border-sky-light hover:bg-sky-light/10 hover:text-sky-dark transition-all">
                  <SelectValue placeholder={
                    !departure || !destination 
                      ? "Select airports first" 
                      : filteredAirlines.length === 0 
                        ? "No airlines available" 
                        : "Select airline"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {filteredAirlines.map((airlineOption) => (
                    <SelectItem
                      key={airlineOption.value}
                      value={airlineOption.value}
                    >
                      {airlineOption.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            className="w-full text-lg py-6 bg-sunset hover:bg-sunset/90 text-white transition-all"
            onClick={handleSearchClick}
            disabled={!departure || !destination || !airline || !departDate || isPredicting}
          >
            <Calculator className="mr-2 h-5 w-5" />
            {isPredicting ? "Predicting..." : "Predict Flight Price"}
          </Button>

          {/* Display predicted price */}
          {predictedPrice !== null && (
            <div className="mt-4 p-6 bg-sunset/10 rounded-lg border border-sunset text-center">
              <h3 className="text-xl font-bold text-navy mb-2">Predicted Flight Price</h3>
              <p className="text-3xl font-bold text-sunset">
                ${Math.round(predictedPrice).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Price prediction based on historical data and flight characteristics
              </p>
            </div>
          )}

          {/* Display prediction features */}
          {predictionResult && (
            <div className="mt-4 p-4 bg-white/90 rounded-lg border border-sky">
              <h3 className="text-lg font-semibold text-navy mb-2">Prediction Features:</h3>
              <div className="grid grid-cols-2 gap-2">
                <div><span className="font-medium">Travel Distance:</span> {predictionResult[0]}</div>
                <div><span className="font-medium">Duration (sec):</span> {predictionResult[1]}</div>
                <div><span className="font-medium">Travel Duration:</span> {predictionResult[2]}</div>
                <div><span className="font-medium">Flight Date:</span> {predictionResult[3]}</div>
                <div><span className="font-medium">Basic Economy:</span> {predictionResult[4] ? "Yes" : "No"}</div>
                <div><span className="font-medium">Airline Code:</span> {predictionResult[5]}</div>
                <div><span className="font-medium">Starting Airport Code:</span> {predictionResult[6]}</div>
                <div><span className="font-medium">Destination Code:</span> {predictionResult[7]}</div>
                <div><span className="font-medium">Segments Distance:</span> {predictionResult[8]}</div>
                <div><span className="font-medium">Cabin Code:</span> {predictionResult[9]}</div>
              </div>
            </div>
          )}

          {/* Display error message */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
              <p className="font-medium">Error:</p>
              <p>{error}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FlightSearch;
