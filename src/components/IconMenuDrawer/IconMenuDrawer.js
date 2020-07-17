import React from "react";
import { View, TouchableWithoutFeedback, Text } from "react-native";
import NotificationNumberCircle from "../NotificationNumberCircle/NotificationNumberCircle";

import OwnIcon from "../../components/OwnIcon/OwnIcon";

class IconMenuDrawer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const numberNotification = 0;
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

          {numberNotification ? (
            <NotificationNumberCircle numberNotification={numberNotification} />
          ) : (
            <View />
          )}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default IconMenuDrawer;
