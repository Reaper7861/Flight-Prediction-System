
import React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, MapPin } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";

// Mock airport data
const airports = [
  { value: "jfk", label: "New York (JFK)" },
  { value: "lax", label: "Los Angeles (LAX)" },
  { value: "sfo", label: "San Francisco (SFO)" },
  { value: "ord", label: "Chicago (ORD)" },
  { value: "lhr", label: "London (LHR)" },
  { value: "cdg", label: "Paris (CDG)" },
  { value: "nrt", label: "Tokyo (NRT)" },
  { value: "dxb", label: "Dubai (DXB)" },
  { value: "sin", label: "Singapore (SIN)" },
  { value: "hnd", label: "Tokyo (HND)" },
];

interface AirportInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const AirportInput = ({
  label,
  placeholder,
  value,
  onChange,
  className,
}: AirportInputProps) => {
  const [open, setOpen] = React.useState(false);
  const selectedAirport = airports.find((airport) => airport.value === value);

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between border-sky-light hover:bg-sky-light/10 hover:text-sky-dark transition-all"
          >
            <div className="flex items-center">
              <MapPin className="mr-2 h-4 w-4 text-sky" />
              {selectedAirport ? selectedAirport.label : placeholder}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder={`Search ${label ? label.toLowerCase() : 'airport'}...`} />
            <CommandEmpty>No airport found.</CommandEmpty>
            <CommandGroup>
              {airports.map((airport) => (
                <CommandItem
                  key={airport.value}
                  value={airport.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === airport.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {airport.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default AirportInput;
