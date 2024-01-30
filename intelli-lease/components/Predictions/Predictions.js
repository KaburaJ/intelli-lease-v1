import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { BarChart, LineChart, PieChart } from "react-native-chart-kit";
import logo from "../../assets/app-logo.png";
import { Image } from "react-native";

export default function Predictions() {
  const line = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        strokeWidth: 2,
      },
    ],
  };

  const barData = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
      },
    ],
  };

  const pieData = [
    {
      name: "Seoul",
      population: 21500000,
      color: "rgba(131, 167, 234, 1)",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "Toronto",
      population: 2800000,
      color: "#F00",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "Beijing",
      population: 527612,
      color: "red",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "New York",
      population: 8538000,
      color: "#ffffff",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "Moscow",
      population: 11920000,
      color: "rgb(0, 0, 255)",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.innerContainer}>
        <View>
            <Image
              source={logo}
              style={{
                width: 400,
                height: 150,
                borderRadius: 50,
                marginLeft: "-22%",
                marginTop: "-4%",
                marginBottom: "-8%",
                resizeMode: "contain",
              }}
            />
          </View>
          <Text style={[styles.text, {marginTop:'5%', fontWeight:'lighter'}]}>Sample of our Predictions</Text>
          <Text style={styles.subTextSmall}>Visual of Available data</Text>
          <PieChart
            data={pieData}
            width={Dimensions.get("window").width * 0.96}
            height={220}
            chartConfig={{
              backgroundColor: "fb8c00",
              backgroundGradientFrom: "green",
              backgroundGradientTo: "#71f075",
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 15,
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
              marginLeft: -8,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
          <Text style={styles.subTextSmall}>
            Visual of Arable land Areas and crops grown
          </Text>
          <View>
            <LineChart
              data={{
                labels: line.labels,
                datasets: [
                  {
                    data: line.datasets[0].data,
                    strokeWidth: 2,
                  },
                ],
              }}
              width={Dimensions.get("window").width * 0.96}
              height={420}
              yAxisLabel={"$"}
              chartConfig={{
                backgroundColor: "fb8c00",
                backgroundGradientFrom: "green",
                backgroundGradientTo: "#71f075",
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 15,
                },
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
                marginLeft: 10,
              }}
            />
          </View>
          <Text style={styles.subTextSmall}>
            Visual of Arable land Areas and crops grown
          </Text>
          <BarChart
            data={barData}
            width={Dimensions.get("window").width * 0.96}
            height={420}
            yAxisLabel={"$"}
            chartConfig={{
              backgroundColor: "fb8c00",
              backgroundGradientFrom: "green",
              backgroundGradientTo: "#71f075",
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 15,
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
              marginLeft: 10,
              marginBottom: -22,
            }}
          />
        </View>
        <StatusBar style="auto" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  innerContainer: {
    paddingBottom: 50,
  },
  logo: {
    marginLeft: "5%",
    marginTop: "14%",
    fontSize: 22,
    marginBottom: "8%",
    color: "#ccc",
  },
  text: {
    marginLeft: "4%",
    fontSize: 38,
    color: "green",
    fontWeight:'lighter',
    marginBottom: "5%",
  },
  subText: {
    marginLeft: "4%",
    fontSize: 30,
    fontWeight: "300",
    color: "green",
    marginBottom: "10%",
  },
  subTextSmall: {
    marginLeft: "4%",
    marginRight: "4%",
    fontSize: 28,
    fontWeight: "300",
    color: "green",
    marginTop: "5%",
    marginBottom: "3%",
  },
  searchInput: {
    height: 40,
    borderColor: "#E2F6E9",
    borderWidth: 2,
    marginLeft: "5%",
    marginRight: "5%",
    paddingLeft: "5%",
    borderRadius: 18,
    marginBottom: "10%",
  },
  countyView: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginLeft: 24,
  },
  row: {
    flexBasis: "28.33%",
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
    border: "none",
    marginRight: 22,
    borderRadius: 25,
    backgroundColor: "#E2F6E9",
  },
  rowText: {
    color: "green",
  },
});
