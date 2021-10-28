import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View, ScrollView, ActivityIndicator } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const API_KEY = "c01eb371fe0059414ff56f2768963b7c";

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [temp, setTemp] = useState([]);
  const [ok, setOk]= useState(true);

  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();

    if(!granted){
      setOk(false);
    }

    const { coords : { latitude, longitude }} = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync({latitude, longitude}, {useGoogleMaps: false});

    setCity(location[0].city);
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`);
    const json = await response.json();
    setDays(json.daily);
    setTemp(json.current.temp);
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
                <View style={styles.tempBox}>
                  <Text style={styles.temp}>{parseFloat(temp).toFixed(1)}</Text>
                  <Text style={styles.symbol}>°C</Text>
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
    flex: 1,
    marginTop: 50,
    justifyContent: "center",
    alignItems: "center",
    //backgroundColor: 'blue',
  },
  cityName: {
    fontSize: 48,
    fontWeight: "500",
  },

  weather: {
    alignItems: "center",
    justifyContent: "space-around",
    //backgroundColor: 'red',
  },

  date: {
    fontSize: 30,
    color: "black",
    marginVertical: 20,
    //backgroundColor: 'white',
  },

  day: {
    width: SCREEN_WIDTH,
    alignItems: "flex-start",
    marginLeft: 10,
    //backgroundColor: 'yellow',
  },

  tempBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 20,
    marginVertical: 20,
    //backgroundColor: 'teal',
  },
  temp: {
    fontSize: 90,
  },
  symbol: {
    fontSize: 75,
    paddingLeft: 10,
  },

  description: {
    //backgroundColor: 'tomato',
    fontSize: 30,
    marginVertical: 20,
  },
  textDescription: {
    //backgroundColor: 'orange',
    fontSize: 20,
    marginVertical: 20,
  }
})