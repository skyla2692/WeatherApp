import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View, ScrollView, ActivityIndicator } from 'react-native';
import { Fontisto } from '@expo/vector-icons';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const API_KEY = "c01eb371fe0059414ff56f2768963b7c";

const icons = {
  "Clouds" : "cloudy",
  "Rain" : "rains",
  "Clear" : "day-sunny",
  "Drizzle" : "rain",
  "Thunderstorm" : "lightnings",
  "Snow" : "snowflake",
  "Atmosphere" : "cloudy-gusts",
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
        <View style={styles.currentStatus}>
          <View style={styles.currentIcon}>
            <Text style={styles.currentTemp}>{parseFloat(currents.temp).toFixed(1)}°C</Text>
            <View style={styles.currentDescBox}>
              <Fontisto name={icons[currents.weather[0].main]} size={70} color="black" style={{marginTop: 20}}/> 
              <Text style={styles.currentDescription}>{currents.weather[0].main}</Text>
            </View>
          </View>
          <View style={styles.currMaxMin}>
            <Text style={styles.currMM}>{parseFloat(days[0].temp.max).toFixed(1)}°C</Text>
            <Text style={styles.currMM}>/</Text>
            <Text style={styles.currMM}>{parseFloat(days[0].temp.min).toFixed(1)}°C</Text>
          </View>

          <ScrollView
            indicatorStyle="white"
            contentContainerStyle={styles.hourly}>
            <View style={styles.everyHour}>
              {/* <Fontisto name={icons[hours.weather[0].main]} size={30} color="black" style={{marginTop: 10}}/>
              <Text style={styles.currentDescription}>{hours.weather[0].main}</Text> */} 
            </View>
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
              <Text style={styles.temp}>{parseFloat(day.temp.max).toFixed(1)}°C</Text>
              <Text style={styles.temp}>{parseFloat(day.temp.min).toFixed(1)}°C</Text>
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
    backgroundColor: "lightcoral",
  },

  city: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    //backgroundColor: 'blue',
  },
  cityName: {
    fontSize: 30,
    fontWeight: "600",
  },

  currentStatus: {
    height: "60%",
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
    marginTop: -10,
    fontWeight: "600",
  },
  currentDescBox: {
    alignItems: 'center',
  },
  currentDescription: {
    fontSize: 20,
    fontWeight: "500",
  },
  currMaxMin: {
    flexDirection: "row",
    width: "80%",
    paddingHorizontal: 40,
    alignItems: "center",
    justifyContent: 'space-around',
    marginTop: -20,
    //backgroundColor: "darkviolet",
  },
  currMM: {
    fontSize: 28,
    fontWeight: '500',
  },

  hourly: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "green",
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
    backgroundColor: "#d67272",
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