import React from "react";
import {
  View,
  Text,
  Alert,
  Dimensions,
  StyleSheet,
  ImageBackground,
  Platform,
  NativeModules,
  TouchableWithoutFeedback,
  Image,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import WavyArea from "./../../components/WavyArea/WavyArea";
import LinearGradient from "react-native-linear-gradient";
import { BoxShadow } from "react-native-shadow";
import Slider from "./../../components/Slider/Slider";
import { connect } from "react-redux";
import { updateState } from "./../../domains/register/ActionCreators";
import {
  deleteMostFrequentRoute,
  postMostFrequentRoute,
  postFrequentTripFromLateralMenu,
  getMostFrequentRoute,
  editMostFrequentRoute,
  postFrequentTrip,
} from "./../../domains/login/ActionCreators";
import Emoji from "@ardentlabs/react-native-emoji";
import Icon from "react-native-vector-icons/Ionicons";

import {
  subscribeSpecialTrainingSessions,
  checkSpecialTrainingEvent,
  getSpecialTrainingSessionSubscribed,
} from "./../../domains/trainings/ActionCreators";

import { strings } from "../../config/i18n";

class ChangeFrequentTripModalSplitScreenWithScooter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      values: [
        {
          label: "walk",
          value: 0,
        },
        {
          label: "bike",
          value: 0,
        },
        {
          label: "bus",
          value: 0,
        },
        {
          label: "train",
          value: 0,
        },
        {
          label: "car",
          value: 0,
        },
        {
          label: "scooter",
          value: 0,
        },
        {
          label: "motorbike",
          value: 0,
        },
        // {
        //   label: "car_pooling",
        //   value: 0
        // },
        
       
      ],
      selected: false,
    };
  }

  static navigationOptions = {
    header: null,
  };

  // static navigationOptions = ({ navigation }) => {
  //   return {
  //     headerTitle: (
  //       <Text
  //         style={{
  //           left: Platform.OS == "android" ? 20 : 0
  //         }}
  //       >
  //         {strings("id_0_51")}
  //       </Text>
  //     )
  //   };
  // };

  componentDidMount() {
    console.log("ChangeFrequentTripModalSplitScreen");
    console.log(this.props);
  }

  getImagePath = (label) => {
    switch (label) {
      case "walk":
        return require("../../assets/images/onboardingImage/walk_icn_onboarding.png");
      case "bike":
        return require("../../assets/images/onboardingImage/bike_icn_onboarding.png");
      case "bus":
        return require("../../assets/images/onboardingImage/bus_icn_onboarding.png");
      case "car":
        return require("../../assets/images/onboardingImage/car_icn_onboarding.png");
      case "motorbike":
        return require("../../assets/images/onboardingImage/moto_icn_onboarding.png");
      case "train":
        return require("../../assets/images/onboardingImage/trai_icn_onboarding.png");
      case "scooter": // car_pooling dal 15/02/2019 diventa train
        return require("../../assets/images/onboardingImage/scooter_icn_onboarding.png");
      default:
        return require("../../assets/images/onboardingImage/walk_icn_onboarding.png");
    }
  };

  getLabel = (label) => {
    switch (label) {
      case "walk":
        return strings("walking");
      case "bike":
        return strings("biking");
      case "bus":
        return strings("public_transpor");
      case "car":
        return strings("car");
      case "motorbike":
        return strings("motorbike");
      case "car_pooling":
        return strings("car_pooling");
      case "train":
        return strings("train");
      default:
        return strings("walking");
    }
  };

  getRenderLabel = (label) => {
    switch (label) {
      case "walk":
        return strings("id_0_151");
      case "bike":
        return strings("id_0_152");
      case "bus":
        return strings("id_0_153");
        case "train":
          return strings("id_0_154");
      case "car":
        return strings("id_0_155");
      case "motorbike":
        return strings("id_0_156");
      case "car_pooling":
        return strings("id_0_155");
        case "scooter":
          return strings("id_0_157");
          
        
      default:
        return strings("id_0_151");
    }
  };

  renderSlider() {
    return this.state.values.map((item, index) => (
      <View
        key={index}
        style={{
          flexDirection: "row",
          height: 80,
          width: Dimensions.get("window").width * 0.9,
          alignSelf: "center",
          justifyContent: "center",
        }}
      >
        <View style={{ flex: 0.3 }}>
          <Image
            style={{
              width: 60,
              height: 60,
            }}
            source={this.getImagePath(this.state.values[index].label)}
          />
        </View>
        <View style={{ flex: 0.7, marginTop: 10 }}>
          <Slider
            value={this.state.values[index].value}
            onValueChange={(value) => {
              // this.setState((prevState) => {
              //   const newValues = prevState.values;
              //   newValues[index].value = value;
                
              //   return { values: newValues };
              // });
              let tot_value = 0;
              this.state.values.forEach(el => (tot_value += el.value));

              let k = 0;
              for (let ind = 0; ind < 7; ind++) {
                // non sempre devo decrementare tutto
                if (ind != index && this.state.values[ind].value > 0) k++;
              }

              if (tot_value > 0) {
              if (tot_value > 300) {
                let v = this.state.values;
                let diff_value = 10 / k;

                for (ind = 0; ind < 7; ind++) {
                  if (ind == index) v[ind].value = value;
                  else if (v[ind].value > 0) v[ind].value -= diff_value;
                }


                this.setState({ values: v, selected: true });
              } else {
                let v = this.state.values;
                v[index].value = value;
                this.setState({ values: v, selected: true });
              }
              } else {
                let v = this.state.values;
                v[index].value = value;
                this.setState({ values: v, selected: false });
              }

              
            }}
            trackStyle={{
              backgroundColor: "#ffffff",
              height: 4,
              borderRadius: 2,
            }}
            // thumbImage={this.getImagePath(this.state.values[index].label)}
            style={{ height: 40 }}
            thumbStyle={{
              height: 26,
              width: 26,
              borderRadius: 13,
              borderWidth: 2,
              borderColor: "#FFFFFF",
            }}
            thumbTintColor={"#FAB21E"}
            minimumTrackTintColor={"#ffffff"}
            minimumValue={0}
            maximumValue={100}
            step={10}
            textRight={this.getRenderLabel(this.state.values[index].label)}
          />
        </View>
      </View>
    ));
  }


  skipScreen = () => {
    this.props.navigation.navigate('ChooseRandomAvatarScreen')
  }


  navigateToGarage = () => {
    this.props.dispatch(
      updateState({
        mostFrequentRaceModalSplit: this.state.values
      })
    );
    if (this.state.values[6].value || this.state.values[4].value || this.state.values[1].value) {
    this.props.navigation.navigate('AllGarageScreen', {
      moto_owning_answer: this.state.values[6].value > 0 ? 1 : 0,
      car_owning_answer: this.state.values[4].value > 0 ? 1 : 0,
      bike_owning_answer: this.state.values[1].value > 0 ? 1 : 0,
    })
  } else {
   
    // salta direttamente 
    this.skipScreen()
  }
   
  };

  render() {
    return (
      <LinearGradient
        start={{ x: 0.0, y: 0.0 }}
        end={{ x: 0.0, y: 1.0 }}
        locations={[0, 1.0]}
        colors={["#62357C", "#6497CC"]}
        style={{
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height,
        }}
      >
        <ImageBackground
          source={require("./../../assets/images/profile_card_bg_muver.png")}
          style={styles.backgroundImage}
        >
          <SafeAreaView style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 100 }}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.goBack(null);
                }}
              >
                <View style={{ width: 30, height: 30, marginLeft: 20 }}>
                  <Icon
                    name="md-arrow-forward"
                    size={18}
                    color="#ffffff"
                    style={{ transform: [{ rotateZ: "180deg" }] }}
                  />
                </View>
              </TouchableOpacity>
              <View style={{ padding: 10 }}>
                 <Text style={styles.title}>{strings("id_0_150")}</Text>
                </View>



              <View style={{}}>{this.renderSlider()}</View>
              <View
                style={{
                 
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    top: 50,
                  }}
                >
                  <View style={styles.buttonContainer}>
                    
                    <View>
                      <TouchableOpacity
                      disabled={!this.state.selected}
                        onPress={this.navigateToGarage}
                        style={[styles.buttonRegister, { opacity: this.state.selected ? 1 : 0.6}]}
                      >
                        <Text
                          style={{
                            // margin: 10,
                            color: "#FFFFFF",
                            fontFamily: "OpenSans-Regular",
                            fontWeight: "400",
                            fontSize: 15,
                            textAlignVertical: "center",
                            textAlign: "center",
                          }}
                        >
                         {strings("id_0_118")}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {/* <TouchableWithoutFeedback
                onPress={() => {
                  let tot_value = 0;
                  this.state.values.forEach(el => (tot_value += el.value));

                  if (tot_value >= 100) {
                    // this.props.dispatch(
                    //   deleteMostFrequentRoute(
                    //     {},
                    //     this.props.registerState.frequent_trip_id
                    //   )
                    // );
                    this.props.dispatch(
                      updateState({
                        mostFrequentRaceModalSplit: this.state.values
                      })
                    );

                    setTimeout(() => {
                      // devo capire se sto modificando una frequent trip o ne sto aggiungendo una nuova
                      const routine = this.props.navigation.getParam(
                        "routine",
                        null
                      );

                      if (this.props.registerState.frequent_trip_id) {
                        // modifica
                        this.props.dispatch(
                          editMostFrequentRoute(
                            {},
                            this.props.registerState.frequent_trip_id,
                            this.props.navigation.navigate(
                          "PersonalFrequentTripDataScreenBlur"
                        )
                          )
                        );
                        // this.props.dispatch(getMostFrequentRoute());
                        
                        // this.navigateToGarage();
                        // this.props.navigation.navigate(
                        //   "PersonalFrequentTripDataScreen"
                        // );
                      } else {
                        // aggiunta

                        this.props.dispatch(postFrequentTrip());
                        this.props.navigation.navigate(
                          "PersonalFrequentTripDataScreen"
                        );
                      }
                    }, 800);
                  } else Alert.alert(strings("id_0_10"), strings("id_0_97"));
                }}
                disabled={this.props.status === "In register" ? true : false}
              >
                <View style={[styles.buttonBox]}>
                  {this.props.status !== "In register" ? (
                    <Text style={styles.buttonGoOnText}>
                      {this.props.text ? this.props.text : strings("id_0_12")}
                    </Text>
                  ) : (
                    <ActivityIndicator size="small" color="#6497CC" />
                  )}
                </View>
              </TouchableWithoutFeedback> */}
                  </View>
                </View>
              </View>
            </ScrollView>
          </SafeAreaView>
        </ImageBackground>
      </LinearGradient>
    );
  }
}

