import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View, ScrollView, ActivityIndicator } from 'react-native';
import { Fontisto } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get("window");
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
  };

  const date = new Date();

  useEffect(() => {
    getWeather();
    }, []);

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>

      <ScrollView 
        pagingEnabled   /* makes the pages to the scrolls (not allowing pages to be freely scrolled) */
        horizontal    /* makes the pages to go horizontal instead of vertical */
        showsHorizontalScrollIndicator={true}   /* if false -> makes the scrolling bar in the bottom disappear */
        indicatorStyle="white"    /* change the color of your scoll bar + only works in IOS */
        contentContainerStyle={styles.weather}  /* way to apply style under ScrollView Tag */
        >
        {days.length === 0 ? (
          <View style={{ ...styles.day, alignItems: "center" }}>
              <ActivityIndicator 
                color="white" 
                size="large" />
          </View>
          ) : (
            days.map((day, index) => 
              <View key={index} style={styles.day}>
                <Text style={styles.date}>{date.getMonth()+1} / {date.getDate()}</Text>
                <View style={styles.iconBox}>
                  <View style={styles.tempBox}>
                    <Text style={styles.temp}>{parseFloat(day.temp.day).toFixed(1)}</Text>
                    <Text style={styles.symbol}>°C</Text>
                  </View>
                  <Fontisto name={icons[day.weather[0].main]} size={68} color="black" style={{marginRight: 20}}/>
                </View>
                <Text style={styles.description}>{day.weather[0].main}</Text>
                <Text style={styles.textDescription}>{day.weather[0].description}</Text>
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
    flex: 1.5,
    marginTop: 70,
    justifyContent: "center",
    alignItems: "center",
    //backgroundColor: 'blue',
  },
  cityName: {
    fontSize: 50,
    fontWeight: "700",
  },

  weather: {
    alignItems: "center",
    justifyContent: "space-around",
    //backgroundColor: 'red',
  },

  day: {
    width: SCREEN_WIDTH,
    alignItems: "flex-start",
    paddingHorizontal: 15,
    marginTop: -40,
    marginBottom: 100,
    //backgroundColor: 'yellow',
  },

  date: {
    fontSize: 30,
    fontWeight: "500",
    marginTop: 5,
    //backgroundColor: 'white',
  },

  iconBox: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginTop: -10,
    //backgroundColor: "lightgreen"
  },
  tempBox: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 50,
    //backgroundColor: 'teal',
  },
  temp: {
    fontSize: 90,
    fontWeight: "600",
  },
  symbol: {
    fontSize: 75,
    paddingLeft: 10,
    fontWeight: "500",
  },

  description: {
    fontSize: 30,
    fontWeight: "600",
    marginTop: -10,
    marginBottom: 10,
    //backgroundColor: 'tomato',
  },
  textDescription: {
    fontSize: 20,
    fontWeight: "500",
    marginVertical: 10,
    //backgroundColor: 'orange',
  }
})