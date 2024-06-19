import React, { useState, useRef } from "react";
import "./Weather.css";
import clear_icon from "../assets/clear.png";
import cloud_icon from "../assets/cloud.png";
import drizzle_icon from "../assets/drizzle.png";
import humidity_icon from "../assets/humidity.png";
import rain_icon from "../assets/rain.png";
import search_icon from "../assets/search.png";
import snow_icon from "../assets/snow.png";
import wind_icon from "../assets/wind.png";

const allIcons = {
  "01d": clear_icon,
  "01n": clear_icon,
  "02d": cloud_icon,
  "02n": cloud_icon,
  "03d": cloud_icon,
  "03n": cloud_icon,
  "04d": drizzle_icon,
  "04n": drizzle_icon,
  "09d": rain_icon,
  "09n": rain_icon,
  "10d": rain_icon,
  "10n": rain_icon,
  "13d": snow_icon,
  "13n": snow_icon,
};

export default function Weather() {
  const inputRef = useRef();
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchWeather = async (city) => {
    inputRef.current.value = "";
    inputRef.current.blur();
    if (!city) {
      alert("Enter city name");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${
          import.meta.env.VITE_APP_ID
        }`
      );
      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        icon: allIcons[data.weather[0].icon] || clear_icon,
      });
    } catch (error) {
      alert("Failed to fetch weather data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    fetchWeather(inputRef.current.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="app">
      <div className="input-container">
        <input
          ref={inputRef}
          type="text"
          className="input"
          placeholder="Search"
          onKeyDown={handleKeyDown}
        />
        <i className="fa-solid fa-magnifying-glass" onClick={handleSearch}></i>
      </div>
      {isLoading ? (
        <h1 className="loading-text">Loading...</h1>
      ) : weatherData ? (
        <>
          <div className="temp-container">
            <h1 className="temp">{weatherData.temperature}°</h1>
            <div className="weather-state">
              <h2 className="cloud-state">{weatherData.location}</h2>
              <img
                src={weatherData.icon}
                className="weather-icon"
                alt="weather icon"
              />
            </div>
          </div>
          <div className="weather-details">
            <div className="weather-detail">
              <i className="fa-solid fa-water"></i>
              <h2>{weatherData.humidity}%</h2>
              <h3>Humidity</h3>
            </div>
            <div className="weather-detail">
              <i className="fa-solid fa-wind"></i>
              <h2>{weatherData.windSpeed}km/h</h2>
              <h3>Wind Speed</h3>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
