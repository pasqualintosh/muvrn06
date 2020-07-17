/**
 * scena per il riassunto dei dati dell'utente
 * @author push
 */

import React from "react";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
  Platform,
  TouchableOpacity,
  TouchableHighlight,
  Alert
} from "react-native";

import { connect } from "react-redux";
import { Tester } from "./../../config/Tester";
import {
  postMostFrequentRouteNotSave,
  UpdateProfile,
  deleteMostFrequentRoute,
  getMostFrequentRoute
} from "./../../domains/login/ActionCreators";
import Icon from "react-native-vector-icons/Ionicons";
import Svg, {
  Circle,
  LinearGradient,
  Line,
  Defs,
  Stop
} from "react-native-svg";
import OwnIcon from "./../../components/OwnIcon/OwnIcon";

import { strings } from "../../config/i18n";

const type = [
  strings("other"),
  strings("home"),
  strings("work"),
  strings("gym"),
  strings("school_universi"),
  strings("work__2"),
  strings("mom_dad"),
  strings("grandma_grandpa"),
  strings("girlfriend_boyf"),
  strings("kids__school"),
  strings("friend_s_place"),
  strings("supermarket"),
  strings("bar_restaurant"),
  strings("cinema_theater")
];

class PersonalFrequentTripDataScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      isModalVisible: false,
      isModalVisibleWeight: false,
      load: true,
      data: {}
    };
  }

  componentWillMount() {
    // setTimeout(() => {
    //   if (this.props.routine.length == 0) {
    //     this.props.navigation.navigate("ChangeFrequentTripScreen");
    //     return 1;
    //   }
    // }, 1000);
  }

  componentDidMount() {
    // chiedo i dati delle routine al db
    this.props.dispatch(getMostFrequentRoute());
    // carico eventuali routine ancora non salvate nel db
    this.props.dispatch(postMostFrequentRouteNotSave());

    const { infoProfile, infoProfileNotSave } = this.props.user;

    const info = { ...infoProfile, ...infoProfileNotSave };

    this.setState({
      data: { ...infoProfileNotSave }
    });
  }

  componentWillUnmount() {
    console.log("aggiornamento dati ");
    this.sendNewChange();
  }

  // metodo per cambiare il parametro specificato in type con il valore value nello stato
  // salvo anche i dati da inviare cosi so che sono nuovi
  // callback, metodo per adattare il formato adatto al db
  changeState = (value, type, callback) => {
    console.log(value);
    console.log(callback);
    callback && typeof callback === "function"
      ? console.log(callback(value))
      : console.log(value);
    this.setState(prevState => {
      return {
        [type]: value,
        data: {
          ...prevState.data,
          [type]:
            callback && typeof callback === "function" ? callback(value) : value
        }
      };
    });
  };

  // manda al db le nuove modifiche fatte alle info dell'utente
  sendNewChange = () => {
    if (this.props.user.infoProfile) {
      if (Object.keys(this.state.data).length) {
        this.props.dispatch(
          UpdateProfile({
            data: {
              ...this.state.data
            }
          })
        );

        this.setState({
          data: {}
        });
      }
    }
  };

  goToDetailFrequentRoutine = elem => {
    this.props.navigation.navigate("FrequentRoutineMapDetail", {
      routine: elem
    });
  };

  addFrequent() {
    return (
      <View
        style={{
          width: 18,
          height: 18,
          borderRadius: 15
        }}
      >
        <TouchableHighlight
          style={{
            backgroundColor: "#fff",
            height: 18,
            width: 18,
            borderRadius: 15,
            alignItems: "center",
            shadowRadius: 5,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.5,
            elevation: 2,
            justifyContent: "center",
            alignItems: "center"
          }}
          onPress={() => {
            this.props.navigation.navigate("ChangeFrequentTripScreen");
          }}
        >
          {/* <Svg height="18" width="18" viewBox="0 0 100 100" fill="white">
            <Line
              x1="50"
              y1="25"
              x2="50"
              y2="75"
              stroke="white"
              strokeWidth="2"
            />
            <Line
              x1="25"
              y1="50"
              x2="75"
              y2="50"
              stroke="white"
              strokeWidth="2"
            />
          </Svg> */}

          <OwnIcon name="add_icn" size={18} color="#6CBA7E" />
        </TouchableHighlight>
      </View>
    );
  }

  renderDeleteBtn(index, id) {
    const numFrequentTrips = this.props.routine.length;
    // al momento il tasto x non c'e
    if (numFrequentTrips > 1)
      return (
        <View
          style={{
            width: 18,
            height: 18,
            borderRadius: 15
          }}
        >
          <TouchableHighlight
            style={{
              backgroundColor: "#fff",
              height: 18,
              width: 18,
              borderRadius: 15,
              alignItems: "center",
              shadowRadius: 5,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.5,
              elevation: 2,
              justifyContent: "center",
              alignItems: "center"
            }}
            onPress={() => {
              Alert.alert(
                strings("frequent_trip"),
                strings("delete_this_fre"),
                [
                  {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                  },
                  {
                    text: strings("ok").toLocaleUpperCase(),
                    onPress: () =>
                      this.props.dispatch(deleteMostFrequentRoute({}, id))
                  }
                ],
                { cancelable: false }
              );
            }}
          >
            <OwnIcon name="delete_icn" size={18} color="#FC6754" />
            {/* <Svg height="18" width="18" viewBox="0 0 100 100" fill="white">
              <Line
                x1="30"
                y1="30"
                x2="70"
                y2="70"
                stroke="white"
                strokeWidth="2"
              />
              <Line
                x1="70"
                y1="30"
                x2="30"
                y2="70"
                stroke="white"
                strokeWidth="2"
              />
            </Svg> */}
          </TouchableHighlight>
        </View>
      );
    else
      return (
        <View
          style={{
            width: 18,
            height: 18,
            backgroundColor: "transparent",
            justifyContent: "center",
            alignItems: "center",
            right: -5,
            borderRadius: 1,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 0.01 },
            shadowOpacity: 0.2
          }}
        />
      );
  }

  render() {
    console.log("object");
    console.log(this.props.routine);
    return (
      <View
        style={{
          backgroundColor: "#fff"
        }}
      >
        <ScrollView
          style={{
            backgroundColor: "#fff",
            height: Dimensions.get("window").height,
            width: Dimensions.get("window").width
          }}
        >
          <View
            style={{
              width: Dimensions.get("window").width,
              flexDirection: "row",
              marginBottom: 5,
              borderBottomColor: "#5F5F5F90",
              borderBottomWidth: 0.3,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <View
              // onPress={() => this.goToDetailFrequentRoutine(elem)}
              style={{
                height: 80,
                width: Dimensions.get("window").width * 0.7,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "center"
                // marginTop: 20
              }}
            >
              <Svg height="40" width="40">
                <Defs>
                  <LinearGradient id="grad" x1="0" y1="0" x2="10" y2="0">
                    <Stop offset="0" stopColor="#7D4D99" stopOpacity="1" />
                    <Stop offset="1" stopColor="#6497CC" stopOpacity="1" />
                  </LinearGradient>
                  <LinearGradient id="grad2" x1="0" y1="0" x2="10" y2="0">
                    <Stop offset="0" stopColor="#E82F73" stopOpacity="1" />
                    <Stop offset="1" stopColor="#F49658" stopOpacity="1" />
                  </LinearGradient>
                </Defs>
                <Circle cx="5" cy="5" r="5" fill="url(#grad)" />
                <Line
                  x1="5"
                  y1="11"
                  x2="5"
                  y2="15"
                  stroke="#3D3D3D"
                  strokeWidth="1"
                />
                <Line
                  x1="5"
                  y1="17"
                  x2="5"
                  y2="21"
                  stroke="#3D3D3D"
                  strokeWidth="1"
                />
                <Line
                  x1="5"
                  y1="23"
                  x2="5"
                  y2="27"
                  stroke="#3D3D3D"
                  strokeWidth="1"
                />
                <Circle cx="5" cy="33" r="5" fill="url(#grad2)" />
              </Svg>
              <View
                style={{
                  marginHorizontal: 18,
                  // flexDirection: "row",
                  alignItems: "flex-start",
                  justifyContent: "center"
                }}
              >
                <Text
                  style={[styles.mfrText, { fontSize: 11, textAlign: "left" }]}
                >
                  {strings("the_most_freque")}
                </Text>
                <Text
                  style={[
                    styles.mfrText,
                    { fontWeight: "400", fontSize: 11, textAlign: "left" }
                  ]}
                >
                  {strings("to_know_the_env")}
                </Text>
              </View>
            </View>
          </View>

          {this.state.load ? (
            this.props.routine.map((elem, index) => (
              <View
                key={elem.id}
                style={{
                  flexDirection: "row",
                  borderRadius: 4,
                  marginTop: 7,
                  justifyContent: "space-around",
                  alignItems: "center",
                  height: Dimensions.get("window").height * 0.1,
                  borderBottomColor: "#5F5F5F",
                  borderBottomWidth: 0.3
                }}
              >
                <View
                  onPress={() => this.goToDetailFrequentRoutine(elem)}
                  style={{
                    height: 40,
                    width: Dimensions.get("window").width * 0.65,
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center"
                  }}
                >
                  <TouchableOpacity
                    onPress={() => this.goToDetailFrequentRoutine(elem)}
                    style={{
                      marginHorizontal: 0,
                      flexDirection: "row",
                      alignItems: "center"
                    }}
                  >
                    {/* <Svg height="40" width="40">
                      <Defs>
                        <LinearGradient id="grad" x1="0" y1="0" x2="10" y2="0">
                          <Stop
                            offset="0"
                            stopColor="#7D4D99"
                            stopOpacity="1"
                          />
                          <Stop
                            offset="1"
                            stopColor="#6497CC"
                            stopOpacity="1"
                          />
                        </LinearGradient>
                        <LinearGradient id="grad2" x1="0" y1="0" x2="10" y2="0">
                          <Stop
                            offset="0"
                            stopColor="#E82F73"
                            stopOpacity="1"
                          />
                          <Stop
                            offset="1"
                            stopColor="#F49658"
                            stopOpacity="1"
                          />
                        </LinearGradient>
                      </Defs>
                      <Circle cx="5" cy="5" r="5" fill="url(#grad)" />
                      <Line
                        x1="5"
                        y1="11"
                        x2="5"
                        y2="15"
                        stroke="#3D3D3D"
                        strokeWidth="1"
                      />
                      <Line
                        x1="5"
                        y1="17"
                        x2="5"
                        y2="21"
                        stroke="#3D3D3D"
                        strokeWidth="1"
                      />
                      <Line
                        x1="5"
                        y1="23"
                        x2="5"
                        y2="27"
                        stroke="#3D3D3D"
                        strokeWidth="1"
                      />
                      <Circle cx="5" cy="33" r="5" fill="url(#grad2)" />
                    </Svg> */}
                    <View
                      style={{
                        marginHorizontal: 0,
                        flexDirection: "row",
                        alignItems: "center"
                      }}
                    >
                      <Text style={styles.mfrText}>
                        {type[elem.start_type]}
                      </Text>
                      <View
                        style={{
                          width: 40,
                          flexDirection: "row",
                          justifyContent: "space-around",
                          alignItems: "center"
                        }}
                      >
                        <Text style={styles.mfrText}>{"<"}</Text>
                        <Text style={styles.mfrText}>{">"}</Text>
                      </View>
                      <Text style={styles.mfrText}>{type[elem.end_type]}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                {this.renderDeleteBtn(index, elem.id)}
                {/* 
                  <View
                    style={{
                      width: 18,
                      height: 18,
                      backgroundColor: "#FC6754",
                      justifyContent: "center",
                      alignItems: "center",
                      right: -5,
                      borderRadius: 1,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 0.01 },
                      shadowOpacity: 0.2
                    }}
                  >
                    <Text style={styles.iconText}>x</Text>
                  </View> 
                  */}
              </View>
            ))
          ) : (
            <View />
          )}
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate("ChangeFrequentTripScreen");
            }}
          >
            <View
              style={{
                flexDirection: "row",
                borderRadius: 4,
                marginTop: 7,
                justifyContent: "space-around",
                alignItems: "center",
                height: Dimensions.get("window").height * 0.1
                // borderBottomColor: "#5F5F5F",
                // borderBottomWidth: 0.3
              }}
            >
              <View
                style={{
                  height: 40,
                  width: Dimensions.get("window").width * 0.65,
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center"
                }}
              >
                <View
                  style={{
                    marginHorizontal: 0,
                    flexDirection: "row",
                    alignItems: "center"
                  }}
                >
                  {/* <Svg height="40" width="40">
                  <Defs>
                    <LinearGradient id="grad" x1="0" y1="0" x2="10" y2="0">
                      <Stop offset="0" stopColor="#7D4D99" stopOpacity="1" />
                      <Stop offset="1" stopColor="#6497CC" stopOpacity="1" />
                    </LinearGradient>
                    <LinearGradient id="grad2" x1="0" y1="0" x2="10" y2="0">
                      <Stop offset="0" stopColor="#E82F73" stopOpacity="1" />
                      <Stop offset="1" stopColor="#F49658" stopOpacity="1" />
                    </LinearGradient>
                  </Defs>
                  <Circle cx="5" cy="5" r="5" fill="url(#grad)" />
                  <Line
                    x1="5"
                    y1="11"
                    x2="5"
                    y2="15"
                    stroke="#3D3D3D"
                    strokeWidth="1"
                  />
                  <Line
                    x1="5"
                    y1="17"
                    x2="5"
                    y2="21"
                    stroke="#3D3D3D"
                    strokeWidth="1"
                  />
                  <Line
                    x1="5"
                    y1="23"
                    x2="5"
                    y2="27"
                    stroke="#3D3D3D"
                    strokeWidth="1"
                  />
                  <Circle cx="5" cy="33" r="5" fill="url(#grad2)" />
                </Svg> */}
                  <Icon name="ios-arrow-forward" size={15} color="#3D3D3D" />
                  <View
                    style={{
                      marginHorizontal: 18,
                      flexDirection: "row",
                      alignItems: "center"
                    }}
                  >
                    <Text
                      style={[
                        styles.mfrText,
                        {
                          borderBottomColor: "#3D3D3D",
                          borderBottomWidth: 1
                          // textDecorationLine:
                          //   Platform.OS == "ios" ? "underline" : ""
                        }
                      ]}
                    >
                      {strings("add_a_new_frequ")}
                    </Text>
                  </View>
                </View>
              </View>
              {this.addFrequent()}
              {/* 
                  <View
                    style={{
                      width: 18,
                      height: 18,
                      backgroundColor: "#FC6754",
                      justifyContent: "center",
                      alignItems: "center",
                      right: -5,
                      borderRadius: 1,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 0.01 },
                      shadowOpacity: 0.2
                    }}
                  >
                    <Text style={styles.iconText}>x</Text>
                  </View> 
                  */}
            </View>
          </TouchableOpacity>
          {/* {this.state.load
            ? this.props.routineNotSave.map((elem, index) => (
                <View
                  key={index + this.props.routine.length}
                  style={{
                    height: 40,
                    flexDirection: "row",
                    borderRadius: 4,
                    marginTop: 7,
                    justifyContent: "space-around",
                    alignItems: "center"
                  }}
                >
                  <View
                    style={{
                      height: 40,
                      width: Dimensions.get("window").width * 0.6,
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center"
                    }}
                  >
                    <View
                      style={{
                        marginHorizontal: 12,
                        flexDirection: "row",
                        alignItems: "center"
                      }}
                    >
                      <Svg height="40" width="40">
                        <Defs>
                          <LinearGradient
                            id="grad"
                            x1="0"
                            y1="0"
                            x2="10"
                            y2="0"
                          >
                            <Stop
                              offset="0"
                              stopColor="#7D4D99"
                              stopOpacity="1"
                            />
                            <Stop
                              offset="1"
                              stopColor="#6497CC"
                              stopOpacity="1"
                            />
                          </LinearGradient>
                          <LinearGradient
                            id="grad2"
                            x1="0"
                            y1="0"
                            x2="10"
                            y2="0"
                          >
                            <Stop
                              offset="0"
                              stopColor="#E82F73"
                              stopOpacity="1"
                            />
                            <Stop
                              offset="1"
                              stopColor="#F49658"
                              stopOpacity="1"
                            />
                          </LinearGradient>
                        </Defs>
                        <Circle cx="5" cy="5" r="5" fill="url(#grad)" />
                        <Line
                          x1="5"
                          y1="11"
                          x2="5"
                          y2="15"
                          stroke="#3D3D3D"
                          strokeWidth="1"
                        />
                        <Line
                          x1="5"
                          y1="17"
                          x2="5"
                          y2="21"
                          stroke="#3D3D3D"
                          strokeWidth="1"
                        />
                        <Line
                          x1="5"
                          y1="23"
                          x2="5"
                          y2="27"
                          stroke="#3D3D3D"
                          strokeWidth="1"
                        />
                        <Circle cx="5" cy="33" r="5" fill="url(#grad2)" />
                      </Svg>
                      <View
                        style={{
                          marginHorizontal: 18,
                          flexDirection: "row",
                          alignItems: "center"
                        }}
                      >
                        <Text style={styles.mfrText}>
                          {type[elem.start_type]}
                        </Text>
                        <View
                          style={{
                            width: 40,
                            flexDirection: "row",
                            justifyContent: "space-around",
                            alignItems: "center"
                          }}
                        >
                          <Text style={styles.mfrText}>{"<"}</Text>
                          <Text style={styles.mfrText}>{">"}</Text>
                        </View>
                        <Text style={styles.mfrText}>
                          {type[elem.end_type]}
                        </Text>
                      </View>
                    </View>
                  </View>
                  {/*
                  <View
                  style={{
                    width: 18,
                    height: 18,
                    backgroundColor: "#87D99A",
                    justifyContent: "center",
                    alignItems: "center",
                    alignContent: "center",
                    right: 7,
                    borderRadius: 1,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 0.01 },
                    shadowOpacity: 0.2,
                    flexDirection: "column"
                  }}
                >
                  <Text style={styles.iconText}>x</Text>
                </View>
                //
                </View>
              ))
            : <View />} */}
          <View style={{ height: 300 }} />
        </ScrollView>
      </View>
    );
  }
}

