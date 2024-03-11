import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, Button } from "react-native-paper";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function AdminAllUsers() {
  const navigation = useNavigation();
  const [details, setDetails] = useState({
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySUQiOiIxQjhERkYxRC1DQzQxLTQyMkEtOUI1NC1DMkYyMjBDMUVFOTEiLCJpYXQiOjE3MDk5Njc4MDQsImV4cCI6MTcxMjU1OTgwNH0.LoPrjnsCOZj3AQ1WNEmSD-XQuLlSI9ATXaLRjsc2AJE",
  });
  const [userDetails, setUserDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        setDetails((prevDetails) => ({ ...prevDetails, token: token }));
      } catch (error) {
        console.error("Error retrieving user data:", error.message);
      }
    };
    getUserData();
  }, []);

  useEffect(() => {
    if (details.token) {
      viewAllUsers();
    }
  }, [details.token]);

  const viewAllUsers = async () => {
    try {
      const response = await fetch("http://172.28.144.1:5002/all-users", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": details.token,
        },
      });
      if (!response.ok) {
        console.error(
          "Error admin viewing pending lease requests:",
          response.status
        );
        return;
      }
      const responseData = await response.json();
      setUserDetails(responseData.results);
    } catch (error) {
      console.error("Error admin viewing all users:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="green" />
      ) : (
        userDetails.map((item) => (
          <TouchableOpacity
            key={item.LeaseLandDataID}
            style={styles.button}
            onPress={() => navigation.navigate("UserProfile", { userId: item.UserId })}
          >
            <AntDesign name="user" style={styles.icon} />
            <Text style={styles.buttonText}>{item.FirstName}</Text>
            <Text style={styles.buttonSubText}>{item.LastName}</Text>
            <Text style={styles.buttonSubText}>{item.UserEmail}</Text>
            <Text style={styles.buttonSubText}>{item.timeStamp}</Text>
            <Button
              style={styles.viewButton}
              onPress={() => navigation.navigate("UserProfile", { userId: item.UserId })}
            >
              <Text style={styles.viewButtonText}>View</Text>
            </Button>
          </TouchableOpacity>
        ))
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
  icon: {
    marginTop: 20,
    color: "#FFF",
    fontSize: 44,
    padding:20
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
    paddingTop: 2,
  },
  buttonSubText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "lighter",
    marginTop: 5,
  },
  viewButton: {
    backgroundColor: "white",
    marginTop: 20,
  },
  viewButtonText: {
    color: "green",
  },
});
