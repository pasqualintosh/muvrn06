import React from "react";
import {
  View,
  Dimensions,
  Text,
  Image,
  TouchableWithoutFeedback
} from "react-native";

class OnboardingMode extends React.Component {
  constructor(props) {
    super(props);
    this.state = { active: false };
  }

  onPressButton = () => {
    const status = !this.state.active;
    this.setState(previousState => {
      return { active: !previousState.active };
    });

    // mi salvo se quel bottone con quel titolo è stato cliccato
    this.props.clickModes(this.props.sourceTxt, status);
  };

  renderCheckIcn() {
    if (this.state.active)
      return (
        <Image
          style={{
            width: 20,
            height: 20
          }}
          source={require("./../../assets/images/onboarding-check_icn.png")}
        />
      );
    else
      return (
        <View
          style={{
            width: 15,
            height: 15,
            borderRadius: 12,
            backgroundColor: "#fff"
          }}
        />
      );
  }

  render() {
    return (
      <View>
        <TouchableWithoutFeedback onPress={() => this.onPressButton()}>
          <View
            style={{
              alignSelf: "center",
              flexDirection: "row",
              width: Dimensions.get("window").width,
              height: Dimensions.get("window").height * 0.1,
              borderBottomColor: "#ffffff45",
              borderBottomWidth: 1
            }}
          >
            <View
              style={{
                flex: 0.3,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Image
                style={{
                  width: 60,
                  height: 60
                }}
                source={this.props.sourceImg}
              />
            </View>
            <View
              style={{
                flex: 0.5,
                justifyContent: "center",
                alignItems: "flex-start"
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  textAlign: "left",
                  fontSize: 14,
                  fontFamily: "OpenSans-Regular"
                }}
              >
                {this.props.sourceTxt}
              </Text>
            </View>
            <View
              style={{
                flex: 0.2,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              {this.renderCheckIcn()}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

export default OnboardingMode;