function isEmpty(obj) {
  for (var x in obj) {
    return false;
  }
  return true;
}

const styles = StyleSheet.create({
  title: {
    fontFamily: "Montserrat-ExtraBold",
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "bold",
    textAlign: 'center'
  },
  buttonRegister: {
    width: Dimensions.get("window").width * 0.35,
    height: 44,
    borderRadius: 22,
    borderColor: "#FFFFFF",
    borderWidth: 1,

    justifyContent: "center",
    alignSelf: "center",
    alignContent: "center",
    flexDirection: "column",
    alignItems: "center",
  },
  backgroundImage: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  topOverlayWave: {
    position: "absolute",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.2,
    top: Platform.OS == "ios" ? 0 : -30,
  },
  bottomOverlayWave: {
    position: "absolute",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.2,
    top: Dimensions.get("window").height * 0.8,
  },
  textHeaderContainer: {
    marginTop: Platform.OS == "ios" ? 30 : 15,
    marginLeft: 20,
    flexDirection: "row",
    width: Dimensions.get("window").width * 0.85,
  },
  textHeader: {
    fontFamily: "OpenSans-ExtraBold",
    color: "#3d3d3d",
    fontSize: 15,
    fontWeight: "bold",
  },
  textFooterContainer: {
    padding: 5,
    width: Dimensions.get("window").width * 0.7,
    justifyContent: "center",
    alignItems: "flex-start",
    alignSelf: "flex-start",
    marginBottom: Platform.OS == "ios" ? 20 : 30,
  },
  textFooter: {
    fontFamily: "OpenSans-Regular",
    color: "#fff",
    fontSize: 12,
    fontWeight: "400",
    textAlign: "left",
  },
  buttonContainer: {
    width: Dimensions.get("window").width,
    height: 64,
    flexDirection: "row",
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  buttonBox: {
    width: Dimensions.get("window").width * 0.2,
    height: 40,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    shadowRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    elevation: 1,
  },
  buttonGoOnText: {
    color: "#3363AD",
    fontFamily: "OpenSans-Regular",
    fontSize: 14,
  },
  sliderSubText: {
    color: "#fff",
    fontFamily: "OpenSans-Regular",
    fontSize: 8,
  },
});

export const positiveData = [
  {
    value: 60,
  },
  {
    value: 40,
  },
  {
    value: 50,
  },
  {
    value: 40,
  },
  {
    value: 50,
  },
];

export const negativeData = [
  {
    value: -60,
  },
  {
    value: -40,
  },
  {
    value: -50,
  },
  {
    value: -40,
  },
  {
    value: -50,
  },
];

const withData = connect((state) => {
  return {
    registerState: state.register,
    loginState: state.login,
  };
});

export default withData(ChangeFrequentTripModalSplitScreenWithScooter);
