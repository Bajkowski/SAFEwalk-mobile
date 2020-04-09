import React, { useContext } from "react";
import { Button, Text, View } from "react-native";

// Screens
import UserHomeNavigation from "./UserScreens/UserHomeNavigation";
import SafewalkerHomeNavigation from "./SafewalkerScreens/SafewalkerHomeNavigation";
import EditProfileNavigation from "./SharedScreens/EditProfileNavigation";
import LoginSettingsNavigation from "./SharedScreens/LoginSettingsNavigation";

// Drawer navigation
import { createDrawerNavigator } from "@react-navigation/drawer";
import DrawerContent from "../components/DrawerContent";
const Drawer = createDrawerNavigator();

// Context
import { AuthContext } from "../contexts/AuthProvider";

// Entry point for the Inactive Walk Navigation.
// Checks for user type (User or Safewalker) to determine appropriate navigation.
export default function InactiveWalkNavigation() {
  const { userType, signout } = useContext(AuthContext);

  return (
    <>
      {/* If it is a user, navigate to user's navigation. Else, go to safewalker's navigation */}
      {userType === "user" ? (
        <UserInactiveWalkNavigation />
      ) : userType === "safewalker" ? (
        <SafewalkerInactiveWalkNavigation />
      ) : (
        <View>
          {/* If userType is neither "user" nor "safewalker", there's something wrong */}
          <Text>
            userType is neither "user" nor "safewalker" in
            InactiveWalkNavigation.js. Please sign out.
          </Text>
          <Button title="Sign out" onPress={signout()} />
        </View>
      )}
    </>
  );
}

function UserInactiveWalkNavigation() {
  return (
    <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />}>
      <Drawer.Screen
        name="UserHomeNavigation"
        component={UserHomeNavigation}
        options={{ title: "Home" }}
      />
      <Drawer.Screen
        name="EditProfile"
        component={EditProfileNavigation}
        options={{ title: "Edit Profile" }}
      />
      <Drawer.Screen
        name="LoginSettings"
        component={LoginSettingsNavigation}
        options={{ title: "Login Settings" }}
      />
    </Drawer.Navigator>
  );
}

function SafewalkerInactiveWalkNavigation() {
  return (
    <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />}>
      <Drawer.Screen
        name="SafewalkerHomeNavigation"
        component={SafewalkerHomeNavigation}
        options={{ title: "Safewalker Home" }}
      />
      <Drawer.Screen
        name="EditProfile"
        component={EditProfileNavigation}
        options={{ title: "Edit Profile" }}
      />
      <Drawer.Screen
        name="LoginSettings"
        component={LoginSettingsNavigation}
        options={{ title: "Login Settings" }}
      />
    </Drawer.Navigator>
  );
}