import React from "react";
import { Alert } from "react-native";
import Aux from "../../helpers/Aux";

import OwnIcon from "../../components/OwnIcon/OwnIcon";

import { logOutNew } from "../../domains/login/ActionCreators";
import { connect } from "react-redux";
import { strings } from "../../config/i18n";

class LogOut extends React.Component {
  constructor(props) {
    super(props);
    this.state = { viewRef: null };
  }

  actionLogOut = () => {
    this.props.dispatch(logOutNew());
  };

  render() {
    return (
      <Aux>
        {/* 
          <Icon
            name="ios-unlock"
            size={27}
            color="red"
            style={{ paddingLeft: 15, marginRight: 15 }}
            onPress={() => {
              navigation.navigate("ChangePasswordScreen");
            }}
          /> 
          */}

        <OwnIcon
          name="logout_icn"
          size={27}
          style={{ position: "relative", left: 5 }}
          color="#000000"
          click={() => {
            Alert.alert(
              "Logout",

              "Are you sure you want to logout?",

              [
                {
                  text: strings("id_14_03"),
                  onPress: () => {
                    this.actionLogOut();
                  }
                },
                {
                  text: strings("id_14_04"),
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel"
                }
              ],
              { cancelable: false }
            );
          }}
        />
        <OwnIcon
          name="arrow_icn"
          size={27}
          style={{ position: "relative", left: -22 }}
          color="#FC6754"
          click={() => {
            Alert.alert(
              "Logout",

              "Are you sure you want to logout?",

              [
                {
                  text: strings("id_14_03"),
                  onPress: () => {
                    this.actionLogOut();
                  }
                },
                {
                  text: strings("id_14_04"),
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel"
                }
              ],
              { cancelable: false }
            );
          }}
          arrow_icn
        />
      </Aux>
    );
  }
}

const logOutAction = connect();

export default logOutAction(LogOut);
