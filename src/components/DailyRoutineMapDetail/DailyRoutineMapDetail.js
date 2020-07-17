import React from "react";
import {
  View,
  Text,
  Dimensions,
  Alert,
  TouchableWithoutFeedback,
  StyleSheet,
  Image,
  Platform
} from "react-native";
import MapView, { AnimatedRegion, Animated } from "react-native-maps";
import { connect } from "react-redux";
import { updateState } from "./../../domains/register/ActionCreators";
import { BoxShadow } from "react-native-shadow";
import InteractionManager from "../../helpers/loadingComponent";

// import MarkerRoutine from "../MarkerRoutine/MarkerRoutine";

// componente utile per selezionare la tratta effettuata dall'utente,
// selezionando punto inziale e finale

class DailyRoutineMapDetail extends React.Component {
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
      visible: true
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
  }

  componentWillMount() {
    const { navigation } = this.props;
    const routine = navigation.getParam("routine", []);

    const { start_type, end_type, start_point, end_point } = routine;
    this.setState({
      points: [start_point, end_point],
      selectType: [start_type, end_type]
    });
  }

  ReturnPoints = () => {
    {
      const points = this.state.points.map((item, num) => (
        <MapView.Marker
          calloutVisible={true}
          onCalloutVisibleChange={visible => this.setState({ visible })}
          title={this.state.type[this.state.selectType[num] - 1]}
          key={item.key}
          coordinate={{
            latitude: item.coordinates[1],
            longitude: item.coordinates[0]
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
          center={{
            latitude: item.coordinates[1],
            longitude: item.coordinates[0]
          }}
          radius={100}
          fillColor="rgba(255, 255, 255, 0.52)"
          strokeColor="rgba(0, 0, 0, 0.33)"
          zIndex={-1}
        />
      ));
      return circles;
    }
  };

  static navigationOptions = ({ navigation }) => {
    return {
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
  };

  render() {
    let MaxLatitude = Math.max.apply(null, [
      this.state.points[0].coordinates[1],
      this.state.points[1].coordinates[1]
    ]);
    let MaxLongitude = Math.max.apply(null, [
      this.state.points[0].coordinates[0],
      this.state.points[1].coordinates[0]
    ]);
    let MinLatitude = Math.min.apply(null, [
      this.state.points[0].coordinates[1],
      this.state.points[1].coordinates[1]
    ]);
    let MinLongitude = Math.min.apply(null, [
      this.state.points[0].coordinates[0],
      this.state.points[1].coordinates[0]
    ]);

    let shadowOpt;
    if (Platform.OS == "ios")
      shadowOpt = {
        width: Dimensions.get("window").width * 0.68,
        height: 40,
        color: "#555",
        border: 8,
        radius: 5,
        opacity: 0.25,
        x: 0,
        y: 1,
        style: {
          position: "absolute",
          top: 0
        }
      };
    else
      shadowOpt = {
        width: Dimensions.get("window").width * 0.68,
        height: 40,
        color: "#444",
        border: 6,
        radius: 5,
        opacity: 0.35,
        x: 0,
        y: 1,
        style: {
          position: "absolute",
          top: 0
        }
      };
    return (
      <View style={StyleSheet.absoluteFillObject}>
        {this.state.load ? (
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
            onMapReady={() =>
              this.mapRef.fitToCoordinates(
                [
                  {
                    latitude: MinLatitude - 0.001,
                    longitude: MinLongitude - 0.001
                  },
                  {
                    latitude: MaxLatitude + 0.001,
                    longitude: MaxLongitude + 0.001
                  }
                ],
                {
                  edgePadding: { top: 40, right: 20, bottom: 80, left: 20 },
                  animated: false
                }
              )
            }
            loadingEnabled
          >
            {this.ReturnPoints()}
            {this.ReturnCircles()}
          </MapView>
        ) : (
            <View />
          )}
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

export default withDailyRoutine(DailyRoutineMapDetail);

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
    bottom:
      Dimensions.get("window").height -
      Dimensions.get("window").height * 0.7 -
      160,
    justifyContent: "flex-start",
    alignItems: "center",
    shadowRadius: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5
  },
  buttonBox: {
    width: Dimensions.get("window").width * 0.68,
    height: 40,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 3,
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 3 }
  },
  buttonGoOnText: {
    color: "#3363AD",
    fontFamily: "OpenSans-Regular",
    fontSize: 14
  }
});
