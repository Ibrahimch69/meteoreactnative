import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import * as Location from 'expo-location';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function App() {
  const API_KEY = '26b39c9537627a397e1441b5efc4837c';
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [forecast, setForecast] = useState(null);
  
  const getWeatherData = async (latitude, longitude) => {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
    );
    return response.data.main.temp;
  };

  const getWeatherForecast = async (latitude, longitude) => {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
    );
    return response.data.list;
  };

  const displayWeather = async () => {
    try {
      const { coords } = await Location.getCurrentPositionAsync({});
      const temp = await getWeatherData(coords.latitude, coords.longitude);
      const forecastData = await getWeatherForecast(coords.latitude, coords.longitude);
      setTemperature(temp);
      setForecast(forecastData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      await displayWeather();
    })();
  }, []);

  let text = '';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }
  
  return (
    <View style={styles.container}>
      {temperature !== null && (
        <Text>La température actuelle est de {temperature}°C</Text>
      )}
      {forecast !== null && (
        <View>
          <Text>Prévisions météorologiques pour les 5 prochains jours:</Text>
          {forecast.slice(0, 5).map((item, index) => {
            const date = new Date(item.dt * 1000);
            const dayOfWeek = date.toLocaleDateString('fr-FR', { weekday: 'long' });
            const temperature = item.main.temp;
            return (
              <Text key={index}>{dayOfWeek}: {temperature}°C</Text>
            );
          })}
        </View>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
