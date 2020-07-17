import React from "react";
import {
  Platform,
  Dimensions,
  ImageBackground,
  View,
  StatusBar
} from "react-native";
import AppIntroSlider from "./../../components/AppIntroSlider/AppIntroSlider";
import CustomSlide from "./../../components/CustomSlide/CustomSlide";
import EndWelcomeSlide from "./../../components/EndWelcomeSlide/EndWelcomeSlide";
import { styles, areUReadyCurve } from "./Style";
import Aux from "./../../helpers/Aux";

import Settings from "./../../config/Settings";
import DeviceInfo from "react-native-device-info";
// import { Analytics, Hits as GAHits } from "react-native-google-analytics";

import { strings } from "../../config/i18n";

const slides = [
  // {
  //   key: (+new Date() + 0).toString(),
  //   imageSource: require("../../assets/images/boombox.png"),
  //   renderWelcomeSlide: true
  // },
  // {
  //   key: (+new Date() + 1).toString(),
  //   title: strings("urban_mobility_"),
  //   subTitle: strings("if_every_day_yo"),
  //   footerTitle: "",
  //   colors: ["#7d4d99", "#6497cc"],
  //   image: true,
  //   imageSource: require("../../assets/images/streching.png"),
  //   curve: areUReadyCurve,
  //   renderWelcomeSlide: true
  // },
  {
    key: (+new Date() + 2).toString(),
    title: "Super customizable",
    text:
      "The component is also super customizable, so you can adapt it to cover your needs and wants.",
    colors: ["#C8DBAE", "#ACDBE5"],
    imageSource: require("../../assets/images/boombox.png"),
    endWelcomeSlide: true
  }
];

class IntroScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  componentWillMount() {
    // const ga = new Analytics(
    //   Settings.analyticsCode,
    //   DeviceInfo.getUniqueID(),
    //   1,
    //   DeviceInfo.getUserAgent()
    // );
    // let gaEvent = new GAHits.Event(
    //   "pirate funnel", // category
    //   "awareness", // action
    //   "awareness", // label
    //   "awareness" // value
    // );
    // ga.send(gaEvent);
  }

  _renderItem = props => <CustomSlide {...props} {...this.props} />;

  render() {
    // supporto iphone x
    return (
      <Aux>
        <ImageBackground
          source={require("../../assets/images/bg-login.png")}
          style={{
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height,
            position: "absolute"
          }}
        />
        <EndWelcomeSlide {...this.props} />
        {/* 
        <AppIntroSlider
          slides={slides}
          renderItem={this._renderItem}
          nextLabel={"Next"}
          paginationContainer={{
            position: "absolute",
            bottom:
              Platform.OS === "ios" &&
              (Dimensions.get("window").height === 812 ||
                Dimensions.get("window").width === 812)
                ? 35
                : 0,
            height: 40
          }}
          bottomButton={true}
        /> 
        */}
      </Aux>
    );
  }
}

export default IntroScreen;
