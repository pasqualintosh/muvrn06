import React from "react";
import { Dimensions } from "react-native";
import AppIntroSlider from "./../../components/AppIntroSlider/AppIntroSlider";
import CustomSurveySlide from "./../../components/CustomSurveySlide/CustomSurveySlide";
import BackgroundGeolocation from './../../helpers/geolocation';
import { connect } from "react-redux";

import { strings } from "../../config/i18n";

const slides = [
  {
    key: (+new Date() + 0).toString(),
    title: "What athlete are you?",
    titleIcon: true,
    icons: [
      "bike",
      "weight_lifter",
      "swimmer",
      "football",
      "basketball",
      "golfer"
    ],
    text:
      "The component is also super customizable, so you can adapt it to cover your needs and wants.",
    colors: ["#7d4d99", "#6497cc"],
    image: true,
    imageSource: require("../../assets/images/bike-icon.png"),
    avatarsList: true
  },
  {
    key: (+new Date() + 1).toString(),
    title: "What's your style?",
    titleIcon: true,
    icons: ["fire", "bus", "bike", "car"],
    text:
      "The component is also super customizable, so you can adapt it to cover your needs and wants.",
    colors: ["#7d4d99", "#6497cc"],
    selectable: true,
    startLabel: "Usually",
    endLabel: "Often",
    image: true,
    imageSource: require("../../assets/images/bike-icon.png")
  },
  {
    key: (+new Date() + 2).toString(),
    title: "What’s your daily most frequent race?",
    titleIcon: true,
    icons: ["calendar"],
    text: "",
    colors: ["#7d4d99", "#6497cc"],
    mostFrequentRace: true,
    startLabel: "Usually",
    endLabel: "Often",
    image: true,
    imageSource: require("../../assets/images/bike-icon.png")
  },
  {
    key: (+new Date() + 4).toString(),
    title: "Do you have a car?",
    titleIcon: false,
    icons: [],
    text: "",
    mobilityHabitsCar: true,
    colors: ["#7d4d99", "#6497cc"]
  },
  {
    key: (+new Date() + 4).toString(),
    title: "Do you have a moto?",
    titleIcon: false,
    icons: [],
    text: "",
    mobilityHabitsMoto: true,
    colors: ["#7d4d99", "#6497cc"]
  },
  {
    key: (+new Date() + 5).toString(),
    title: "Now You are ready to play.",
    titleIcon: true,
    icons: ["fire", "bus", "bike", "car"],
    text: "",
    colors: ["#7d4d99", "#6497cc"],
    userData: true
  },
  {
    key: (+new Date() + 6).toString(),
    title: "Select your team.",
    titleIcon: true,
    icons: ["fire", "bus", "bike", "car"],
    text: "",
    colors: ["#7d4d99", "#6497cc"],
    selectCity: true
  },
  {
    key: (+new Date() + 7).toString(),
    title: "START MOVE",
    text:
      "Invite your friends to join the MUVement and train for the ”International City Tournament”",
    colors: ["#7d4d99", "#6497cc"],
    endSurveySlide: true
  }
];

class SurveyScreens extends React.Component {
  static navigationOptions = {
    header: null
  };

  RegisterClose = () => {
    this.props.navigation.navigate("Home");
  };
  _renderItem = props => {
    return (
      <CustomSurveySlide
        {...props}
        {...this.props}
        RegisterClose={this.RegisterClose}
      />
    );
  };

  // quando finisco l'iscrizione non mi serve piu i gps attivo per avere la routine o la citta piu vicina
  componentWillUnmount() {
    BackgroundGeolocation.stop();
  }
  render() {
    return (
      <AppIntroSlider
        slides={slides}
        renderItem={this._renderItem}
        nextLabel={strings("go_on")}
        paginationContainer={{
          position: "absolute",
          bottom: 0,
          height: 40
        }}
        endSurveySlideButton={true}
        endSurveySlideNumber={5}
        goOnButton={false}
        goOnButtonStyle={{
          position: "absolute",
          top: Dimensions.get("window").height * 0.7 + 120
        }}
        notSwipe={true}
        bottomButton={false}
        {...this.props}
      />
    );
  }
}

const withRegister = connect(state => {
  return {
    registerState: state.register
  };
});

export default withRegister(SurveyScreens);
