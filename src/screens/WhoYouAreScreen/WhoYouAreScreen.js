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
import DatePickerNew from "./../../components/DatePickerNew/DatePickerNew";
import PickerModalContentNew from "./../../components/PickerModalContentNew/PickerModalContentNew";

// tipi di scelte
const select = {
  BikeSharingChoose: [strings("id_14_04"), strings("id_14_03")],
  CarSharingChoose: [strings("id_14_04"), strings("id_14_03")],
  localTransportSubscriberChoose: ["No", "Monthly", "Annual"],
  trainTransportSubscriberChoose: ["No", "Monthly", "Annual"],
  poolingPilotChoose: [strings("id_14_04"), strings("id_14_03")],
  poolingPassengerChoose: [strings("id_14_04"), strings("id_14_03")],
  employment: [
    strings("to_fill"),
    strings("unemployed"),
    strings("student"),
    strings("employee"),
    strings("freelancer"),
    strings("entrepreneur"),
    strings("homemaker"),
  ],
  weight: Array(81)
    .fill(0)
    .map((e, i) => i + 40)
    .map((elem) => elem.toString()),
  gender: [strings("id_13_20"), strings("id_13_21"), strings("id_13_22")],
  height: Array(121)
    .fill(0)
    .map((e, i) => i + 100)
    .map((elem) => elem.toString()),
};

class WhoYouAreScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      duration: 0,
      selected: false,
      weight: "0",
      date_of_birth: "",
      gender: 0,
      height: "0",
      data: {}
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
        return require("../../assets/images/walk_ion_slider_cn.png");
      case "bike":
        return require("../../assets/images/bike_icn.png");
      case "bus":
        return require("../../assets/images/bus_icn.png");
      case "car":
        return require("../../assets/images/car_icn.png");
      case "motorbike":
        return require("../../assets/images/moto_icn.png");
      case "train":
        return require("../../assets/images/onboarding-train.png");
      case "car_pooling": // car_pooling dal 15/02/2019 diventa train
        return require("../../assets/images/carpooling_icn.png");
      default:
        return require("../../assets/images/onboarding-walk.png");
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
        return strings("walking");
      case "bike":
        return strings("bicycle");
      case "bus":
        return strings("local_public_tr");
      case "car":
        return strings("car");
      case "motorbike":
        return strings("motorbike");
      case "car_pooling":
        return strings("car_pooling");
      default:
        return strings("walking");
    }
  };

  // metodo per cambiare il parametro specificato in type con il valore value nello stato
  // salvo anche i dati da inviare cosi so che sono nuovi
  // callback, metodo per adattare il formato adatto al db
  changeState = (value, type, callback) => {
    console.log(value);
    console.log(callback);
    callback && typeof callback === "function"
      ? console.log(callback(value))
      : console.log(value);
    this.setState((prevState) => {
      return {
        [type]: value,
        data: {
          ...prevState.data,
          [type]:
            callback && typeof callback === "function"
              ? callback(value)
              : value,
        },
      };
    });
  };

  ConvertId = (value) => {
    console.log(value)
    if (value == strings("id_13_20")) {
      // maschio
      return 1;
    } else if (value == strings("id_13_21")) {
      // femmina
      return 2;
    } else if (value == strings("id_13_22")) {
      // non dico il mio sesso 
      return 3;
    } else {
      // non ho specificato
      return 0;
    }
  };

  inputText() {
    return (
      <View style={styles.paddingInput}>
        <View style={styles.inputView}>
          <Text style={styles.LeftTitle}>{strings("id_13_14")}</Text>
          <DatePickerNew
            value={
              this.state.date_of_birth
                ? this.state.date_of_birth
                : ''
            }
            type={"date_of_birth"}
            changeState={this.changeState}
            function={this.conversDate}
          />
        </View>
        <View style={styles.borderInput}></View>
      </View>
    );
  }

  inputHeight() {
    return (
      
      <View style={styles.paddingInput}>
        <View style={styles.inputView}>
          <Text style={styles.LeftTitle}>{strings("id_13_18")}</Text>
          <PickerModalContentNew
            value={this.state.height !== "0" ? this.state.height : "-"}
            type={"height"}
            changeState={this.changeState}
            listValue={select.height}
            extraValue={"cm"}
            function={parseInt}
          />
        </View>
        <View style={styles.borderInput}></View>
      </View>
    );
    }


    textCalories() {
      return (
        
        <View style={styles.paddingCalories}>
            <Text style={styles.titleCalories}>{strings("id_0_144")}</Text>
        </View>
      );
      }
    


  inputWeight() {
    return (
      <View style={styles.paddingInput}>
        <View style={styles.inputView}>
          <Text style={styles.LeftTitle}>{strings("id_13_19")}</Text>
          <PickerModalContentNew
            value={this.state.weight !== "0" ? this.state.weight : "-"}
            type={"weight"}
            changeState={this.changeState}
            listValue={select.weight}
            extraValue={"kg"}
            function={parseInt}
          />
        </View>
        <View style={styles.borderInput}></View>
      </View>
    );
  }

  inputGender() {
    return (
      <View style={styles.paddingInput}>
        <View style={styles.inputView}>
          <Text style={styles.LeftTitle}>{strings("id_13_16")}</Text>
          <PickerModalContentNew
            value={
              this.state.gender
                ? typeof this.state.gender === "number"
                  ? select.gender[this.state.gender]
                  : this.state.gender
                : "-"
            }
            type={"gender"}
            changeState={this.changeState}
            listValue={[   
              strings("id_13_20"),
              strings("id_13_21"),
              strings("id_13_22"),
            ]}
            extraValue={""}
            function={this.ConvertId}
          />
        </View>
        <View style={styles.borderInput}></View>
      </View>
    );
  }



  // da string a   03/02/2020
  conversDate = string => {
    console.log(string);
    // const date = moment(string).format('L')
    // const date = new Date(string).toISOString().substring(0, 10)

    date = new Date(string);
    year = date.getFullYear();
    month = date.getMonth() + 1;
    dt = date.getDate();

    if (dt < 10) {
      dt = "0" + dt;
    }
    if (month < 10) {
      month = "0" + month;
    }

    dateTot = year + "-" + month + "-" + dt;

    console.log(dateTot);
    return dateTot;
  };

  inputAge() {
    return (
      <View style={styles.paddingInput}>
        <View style={styles.inputView}>
          <Text style={styles.LeftTitle}>{strings("id_13_14")}</Text>
          <DatePickerNew
            value={
              this.state.date_of_birth
                ? this.state.date_of_birth
                : ''
            }
            type={"date_of_birth"}
            changeState={this.changeState}
            function={this.conversDate}
            extraValue={""}
          />
        </View>
        <View style={styles.borderInput}></View>
      </View>
    );
  }

  renderSlider() {
    return (
      <View
        style={{
          flexDirection: "column",
          paddingTop: 30,
          width: Dimensions.get("window").width * 0.9,
          alignSelf: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            flexDirection: "column",

            width: Dimensions.get("window").width * 0.9,
            alignSelf: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontFamily: "OpenSans-Regular",
              fontWeight: "400",
              fontSize: 16,
              textAlignVertical: "center",
              textAlign: "center",
            }}
          >
            {strings("id_0_145")}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "column",
            height: 80,
            width: Dimensions.get("window").width * 0.9,
            alignSelf: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              marginTop: 10,
              width: Dimensions.get("window").width * 0.9,
            }}
          >
            <Slider
              value={this.state.duration}
              onValueChange={(value) => {
                this.setState((prevState) => {
                  

                  return { duration: value };
                });
                // let tot_value = 0;
                // this.state.values.forEach(el => (tot_value += el.value));

                // let k = 0;
                // for (let ind = 0; ind < 6; ind++) {
                //   // non sempre devo decrementare tutto
                //   if (ind != index && this.state.values[ind].value > 0) k++;
                // }

                // if (tot_value > 300) {
                //   let v = this.state.values;
                //   let diff_value = 10 / k;

                //   for (ind = 0; ind < 6; ind++) {
                //     if (ind == index) v[ind].value = value;
                //     else if (v[ind].value > 0) v[ind].value -= diff_value;
                //   }

                //   this.setState({ values: v, selected: true });
                // } else {
                //   let v = this.state.values;
                //   v[index].value = value;
                //   this.setState({ values: v, selected: true });
                // }

                // tot_value = 0;
                // this.state.values.forEach(el => (tot_value += el.value));
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
              maximumValue={90}
              step={10}
              stepValue={true}
            />
          </View>
          {/* <View style={{ marginTop: 2,  width: Dimensions.get("window").width * 0.9 + 4, flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text>0</Text>
        <Text>30 min</Text>
        <Text>30 min</Text>
        <Text>90 min</Text>
        
        </View> */}
        </View>
      </View>
    );
  }

  navigateToModalSplit = () => {
    console.log()
    this.props.dispatch(
      updateState({
        duration : this.state.duration,
        weight: parseInt(this.state.weight),
      date_of_birth: this.state.data.date_of_birth ? this.state.data.date_of_birth : this.state.date_of_birth,
      gender: this.ConvertId(this.state.gender),
      height: parseInt(this.state.height),
      })
    );
    this.props.navigation.navigate('ChangeFrequentTripModalSplitScreenWithScooter')
  };


  skipScreen = () => {
    this.props.navigation.navigate('ChangeFrequentTripModalSplitScreenWithScooter')
  }

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
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{ paddingBottom: 100 }}
            >
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
                <Text style={styles.title}>{strings("id_0_143")}</Text>
              </View>

              {this.inputAge()}
              {this.inputGender()}
              {this.inputHeight()}
              {this.inputWeight()}
              {this.textCalories()}

              {this.renderSlider()}

              <View style={{}}>
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
                        disabled={!this.state.duration}
                        onPress={this.navigateToModalSplit}
                        style={[
                          styles.buttonRegister,
                          { opacity: this.state.duration ? 1 : 0.6 },
                        ]}
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
  paddingCalories: {
    paddingTop: 10,
    width: Dimensions.get("window").width * 0.85,
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  paddingInput: {
    paddingTop: 30,
    width: Dimensions.get("window").width * 0.85,
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  LeftTitle: {
    alignSelf: "center",

    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    fontSize: 16,
    color: "#FFFFFF",
  },
  titleCalories: {
    textAlign: 'left',

    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    fontSize: 11,
    color: "#FFFFFF",
  },
  inputView: {
    width: Dimensions.get("window").width * 0.85,
    height: 44,
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
  },
  borderInput: {
    width: Dimensions.get("window").width * 0.85 - 5,
    height: 1,
    backgroundColor: "#FFFFFF",
    alignSelf: "flex-end",
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
  },
  title: {
    fontFamily: "Montserrat-ExtraBold",
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "bold",
    textAlign: "center",
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
  };
});

export default withData(WhoYouAreScreen);
