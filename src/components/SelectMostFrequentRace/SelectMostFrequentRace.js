import React from "react";
import { View, Text, Dimensions, TouchableWithoutFeedback } from "react-native";
import { styles } from "./Style";
import RoutineDayInWeek from "./../RoutineDayInWeek/RoutineDayInWeek";
import Svg, {
  G,
  Image,
  Circle,
  LinearGradient,
  Line,
  Defs,
  Stop
} from "react-native-svg";
import Icon from "react-native-vector-icons/Ionicons";

class SelectMostFrequentRace extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mapViewVisible: false
    };
  }

  render() {
    let chooseTxt = "";
    if (this.props.mostFrequentRaceFrequencyPosition == undefined)
      chooseTxt = "Choose your trip";
    else chooseTxt = "Change your trip";
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "center"
        }}
      >
        <View style={styles.chooseMfrContainer}>
          <TouchableWithoutFeedback
            onPress={() => {
              this.props.navigation.navigate("SelectMostFrequentRoutePoint", {
                changeRoutesPivot: () =>
                  this.props.changeRoutesPivot
                    ? this.props.changeRoutesPivot()
                    : null
              });
            }}
          >
            <View
              style={{
                width: Dimensions.get("window").width * 0.4,
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
                alignSelf: "center"
              }}
            >
              {/* 
              <View
                style={{ width: 12, height: 32, backgroundColor: "#5FC4E2" }}
              /> 
              */}
              <View
                style={{
                  marginLeft: 6
                }}
              >
                <Svg height="28" width="18">
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
                  <Circle cx="5" cy="7" r="3" fill="url(#grad)" />
                  <Circle cx="5" cy="22" r="3" fill="url(#grad2)" />
                </Svg>
              </View>
              <Text style={styles.headerText}>{chooseTxt}</Text>
              <View
                style={{
                  width: 16,
                  height: 16,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Icon
                  style={{ marginTop: 5 }}
                  name="ios-arrow-forward"
                  size={26}
                  color="#3D3D3D"
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.frequencyContainer}>
          <RoutineDayInWeek
            handleFrequencyChange={this.props.handleFrequencyChange}
            DaysChoose={this.props.DaysChoose}
          />
        </View>
      </View>
    );
  }
}

export default SelectMostFrequentRace;
