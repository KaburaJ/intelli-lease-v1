import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage

export default function SignUp() {
  const navigation = useNavigation();

  const [form, setForm] = useState({
    FirstName: "",
    LastName: "",
    UserEmail: "",
    UserPasswordHash: "",
    UserCPassword: "",
  });

  const handleSignUp = async () => {
    try {
      if(form.FirstName && form.LastName && form.UserEmail && form.UserPasswordHash && form.UserCPassword ){
      if (form.UserPasswordHash !== form.UserCPassword) {
        Alert.alert("Passwords do not match");
        return;
      }
  
      const response = await fetch("http://localhost:5000/user/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const responseData = await response.json();

    console.log("FORM", form);
    console.log("RESPONSE", responseData);

    if (!response.ok) {
      console.error("Error signing up:", responseData);
      return;
    }

    const userData = responseData[0];
    console.log(userData);


    Alert.alert("Sign up successful", null, [
      {
        text: "OK",
        onPress: () =>
          navigation.navigate("LogIn", {
            userData: userData,
          }),
      },
    ]);
  }
  else{
    Alert.alert("Please fill all required fields", null, [
     {text: "OK",}
    ])
  }
  } catch (error) {
    console.error("Error signing up:", error.message);
  }
};


  return (
    <SafeAreaView style={{width:'100%'}}>
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <Text style={styles.subtitle}>Sign up to an account</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.input}>
          <Text style={styles.inputLabel}>First Name</Text>

          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="default"
            onChangeText={(FirstName) => setForm({ ...form, FirstName })}
            placeholder="john"
            placeholderTextColor="#6b7280"
            style={styles.inputControl}
            value={form.FirstName}
          />
        </View>
        <View style={styles.input}>
          <Text style={styles.inputLabel}>Last Name</Text>

          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="default"
            onChangeText={(LastName) => setForm({ ...form, LastName })}
            placeholder="doe"
            placeholderTextColor="#6b7280"
            style={styles.inputControl}
            value={form.LastName}
          />
        </View>
        <View style={styles.input}>
          <Text style={styles.inputLabel}>Email address</Text>

          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            onChangeText={(UserEmail) => setForm({ ...form, UserEmail })}
            placeholder="john@example.com"
            placeholderTextColor="#6b7280"
            style={styles.inputControl}
            value={form.UserEmail}
          />
        </View>

        <View style={styles.input}>
          <Text style={styles.inputLabel}>Password</Text>

          <TextInput
            autoCorrect={false}
            onChangeText={(UserPasswordHash) =>
              setForm({ ...form, UserPasswordHash })
            }
            placeholder="********"
            placeholderTextColor="#6b7280"
            style={styles.inputControl}
            secureTextEntry={true}
            value={form.UserPasswordHash}
          />
        </View>
        <View style={[styles.input, { marginBottom: "-1em" }]}>
          <Text style={styles.inputLabel}>Confirm Password</Text>

          <TextInput
            autoCorrect={false}
            onChangeText={(UserCPassword) =>
              setForm({ ...form, UserCPassword })
            }
            placeholder="********"
            placeholderTextColor="#6b7280"
            style={styles.inputControl}
            secureTextEntry={true}
            value={form.UserCPassword}
          />
        </View>

        <View style={styles.formAction}>
          <TouchableOpacity onPress={handleSignUp}>
            <View style={styles.btn}>
              <Text style={styles.btnText}>Sign Up</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    margin: 28,
    marginTop: -30,
  },
  container: {
    padding: 44,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },

  logo: {
    marginLeft: "5%",
    marginTop: "14%",
    fontSize: 22,
    marginBottom: "-3%",
    color: "#ccc",
  },
  header: {
    marginVertical: 36,
  },
  form: {
    marginBottom: 24,
  },
  formAction: {
    marginVertical: 24,
  },
  formFooter: {
    fontSize: 15,
    fontWeight: "500",
    color: "#222",
    textAlign: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1d1d1d",
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#929292",
    textAlign: "center",
  },
  input: {
    marginBottom: 16,
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
    fontWeight: "500",
    color: "#222",
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
});
