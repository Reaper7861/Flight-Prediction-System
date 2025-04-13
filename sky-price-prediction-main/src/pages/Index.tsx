
import React from "react";
import FlightSearch from "@/components/FlightSearch";
import { Plane } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen relative bg-gradient-to-b from-sky to-sky-light overflow-hidden">
      {/* Cloud decorations */}
      <div className="absolute top-20 left-10 opacity-60 cloud-animation">
        <div className="w-40 h-16 bg-white rounded-full" />
        <div className="w-32 h-16 bg-white rounded-full -mt-8 ml-10" />
        <div className="w-24 h-12 bg-white rounded-full -mt-4 ml-4" />
      </div>
      <div className="absolute top-40 right-20 opacity-70 cloud-animation" style={{ animationDelay: "-2s" }}>
        <div className="w-36 h-14 bg-white rounded-full" />
        <div className="w-28 h-14 bg-white rounded-full -mt-6 ml-8" />
        <div className="w-20 h-10 bg-white rounded-full -mt-4 ml-2" />
      </div>
      <div className="absolute bottom-40 left-1/4 opacity-50 cloud-animation" style={{ animationDelay: "-4s" }}>
        <div className="w-48 h-16 bg-white rounded-full" />
        <div className="w-40 h-16 bg-white rounded-full -mt-8 ml-12" />
        <div className="w-24 h-12 bg-white rounded-full -mt-5 ml-6" />
      </div>

      {/* Flying plane animation */}
      <div className="absolute -right-20 top-32 transform rotate-12 animate-float">
        <div className="relative">
          <Plane className="text-white h-16 w-16" />
          <div className="absolute top-12 left-0 w-40 h-1 bg-white opacity-40 rounded-full" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Predict Your Flight Prices
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Get accurate price predictions for your next journey based on real-time data
          </p>
        </div>

        <FlightSearch />

        {/* Additional information section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl">
            <div className="w-16 h-16 bg-sky-light rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-sky"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-navy mb-2">Price Prediction</h3>
            <p className="text-gray-600">
              Advanced algorithms to predict flight prices with high accuracy
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl">
            <div className="w-16 h-16 bg-sky-light rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-sky"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-navy mb-2">All Airlines</h3>
            <p className="text-gray-600">
              Compare predicted prices across multiple airlines in one search
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl">
            <div className="w-16 h-16 bg-sky-light rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-sky"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-navy mb-2">Instant Predictions</h3>
            <p className="text-gray-600">
              Get price predictions instantly to help you book at the right time
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
