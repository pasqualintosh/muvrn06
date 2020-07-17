import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import ActionButton from "react-native-action-button";
import Icon from "react-native-vector-icons/Ionicons";
import OwnIcon from "../OwnIcon/OwnIcon";
import LinearGradient from "react-native-linear-gradient";

class ButtonPlayStop3 extends Component {
  constructor() {
    super();
    this.state = {
      active: false
    };
  }

  render() {
    return (
      <View>
        <ActionButton
          offsetY={0}
          offsetX={25}
          size={48}
          active={this.state.active}
          resetToken={1}
          onPress={() => {
            this.setState((prevState, props) => {
              return { active: !prevState.active };
            });
            console.log(this.state.active);
            console.log("click per attivare");
          }}
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
        >
          <ActionButton.Item
            buttonColor="#9b59b6"
            onPress={() => console.log("notes tapped!")}
          >
            <Icon name="md-create" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor="#3498db" onPress={() => {}}>
            <Icon name="md-notifications-off" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor="#1abc9c" onPress={() => {}}>
            <Icon name="md-done-all" style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>

        <ActionButton
          offsetY={0}
          offsetX={100}
          size={48}
          buttonColor="rgba(231,76,60,1)"
          active={this.state.active}
          resetToken={1}
          onPress={() => {
            this.setState((prevState, props) => {
              return { active: !prevState.active };
            });
            console.log(this.state.active);
            console.log("click per attivare");
          }}
          renderIcon={() => (
            <OwnIcon name="MUV_logo" size={48} color="#FFFFFF" />
          )}
          degrees={0}
        >
          <ActionButton.Item
            buttonColor="#9b59b6"
            onPress={() => console.log("notes tapped!")}
          >
            <Icon name="md-create" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor="#3498db" onPress={() => {}}>
            <Icon name="md-notifications-off" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor="#1abc9c" onPress={() => {}}>
            <Icon name="md-done-all" style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>
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

export default ButtonPlayStop3;
