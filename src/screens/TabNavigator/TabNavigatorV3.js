import React, { Component } from 'react'
import { View } from 'react-native'
import { createAppContainer, createStackNavigator, createNavigator } from "react-navigation"

import LoginWithSocial from "../LoginWithSocial/LoginWithSocial";
import LoginWithEmail from "../LoginWithEmail/LoginWithEmail";
import WelcomeMUVToNewMUV from "../WelcomeMUVToNewMUV/WelcomeMUVToNewMUV";

Stack = createStackNavigator(
  {
    Login: {
      screen: LoginWithEmail,
    },
    Welcome: {
      screen: LoginWithSocial,
    },
    WelcomeMUVToNewMUV: {
      screen: WelcomeMUVToNewMUV,
    }
  },
  {
    initialRouteName: "Login",
  }
);

class CustomNavigator extends Component {
  static router = {
    ...Stack.router,
    getStateForAction: (action, lastState) => {
      return Stack.router.getStateForAction(action, lastState);
    }
  };

  componentDidMount(lastProps) {
  }

  render() {
    const { navigation } = this.props;

    return (
      <Stack navigation={navigation} />
    )
  }
}

export default CustomNavigator
