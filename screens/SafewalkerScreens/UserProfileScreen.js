import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-elements";
import { Linking } from "expo";

import { Ionicons, EvilIcons, FontAwesome } from "@expo/vector-icons";

import colors from "./../../constants/colors";

export default function UserProfileScreen({ navigation }) {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("728 State St");
  const [postalCode, setPostalCode] = useState("53715");
  const [city, setCity] = useState("Madison");

  useEffect(() => {
    // later, call from server for user information
    // for now, just set default values
    setFirstname("Mujahid");
    setLastname("Anuar");
    setPhoneNumber("6081234567");
  }, []);

  function handleCall() {
    Linking.openURL("tel:+1" + phoneNumber);
  }

  function handleText() {
    Linking.openURL("sms:+1" + phoneNumber);
  }

  function handleMaps() {
    let daddr = encodeURIComponent(`${address} ${postalCode}, ${city}`);

    Linking.openURL(`https://maps.google.com/?daddr=${daddr}`);
  }

  function handleCancellation() {
    navigation.replace("SafewalkerHome");
  }

  return (
    <View style={styles.container}>
      <FontAwesome
        name="user-circle"
        size={100}
        style={styles.profilePicture}
      />
      <Text style={styles.textName}>
        {firstname} {lastname}
      </Text>
      <View style={styles.buttonContactContainer}>
        <Button
          icon={<Ionicons name="ios-call" size={60} color={colors.white} />}
          buttonStyle={styles.buttonCall}
          onPress={() => handleCall()}
        />
        <Button
          icon={<Ionicons name="md-text" size={60} color={colors.white} />}
          buttonStyle={styles.buttonText}
          onPress={() => handleText()}
        />
      </View>

      <Button
        title="Navigate using Maps"
        buttonStyle={styles.buttonCancel}
        icon={<EvilIcons name="external-link" size={25} color={colors.white} />}
        iconRight={true}
        onPress={() => handleMaps()}
      />
      <Button
        title="Cancel"
        buttonStyle={styles.buttonCancel}
        onPress={() => handleCancellation()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: "stretch",
    justifyContent: "center"
  },
  profilePicture: {
    alignSelf: "center",
    marginBottom: 30
  },
  textName: {
    alignSelf: "center",
    fontSize: 30,
    marginBottom: 40
  },
  buttonContactContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 100
  },
  buttonCall: {
    backgroundColor: colors.gray,
    borderRadius: 15,
    width: 80,
    height: 80
  },
  buttonText: {
    backgroundColor: colors.gray,
    borderRadius: 15,
    width: 80,
    height: 80
  },
  buttonCancel: {
    marginBottom: 40,
    height: 60,
    borderRadius: 50,
    backgroundColor: colors.red,
    marginHorizontal: 40
  }
});