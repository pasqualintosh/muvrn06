import React from "react";
import { Text } from "react-native";
import LinearGradient from "react-native-linear-gradient";

class NotificationNumberCircle extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <LinearGradient
        start={{ x: 0.0, y: 0.0 }}
        end={{ x: 0.0, y: 1.0 }}
        locations={[0, 1.0]}
        colors={["#E82F73", "#F49658"]}
        style={this.props.style}
      >
        <Text style={{ color: "white", fontSize: 10 }}>
          {this.props.numberNotification}
        </Text>
      </LinearGradient>
    );
  }
}

NotificationNumberCircle.defaultProps = {
  numberNotification: 0,
  style: {
    height: 15,
    width: 15,

    borderRadius: 8,
    alignContent: "center",
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    left: 15,
    top: 0,
    shadowRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    elevation: 1
  }
};

export default NotificationNumberCircle;
