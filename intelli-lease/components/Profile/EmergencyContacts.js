import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const EmergencyContactsPage = () => {

  return (
<View style={styles.emergencyContainer}>
    <View style={styles.contactCard}>
    <Text style={styles.contactCardText}>qwerty</Text>
    <Text>00001010100</Text>
    </View>
    <View style={styles.contactCard}>
    <Text style={styles.contactCardText}>qwertty</Text>
    <Text>11111111111111111</Text>
    </View>

    

</View>
  );
};

const styles = StyleSheet.create({
  emergencyContainer: {
    backgroundColor: "transparent"
  },
  contactCard: {
    backgroundColor:"#FFF",
    marginTop:"5%",
    width:"90%",
    height:"30%",
    alignItems:"center",
    marginLeft:"5%",
    marginRight:"5%",
    borderRadius:12
  },
  contactCardText: {
    marginTop:"10%"
  }

  },
);

export default EmergencyContactsPage;
