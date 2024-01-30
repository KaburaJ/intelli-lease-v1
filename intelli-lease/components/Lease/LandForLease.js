import React from "react";
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
import { Button } from "react-native-paper";

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


// const handleLandForLeaseClick = () => {
//   console.log("handleLandForLeaseClick called");
//   Alert.alert(
//     "Request Received",
//     "Your request to lease this parcel of land has been received pending approval",
//     [{ text: "OK" }]
//   );
// };



export default function LandForLease() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {landData.map((item) => (
        <View
          key={item.id}
          style={styles.button}
          onclick={() =>Alert.alert(
            "Request Received",
            "Your request to lease this parcel of land has been received pending approval",
            [{ text: "OK" }]
          )}
        >
          <Image style={styles.image} source={item.image} />
          <Text style={styles.buttonText}>{item.name}</Text>
          <Text style={styles.buttonSubText}>{item.description}</Text>
          <TouchableOpacity>
          <Button style={styles.leaseButton} >
            <Text style={{color:'green'}}>Lease Now</Text>
          </Button>
          </TouchableOpacity>
        </View>
      ))}
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
    marginTop: 25,
  },
  leaseButton: {
    backgroundColor: "white",
    color: "green",
    marginTop: 20,
  },
});
