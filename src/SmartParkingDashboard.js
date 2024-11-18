import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Lottie from 'lottie-react';
import alert  from './assets/alert.json';
import car from './assets/car.json';
import car1 from './assets/car1.json';
// Animations
const animations = {
  carAlert: {
    "v": "5.5.7",
    "fr": 30,
    "ip": 0,
    "op": 60,
    "w": 200,
    "h": 200,
    "layers": [{
      "ddd": 0,
      "ind": 1,
      "ty": 4,
      "ks": {
        "o": { "a": 1, "k": [{ "t": 0, "s": [100], "h": 1 }, { "t": 30, "s": [50], "h": 1 }, { "t": 60, "s": [100], "h": 1 }] },
        "p": { "a": 0, "k": [100, 100, 0] },
        "a": { "a": 0, "k": [0, 0, 0] },
        "s": { "a": 0, "k": [100, 100, 100] }
      },
      "shapes": [{
        "ty": "gr",
        "it": [{
          "ty": "sr",
          "p": { "a": 0, "k": [0, 0] },
          "r": { "a": 0, "k": 0 },
          "pt": { "a": 0, "k": 3 },
          "or": { "a": 0, "k": 50 },
          "os": { "a": 0, "k": 0 }
        }]
      }]
    }]
  },
  motion: {
    "v": "5.5.7",
    "fr": 30,
    "ip": 0,
    "op": 60,
    "w": 200,
    "h": 200,
    "layers": [{
      "ddd": 0,
      "ind": 1,
      "ty": 4,
      "ks": {
        "o": { "a": 0, "k": 100 },
        "p": { "a": 0, "k": [100, 100, 0] },
        "a": { "a": 0, "k": [0, 0, 0] },
        "s": { "a": 1, "k": [
          { "t": 0, "s": [0, 0, 100], "h": 1 },
          { "t": 30, "s": [100, 100, 100], "h": 1 },
          { "t": 60, "s": [0, 0, 100], "h": 1 }
        ]}
      },
      "shapes": [{
        "ty": "gr",
        "it": [{
          "ty": "rc",
          "p": { "a": 0, "k": [0, 0] },
          "s": { "a": 0, "k": [80, 80] },
          "r": { "a": 0, "k": 0 }
        }]
      }]
    }]
  },
  alert:alert,
  car:car,
  car1:car1,

};

function SmartParkingDashboard() {
  const [parkingData, setParkingData] = useState({
    distance: 0,
    motionDetected: false,
    timestamp: new Date()
  });
  const [error, setError] = useState(null);

  const API_URL = 'https://iot-sensor-server.vercel.app/sensor/data';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_URL);
        const { distance, status } = response.data[0];
        setParkingData({
          distance,
          motionDetected: status === 'detected',
          timestamp: new Date()
        });
        setError(null);
      } catch (err) {
        setError('Failed to fetch parking data');
      }
    };

    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, []);

  const isNearby = parkingData.distance <= 30;

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-4">
      <h1 className="text-3xl font-bold mb-6">Smart Parking Monitor</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Distance Monitor Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2" />
            </svg>
            <h2 className="text-xl font-semibold">Distance Monitor</h2>
          </div>
          <div className="text-4xl font-bold mb-4">
            {parkingData.distance.toFixed(2)}cm
          </div>
          {isNearby && (
            <div className="mt-4">
              <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded">
                <p className="font-bold">No motion plz!</p>
                <p>Vehicle is within 30 cm of the sensor</p>
              </div>
              <div className="w-32 h-32 mx-auto mt-4">
                <Lottie 
                  animationData={animations.alert}
                  loop={true}
                  autoplay={true}
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Motion Status Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <h2 className="text-xl font-semibold">Motion Status</h2>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="w-32 h-32">
              <Lottie 
                animationData={animations.car1}
                loop={true}
                autoplay={parkingData.motionDetected}
                style={{ width: '200%', height: '180%' }}
              />
            </div>
            <span className="text-lg">
              {parkingData.motionDetected ? 'Motion Detected' : 'No Motion'}
            </span>
          </div>
        </div>
      </div>

      {/* Parking Status Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
          <h2 className="text-xl font-semibold">Parking Status</h2>
        </div>
        <div className="flex items-center justify-center p-4">
          <div className={`text-2xl font-semibold ${
            isNearby ? 'text-yellow-600' : 'text-green-600'
          }`}>
            {isNearby ? 'Caution: Find another slot' : 'Have fun parking!'}
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-500 text-right">
        Last updated: {parkingData.timestamp.toLocaleTimeString()}
      </div>
    </div>
  );
}

export default SmartParkingDashboard;