const withData = connect(state => {
  // prendo solo le routine
  return {
    routine: state.login.mostFrequentRoute ? state.login.mostFrequentRoute : [],
    routineNotSave: state.login.mfr_modal_split_NotSave
      ? state.login.mfr_modal_split_NotSave
      : [],
    user: state.login,
    infoProfile: state.login.infoProfile,
    points:
      state.statistics.statistics === []
        ? 0
        : state.statistics.statistics.reduce((total, elem, index, array) => {
            return total + elem.points;
          }, 0)
  };
});

export default withData(PersonalFrequentTripDataScreen);

const styles = StyleSheet.create({
  first: {
    flex: 1,
    height:
      Dimensions.get("window").height * 0.1 > 100
        ? Dimensions.get("window").height * 0.1
        : 100,
    flexDirection: "row",
    borderTopColor: "#5F5F5F",
    borderTopWidth: 0.3,
    backgroundColor: "#fff"
  },
  other: {
    flex: 1,
    height: Dimensions.get("window").height * 0.1,
    flexDirection: "row",
    borderTopColor: "#5F5F5F",
    borderTopWidth: 0.3,
    backgroundColor: "#fff",
    justifyContent: "space-between",
    alignItems: "center"
  },
  last: {
    flex: 1,
    height: Dimensions.get("window").height * 0.1,
    flexDirection: "row",
    borderTopColor: "#5F5F5F",
    borderTopWidth: 0.3
  },
  LeftFrequentRoute: {
    fontSize: 15,
    fontWeight: "bold"
  },
  Left: {
    alignSelf: "center",
    textAlignVertical: "center",
    flex: 1,
    fontSize: 15,
    fontWeight: "bold",
    left: 20,
    fontFamily: "OpenSans-Bold",
    color: "#3D3D3D"
  },
  Right: {
    marginHorizontal: 7,
    fontSize: 13,
    fontWeight: "400",
    fontFamily: "OpenSans-Regular",
    color: "#3D3D3D"
  },
  RightAndroid: {
    alignSelf: "center",
    right: 10
  },
  RightText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    fontSize: 13,
    color: "#3D3D3D"
  },
  centerTextContainer: {
    position: "absolute",
    top: Dimensions.get("window").height * 0.1 + 190
  },
  centerValue: {
    fontFamily: "Montserrat-ExtraBold",
    color: "#3F3F3F",
    fontSize: 37,
    textAlign: "center",
    textAlignVertical: "center"
  },
  centerTextParam: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#9D9B9C",
    fontSize: 9,
    fontWeight: "bold"
  },
  iconText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#fff",
    fontSize: 10,
    textAlignVertical: "center"
  },
  mfrText: {
    fontFamily: "OpenSans-Bold",
    marginRight: 0,
    fontWeight: "bold",
    color: "#3D3D3D",
    fontSize: 12,
    textAlign: "center"
  },
  modalContent: {
    backgroundColor: "white",
    padding: 22,

    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  modalContentAndroid: {
    width: 120,
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  button: {
    backgroundColor: "lightblue",
    padding: 12,
    margin: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  }
});
