import React from "react";
import { View, Text, TouchableWithoutFeedback } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";
import { setRightMenuState } from "./../../domains/login/ActionCreators";

class ToggleRightMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View>
        <TouchableWithoutFeedback
          onPress={() => {
            // console.log(props);
            // props.navigation.openDrawer();
            this.props.dispatch(setRightMenuState(!this.props.right_menu));
          }}
        >
          <View style={{ marginRight: 13 }}>
            <Icon name="ios-menu" size={30} color="black" />
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const getRightMenu = state =>
  state.login.right_menu ? state.login.right_menu : false;

const withData = connect(state => {
  return {
    right_menu: getRightMenu(state)
  };
});

export default withData(ToggleRightMenu);
