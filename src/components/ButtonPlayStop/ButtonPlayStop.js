import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import ActionButton from "react-native-action-button";
import Icon from "react-native-vector-icons/Ionicons";
import OwnIcon from "../OwnIcon/OwnIcon";
import LinearGradient from "react-native-linear-gradient";
import ComponentAnimated from "../ComponentAnimated/ComponentAnimated";

class ButtonPlayStop extends Component {
  render() {
    return (
      <View>
        <ActionButton
          offsetY={0}
          offsetX={25}
          size={48}
          renderIcon={() => (
            <LinearGradient
              start={{ x: 0.0, y: 0.0 }}
              end={{ x: 0.0, y: 1.0 }}
              locations={[0, 1.0]}
              colors={["#e82f73", "#f49658"]}
              style={{ elevation: 10, borderRadius: 25 }}
            >
              <OwnIcon name="MUV_logo" size={48} color="#FFFFFF" />
            </LinearGradient>
          )}
          degrees={0}
        />
        <ComponentAnimated />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: "white"
  }
});

export default ButtonPlayStop;
