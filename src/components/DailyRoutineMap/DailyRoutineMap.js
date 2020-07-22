import React from "react";
import {
  View,
  Text,
  Dimensions,
  Alert,
  TouchableWithoutFeedback,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  ScrollView
} from "react-native";
import MapView, { AnimatedRegion, Animated } from "react-native-maps";
import { connect } from "react-redux";
import { updateState } from "./../../domains/register/ActionCreators";
import { BoxShadow } from "react-native-shadow";
import InteractionManager from "../../helpers/loadingComponent";
import { Input } from "react-native-elements";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { getMostFrequentRoute } from "./../../domains/login/ActionCreators";
import { strings } from "../../config/i18n";

// import MarkerRoutine from "../MarkerRoutine/MarkerRoutine";

// componente utile per selezionare la tratta effettuata dall'utente,
// selezionando punto inziale e finale

class DailyRoutineMap extends React.Component {
  constructor() {
    super();
    this.mapRef = null;
    this.state = {
      points: [],
      type: ["Home", "Work", "Gym", "School", "Other"],
      selectType: [-1, -1],
      ButtonAndroid: -1,
      viewRef: null,
      load: false,
      street: "",
      search: false,
      searchResult: [{ formatted_address: "pippo" }],
      instructions: [
        strings("please_enter_th"),
        "Well, now tell us what place is inside the starting area.",
        "You're almost there. Enter the address for your trip destination. Again, we will only keep the outline of the surrounding area.",
        "Good job! Now specify your destination type and you're done.",
        "Your frequent trip has been set correctly. Shall we move on?"
      ]
    };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        load: true
      });
    });
  }

  componentWillUnmount() {
    this.setState({
      load: false
    });
    this.props.dispatch(getMostFrequentRoute());
  }

  componentWillMount() {
    // se l'utente avaeva gia specificato la routine la ricarico
    if (this.props.mostFrequentRaceFrequencyPosition) {
      const {
        start_type,
        end_type,
        start_point,
        end_point
      } = this.props.mostFrequentRaceFrequencyPosition;
      this.setState({
        points: [start_point, end_point],
        selectType: [start_type, end_type]
      });
      this.textDescriptionHeader("Change Routine");
    }
  }

  textDescriptionHeader = text => {
    console.log("prova");
    this.props.navigation.setParams({ title: text });
  };

  AddPoint = (position, mapRef) => {
    const key = +new Date();
    // faccio in modo di avere solo gli ultimi due punti scelti
    this.setState(previousState => {
      // soglia per evitare dei punti troppo vicini, scelti dall'utente

      const size = previousState.points.length;
      const ThresholdGPS = 0.0003;
      if (size === 0) {
        this.textDescriptionHeader("Select type start of routine");
        return {
          points: [{ ...position, key }],
          ButtonAndroid: 0
        };
      } else if (size === 1) {
        if (
          Math.abs(
            previousState.points[size - 1].latitude - position.latitude
          ) >= ThresholdGPS &&
          Math.abs(
            previousState.points[size - 1].longitude - position.longitude
          ) >= ThresholdGPS
        ) {
          // se il punto è lontano a quello precedente  viene considerato
          this.textDescriptionHeader("Select type end of routine");
          return {
            points: [previousState.points[0], { ...position, key }],
            ButtonAndroid: 1
          };
        } else {
          // se il punto è vicino a quello precedente, aggiorno quello precedente
          this.textDescriptionHeader("Select type start of routine");
          return {
            points: [{ ...position, key }],
            ButtonAndroid: 0
          };
        }
      } else if (size == 2) {
        // devo sapere quale delle due posizione devo aggiornare
        const distance1 =
          Math.abs(previousState.points[0].latitude - position.latitude) +
          Math.abs(previousState.points[0].longitude - position.longitude);
        const distance2 =
          Math.abs(previousState.points[1].latitude - position.latitude) +
          Math.abs(previousState.points[1].longitude - position.longitude);
        if (distance1 === 0 || distance2 === 0) {
          // in caso non succede nulla
          return {
            points: previousState.points
          };
        } else if (distance1 <= distance2) {
          // se il punto è piu lontano al primo, questo viene aggiornato
          this.textDescriptionHeader("Select type start of routine");
          return {
            points: [{ ...position, key }, previousState.points[1]],
            ButtonAndroid: 0
          };
        } else {
          this.textDescriptionHeader("Select type end of routine");
          return {
            points: [previousState.points[0], { ...position, key }],
            ButtonAndroid: 1
          };
        }
      }
      // in caso non succede nulla
      return {
        points: previousState.points
      };
    });
    if (this.mapRef) {
      this.mapRef.animateToCoordinate(position, 1000);
    }
  };

  SelectType = (index, view, num) => {
    console.log(index);
    console.log(num);
    console.log(view);
    this.setState(previousState => {
      // soglia per evitare dei punti troppo vicini, scelti dall'utente

      const NewType = { ...previousState };
      if (num === 0 && NewType.selectType[1] !== -1) {
        this.textDescriptionHeader("Complete, press Ok");
      } else if (num === 0) {
        this.textDescriptionHeader("Select end of routine");
      } else if (num === 1 && NewType.selectType[0] !== -1) {
        this.textDescriptionHeader("Complete, press Ok");
      } else if (num === 1 && NewType.selectType[0] === -1) {
        this.textDescriptionHeader("Select start of routine");
      }
      NewType.selectType[num] = index;
      NewType.ButtonAndroid = -1;
      return NewType;
    });
  };

  ReturnPoints = () => {
    {
      let viewRef = [null, null];
      const points = this.state.points.map((item, num) => (
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
      return points;
    }
  };

  ReturnCircles = () => {
    {
      const circles = this.state.points.map((item, num) => (
        <MapView.Circle
          key={item.key}
          center={{ latitude: item.latitude, longitude: item.longitude }}
          radius={100}
          fillColor="rgba(255, 255, 255, 0.52)"
          strokeColor="rgba(0, 0, 0, 0.33)"
          zIndex={-1}
        />
      ));
      return circles;
    }
  };

  // https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=AIzaSyAnm-A_1ER67vJa-HHTCTC5VeVfXCA3Dbo

  ConfermPoints = () => {
    if (this.state.points) {
      if (this.state.points.length === 2) {
        // ho due punti quindi posso andare avanti, salvando in redux la routine
        // i due tipi di routine si passa come prop quando si passa a questa pagina
        const mostFrequentRaceFrequencyPosition = {
          start_point: this.state.points[0],
          end_point: this.state.points[1],
          start_type:
            this.state.selectType[0] === 4 ? 0 : this.state.selectType[0] + 1,
          end_type:
            this.state.selectType[1] === 4 ? 0 : this.state.selectType[1] + 1
        };
        // se è other ovvero l'ultimo metto 0 poiche nel db hanno all'inizio other
        this.props.dispatch(updateState({ mostFrequentRaceFrequencyPosition }));
      } else {
        // dare un avviso
        Alert.alert("Scegli un altro punto");
      }
    } else {
      // dare un avviso di inserire due punti
      Alert.alert("Scegli due punti");
    }
  };

  handleStreet = text => {
    this.setState({
      street: text
    });
  };

  sendGeocoding = text => {
    axios
      .get(
        "https://maps.googleapis.com/maps/api/geocode/json?address=" +
          // this.state.street +
          text +
          "&key=AIzaSyC3cg3CWrVwdNa1ULzzlxZ-gy-4gCp080M"
      )
      .then(response => {
        // handle success
        console.log("risposta google");
        console.log(response);

        // controllo se ho ricevuto un risultato
        if (response.data.status === "OK") {
          const position = response.data.results[0].geometry.location;
          this.AddPoint({
            latitude: position.lat,
            longitude: position.lng
          });
          this.setState({
            searchResult: response.data.results
          });
        } else if (response.data.status === "ZERO_RESULTS") {
          Alert.alert("Insert a valid street");
        }

        /* console.log(position);
          const key = +new Date();
          // const position = response.data.results[0].geometry.location;

          // se ho gia inserito la prima via o il primo valore
          //
          const title = this.props.navigation.getParam(
            "title",
            "Select start of routine"
          );
          if (title === "Select start of routine") {
            this.textDescriptionHeader("Select type start of routine");
            console.log("1");

            this.setState(previousState => {
              if (previousState.points.length !== 2) {
                return {
                  points: [
                    {
                      latitude: position.lat,
                      longitude: position.lng,
                      key
                    }
                  ],
                  ButtonAndroid: 0
                };
              } else {
                return {
                  points: [
                    {
                      latitude: position.lat,
                      longitude: position.lng,
                      key
                    },
                    previousState.points[1]
                  ],
                  ButtonAndroid: 0
                };
              }
            });
          } else {
            this.textDescriptionHeader("Select type end of routine");
            console.log("2");

            this.setState(previousState => {
              return {
                points: [
                  previousState.points[0],
                  {
                    latitude: position.lat,
                    longitude: position.lng,
                    key
                  }
                ],
                ButtonAndroid: 1
              };
            });
          }

          console.log(position);
          if (this.mapRef) {
            this.mapRef.animateToCoordinate(
              {
                latitude: position.lat,
                longitude: position.lng
              },
              1000
            );
          }

        // cancello il testo nel campo
        this.setState({
          street: ""
        });
         */
      })
      .catch(function(error) {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
          return error.response;

          // if (error.response.status === 403) {
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
        // always executed

        // cancello il testo nel campo
        this.setState({
          street: ""
        })
      );
  };

  InputStreet = () => {
    if (this.state.ButtonAndroid < 0) {
      return (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0

            // borderBottomWidth: 1,
            // borderBottomColor: "#3D3D3D"
          }}
        >
          {/* 
          <Input
            returnKeyType={"search"}
            placeholder={"Insert Street"}
            value={this.state.street}
            onChangeText={text => this.handleStreet(text)}
            errorStyle={{ color: "red" }}
            errorMessage={"Street not valid"}
            leftIcon={<Icon name="ios-search" size={18} color="#3D3D3D" />}
            autoCorrect={false}
            containerStyle={{
              backgroundColor: "white",
              borderColor: "#f7f8f9",
              borderWidth: 1,
              flex: 1,
              width: Dimensions.get("window").width
            }}
            onSubmitEditing={() => {
              this.sendGeocoding();
              // this.setState({
              //   search: false
              // });
            }}
            onFocus={() => {
              this.setState({
                search: true
              });
            }}
          /> 
          */}
          <GooglePlacesAutocomplete
            placeholder={strings("text_your_addre")}
            minLength={2} // minimum length of text to search
            autoFocus={false}
            returnKeyType={"search"} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
            listViewDisplayed="auto" // true/false/undefined
            // fetchDetails={true}
            renderDescription={row => row.description} // custom description render
            onPress={(data, details = null) => {
              // 'details' is provided when fetchDetails = true
              // console.log(data, details);
              console.log(data.description);
              this.handleStreet(data.description);
              this.sendGeocoding(data.description);
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
        </View>
      );
    }
    return <View />;
  };

  // render bottoni per android in alto
  ButtonAndroid = () => {
    if (this.state.ButtonAndroid >= 0) {
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
                this.state.selectType[this.state.ButtonAndroid ? 0 : 1] !==
                index ? (
                  () =>
                    this.SelectType(
                      index,
                      this.state.viewRef,
                      this.state.ButtonAndroid
                    )
                ) : (
                  <View />
                )
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
                    // padding: 2,
                    // borderTopWidth: 0.8,
                    // borderTopColor: "#F7F8F9",
                    color:
                      this.state.selectType[
                        this.state.ButtonAndroid ? 0 : 1
                      ] === index
                        ? "grey"
                        : this.state.selectType[this.state.ButtonAndroid] ===
                          index
                        ? "blue"
                        : "#3D3D3D"
                    // fontWeight: "900"
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
  };

  newPositionFromCurrent = () => {
    const position = {
      latitude: this.props.latitude,
      longitude: this.props.longitude
    };
    this.AddPoint(position);
  };

  newPosition = elem => {
    const position = elem.geometry.location;
    this.AddPoint({
      latitude: position.lat,
      longitude: position.lng
    });
  };

  showType = (num, viewRef) => {
    console.log(num);
    console.log(viewRef);
    this.setState({
      ButtonAndroid: num,
      viewRef
    });
  };

  // quando si preme il tast ok dopo aver messo i due punti e il tipo
  OK = () => {
    // aggiunge la routine a redux che puo essere utilizzata per poi sbloccare il campo go on del pannello precedente
    this.ConfermPoints();
    this.props.changeRoutesPivot();
    this.props.navigation.goBack();
  };

  renderPhrase() {
    let phrase = this.state.instructions[0];
    switch (this.state.points.length) {
      case 0: {
        phrase = this.state.instructions[0];
        break;
      }

      case 1: {
        phrase =
          this.state.selectType[0] == -1
            ? this.state.instructions[1]
            : this.state.instructions[2];
        break;
      }
      case 2: {
        phrase =
          this.state.selectType[1] == -1
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
          top: Dimensions.get("window").height * 0.15,
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

  render() {
    let shadowOpt;
    if (Platform.OS == "ios")
      shadowOpt = {
        width: (Dimensions.get("window").width * 0.68) / 2 - 10,
        height: 40,
        color: "#555",
        border: 4,
        radius: 3,
        opacity: 0.25,
        x: 1,
        y: 1,
        style: {
          position: "absolute",
          top: 0
        }
      };
    else
      shadowOpt = {
        // width: (Dimensions.get("window").width * 0.68) / 2,
        // height: 40,
        width: 1,
        height: 1,
        color: "#444",
        border: 1,
        radius: 1,
        opacity: 0,
        x: 0,
        y: 1,
        style: {
          // position: "absolute",
          // top: 0
        }
      };
    return (
      <View style={StyleSheet.absoluteFillObject}>
        {this.state.load ? (
          this.state.search ? (
            <ScrollView
              style={[
                StyleSheet.absoluteFillObject,
                {
                  bottom: 0,
                  flex: 1,
                  backgroundColor: "#fff"
                }
              ]}
            >
              <View
                style={{
                  backgroundColor: "#fff",
                  opacity: 0
                  // borderBottomWidth: 1,
                  // borderBottomColor: "#3D3D3D"
                }}
              >
                <Input
                  returnKeyType={"search"}
                  placeholder={"Insert Street"}
                  value={this.state.street}
                  onChangeText={text => this.handleStreet(text)}
                  errorStyle={{ color: "red" }}
                  errorMessage={"Street not valid"}
                  leftIcon={
                    <Icon name="ios-search" size={18} color="#3D3D3D" />
                  }
                  autoCorrect={false}
                  containerStyle={{
                    backgroundColor: "white",
                    borderColor: "#f7f8f9",
                    borderWidth: 1
                  }}
                />
              </View>
              <TouchableOpacity
                style={{
                  flex: 1,
                  textAlign: "center"
                }}
                onPress={() => {
                  this.setState({
                    search: false
                  });

                  this.newPositionFromCurrent();
                }}
              >
                <View
                  style={{
                    height: 30,
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
                      color: "blue"
                    }}
                  >
                    Current Position
                  </Text>
                </View>
              </TouchableOpacity>

              {this.state.searchResult.map((elem, index) => {
                console.log(elem);
                return (
                  <TouchableOpacity
                    key={index}
                    style={{
                      flex: 1
                    }}
                    onPress={() => {
                      this.setState({
                        search: false
                      });
                      this.newPosition(elem);
                    }}
                  >
                    <View
                      style={{
                        height: 30,
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
                          color: "blue"
                        }}
                      >
                        {elem.formatted_address}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}

              <TouchableOpacity
                onPress={() =>
                  this.setState({
                    search: false
                  })
                }
                style={{
                  flex: 1,
                  textAlign: "center"
                }}
              >
                <View
                  style={{
                    height: 30,
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
                      color: "blue"
                    }}
                  >
                    Back to Map
                  </Text>
                </View>
              </TouchableOpacity>
            </ScrollView>
          ) : (
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
                latitude: this.props.latitude,
                longitude: this.props.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01
              }}
              loadingEnabled
              // onPress={e =>
              //   this.AddPoint(e.nativeEvent.coordinate, this.mapRef)
              // }
            >
              {this.ReturnPoints()}
              {this.ReturnCircles()}
            </MapView>
          )
        ) : (
          <View />
        )}
        {this.renderPhrase()}
        {this.ButtonAndroid()}
        {this.state.selectType[0] !== -1 && this.state.selectType[1] !== -1 ? (
          <View style={styles.buttonContainer}>
            <TouchableWithoutFeedback onPress={() => this.OK()}>
              <View>
                {/* <BoxShadow setting={shadowOpt} /> */}
                <View
                  style={[styles.buttonBox, { backgroundColor: "#87D99A" }]}
                >
                  <Text style={styles.buttonGoOnText}>Yes!</Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() => {
                this.setState({
                  points: [],
                  selectType: [-1, -1]
                });
              }}
            >
              <View>
                {/* <BoxShadow setting={shadowOpt} /> */}
                <View
                  style={[styles.buttonBox, { backgroundColor: "#FC6754" }]}
                >
                  <Text style={styles.buttonGoOnText}>Reset</Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        ) : (
          <View
            style={[
              styles.buttonContainer,
              {
                opacity: 0.4
              }
            ]}
          >
            <TouchableWithoutFeedback onPress={() => {}}>
              <View>
                {/* <BoxShadow setting={shadowOpt} /> */}
                <View
                  style={[styles.buttonBox, { backgroundColor: "#87D99A" }]}
                >
                  <Text style={styles.buttonGoOnText}>Yes!</Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() => {
                //
              }}
            >
              <View>
                {/* <BoxShadow setting={shadowOpt} /> */}
                <View
                  style={[styles.buttonBox, { backgroundColor: "#FC6754" }]}
                >
                  <Text style={styles.buttonGoOnText}>Reset</Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        )}
        {this.InputStreet()}
      </View>
    );
  }
}

const withDailyRoutine = connect(state => {
  return {
    latitude: state.register.latitude ? state.register.latitude : 38.1146969,
    longitude: state.register.longitude ? state.register.longitude : 13.3650935,
    mostFrequentRaceFrequencyPosition: state.register
      .mostFrequentRaceFrequencyPosition
      ? state.register.mostFrequentRaceFrequencyPosition
      : null
  };
});

export default withDailyRoutine(DailyRoutineMap);

const styles = StyleSheet.create({
  paginationDots: {
    height: 16,
    margin: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4
  },
  leftButtonContainer: {
    position: "absolute",
    left: 0
  },
  rightButtonContainer: {
    position: "absolute",
    right: 0
  },
  bottomButtonContainer: {
    height: 44,
    marginHorizontal: 16
  },
  bottomButton: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, .3)",
    alignItems: "center",
    justifyContent: "center"
  },
  buttonText: {
    backgroundColor: "transparent",
    color: "white",
    fontSize: 18,
    padding: 16
  },
  buttonContainer: {
    width: Dimensions.get("window").width,
    height: 60,
    backgroundColor: "transparent",
    position: "absolute",
    top: Dimensions.get("window").height * 0.7,
    justifyContent: "center",
    alignItems: "flex-start",
    shadowRadius: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    flexDirection: "row"
  },
  buttonBox: {
    width: (Dimensions.get("window").width * 0.68) / 2 - 10,
    height: 40,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 3,
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 3 },
    marginHorizontal: 6
  },
  buttonGoOnText: {
    // color: "#3363AD",
    color: "#fff",
    fontFamily: "OpenSans-Regular",
    fontSize: 12
  }
});
