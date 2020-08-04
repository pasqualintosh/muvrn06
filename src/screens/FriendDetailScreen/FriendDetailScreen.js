import React from "react";
import {
  Text,
  Dimensions,
  Platform,
  View,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import OwnIcon from "../../components/OwnIcon/OwnIcon";
import { connect } from "react-redux";
import { createSelector } from "reselect";
import { getMostFrequentRoute } from "./../../domains/login/ActionCreators";
import FriendScreenHeader from "./../../components/FriendScreenHeader/FriendScreenHeader";


import FriendScreenCards from "./..//FriendScreenCards/FriendScreenCards";

import SustainabilitySection from "./../../components/SustainabilitySection/SustainabilitySection";

import { strings } from "../../config/i18n";  
import { store } from "../../store";
import { getUserInfoNew } from "./../../domains/follow/ActionCreators";
import Aux from "../../helpers/Aux";

class FriendDetailScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      enableModal: false,
      user: null,
    };
  }

  callback = (data) => {
    this.setState({
      user: data,
    });
  };

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        <Text
          style={{
            left: Platform.OS == "android" ? 20 : 0,
          }}
        >
          {strings("id_5_15")}
        </Text>
      ),
      headerRight: (
        <OwnIcon
          name="settings_icn"
          size={40}
          color="#9D9B9C"
          click={() => navigation.navigate("PersonalDataScreen")}
        />
      ),
    };
  };

  componentWillMount() {
    console.log(this.props.friendData);

    const username = this.props.friendData.username;
    console.log(username);
    if (username) {
      // chiedo i dati al db
      store.dispatch(getUserInfoNew({ username }, this.callback));
    }
  }

  render() {
    return (
      <View
        style={{
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height,
          backgroundColor: "transparent",
        }}
      >
        <LinearGradient
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 0.0, y: 1.0 }}
          locations={[0, 1.0]}
          colors={["#6C6C6C", "#3D3D3D"]}
          style={{
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height,
          }}
        >
          <ScrollView
            style={{
              width: Dimensions.get("window").width,
              height: Dimensions.get("window").height,
            }}
            showsVerticalScrollIndicator={false}
            ref={(ref) => (this.ref = ref)}
          >
            {this.state.user ? (
              <Aux>
                <FriendScreenHeader
                  user={this.state.user}
                  friendData={this.props.friendData}
                />
                <FriendScreenCards
                  {...this.props}
                  friendData={this.props.friendData}
                  infoProfile={this.state.user}
                  
                />
                <SustainabilitySection CO2={this.state.user.stats.total_co2} />
                {/* <View
                  style={{
                    height: 300,
                    backgroundColor: "transparent",
                  }}
                /> */}
              </Aux>
            ) : (
              <View
                style={{
                  flexDirection: "column",
                  justifyContent: "space-around",
                  height: Dimensions.get("window").height * 0.64,
                  position: "relative",
                  alignSelf: "center",
                  width: Dimensions.get("window").width * 0.9,
                }}
              >
                <ActivityIndicator size="large" color="#3D3D3D" />
              </View>
            )}
          </ScrollView>
        </LinearGradient>
      </View>
    );
  }
}

export default FriendDetailScreen;
