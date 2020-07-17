import React from "react";
import { Text, Dimensions, Platform, View, ScrollView } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import OwnIcon from "../../components/OwnIcon/OwnIcon";
import { connect } from "react-redux";
import { createSelector } from "reselect";
import { getMostFrequentRoute } from "./../../domains/login/ActionCreators";
import ProfileScreenHeader from "./../../components/ProfileScreenHeader/ProfileScreenHeader";
import ProfileScreenCards from "./../../components/ProfileScreenCards/ProfileScreenCards";
import ProfileScreenTranings from "./../../components/ProfileScreenTranings/ProfileScreenTranings";

import FriendScreen from "./../../components/FriendScreen/FriendScreen";

import { getStats } from "./../../domains/statistics/ActionCreators";

import { changeScreenProfile } from "../../domains/trainings/ActionCreators";

import { strings } from "../../config/i18n";

class ProfileScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        <Text
          style={{
            left: Platform.OS == "android" ? 20 : 0
          }}
        >
          {strings("profile")}
        </Text>
      ),
      headerRight: (
        <OwnIcon
          name="settings_icn"
          size={40}
          color="#9D9B9C"
          click={() => navigation.navigate("PersonalDataScreen")}
        />
      )
    };
  };

  

  renderPage() {
    return (
      <ScrollView
        style={{
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height
        }}
        showsVerticalScrollIndicator={false}
        ref={ref => (this.ref = ref)}
      >
        <ProfileScreenCards navigation={this.props.navigation} />
        <View
              style={{
                height: 300,
                backgroundColor: "transparent"
              }}
            />
      </ScrollView>
    );
  }

  render() {
    return (
      <View
        style={{
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height,
          backgroundColor: "transparent"
        }}
      >
        <LinearGradient
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 0.0, y: 1.0 }}
          locations={[0, 1.0]}
          colors={["#6C6C6C", "#3D3D3D"]}
          style={{
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height
          }}
        >
          {/* <ProfileScreenHeader
            handleChangePage={page => this._handleChangePage(page)}
            page={this.props.page}
          /> */}

          {/* <ProfileScreenCards /> */}
          {this.renderPage()}
        </LinearGradient>
      </View>
    );
  }
}

const connectDispatch = connect();

export default connectDispatch(ProfileScreen);
