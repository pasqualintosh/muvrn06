import React from "react";
import { View, Text, findNodeHandle, Platform } from "react-native";
import { createStackNavigator } from "react-navigation";
import HomeScreen from "../../HomeScreen/HomeScreen";
import MapScreen from "../../MapScreen/MapScreen";
import Test from "../../Test/Test";
import ProfileScreen from "../../ProfileScreen/ProfileScreen";
import PersonalDataScreen from "../../PersonalDataScreen/PersonalDataScreen";

import OwnIcon from "../../../components/OwnIcon/OwnIcon";
import Icon from "react-native-vector-icons/Ionicons";
import Aux from "../../../helpers/Aux";

import NotificationPoint from "./../../../components/NotificationPoint/NotificationPoint";

import ListRecapActivity from "../../../components/ListRecapActivity/ListRecapActivity";
import CustomSurveySlide from "../../../components/CustomSurveySlide/CustomSurveySlide";

import Blur from "../../../components/Blur/Blur";
import MapRoutine from "../../MapRoutine/MapRoutine";
import SelectNewRoutine from "../../SelectNewRoutine/SelectNewRoutine";

const ProfileStack = createStackNavigator(
  {
    Info: {
      screen: ProfileScreen
    },
    MappaCompleta: {
      screen: MapScreen
    },
    PreviousRoute: {
      screen: ListRecapActivity
    },
    PersonalDataScreen: {
      screen: PersonalDataScreen
    },
    Routine: {
      screen: SelectNewRoutine
    },
    SelectMostFrequentRoutePoint: {
      screen: MapRoutine
    }
  },

  {
    initialRouteName: "Info"
  }
);

class Profile extends React.Component {
  // questa struttura si deve ripete per ogni tab della tabBar altrimenti il blur e la notifica non sono presenti
  constructor(props) {
    super(props);
    this.state = { viewRef: null };
  }

  componentDidMount() {
    // quando ho caricato il componente, posso dire a blur che è possibile fare il blur usando questa variabile
    this.setState({ viewRef: findNodeHandle(this.view) });
  }

  render() {
    return (
      <Aux>
        <NotificationPoint navigation={this.props.navigation} />
        <ProfileStack
          ref={view => {
            this.view = view;
          }}
        />
        <Blur viewRef={this.state.viewRef} />
      </Aux>
    );
  }
}

export default Profile;
