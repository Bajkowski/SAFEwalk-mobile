import React, { useState, useEffect, useContext, useRef } from "react";
import axios from 'axios';
import {
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableOpacity,
  View,
  Keyboard
} from "react-native";
import { Input } from "react-native-elements";
import { useForm } from "react-hook-form";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

// Components
import Button from "./../../components/Button"

// Constants
import colors from "./../../constants/colors";
import socket from "./../../contexts/socket";
import url from "./../../constants/api";
import style from "./../../constants/style"

// Contexts
import { AuthContext } from "./../../contexts/AuthProvider";
import MapView, { Marker, PROVIDER_GOOGLE, fitToElements } from "react-native-maps";

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 43.076492;
const LONGITUDE = -89.401185;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

var initialRegion = {
  latitude: LATITUDE,
  longitude: LONGITUDE,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
};

// temporary
const homePlace = {
  description: 'Home',
  text: "",
  coordinates: {
    latitude: 43.081606,
    longitude: -89.376298
  }
};

export default function UserHomeScreen({ navigation }) {

  const mapRef = useRef(null);

  // store current user location
  const [location, setLocation] = useState({
    coordinates: {
      latitude: 43.081606,
      longitude: -89.376298
    },
    text: ""
  });

  // destination
  const [destination, setDestination] = useState({
    coordinates: {
      latitude: +43.081606,
      longitude: -89.376298
    },
    text: ""
  });

  // walk origin
  const [start, setStart] = useState({
    coordinates: {
      latitude: 43.075143,
      longitude: -89.400151
    },
    text: ""
  });

  const [eta, setEta] = useState("0");

  // set window region of MapView
  const [region, setRegion] = useState(
    {
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }
    }
  );

  // markers and locations
  const [markers, setMarkers] = useState([
    {
      key: 0,
      title: 'Start',
      coordinates: {
        latitude: LATITUDE,
        longitude: LONGITUDE
      }
    },
    {
      key: 1,
      title: 'Destination',
      coordinates: {
        // replace with api to get user's home addre
        latitude: homePlace.coordinates.latitude,
        longitude: homePlace.coordinates.longitude
      }
    }
  ]);

  const [request, setRequest] = useState(false);
  const [show, setShow] = useState(false);
  const { userToken, email } = useContext(AuthContext);

  async function getInitialState() {
    return {
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
    };
  }

  async function onRegionChangeComplete(region){
    useState({ region });
  }

  async function onRegionChange(region) {
    useState({ region });
  }

  async function onTextChange(textValue) {
    setDestination({
      coordinates: {
        latitude: destination.coordinates.latitude,
        longitude: destination.coordinates.longitude
      },
      text: textValue
    });
}

  const getCoordinates = text => {
    var replaced = text.split(' ').join('+');
    var axiosURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + replaced + "&key=AIzaSyAOjTjRyHvY82Iw_TWRVGZl-VljNhRYZ-c";
    axios.get(axiosURL)
      .then(res => {
        console.log("OUTPUT: " + res.data.results[0].geometry.location.lat);

        destination.coordinates.latitude = res.data.results[0].geometry.location.lat;
        destination.coordinates.longitude = res.data.results[0].geometry.location.lng;

        console.log("RETURNING: " + res.data.results[0].geometry.location.lat);
        return res.data.results[0].geometry.location;

      })
  }

  const getAddress = coordinates => {
    var axiosURL = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + coordinates.latitude + ", " + coordinates.longitude + "&key=AIzaSyAOjTjRyHvY82Iw_TWRVGZl-VljNhRYZ-c";
    axios.get(axiosURL)
    .then(res => {
      console.log("OUTPUT: " + res.data.results[0].formatted_address);
      setDestination({
        coordinates: {
          latitude: destination.coordinates.latitude,
          longitude: destination.coordinates.longitude
        },
        text: res.data.results[0].formatted_address
      })
      return(res.data.results[0].formatted_address);
    })
  }

  async function updateDestination() {

    var tempCoords = getCoordinates(destination.text);

    setMarkers([
      {
        key: 0,
        title: 'Start',
        coordinates: {
          latitude: LATITUDE,
          longitude: LONGITUDE
        }
      },
      {
        key: 1,
        coordinates: {
          latitude: destination.coordinates.latitude,
          longitude: destination.coordinates.longitude,
        }
      }
    ])

  }

  async function getEta() {

    navigator.geolocation.getCurrentPosition(showLocation);
    // test:     https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=43.076492,-89.401185&destinations=44.076492,-89.401185&key=AIzaSyAOjTjRyHvY82Iw_TWRVGZl-VljNhRYZ-c
    var axiosURL = "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=" + start.coordinates.latitude + ", " + start.coordinates.longitude + "&destinations=" + destination.coordinates.latitude + ", " + destination.coordinates.longitude + "&key=AIzaSyAOjTjRyHvY82Iw_TWRVGZl-VljNhRYZ-c";
    axios.get(axiosURL)
    .then(res => {
      console.log("OUTPUT: " + res.data.rows[0].elements[0].duration.text);
      setEta(res.data.rows[0].elements[0].duration.text);
    })
  }

  async function setSocketId() {
    // PutUser API call
    const res1 = await fetch(
      "https://safewalkapplication.azurewebsites.net/api/Users/" + email,
      {
        method: "PUT",
        headers: {
          token: userToken,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          socketId: socket.id
        })
      }
    );

    if (status != 200 && status != 201) {
      console.log("set socketId failed: status " + status);
      return;
    }

    // Add Walk API call
    // Create a walk in the database
    const res = await fetch(url + "/api/Walks", {
      method: "POST",
      headers: {
        token: userToken,
        email: email,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        time: new Date(),
        startText: location,
        destText: destination,
        userSocketId: socket.id,
      }),
    }).catch((error) => {
      console.error(
        "Error in POST walk in addRequest() in UserHomeScreen:" +
        error
      );
      setIsLoading(false);
    });

    let status = res.status;
    // Upon fetch failure/bad status
    if (status !== 200 && status !== 201) {
      console.log(
        "creating a walk request in addRequest() in UserHomeScreen failed: status " +
        status
      );
      setIsLoading(false);
      return; // exit
    }

    let data = await res.json();
    // store walkId in the WalkContext
    setWalkId(data["id"]);

    // send notification to all Safewalkers
    socket.emit("walk status", true);

    // navigate to the wait screen (keep this)
    navigation.reset({
      index: 0,
      routes: [
        {
          name: "UserWait",
        },
      ],
    });
  }

  async function showLocation(position) {
    setLocation(
      {
        coordinates: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }
      }
    )
 }

  async function onMapReady() {
    mapRef.current.fitToElements();
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Conditional Statement Based on if the User has made a Request */}
      {!request ? (
        <View style={styles.container}>
          {/* User Start and End Location Input Fields */}
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.mapStyle}
            showsUserLocation={true}
            ref={mapRef}
            minZoomLevel={10}
            maxZoomLevel={15}
            onMapReady={onMapReady}
          >
            <Input
              inputStyle={styles.input}
              inputContainerStyle={styles.inputContainer}
              value={destination.text}
              onChangeText={onTextChange}
              onSubmitEditing={updateDestination}
              placeholder='Destination'
              returnKeyType='search'
              leftIcon={{
                type: "font-awesome",
                name: "map-marker"
              }}
            />
            <Text>  Destination Marker Location: {markers[1].coordinates.latitude}, {markers[1].coordinates.longitude}</Text>
            <Text>  ETA: {eta}</Text>
            <Text>  User Coordinates: {location.coordinates.latitude}, {location.coordinates.longitude}</Text>
            <Text>  Destination Text: {destination.text}</Text>
            <Text>  Destination Coordinates: {destination.coordinates.latitude}, {destination.coordinates.longitude}</Text>
            {markers.map((marker) => (
              <MapView.Marker
                key={marker.key}
                coordinate={{
                  latitude: marker.coordinates.latitude,
                  longitude: marker.coordinates.longitude
                }}
                title={marker.title}
              />
            ))}
          </MapView>
          <TouchableOpacity onPress={() => {getEta(); mapRef.current.fitToElements()}}>
            <Text style={styles.buttonConfirm}> ETA </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => addRequest()}>
            <Text style={styles.buttonRequest}> Request SAFEwalk </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.container}>
          {/* View When the User Submits a SAFEwalk Request */}
          <Text
            style={{
              textAlign: "center",
              fontSize: 30,
              color: colors.orange,
              fontWeight: "bold"
            }}
          >
            Searching for {"\n"} SAFEwalker...
          </Text>
          <Icon
            type="font-awesome"
            name="hourglass"
            color={colors.orange}
            size={80}
            iconStyle={{ marginBottom: 100 }}
          />
          <TouchableOpacity onPress={() => cancelRequest()}>
            <Text style={styles.buttonCancel}> Cancel </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "space-around"
  },
  buttonRequest: {
    backgroundColor: "#77b01a",
    borderColor: 'transparent',
    borderWidth: 1,
    borderRadius: 25,
    color: colors.white,
    fontSize: 24,
    fontWeight: "bold",
    overflow: "hidden",
    padding: 12,
    textAlign: "center",
    marginBottom: 110
  },
  buttonConfirm: {
    backgroundColor: "#77b01a",
    borderColor: 'transparent',
    borderWidth: 1,
    borderRadius: 25,
    color: colors.white,
    fontSize: 24,
    fontWeight: "bold",
    overflow: "hidden",
    padding: 12,
    textAlign: "center",
    marginBottom: 160
  },
  buttonFit: {
    backgroundColor: "#77b01a",
    borderColor: 'transparent',
    borderWidth: 1,
    borderRadius: 25,
    color: colors.white,
    fontSize: 24,
    fontWeight: "bold",
    overflow: "hidden",
    padding: 12,
    textAlign: "center",
    marginTop: 160
  },
  buttonCancel: {
    backgroundColor: colors.red,
    borderColor: colors.white,
    borderWidth: 1,
    borderRadius: 25,
    color: colors.white,
    fontSize: 24,
    fontWeight: "bold",
    overflow: "hidden",
    padding: 12,
    textAlign: "center",
    width: 200
  },
  input: {
    marginLeft: 20,
  },
  inputContainer: {
    marginBottom: 20,
    marginTop: 20,
    borderColor: 'transparent',
    backgroundColor: 'white',
    borderWidth: 2,
    borderRadius: 5
  },
  inputContainerTop: {
    marginBottom: 20,
    marginTop: 20,
    borderColor: 'transparent',
    backgroundColor: 'white',
    borderWidth: 2,
    borderRadius: 5
  },
  image: {
    width: Dimensions.get("window").width - 75,
    height: 350,
    marginBottom: 40,
    marginTop: 20,
  },
  mapStyle: {
    marginTop: 70,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height-90,
  }
});
