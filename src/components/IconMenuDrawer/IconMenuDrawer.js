import React from "react";
import { View, TouchableWithoutFeedback, Text } from "react-native";
import NotificationNumberCircle from "../NotificationNumberCircle/NotificationNumberCircle";

import OwnIcon from "../../components/OwnIcon/OwnIcon";
import {
  frequentTripsState
} from "./../../domains/login/Selectors.js";
import { connect } from "react-redux";

class IconMenuDrawer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const numberNotification = 1;
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          this.props.navigation.openDrawer();
        }}
      >
        <View
          style={{
            paddingRight: 13,
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
            flexDirection: "row"
          }}
        >
          <OwnIcon name="top_menu_icn" size={30} color={"black"} />

          {!this.props.routine.length ? (
            <NotificationNumberCircle numberNotification={1} />
          ) : (
            <View />
          )}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const notificationPopup = connect(state => {
  // prendo solo le routine
  return {
    routine: frequentTripsState(state)
  };
});

export default notificationPopup(IconMenuDrawer);


