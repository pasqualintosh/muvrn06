import React from "react";
import {
  View,
  Text,
  Dimensions,
  Alert,
  TouchableWithoutFeedback,
  StyleSheet,
  Platform,
  Image
} from "react-native";
import MapView, { AnimatedRegion, Animated } from "react-native-maps";
import { connect } from "react-redux";
import { updateState, getCity } from "./../../domains/register/ActionCreators";
import axios from "axios";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import BackgroundGeolocation from "./../../../src/helpers/geolocation";
import Geocoder from "./../../components/Geocoder/Geocoder";
import { prefixesList } from "./../../assets/ListPrefixes";
import LinearGradient from "react-native-linear-gradient";

import { strings } from "../../config/i18n";

class FrequentTripMapScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user_lat: 38.120560,
      user_lon: 13.358200,
      points: [],
      select_type: [-1, -1],
      type: ["Home", "Work", "Gym", "School", "Other"],
      street: "",
      formatted_address: "",
      button_android: -1,
      viewRef: null,
      load: false,
      search: false,
      search_result: [{ formatted_address: "" }],
      instructions: [
        strings("please_enter_th"),
        "Well, now tell us what place is inside the starting area.",
        "You're almost there. Enter the address for your trip destination. Again, we will only keep the outline of the surrounding area.",
        "Good job! Now specify your destination type and you're done.",
        "Your frequent trip has been set correctly. Shall we move on?"
      ],
      start_point: null,
      end_point: null,
      render_ok_btn: true
    };
    this.mapRef = null;
  }

  static navigationOptions = {
    headerTitle: (
      <Text
        style={{
          left: Platform.OS == "android" ? 20 : 0
        }}
      >
        Frequent Trip
      </Text>
    )
  };

  static navigationOptions = ({ navigation, screenProps }) => ({
    headerTitle: navigation.state.params
      ? navigation.state.params.screen_name.charAt(0).toUpperCase() +
        navigation.state.params.screen_name.slice(1)
      : "Frequent trip"
    // headerRight: navigation.state.params
    //   ? navigation.state.params.screen_name
    //   : "Frequen trip"
  });

  addPoint = (position, mapRef) => {
    const key = +new Date();
    this.setState(previousState => {
      if (this.mapRef) {
        this.mapRef.animateToCoordinate(position, 1000);
      }

      return {
        points: [{ ...position, key }],
        button_android: 0
      };
    });
  };

  setBackgroundGeolocation = () => {
    BackgroundGeolocation.configure({
      desiredAccuracy: 0,
      // stationaryRadius: 50,
      // distanceFilter: 50,
      debug: false,
      startOnBoot: false,
      stopOnTerminate: false,
      locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
      interval: 10000, // android
      fastestInterval: 5000, // android
      activitiesInterval: 10000, // android
      stopOnStillActivity: false,
      url: "http://192.168.81.15:3000/location",
      httpHeaders: {
        "X-FOO": "bar"
      },
      // customize post properties
      postTemplate: {
        lat: "@latitude",
        lon: "@longitude",
        foo: "bar" // you can also add your own properties
      },
      notificationTitle: "MUV",
      notificationText: "Background tracking"
    });

    BackgroundGeolocation.on("location", location => {
      BackgroundGeolocation.startTask(taskKey => {
        this.setState(
          {
            user_lat: location.latitude,
            user_lon: location.longitude
          },
          () => {
            if (this.mapRef) {
              this.mapRef.animateToCoordinate(location, 1000);
            }

            Geocoder.init("AIzaSyC3cg3CWrVwdNa1ULzzlxZ-gy-4gCp080M");
            Geocoder.from({
              latitude: location.latitude,
              longitude: location.longitude
            })
              .then(json => {
                street = json.results[0].address_components;
                let country_name = street[6].long_name;
                let country_code = street[6].short_name;

                let prefix = prefixesList.find(p => p.name === country_name)
                  .code;

                let prefixIndex = prefixesList.findIndex(el => {
                  return el.name === country_name;
                });
              })
              .catch(error => console.warn(error));

            BackgroundGeolocation.stop();
          }
        );

        if (this.mapRef) {
          this.mapRef.animateToCoordinate(location, 1000);
        }

        BackgroundGeolocation.endTask(taskKey);
      });
    });

    BackgroundGeolocation.on("error", error => {
      console.log("[ERROR] BackgroundGeolocation error:", error);
    });

    BackgroundGeolocation.on("start", () => {
      console.log("[INFO] BackgroundGeolocation service has been started");
    });

    BackgroundGeolocation.on("stop", () => {
      console.log("[INFO] BackgroundGeolocation service has been stopped");
    });

    BackgroundGeolocation.on("authorization", status => {
      console.log(
        "[INFO] BackgroundGeolocation authorization status: " + status
      );
      if (status !== BackgroundGeolocation.AUTHORIZED) {
        // we need to set delay or otherwise alert may not be shown
        setTimeout(
          () =>
            Alert.alert(
              "Permissions",
              "MUV wants to access your position. To save your battery we reccomend you to select 'Allow only while...'",
              [
                {
                  text: strings("id_14_03"),
                  onPress: () => BackgroundGeolocation.showAppSettings()
                },
                {
                  text: strings("id_14_04"),
                  onPress: () => console.log("No Pressed"),
                  style: "cancel"
                }
              ]
            ),
          1000
        );
      }
    });

    BackgroundGeolocation.on("background", () => {
      console.log("[INFO] App is in background");
    });

    BackgroundGeolocation.on("foreground", () => {
      console.log("[INFO] App is in foreground");
    });

    BackgroundGeolocation.start();
  };

  unsetBackgroundGeolocation = () => {
    // unregister all event listeners
    BackgroundGeolocation.events.forEach(event =>
      BackgroundGeolocation.removeAllListeners(event)
    );
    BackgroundGeolocation.stop();
  };

  componentDidMount() {
    // this.setBackgroundGeolocation();

    // if (Platform.OS == "ios")
      navigator.geolocation.getCurrentPosition(
        position => {
          console.log(position.coords);
          // BackgroundGeolocation.stop();
          //  this.unsetBackgroundGeolocation();
          this.setState(
            {
              user_lat: position.coords.latitude,
              user_lon: position.coords.longitude
            },
            () => {
              if (this.mapRef) {
                this.mapRef.animateToCoordinate(position.coords, 1000);
              }

              Geocoder.init("AIzaSyC3cg3CWrVwdNa1ULzzlxZ-gy-4gCp080M");
              Geocoder.from({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              })
                .then(json => {
                  street = json.results[0].address_components;
                  let country_name = street[6].long_name;
                  let country_code = street[6].short_name;

                  let prefix = prefixesList.find(p => p.name === country_name)
                    .code;

                  let prefixIndex = prefixesList.findIndex(el => {
                    return el.name === country_name;
                  });

                  setTimeout(() => {
                    if (
                      this.props.navigation.state.params.start_point == true
                    ) {
                      console.log(this.props.navigation.state.params);
                      if (
                        this.props.navigation.state.params.frequent_trip_start
                      ) {
                        console.log(this.props.navigation.state.params);
                        this.setState({
                          start_point: this.props.navigation.state.params
                            .frequent_trip_start,
                          formatted_address: this.props.navigation.state.params
                            .frequent_trip_start.street,
                          points: [
                            {
                              latitude: this.props.navigation.state.params
                                .frequent_trip_start.latitude,
                              longitude: this.props.navigation.state.params
                                .frequent_trip_start.longitude,
                              key: +new Date()
                            }
                          ]
                        });
                        if (this.mapRef) {
                          this.mapRef.animateToCoordinate(
                            {
                              ...this.props.navigation.state.params
                                .frequent_trip_start
                            },
                            1200
                          );
                        }
                      }
                    }
                    if (this.props.navigation.state.params.end_point == true) {
                      if (
                        this.props.navigation.state.params.frequent_trip_end
                      ) {
                        this.setState({
                          end_point: this.props.navigation.state.params
                            .frequent_trip_end,
                          formatted_address: this.props.navigation.state.params
                            .frequent_trip_end.street,
                          points: [
                            {
                              latitude: this.props.navigation.state.params
                                .frequent_trip_end.latitude,
                              longitude: this.props.navigation.state.params
                                .frequent_trip_end.longitude,
                              key: +new Date()
                            }
                          ]
                        });
                        if (this.mapRef) {
                          this.mapRef.animateToCoordinate(
                            this.props.navigation.state.params
                              .frequent_trip_end,
                            1200
                          );
                        }
                      }
                    }
                  }, 500);
                })
                .catch(error => console.warn(error));
            }
          );
        },
        error => alert(error.message),
        { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 }
      );
  }

  componentWillUnmount() {
    // this.unsetBackgroundGeolocation();
  }

  textDescriptionHeader = text => {
    this.props.navigation.setParams({ title: text });
  };

  handleStreet = text => {
    this.setState({
      formatted_address: text
    });
  };

  saveTripsInRedux = index => {
    if (this.props.navigation.state.params.start_point == true) {
      let street = this.state.formatted_address;
      if (street == "") {
        Geocoder.init("AIzaSyC3cg3CWrVwdNa1ULzzlxZ-gy-4gCp080M");
        Geocoder.from({
          latitude: this.state.user_lat,
          longitude: this.state.user_lon
        })
          .then(json => {
            street = json.results[0].address_components;
            const start_point = {
              latitude: this.state.points[0].latitude,
              longitude: this.state.points[0].longitude,
              type: this.state.type[index],
              street: street[1].long_name + ", " + street[2].long_name
            };
            this.setState({ start_point });
          })
          .catch(error => console.warn(error));
      } else {
        const start_point = {
          latitude: this.state.points[0].latitude,
          longitude: this.state.points[0].longitude,
          type: this.state.type[index],
          street: this.state.formatted_address
        };
        this.setState({ start_point });
      }
    } else if (this.props.navigation.state.params.end_point == true) {
      let street = this.state.formatted_address;
      if (street == "") {
        Geocoder.init("AIzaSyC3cg3CWrVwdNa1ULzzlxZ-gy-4gCp080M");
        Geocoder.from({
          latitude: this.state.user_lat,
          longitude: this.state.user_lon
        })
          .then(json => {
            street = json.results[0].address_components;

            const end_point = {
              latitude: this.state.points[0].latitude,
              longitude: this.state.points[0].longitude,
              type: this.state.type[index],
              street: street[1].long_name + ", " + street[2].long_name
            };
            this.setState({ end_point });
          })
          .catch(error => console.warn(error));
      } else {
        const end_point = {
          latitude: this.state.points[0].latitude,
          longitude: this.state.points[0].longitude,
          type: this.state.type[index],
          street: this.state.formatted_address
        };
        this.setState({ end_point });
      }
    }
  };

  saveJustPointsInRedux = () => {
    if (this.props.navigation.state.params.start_point == true) {
      let street = this.state.formatted_address;
      if (street == "") {
        Geocoder.init("AIzaSyC3cg3CWrVwdNa1ULzzlxZ-gy-4gCp080M");
        Geocoder.from({
          latitude: this.state.user_lat,
          longitude: this.state.user_lon
        })
          .then(json => {
            street = json.results[0].address_components;
            const start_point = {
              latitude: this.state.user_lat,
              longitude: this.state.user_lon,
              street: street[1].long_name + ", " + street[2].long_name
            };

            this.setState(
              {
                formatted_address:
                  street[1].long_name + ", " + street[2].long_name,
                start_point
              },
              () => {}
            );
          })
          .catch(error => console.warn(error));
      } else {
        const start_point = {
          latitude: this.state.user_lat,
          longitude: this.state.user_lon,
          street: this.state.formatted_address
        };

        this.setState({
          start_point
        });
      }
    } else if (this.props.navigation.state.params.end_point == true) {
      let street = this.state.formatted_address;
      if (street == "") {
        Geocoder.init("AIzaSyC3cg3CWrVwdNa1ULzzlxZ-gy-4gCp080M");
        Geocoder.from({
          latitude: this.state.user_lat,
          longitude: this.state.user_lon
        })
          .then(json => {
            street = json.results[0].address_components;
            const end_point = {
              latitude: this.state.user_lat,
              longitude: this.state.user_lon,
              street: street[1].long_name + ", " + street[2].long_name
            };
            this.setState({
              formatted_address:
                street[1].long_name + ", " + street[2].long_name,
              end_point
            });
          })
          .catch(error => console.warn(error));
      } else {
        const end_point = {
          latitude: this.state.user_lat,
          longitude: this.state.user_lon,
          street: this.state.formatted_address
        };
        this.setState({ end_point });
      }
    }
  };

  sendGeocoding = text => {
    axios
      .get(
        "https://maps.googleapis.com/maps/api/geocode/json?address=" +
          text +
          "&key=AIzaSyC3cg3CWrVwdNa1ULzzlxZ-gy-4gCp080M"
      )
      .then(response => {
        console.log("risposta google");
        console.log(response);

        if (response.data.status === "OK") {
          const position = response.data.results[0].geometry.location;
          this.addPoint({
            latitude: position.lat,
            longitude: position.lng
          });
          this.setState(
            {
              search_result: response.data.results,
              user_lat: position.lat,
              user_lon: position.lng
            },
            () => {
              this.saveJustPointsInRedux();
              // this.props.navigation.goBack(null);
            }
          );
        } else if (response.data.status === "ZERO_RESULTS") {
          Alert.alert("Insert a valid street");
        }
      })
      .catch(function(error) {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
          return error.response;
        } else if (error.request) {
          console.log(error.request);
          return error.request;
        } else {
          console.log(error.message);
          return error.message;
        }
        console.log(error.config);
      })
      .then(
        this.setState({
          street: ""
        })
      );
  };

  selectType = (index, view, num) => {
    console.log(index);
    console.log(num);
    console.log(view);
    this.setState(previousState => {
      // soglia per evitare dei punti troppo vicini, scelti dall'utente

      const NewType = { ...previousState };
      if (num === 0 && NewType.select_type[1] !== -1) {
        this.textDescriptionHeader("Complete, press " + strings("id_0_12"));
      } else if (num === 0) {
        this.textDescriptionHeader("Select end of routine");
      } else if (num === 1 && NewType.select_type[0] !== -1) {
        this.textDescriptionHeader("Complete, press " + strings("id_0_12"));
      } else if (num === 1 && NewType.select_type[0] === -1) {
        this.textDescriptionHeader("Select start of routine");
      }
      NewType.select_type[num] = index;
      NewType.button_android = -1;
      return NewType;
    });

    this.saveTripsInRedux(index);

    this.props.navigation.goBack(null);
  };

  renderButtons() {
    if (this.state.button_android >= 0) {
      return (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: "#fff",
            marginTop: Platform.OS == "ios" ? 60 : 0
            // borderBottomWidth: 1,
            // borderBottomColor: "#3D3D3D"
          }}
        >
          {this.state.type.map((elem, index) => (
            <TouchableWithoutFeedback
              key={index}
              onPress={
                this.state.select_type[this.state.button_android ? 0 : 1] !==
                index
                  ? () => {
                      this.selectType(
                        index,
                        this.state.viewRef,
                        this.state.button_android
                      );
                    }
                  : null
              }
            >
              <View
                style={{
                  height: 40,
                  width: Dimensions.get("window").width,
                  justifyContent: "center",
                  alignItems: "center",
                  borderTopWidth: 0.8,
                  borderTopColor: "#F7F8F9"
                }}
              >
                <Text
                  style={{
                    fontFamily: "OpenSans-Bold",
                    textAlign: "center",
                    fontSize: 14,
                    color:
                      this.state.select_type[
                        this.state.button_android ? 0 : 1
                      ] === index
                        ? "grey"
                        : this.state.select_type[this.state.button_android] ===
                          index
                        ? "blue"
                        : "#3D3D3D"
                  }}
                >
                  {elem}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          ))}
        </View>
      );
    }
    return <View />;
  }

  renderOkBtn() {
    if (this.state.formatted_address != "" && this.state.render_ok_btn) {
      return (
        <TouchableWithoutFeedback
          onPress={() => {
            this.props.navigation.navigate("ChangeFrequentTripScreen", {
              start_point: this.state.start_point,
              end_point: this.state.end_point
            });
          }}
          // style={{
          //   position: "absolute",
          //   top: Dimensions.get("window").height * 0.3,
          //   right: Dimensions.get("window").width * 0.5 - 50
          // }}
        >
          <LinearGradient
            start={{ x: 0.0, y: 0.0 }}
            end={{ x: 0.0, y: 1.0 }}
            locations={[0, 1.0]}
            colors={["#e82f73", "#f49658"]}
            style={{
              width: 100,
              height: 50,
              borderRadius: 5,
              alignItems: "center",
              justifyContent: "center",
              position: "absolute",
              top: Dimensions.get("window").height * 0.3,
              right: Dimensions.get("window").width * 0.5 - 50
            }}
          >
            <View
              style={{
                // width: 100,
                // height: 50,
                // borderRadius: 5,
                // position: "absolute",
                // top: Dimensions.get("window").height * 0.3,
                // right: Dimensions.get("window").width * 0.5 - 50,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Text
                style={{
                  margin: 10,
                  color: "#FFFFFF",
                  fontFamily: "OpenSans-Regular",
                  fontWeight: "400",
                  fontSize: 15
                }}
              >
                {strings("id_0_12")}
              </Text>
            </View>
          </LinearGradient>
        </TouchableWithoutFeedback>
      );
    }
  }

  renderAutocompleteInput() {
    return (
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0
        }}
      >
        <GooglePlacesAutocomplete
          textInputProps={{
            onFocus: () => {
              this.setState({ render_ok_btn: false });
            }
          }}
          placeholder={
            strings("id_0_34")
              .charAt(0)
              .toUpperCase() + strings("id_0_34").slice(1)
          }
          minLength={2} // minimum length of text to search
          autoFocus={false}
          returnKeyType={"search"} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
          // listViewDisplayed="auto" // true/false/undefined
          listViewDisplayed={false}
          // fetchDetails={true}
          renderDescription={row => row.description} // custom description render
          onPress={(data, details = null) => {
            // 'details' is provided when fetchDetails = true
            // console.log(data, details);
            // console.log(data.description);
            this.setState(
              { formatted_address: data.description, render_ok_btn: true },
              () => {
                this.handleStreet(data.description);
                this.sendGeocoding(data.description);

                this.saveJustPointsInRedux();
                // this.props.navigation.goBack(null);
              }
            );
          }}
          getDefaultValue={() => ""}
          query={{
            key: "AIzaSyC3cg3CWrVwdNa1ULzzlxZ-gy-4gCp080M",
            language: "en" // language of the results
          }}
          styles={{
            textInputContainer: {
              width: "100%",
              backgroundColor: "transparent",
              borderRadius: 3,
              borderBottomWidth: 0,
              height: 55,
              marginTop:
                Platform.OS == "ios"
                  ? Dimensions.get("window").height === 812 ||
                    Dimensions.get("window").width === 812 ||
                    Dimensions.get("window").height === 896 ||
                    Dimensions.get("window").width === 896
                    ? 75
                    : 60
                  : 0
            },
            textInput: {
              borderRadius: 6,
              height: 55,
              justifyContent: "center",
              alignItems: "center"
            },
            container: {},
            listView: {
              backgroundColor: "#fff",
              marginTop: 5
            },
            description: {
              fontFamily: "OpenSans-Regular",
              fontSize: 14,
              fontWeight: "400"
            },
            predefinedPlacesDescription: {
              color: "#1faadb"
            },
            poweredContainer: {
              height: 7,
              backgroundColor: "transparent"
            },
            powered: {
              width: 60
            }
          }}
          currentLocationLabel="Current location"
          nearbyPlacesAPI="GooglePlacesSearch"
          GoogleReverseGeocodingQuery={{}}
          GooglePlacesSearchQuery={{
            rankby: "distance",
            types: "food"
          }}
          filterReverseGeocodingByTypes={[
            "locality",
            "administrative_area_level_3"
          ]}
        />
        <TouchableWithoutFeedback
          onPress={() => {
            this.addPoint({
              latitude: this.state.user_lat,
              longitude: this.state.user_lon
            });

            this.saveJustPointsInRedux();
            // this.props.navigation.goBack(null);
          }}
        >
          <View
            style={{
              width: "96.3%",
              backgroundColor: "#fff",
              borderRadius: 5,
              borderBottomWidth: 0,
              height: 40,
              marginTop: 10,
              alignSelf: "center",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row"
            }}
          >
            <Text style={styles.textCurrentLocation}>{strings("id_0_47")}</Text>
            <Image
              style={{ width: 35, height: 35, marginRight: 5 }}
              source={require("./../../assets/images/map_point_a_circle.png")}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  renderPoints() {
    {
      let viewRef = [null, null];
      return this.state.points.map((item, num) => (
        <MapView.Marker
          key={item.key}
          coordinate={{ latitude: item.latitude, longitude: item.longitude }}
          ref={view => {
            viewRef[num] = view;
          }}
          image={
            num
              ? require("./../../assets/images/Map_pin_2.png")
              : require("./../../assets/images/Map_pin_1.png")
          }
          anchor={{ x: 0.5, y: 0.5 }}
        />
      ));
    }
  }

  renderCircles() {
    {
      return this.state.points.map((item, num) => (
        <MapView.Circle
          key={item.key}
          center={{ latitude: item.latitude, longitude: item.longitude }}
          radius={100}
          fillColor="rgba(255, 255, 255, 0.52)"
          strokeColor="rgba(0, 0, 0, 0.33)"
          zIndex={-1}
        />
      ));
    }
  }

  renderPhrase() {
    let phrase = this.state.instructions[0];
    switch (this.state.points.length) {
      case 0: {
        phrase = this.state.instructions[0];
        break;
      }

      case 1: {
        phrase =
          this.state.select_type[0] == -1
            ? this.state.instructions[1]
            : this.state.instructions[2];
        break;
      }
      case 2: {
        phrase =
          this.state.select_type[1] == -1
            ? this.state.instructions[3]
            : this.state.instructions[4];
        break;
      }

      default:
        break;
    }

    return (
      <View
        style={{
          position: "absolute",
          top: Dimensions.get("window").height * 0.3,
          right: Dimensions.get("window").width * 0.1,
          width: Dimensions.get("window").width * 0.8,
          height: 60,
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "center",
          padding: 10,
          backgroundColor: "#fff",
          borderRadius: 3
        }}
      >
        <Text
          style={{
            fontFamily: "OpenSans-Regular",
            fontWeight: "400",
            color: "#3d3d3d",
            fontSize: 12,
            fontWeight: "bold"
          }}
        >
          {phrase}
        </Text>
      </View>
    );
  }

  renderLongPressPhrase() {
    console.log(this.state.formatted_address);
    if (this.state.formatted_address != "") {
      return (
        <TouchableWithoutFeedback
          onPress={() => {
            console.log(this.state);
            // this.props.navigation.navigate("ChangeFrequentTripScreen", {
            //   start_point: this.state.start_point,
            //   end_point: this.state.end_point
            // });
          }}
        >
          <View
            style={{
              position: "absolute",
              top: Dimensions.get("window").height * 0.6,
              right: Dimensions.get("window").width * 0.1,
              width: Dimensions.get("window").width * 0.8,
              height: 60,
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center",
              padding: 10,
              backgroundColor: "#fff",
              borderRadius: 3
            }}
          >
            <Text
              style={{
                fontFamily: "OpenSans-Regular",
                fontWeight: "400",
                color: "#3d3d3d",
                fontSize: 12,
                fontWeight: "bold"
              }}
            >
              {this.state.formatted_address}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      );
    }
  }

  render() {
    return (
      <View
        style={[
          StyleSheet.absoluteFillObject,
          { backgroundColor: "transparent" }
        ]}
      >
        <MapView
          ref={ref => {
            this.mapRef = ref;
          }}
          style={[
            StyleSheet.absoluteFillObject,
            {
              bottom: 0,
              flex: 1
            }
          ]}
          initialRegion={{
            latitude: this.state.user_lat,
            longitude: this.state.user_lon,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01
          }}
          loadingEnabled
          onLongPress={e => {
            this.addPoint(e.nativeEvent.coordinate, this.mapRef);

            this.setState(
              {
                user_lat: e.nativeEvent.coordinate.latitude,
                user_lon: e.nativeEvent.coordinate.longitude,
                formatted_address: ""
              },
              () => {
                this.saveJustPointsInRedux();
              }
            );
          }}
        >
          {/* {this.renderPhrase()} */}
          {this.renderCircles()}
          {this.renderPoints()}
        </MapView>
        {this.renderLongPressPhrase()}
        {this.renderAutocompleteInput()}
        {this.renderOkBtn()}
        {/* {this.renderButtons()} */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textCurrentLocation: {
    fontFamily: "OpenSans-Regular",
    color: "#3d3d3d80",
    fontSize: 13,
    fontWeight: "400",
    marginLeft: 12
  }
});

const withData = connect(state => {
  return {
    registerState: state.register
  };
});

export default withData(FrequentTripMapScreen);
