import React from "react";
import { View, Text, TouchableWithoutFeedback } from "react-native";
import LinearGradient from "react-native-linear-gradient";

class GradientButton extends React.Component {
  render() {
    return (
      <View>
        <TouchableWithoutFeedback>
          <View style={[{ marginTop: 8 }, this.props.containerStyle]}>
            <LinearGradient
              start={{ x: 0.0, y: 0.0 }}
              end={{ x: 1.0, y: 0.0 }}
              locations={[0, 1.0]}
              colors={
                this.props.gradientColor != undefined
                  ? this.props.gradientColor
                  : ["#7D4D99", "#6497CC"]
              }
              style={[
                {
                  width: 60,
                  height: 30,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 3,
                  elevation: 3,
                  shadowColor: "#000000",
                  shadowRadius: 2,
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.5
                },
                this.props.buttonStyle
              ]}
            >
              <Text
                style={[
                  {
                    color: "#fff",
                    fontFamily: "OpenSans-Regular",
                    fontWeight: "400"
                  },
                  this.props.textStyle
                ]}
              >
                {this.props.buttonText != undefined
                  ? this.props.buttonText
                  : "LIVE"}
              </Text>
            </LinearGradient>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

export default GradientButton;
