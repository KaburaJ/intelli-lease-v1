import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import sample1 from "../../assets/sample1.jpg";
import sample2 from "../../assets/istockphoto-1468184902-1024x1024.jpg";
import sample3 from "../../assets/istockphoto-1292399669-1024x1024.jpg";
import { ActivityIndicator, Button } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute, validatePathConfig } from "@react-navigation/native";

const landData = [
  {
    id: "1",
    name: "Land A",
    image: sample1,
    description: "Land A description...",
  },
  {
    id: "2",
    name: "Land B",
    image: sample2,
    description: "Land B description...",
  },
  {
    id: "3",
    name: "Land C",
    image: sample3,
    description: "Land C description...",
  },
  {
    id: "4",
    name: "Land A",
    image: sample1,
    description: "Land A description...",
  },
  {
    id: "5",
    name: "Land B",
    image: sample2,
    description: "Land B description...",
  },
  {
    id: "6",
    name: "Land C",
    image: sample3,
    description: "Land C description...",
  },
];

export default function LandForLease() {
  const route = useRoute();
  const { countyName } = route.params;
  console.log(countyName);
  const navigation =  useNavigation()
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState({
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySUQiOiIxQjhERkYxRC1DQzQxLTQyMkEtOUI1NC1DMkYyMjBDMUVFOTEiLCJpYXQiOjE3MTAxMDg3MzEsImV4cCI6MTcxMjcwMDczMX0.4POIt3D1iUvRg9fOl52GQ92htuG2zzYh0vlK56gaKZ0",
    userID: "",
  });

  const [landDetails, setLandDetails] = useState([]);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        setDetails({ token: token });
        const userID = await AsyncStorage.getItem("UserID");
        setDetails({ ...details, userID: userID });
      } catch (error) {
        console.error("Error retrieving user data from AsyncStorage:", error);
      }
    };

    getUserData();
  }, []);

  const viewPendingLeaseRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://172.28.144.1:5002/user-view-approved-lease-requests-by-county",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": details.token,
          },
          body: JSON.stringify({ CountyName: countyName }),
        }
      );
      if (!response.ok) {
        console.error(
          "Error viewing approved lease request by county name:",
          response.status
        );
        return;
      }

      const responseData = await response.json();
      console.log("land for lease response", responseData.results[0]);
      setLandDetails(responseData.results);
    } catch (error) {
      console.error(
        "Error viewing approved lease request by county name:",
        error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    viewPendingLeaseRequests();
  }, [countyName]);

  console.log(details);

  const handleLeaseClick = async (id) => {
    console.log("clicked");
    try {
      const response = await fetch("http://172.28.144.1:5002/lease-land", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": details.token,
        },
        body: JSON.stringify({
          LeaseLandDataID: id,
          RequesterUserID: details.userID,
        }),
      });
      if (!response.ok) {
        console.error("Error Leasing Land:", response);
        return;
      }

      Alert.alert(
        "Your lease request has been received and is pending approval. We shall get back to you.",
        null,
        [{ text: "OK", onPress: () => navigation.navigate("WelcomeUserHome") }]
      );
    } catch (error) {
      console.error("Error leasing land:", error.message);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="green" />
      </View>
    );
  }
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {landDetails && landDetails.length > 0 ? (
        landDetails.map((item) => (
          <View
            key={item.LeaseLandDataID}
            style={styles.button}
            onclick={() =>
              Alert.alert(
                "Request Received",
                "Your request to lease this parcel of land has been received pending approval",
                [{ text: "OK" }]
              )
            }
          >
            <Image style={styles.image} source={sample1} />
            <Text style={styles.buttonText}>{item.CountyName}</Text>
            <Text style={styles.buttonSubText}>{item.SubCountyName}</Text>
            <Text style={styles.buttonSubText}>{item.ConstituencyName}</Text>
            <Text style={styles.buttonSubText}>{item.LandSize}</Text>
            <Text style={styles.buttonSubText}>{item.timeStamp}</Text>
            <TouchableOpacity>
              <Button
                style={styles.leaseButton}
                onPress={() => handleLeaseClick(item.LeaseLandDataID)} // Corrected onPress handler
              >
                <Text style={{ color: "green" }}>Lease Now</Text>
              </Button>
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <Text>
          No land available for lease in {countyName}. Please check again later.
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  button: {
    backgroundColor: "green",
    width: "90%",
    paddingBottom: 25,
    marginBottom: 35,
    borderRadius: 8,
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 200,
    marginBottom: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    paddingBottom: 2,
  },
  buttonSubText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "lighter",
    marginBottom: 5,
    marginTop: 5,
  },
  leaseButton: {
    backgroundColor: "white",
    color: "green",
    marginTop: 20,
  },
});
