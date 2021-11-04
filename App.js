import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View, ScrollView, ActivityIndicator } from 'react-native';
import { Fontisto } from '@expo/vector-icons';

const config = require('./config/key');
const API_KEY = config.API_KEY;

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const icons = {
  "Clouds" : "cloudy",
  "Rain" : "rains",
  "Clear" : "day-sunny",
  "Drizzle" : "rain",
  "Thunderstorm" : "lightnings",
  "Snow" : "snowflake",
  "Atmosphere" : "cloudy-gusts",
  "Mist" : "cloudy-gusts",
  "Smoke" : "fog",
  "Haze" : "cloudy-gusts",
  "Dust": "cloudy-gusts",
  "Fog" : "fog",
  "Sand" : "cloudy-gusts",
  "Ash" : "cloudy-gusts",
  "Squall" : "cloudy-gusts",
  "Tornado" : "cloudy-gusts",
};

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk]= useState(true);
  const [currents, setCurrents] = useState([]);
  const [hours, setHours] = useState([]);

  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();

    if(!granted){
      setOk(false);
    };

    const { coords : { latitude, longitude }} = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync({latitude, longitude}, {useGoogleMaps: false});

    setCity(location[0].city);

    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`);
    const json = await response.json();

    setDays(json.daily);
    setCurrents(json.current);
    setHours(json.hourly);
  };

  useEffect(() => {
    getWeather();
    }, []);

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
    
      <ScrollView 
        /* pagingEnabled ->  makes the pages to scroll by pages (not allowing pages to be freely scrolled) */
        showsHorizontalScrollIndicator={false}   /* makes the scrolling bar in the bottom disappear */
        /* indicatorStyle="white"    change the color of your scoll bar + only works in IOS */
        contentContainerStyle={styles.weather}  /* way to apply style under ScrollView Tag */
      >
        <View style={styles.today}>
          <View style={styles.currentStatus}>
            <View style={styles.currentIcon}>
              <Text style={styles.currentTemp}>{parseFloat(currents.temp).toFixed(1)}°C</Text>
              <View style={styles.currentDescBox}>
                <Fontisto name={icons[currents.weather[0].main]} size={56} color="black" style={{marginTop: 20}}/> 
                <Text style={styles.currentDescription}>{currents.weather[0].main}</Text>
              </View>
            </View>
            <View style={styles.currMaxMin}>
              <Text style={styles.currMM}>{parseFloat(days[0].temp.max).toFixed(0)}°C</Text>
              <Text style={styles.currMM}>/</Text>
              <Text style={styles.currMM}>{parseFloat(days[0].temp.min).toFixed(0)}°C</Text>
            </View>
          </View>
          <ScrollView
            horizontal
            scrollEnabled
            indicatorStyle="white"
            contentContainerStyle={styles.hourly}>
            {hours.map((hour, index) =>
              <View style={styles.everyHour}>
                <Text style={styles.hourlyhour}>{new Date(hour.dt*1000).getHours()}시</Text>
                <Fontisto name={icons[hour.weather[0].main]} size={30} color="black" style={{marginTop: 10}}/>
                <Text style={styles.hourlyTemp}>{parseFloat(hour.temp).toFixed(1)}</Text>
              </View>
            )}
          </ScrollView>
        </View>

        {days.length === 0 ? (
          <View style={{ ...styles.loading, alignItems: "center" }}>
            <ActivityIndicator 
              color="white" 
              size="large" />
          </View>
          ) : (
          days.map((day, index) => 
            <View style={styles.weekBox}>
              <Text style={styles.date}>{new Date(day.dt*1000).toString().substring(4, 10)}</Text>
              <Fontisto name={icons[day.weather[0].main]} size={25} color="black"/>
              <Text style={styles.temp}>{parseFloat(day.temp.max).toFixed(0)}°C</Text>
              <Text style={styles.temp}>{parseFloat(day.temp.min).toFixed(0)}°C</Text>
            </View>
            )
          )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#afdeee",
  },

  city: {
    flex: 1.2,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
    //backgroundColor: 'blue',
  },
  cityName: {
    fontSize: 32,
    fontWeight: "600",
  },

  today: {
    flex: 4,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginVertical: 10,
    //backgroundColor: 'lime',
  },
  currentStatus: {
    marginVertical: 5,
    //backgroundColor: 'gold',
  },
  currentIcon: {
    width: SCREEN_WIDTH,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    //backgroundColor: "cyan",
  },
  currentTemp: {
    fontSize: 80,
    fontWeight: "600",
  },
  currentDescBox: {
    marginTop: 10,
    alignItems: 'center',
  },
  currentDescription: {
    fontSize: 20,
    fontWeight: "500",
    marginTop: 10,
  },
  currMaxMin: {
    flexDirection: "row",
    width: "70%",
    marginTop: -20,
    marginBottom: 40,
    paddingHorizontal: 40,
    alignItems: "center",
    justifyContent: 'space-around',
    //backgroundColor: "darkviolet",
  },
  currMM: {
    fontSize: 28,
    fontWeight: '500',
  },

  hourly: {
    flexDirection: "row",
    height: 120,
    alignItems: "center",
    marginVertical: 10,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    //backgroundColor: "green",
  },
  everyHour: {
    flexDirection: "column",
    width: 80,
    alignItems: "center",
    marginVertical: 20,
    paddingHorizontal: 5,
    //backgroundColor: 'fuchsia',
  },
  hourlyhour: {
    fontSize: 20,
    fontWeight: '500',
    //backgroundColor: 'cornsilk'
  },
  hourlyTemp: {
    fontSize: 20,
    fontWeight: '500',
    marginTop: 10,
    //backgroundColor: 'coral',
  },

  weather: {
    alignItems: "center",
    marginVertical: 10,
    marginHorizontal: 5,
    //backgroundColor: 'red',
  },

  loading: {
    width: SCREEN_WIDTH,
    height: "100%",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    //backgroundColor: 'yellow',
  },

  weekBox: {
    width: SCREEN_WIDTH,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    marginVertical: 5,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    backgroundColor: "#96d4e9"
  },
  date: {
    fontSize: 24,
    fontWeight: "500",
    //backgroundColor: 'white',
  },
  days: {
    fontSize: 24,
    fontWeight: "500",
    //backgroundColor: 'grey',
  },
  temp: {
    fontSize: 24,
    fontWeight: "500",
  },
})