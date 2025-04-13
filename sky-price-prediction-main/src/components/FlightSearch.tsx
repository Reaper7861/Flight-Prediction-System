
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import AirportInput from "./AirportInput";
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

const airlines = [
  { value: "all", label: "All Airlines" },
  { value: "delta", label: "Delta Airlines" },
  { value: "american", label: "American Airlines" },
  { value: "united", label: "United Airlines" },
  { value: "southwest", label: "Southwest Airlines" },
  { value: "jetblue", label: "JetBlue Airways" },
  { value: "lufthansa", label: "Lufthansa" },
  { value: "emirates", label: "Emirates" },
  { value: "british", label: "British Airways" },
  { value: "airfrance", label: "Air France" },
];

const stops = [
  { value: "any", label: "Any Number of Stops" },
  { value: "nonstop", label: "Non-Stop Only" },
  { value: "1stop", label: "1 Stop Max" },
  { value: "2stops", label: "2 Stops Max" },
];

const FlightSearch = () => {
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [departDate, setDepartDate] = useState<Date | undefined>(undefined);
  const [returnDate, setReturnDate] = useState<Date | undefined>(undefined);
  const [airline, setAirline] = useState("all");
  const [stop, setStop] = useState("any");

  const handleSearchClick = () => {
    // In a real app, this would trigger a search
    console.log({
      departure,
      destination,
      departDate,
      returnDate,
      airline,
      stop,
    });
  };

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
              <AirportInput
                label=""
                placeholder="Select departure airport"
                value={departure}
                onChange={setDeparture}
                className="w-full"
              />
            </div>
            <div className="w-full md:w-1/2 space-y-2">
              <div className="flex items-center mb-1">
                <div className="bg-sky-light rounded-full p-1.5 mr-2">
                  <PlaneLanding className="text-sky h-5 w-5" />
                </div>
                <Label>To</Label>
              </div>
              <AirportInput
                label=""
                placeholder="Select destination airport"
                value={destination}
                onChange={setDestination}
                className="w-full"
              />
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
              <Label>Stops</Label>
              <Select value={stop} onValueChange={setStop}>
                <SelectTrigger className="border-sky-light hover:bg-sky-light/10 hover:text-sky-dark transition-all">
                  <SelectValue placeholder="Select stop preference" />
                </SelectTrigger>
                <SelectContent>
                  {stops.map((stopOption) => (
                    <SelectItem key={stopOption.value} value={stopOption.value}>
                      {stopOption.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-1/2 space-y-2">
              <Label>Airline</Label>
              <Select value={airline} onValueChange={setAirline}>
                <SelectTrigger className="border-sky-light hover:bg-sky-light/10 hover:text-sky-dark transition-all">
                  <SelectValue placeholder="Select airline" />
                </SelectTrigger>
                <SelectContent>
                  {airlines.map((airlineOption) => (
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
          >
            <Calculator className="mr-2 h-5 w-5" />
            Predict Flight Price
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FlightSearch;
