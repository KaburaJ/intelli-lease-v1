import { useRoute } from "@react-navigation/native";
import React, { useState, useEffect, useRef } from "react";
import { StatusBar, Dimensions, SafeAreaView } from "react-native";
import { ScrollView, StyleSheet, Text, View, Image } from "react-native";
import { BarChart, LineChart, PieChart } from "react-native-chart-kit";
import MapView, { Marker, Polygon } from "react-native-maps";
import geojsonData from "../../assets/ke_crops_size.json";
import data from "../../assets/cropRecommendation.json";
import { Picker } from "@react-native-picker/picker";
import logo from "../../assets/app-logo.png";
import Slider from "@react-native-community/slider";
import pieChartImage from "../../assets/pie_chart_image.png";
import axios from "axios";

export default function Analytics() {
  const [polygons, setPolygons] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [selectedCropColor, setSelectedCropColor] = useState("red");
  const [selectedCropClass, setSelectedCropClass] = useState(null);
  const route = useRoute();
  const { place, latitude, longitude, fromHome } = route.params || {};
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [threshold, setThreshold] = useState(10);
  const [weatherData, setWeatherData] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [form, setForm] = useState({
    N: 0,
    P: 0,
    K: 0,
    temperature: 0,
    humidity: 0,
    pH: 0,
    rainfall: 0,
  });

  const handlePredict = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/predict",
        { features: Object.values(form) },
        { withCredentials: true }
      );
      console.log(response.data.prediction[0]);
      setPrediction(response.data.prediction[0]);
    } catch (error) {
      console.error("Error predicting:", error);
    }
  };

  const [pieChartTitle, setPieChartTitle] = useState(
    "Crop classes and their distribution"
  );
  const [lineChartTitle, setLineChartTitle] = useState(
    "Visual of Arable land Areas and crops grown"
  );
  const [barTempChartTitle, setBarTempChartTitle] = useState(
    "Temperature Data Visualization for crop type"
  );
  const [barHumidChartTitle, setBarHumidChartTitle] = useState(
    "Humidity Data Visualization for crop type"
  );
  const [barPHChartTitle, setBarPHChartTitle] = useState(
    "PH Data Visualization for crop type"
  );
  const [barPhosphorousChartTitle, setBarPhosphorousChartTitle] = useState(
    "Phosphorous Data Visualization for crop type"
  );
  const [barPotassiumChartTitle, setBarPotassiumChartTitle] = useState(
    "Potassium Data Visualization for crop type"
  );
  const [barNitrogenChartTitle, setBarNitrogenChartTitle] = useState(
    "Nitrogen Data Visualization for crop type"
  );
  const [barChartTitle, setBarChartTitle] = useState(
    "Rainfall Data Visualization for crop type"
  );

  // console.log(cropData);
  const mapViewRef = useRef(null);

  const handleMarkerAppear = () => {
    if (latitude && longitude && mapViewRef.current) {
      const newRegion = {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };

      mapViewRef.current.animateToRegion(newRegion, 1000);
    }
  };

  useEffect(() => {
    try {
      const validPolygons = geojsonData
        .filter(
          (feature) =>
            feature &&
            feature.geometry &&
            (!selectedCropClass || feature.CODE1 === selectedCropClass)
        )
        .map((feature, index) => {
          if (!feature || !feature.AREA_SQKM_) {
            console.error(`Invalid data at index ${index}:`, feature);
            return null;
          }

          const coordinates = feature.geometry.coordinates.map((point) => ({
            latitude: point[1],
            longitude: point[0],
          }));

          return {
            coordinates,
          };
        });

      setPolygons(validPolygons);
    } catch (error) {
      console.error("Error processing data:", error);
    }
  }, [geojsonData, selectedCropClass]);

  const handlePickerChange = (itemValue) => {
    setSelectedCrop(itemValue);
    setSelectedCropClass(itemValue);
    setSelectedCropColor(itemValue ? "red" : "rgba(131, 167, 234, 1)");
    setThreshold(10);

    setPieChartTitle(
      `Crop classes and their distribution - ${itemValue || "All Crops"}`
    );
    setLineChartTitle(
      `Visual of Arable land Areas and crops grown - ${
        itemValue || "All Crops"
      }`
    );
    setBarTempChartTitle(
      `Temperature Data Visualization for ${itemValue || "All Crops"}`
    );
    setBarHumidChartTitle(
      `Humidity Data Visualization for ${itemValue || "All Crops"}`
    );
    setBarPotassiumChartTitle(
      `Potassium Data Visualization for ${itemValue || "All Crops"}`
    );
    setBarPhosphorousChartTitle(
      `Phosphorous Data Visualization for ${itemValue || "All Crops"}`
    );
    setBarPHChartTitle(`PH Data Visualization for ${itemValue || "All Crops"}`);
    setBarNitrogenChartTitle(
      `Nitrogen Data Visualization for ${itemValue || "All Crops"}`
    );
    setBarChartTitle(
      `Rainfall Data Visualization for ${itemValue || "All Crops"}`
    );
  };

  const line = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        strokeWidth: 2,
      },
    ],
  };

  const uniqueCropClasses = Array.from(new Set(data.map((item) => item.label)));

  useEffect(() => {
    const labelPopulations = {};
    data.forEach((item) => {
      const label = item.label;
      const population = item.N + item.P + item.K;

      if (labelPopulations[label]) {
        labelPopulations[label] += population;
      } else {
        labelPopulations[label] = population;
      }
    });

    const transformedData = Object.keys(labelPopulations).map((label) => ({
      name: label,
      population: labelPopulations[label],
      color: getRandomColor(),
    }));

    setPieData(transformedData);
  }, [data]);

  const getRandomColor = () => {
    const colors = [
      "#FF5733",
      "#33FF57",
      "#5733FF",
      "#FF336A",
      "#33B8FF",
      "#FF6347",
      "#00FFFF",
      "#8A2BE2",
      "#7FFF00",
      "#FF7F50",
      "#ADFF2F",
      "#800000",
      "#DC143C",
      "#FFA500",
      "#FFD700",
      "#B22222",
      "#4682B4",
      "#8B008B",
      "#FF69B4",
      "#4B0082",
      "#00FF7F",
      "#FF1493",
      "#00CED1",
    ];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };

  const filteredData = selectedCrop
    ? data.filter((item) => item.label === selectedCrop)
    : data;

  const labels = filteredData.slice(-threshold).map((item) => item.label);
  const rainfallData = filteredData
    .slice(-threshold)
    .map((item) => item.rainfall);

  const barData = {
    labels: labels,
    datasets: [
      {
        data: rainfallData,
      },
    ],
  };

  const filteredTempData = selectedCrop
    ? data.filter((item) => item.label === selectedCrop)
    : data;
  const tempLabels = filteredTempData
    .slice(0, threshold)
    .map((item) => item.label);
  const tempData = filteredTempData
    .slice(0, threshold)
    .map((item) => item.temperature);
  const barTempData = {
    labels: tempLabels,
    datasets: [
      {
        data: tempData,
      },
    ],
  };

  const filteredHumidityData = selectedCrop
    ? data.filter((item) => item.label === selectedCrop)
    : data;
  const humidityLabels = filteredHumidityData
    .slice(0, threshold)
    .map((item) => item.label);
  const humidityData = filteredHumidityData
    .slice(0, threshold)
    .map((item) => item.humidity);
  const barHumidityData = {
    labels: humidityLabels,
    datasets: [
      {
        data: humidityData,
      },
    ],
  };

  const filteredPhosphorousData = selectedCrop
    ? data.filter((item) => item.label === selectedCrop)
    : data;
  const phosphorousLabels = filteredPhosphorousData
    .slice(0, threshold)
    .map((item) => item.label);
  const phosphorousData = filteredPhosphorousData
    .slice(0, threshold)
    .map((item) => item.K);
  const barPhosphorousData = {
    labels: phosphorousLabels,
    datasets: [
      {
        data: phosphorousData,
      },
    ],
  };

  const filteredPHData = selectedCrop
    ? data.filter((item) => item.label === selectedCrop)
    : data;
  const PHLabels = filteredPHData.slice(0, threshold).map((item) => item.label);
  const PHData = filteredPHData.slice(0, threshold).map((item) => item.ph);
  const barPHData = {
    labels: PHLabels,
    datasets: [
      {
        data: PHData,
      },
    ],
  };

  const filteredNitrogenData = selectedCrop
    ? data.filter((item) => item.label === selectedCrop)
    : data;
  const nitrogenLabels = filteredNitrogenData
    .slice(0, threshold)
    .map((item) => item.label);
  const nitrogenData = filteredNitrogenData
    .slice(0, threshold)
    .map((item) => item.N);
  const barNitrogenData = {
    labels: nitrogenLabels,
    datasets: [
      {
        data: nitrogenData,
      },
    ],
  };

  const filteredPotassiumData = selectedCrop
    ? data.filter((item) => item.label === selectedCrop)
    : data;
  const potassiumLabels = filteredPotassiumData
    .slice(0, threshold)
    .map((item) => item.label);
  const potassiumData = filteredPotassiumData
    .slice(0, threshold)
    .map((item) => item.K);
  const barPotassiumData = {
    labels: potassiumLabels,
    datasets: [
      {
        data: potassiumData,
      },
    ],
  };

  const getPhosphorousData = async () => {
    try {
      const res = await axios.get(
        `https://api.isda-africa.com/v1/soilproperty?key=AIzaSyCruMPt43aekqITCooCNWGombhbcor3cf4&lat=${latitude}&lon=${longitude}&property=phosphorous_extractable&depth=0-20`,
        { withCredentials: true }
      );
      const phosphorousValue =
        res.data.property?.phosphorous_extractable[0].value.value;
      console.log("Phosphorous Value:", phosphorousValue);
      setForm((prevForm) => ({ ...prevForm, P: phosphorousValue }));
    } catch (error) {
      console.log(error);
    }
  };
  const getPotassiumData = async () => {
    try {
      const res = await axios.get(
        `https://api.isda-africa.com/v1/soilproperty?key=AIzaSyCruMPt43aekqITCooCNWGombhbcor3cf4&lat=${latitude}&lon=${longitude}&property=potassium_extractable&depth=0-20`,
        { withCredentials: true }
      );
      const potassiumValue =
        res.data.property?.potassium_extractable[0].value.value;
      console.log("Potassium Value:", potassiumValue);
      setForm((prevForm) => ({ ...prevForm, K: potassiumValue }));
    } catch (error) {
      console.log(error);
    }
  };
  const getNitrogenData = async () => {
    try {
      const res = await axios.get(
        `https://api.isda-africa.com/v1/soilproperty?key=AIzaSyCruMPt43aekqITCooCNWGombhbcor3cf4&lat=${latitude}&lon=${longitude}&property=nitrogen_total&depth=0-20`,
        { withCredentials: true }
      );
      const nitrogenValue = res.data.property?.nitrogen_total[0].value.value;
      console.log("Nitrogen Value:", nitrogenValue);
      setForm((prevForm) => ({ ...prevForm, N: nitrogenValue }));
    } catch (error) {
      console.log(error);
    }
  };
  const getPHData = async () => {
    try {
      const res = await axios.get(
        `https://api.isda-africa.com/v1/soilproperty?key=AIzaSyCruMPt43aekqITCooCNWGombhbcor3cf4&lat=${latitude}&lon=${longitude}&property=ph&depth=0-20`,
        { withCredentials: true }
      );
      const phValue = res.data.property?.ph[0].value.value;
      console.log("Ph Value:", phValue);
      setForm((prevForm) => ({ ...prevForm, pH: phValue }));
    } catch (error) {
      console.log(error);
    }
  };

  const getClimateData = async () => {
    try {
      const res = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relative_humidity_2m,rain`,
        { withCredentials: true }
      );
      const data = res.data;
      setWeatherData(data);
      // setForm((prevForm) => ({
      //   ...prevForm,
      //   temperature: weatherData.hourly.temperature_2m[0],
      // }));
      // setForm((prevForm) => ({
      //   ...prevForm,
      //   humidity: weatherData.hourly.relative_humidity_2m[0],
      // }));
      // setForm((prevForm) => ({
      //   ...prevForm,
      //   rainfall: weatherData.hourly.rain[0],
      // }));
    } catch (error) {}
  };

  if(longitude && latitude){
  useEffect(() => {
    getPhosphorousData();
    getPotassiumData();
    getNitrogenData();
    getPHData();
    getClimateData();
    // handlePredict()
  }, [longitude, latitude]);
}

  // if (weatherData) {
  //   setForm((prevForm) => ({
  //     ...prevForm,
  //     temperature: weatherData.hourly.temperature_2m[0],
  //   }));
  //   setForm((prevForm) => ({
  //     ...prevForm,
  //     humidity: weatherData.hourly.relative_humidity_2m[0],
  //   }));
  //   setForm((prevForm) => ({
  //     ...prevForm,
  //     rainfall: weatherData.hourly.rain[0],
  //   }));

  //   useEffect(() => {
  //     handlePredict();
  //   }, [form]);
  // }

  let lineChart, barRainfallChart, barHumidityChart;

  if (weatherData) {
    const labelsA = weatherData.hourly.time;
    const temperatureData = weatherData.hourly.temperature_2m.map(Number);
    const humidityDataA = weatherData.hourly.relative_humidity_2m.map(Number);
    const rainfallDataA = weatherData.hourly.rain.map(Number);
    lineChart = (
      <View>
        <Text style={styles.subTextSmall}>Temperature Line Chart</Text>
        <LineChart
          data={{
            labels: labelsA,
            datasets: [{ data: temperatureData, strokeWidth: 2 }],
          }}
          width={460}
          height={320}
          style={chartConfig.style}
          yAxisLabel="°C"
          chartConfig={chartConfig}
        />
      </View>
    );

    barRainfallChart = (
      <View>
        <Text style={styles.subTextSmall}>Rainfall Bar Chart</Text>
        <BarChart
          data={{
            labels: labelsA,
            datasets: [{ data: rainfallDataA }],
          }}
          width={460}
          height={320}
          style={chartConfig.style}
          yAxisLabel="mm"
          chartConfig={chartConfig}
        />
      </View>
    );

    barHumidityChart = (
      <View>
        <Text style={styles.subTextSmall}>Humidity Bar Chart</Text>
        <BarChart
          data={{
            labels: labelsA,
            datasets: [{ data: humidityDataA }],
          }}
          width={460}
          height={320}
          style={chartConfig.style}
          yAxisLabel="%"
          chartConfig={chartConfig}
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <View>
          {fromHome ? null : (
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
          )}
        </View>
        {fromHome ? (
          <Text style={[styles.subText, { marginTop: "5%" }]}>
            {place} Map view
          </Text>
        ) : (
          <Text style={[styles.subText, { marginTop: "5%" }]}>
            Kenya Map view
          </Text>
        )}
        <Picker
          selectedValue={selectedCrop}
          onValueChange={handlePickerChange}
          style={{ ...styles.picker, color: "black" }}
        >
          <Picker.Item
            style={styles.pickerItem}
            label="Select Crop Class"
            value={null}
          />
          {uniqueCropClasses.map((code) => (
            <Picker.Item
              key={code}
              label={data.find((item) => item.label === code).label}
              value={code}
              style={styles.pickerItem}
            />
          ))}
        </Picker>
        <MapView
          ref={mapViewRef}
          style={styles.map}
          initialRegion={{
            latitude: latitude || 1.2921,
            longitude: longitude || 36.8219,
            latitudeDelta: 5,
            longitudeDelta: 5,
          }}
        >
          {polygons.map((feature, index) => (
            <Polygon
              key={index}
              coordinates={
                feature && feature.geometry
                  ? feature.geometry.coordinates[0]
                  : []
              }
              fillColor="rgba(0, 128, 255, 0.5)"
              strokeColor="rgba(0, 128, 255, 1)"
            />
          ))}

          {latitude && longitude && (
            <Marker
              coordinate={{
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
              }}
              pinColor="red"
              title={place}
              onCalloutPress={handleMarkerAppear}
            />
          )}
        </MapView>
        <View></View>
        <Image source={pieChartImage} style={styles.image}></Image>
        {/* <Text style={styles.subTextSmall}>{lineChartTitle}</Text> */}
        {/* <View>
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
        </View> */}
        {/* {selectedCrop && (
          <>
            <Slider
              style={{ width: "90%", alignSelf: "center", marginVertical: 10 }}
              minimumValue={1}
              maximumValue={filteredData.length}
              value={threshold}
              step={10}
              onValueChange={(value) => setThreshold(value)}
              minimumTrackTintColor="#00ff00"
              maximumTrackTintColor="#000000"
            />

            <View
              style={{
                alignSelf: "center",
                marginVertical: 10,
                width: "90%",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text>1</Text>
              <Text>{threshold}</Text>
              <Text>{filteredData.length}</Text>
            </View>
          </>
        )} */}
        {longitude && latitude && weatherData ? (
          <View>
            {lineChart}
            {barRainfallChart}
            {barHumidityChart}
          </View>
        ) : null}
        {selectedCrop && (
          <>
            <Text style={styles.subTextSmall}>{barTempChartTitle}</Text>
            <BarChart
              data={barTempData}
              width={Dimensions.get("window").width * 0.96}
              height={320}
              chartConfig={{
                backgroundColor: "fb8c00",
                backgroundGradientFrom: "green",
                backgroundGradientTo: "#71f075",
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 15,
                },
                showXAxisLabel: false,
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
                marginLeft: 10,
                marginBottom: 25,
              }}
            />
          </>
        )}

        {selectedCrop && (
          <>
            <Text style={styles.subTextSmall}>{barChartTitle}</Text>
            <BarChart
              data={barData}
              width={Dimensions.get("window").width * 0.96}
              height={320}
              chartConfig={{
                backgroundColor: "fb8c00",
                backgroundGradientFrom: "green",
                backgroundGradientTo: "#71f075",
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 15,
                },
                showXAxisLabel: false,
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
                marginLeft: 10,
                marginBottom: 25,
              }}
            />
          </>
        )}
        {selectedCrop && (
          <>
            <Text style={styles.subTextSmall}>{barHumidChartTitle}</Text>
            <BarChart
              data={barHumidityData}
              width={Dimensions.get("window").width * 0.96}
              height={320}
              chartConfig={{
                backgroundColor: "fb8c00",
                backgroundGradientFrom: "green",
                backgroundGradientTo: "#71f075",
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 15,
                },
                showXAxisLabel: false,
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
                marginLeft: 10,
                marginBottom: 25,
              }}
            />
          </>
        )}
        {selectedCrop && (
          <>
            <Text style={styles.subTextSmall}>{barPotassiumChartTitle}</Text>
            <BarChart
              data={barPotassiumData}
              width={Dimensions.get("window").width * 0.96}
              height={320}
              chartConfig={{
                backgroundColor: "fb8c00",
                backgroundGradientFrom: "green",
                backgroundGradientTo: "#71f075",
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 15,
                },
                showXAxisLabel: false,
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
                marginLeft: 10,
                marginBottom: 25,
              }}
            />
          </>
        )}
        {selectedCrop && (
          <>
            <Text style={styles.subTextSmall}>{barPHChartTitle}</Text>

            <BarChart
              data={barPHData}
              width={Dimensions.get("window").width * 0.96}
              height={320}
              chartConfig={{
                backgroundColor: "fb8c00",
                backgroundGradientFrom: "green",
                backgroundGradientTo: "#71f075",
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 15,
                },
                showXAxisLabel: false,
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
                marginLeft: 10,
                marginBottom: 25,
              }}
            />
          </>
        )}
        {selectedCrop && (
          <>
            <Text style={styles.subTextSmall}>{barNitrogenChartTitle}</Text>
            <BarChart
              data={barNitrogenData}
              width={Dimensions.get("window").width * 0.96}
              height={320}
              chartConfig={{
                backgroundColor: "fb8c00",
                backgroundGradientFrom: "green",
                backgroundGradientTo: "#71f075",
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 15,
                },
                showXAxisLabel: false,
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
                marginLeft: 10,
                marginBottom: 25,
              }}
            />
          </>
        )}
        {selectedCrop && (
          <>
            <Text style={styles.subTextSmall}>{barPhosphorousChartTitle}</Text>
            <BarChart
              data={barPhosphorousData}
              width={Dimensions.get("window").width * 0.96}
              height={320}
              chartConfig={{
                backgroundColor: "fb8c00",
                backgroundGradientFrom: "green",
                backgroundGradientTo: "#71f075",
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 15,
                },
                showXAxisLabel: false,
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
                marginLeft: 10,
                marginBottom: 25,
              }}
            />
          </>
        )}

        <StatusBar style="auto" />
      </View>
    </ScrollView>
  );
}

const chartConfig = {
  backgroundColor: "fb8c00",
  backgroundGradientFrom: "green",
  backgroundGradientTo: "#71f075",
  decimalPlaces: 2,
  style: {
    borderRadius: 15,
    marginLeft: "2%",
  },
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  logo: {
    marginLeft: "5%",
    marginTop: "14%",
    fontSize: 22,
    marginBottom: "8%",
    color: "#ccc",
  },
  subText: {
    marginLeft: "4%",
    fontSize: 30,
    fontWeight: "300",
    color: "green",
    marginBottom: "5%",
  },
  subTextSmall: {
    marginLeft: "4%",
    marginRight: "4%",
    fontSize: 28,
    fontWeight: "300",
    color: "green",
    marginTop: "10%",
    marginBottom: "3%",
  },
  map: {
    backgroundColor: "#E2F6E9",
    height: 405,
    width: "100%",
    marginBottom: "5%",
    flex: 1,
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
  countyScrollView: {
    flex: 1,
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
  picker: {
    height: 50,
    width: "90%",
    alignSelf: "center",
    marginBottom: 10,
  },
  pickerItem: {
    color: "black",
    fontSize: 16,
  },
  image: {
    width: 350,
    height: 350,
    resizeMode: "cover",
    marginLeft: 5,
    marginRight:5
  },
});
