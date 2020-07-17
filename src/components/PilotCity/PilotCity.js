import React from "react";
import {
  View,
  Text,
  Dimensions,
  TouchableWithoutFeedback,
  Image
} from "react-native";

class PilotCity extends React.Component {
  constructor(props) {
    super(props);
  }
  renderTarget = index => {
    if (this.props.nearestCity === this.props.cityName) {
      return (
        <View>
          <View
            style={{
              width: 10,
              height: 10,
              position: "absolute",
              top: 0,
              right: Dimensions.get("window").width * 0.12,
              borderLeftColor: "#707070",
              borderTopColor: "#707070",
              borderLeftWidth: 1,
              borderTopWidth: 1
            }}
          />
          <View
            style={{
              width: 10,
              height: 10,
              position: "absolute",
              top: 0,
              left: Dimensions.get("window").width * 0.12,
              borderRightColor: "#707070",
              borderTopColor: "#707070",
              borderRightWidth: 1,
              borderTopWidth: 1
            }}
          />
          <View
            style={{
              width: 10,
              height: 10,
              position: "absolute",
              top: 65,
              right: Dimensions.get("window").width * 0.12,
              borderLeftColor: "#707070",
              borderBottomColor: "#707070",
              borderLeftWidth: 1,
              borderBottomWidth: 1
            }}
          />
          <View
            style={{
              width: 10,
              height: 10,
              position: "absolute",
              top: 65,
              left: Dimensions.get("window").width * 0.12,
              borderRightColor: "#707070",
              borderBottomColor: "#707070",
              borderRightWidth: 1,
              borderBottomWidth: 1
            }}
          />
        </View>
      );
    }
  };
  render() {
    let styleImage = {
      width: 50,
      height: 50,
      // tintColor: "gray"
    };
    // if (this.props.nearestCity === this.props.cityName) {
    //   styleImage = {
    //     width: 50,
    //     height: 50
    //   };
    // }
    return (
      <TouchableWithoutFeedback onPress={this.props.handleTap}>
        <View
          style={{
            width: Dimensions.get("window").width * 0.3,
            height: 80,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          {this.renderTarget()}
          <Image style={styleImage} source={this.props.nearestCity === this.props.cityName ? this.props.source : this.props.sourceBn} />
          <Text
            style={{
              fontFamily: "Montserrat-ExtraBold",
              color: "#3F3F3F",
              fontSize: 16,
              marginVertical: 1
            }}
          >
            {this.props.cityName}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default PilotCity;
