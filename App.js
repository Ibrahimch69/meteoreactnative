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
  const [city, setCity] = useState(null);

  const getWeatherData = async (latitude, longitude) => {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
    );
    return response.data.main.temp;
  };

  const displayWeather = async () => {
    try {
      const { coords } = await Location.getCurrentPositionAsync({});
      const temp = await getWeatherData(coords.latitude, coords.longitude);
      setTemperature(temp);
  
      const geo = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.latitude},${coords.longitude}&key=VOTRE_CLE_API`
      );
      const cityName = geo.data.results[0].address_components[2].long_name;
      setCity(cityName);
  
      console.log(temp, cityName);
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
      <Text>la ville est {city}</Text>
      {city !== null && <Text>Bienvenue dans la ville de {city}</Text>}
      {temperature !== null && (
        <Text>La température actuelle est de {temperature}°C</Text>
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
