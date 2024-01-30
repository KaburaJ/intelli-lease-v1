import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import DropDownPicker from "react-native-dropdown-picker";
import { Picker } from "@react-native-picker/picker";
import countyData from "../../assets/ke.json";

const LeaseLandPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  console.log(route);
  const { UserEmail } = route.params && route.params[0] ? route.params[0] : {UserEmail:'kk@gmail.com'};
  console.log(UserEmail);
  const [userData, setUserData] = useState({});

  const [details, setDetails] = useState({
    UserID: userData.UserID,
    County: "",
    SubCounty: "",
    Constituency: "",
    LandSize: 0
  });

  const getUserDetails = async () => {
    try {
      const response = await fetch(
        "https://intelli-lease-land-details.onrender.com/userdetails",
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          // body: JSON.stringify({ UserEmail: UserEmail }),
        }
      );
      
      const data = await response.json()
      console.log(data);
      const result = await response.json();      
      if (!response.ok) {
        console.error("Error getting user details:", response.status);
        return;
      }
    } catch (error) {
      console.error("Error getting user details:", error.message);
    }
  };

useEffect(() => {
  getUserDetails()
}, [])


  const handleLease = async () => {
    try {
      const response = await fetch(
        "https://intelli-lease-land-details.onrender.com/lease-out",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(details),
        }
      );
      if (!response.ok) {
        console.error("Error signing up:", response.status);
        return;
      }

      Alert.alert(
        "Your land is up for lease pending approval. We shall get back to you.",
        null,
        [{ text: "OK", onPress: () => navigation.navigate("Home") }]
      );
    } catch (error) {
      console.error("Error signing up:", error.message);
    }
  };

  const uniqueCountyClasses = Array.from(
    new Set(countyData.map((item) => item.admin_name))
  );

  return (
    <ScrollView>
      <View style={styles.mainContainer}>
        <View style={styles.form}>
          <Text style={[styles.inputLabel, { marginTop: 10 }]}>
            Personal Details
          </Text>
          <View style={[styles.input, { marginTop: 20 }]}>
            <Text style={styles.inputLabel}>First Name</Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="default"
              placeholderTextColor="#6b7280"
              style={styles.inputControl}
              defaultValue={userData.FirstName}
            />
          </View>
          <View style={styles.input}>
            <Text style={styles.inputLabel}>Last Name</Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="default"
              placeholderTextColor="#6b7280"
              style={styles.inputControl}
              defaultValue={userData.LastName}
            />
          </View>
          <View style={[styles.input]}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="default"
              placeholderTextColor="#6b7280"
              style={styles.inputControl}
              defaultValue={userData.UserEmail}
            />
          </View>

          <Text style={[styles.inputLabel, { marginTop: 10 }]}>
            Location Details
          </Text>
          <Picker
            selectedValue={details.County}
            style={styles.inputControl}
            onValueChange={(itemValue) =>
              setDetails({ ...details, County: itemValue })
            }
          >
            <Picker.Item label="Select County" value="" />
            {uniqueCountyClasses.map((admin_name) => (
              <Picker.Item
                key={admin_name}
                label={admin_name}
                value={admin_name}
                style={styles.pickerItem}
              />
            ))}
          </Picker>

          <Picker
            selectedValue={details.SubCounty}
            style={styles.inputControl}
            onValueChange={(itemValue) =>
              setDetails({ ...details, SubCounty: itemValue })
            }
          >
            <Picker.Item label="Select Sub-County" value="" />
            {uniqueCountyClasses.map((admin_name) => (
              <Picker.Item
                key={admin_name}
                label={admin_name}
                value={admin_name}
                style={styles.pickerItem}
              />
            ))}
          </Picker>

          <Picker
            selectedValue={details.Constituency}
            style={styles.inputControl}
            onValueChange={(itemValue) =>
              setDetails({ ...details, Constituency: itemValue })
            }
          >
            <Picker.Item label="Select Constituency" value="" />
            {uniqueCountyClasses.map((admin_name) => (
              <Picker.Item
                key={admin_name}
                label={admin_name}
                value={admin_name}
                style={styles.pickerItem}
              />
            ))}
          </Picker>
          <Text style={[styles.inputLabel, { marginTop: 20 }]}>
            Land Details
          </Text>
          <View style={[styles.input, { marginTop: 20 }]}>
            <Text style={styles.inputLabel}>Land Size (in Acres)</Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="number-pad"
              onChangeText={(LandSize) =>
                setDetails({ ...details, LandSize})
              }
              placeholder="0 (ACRES)"
              placeholderTextColor="#6b7280"
              style={styles.inputControl}
              value={details.LandSize}
            />
          </View>
          <View style={styles.formAction}>
            <TouchableOpacity onPress={handleLease}>
              <View style={styles.btn}>
                <Text style={styles.btnText}>Lease Out Your Land</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    marginTop: 15,
    margin: 18,
    padding: 30,
    backgroundColor: "white",
    borderRadius: 25,
    paddingBottom: 35,
  },
  form: {
    marginBottom: 24,
  },
  input: {
    marginBottom: 6,
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: "600",
    color: "#222",
    marginBottom: 8,
  },
  inputControl: {
    height: 44,
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    marginBottom: 25,
    fontWeight: "500",
    color: "#222",
    borderColor: "transparent",
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    backgroundColor: "green",
    borderColor: "green",
  },
  btnText: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: "600",
    color: "#fff",
  },
  formAction: {
    marginTop: 20,
  },
});

export default LeaseLandPage;
