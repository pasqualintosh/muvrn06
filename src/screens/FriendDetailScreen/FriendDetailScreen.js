import React from "react";
import { Text, Dimensions, Platform, View, ScrollView } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import OwnIcon from "../../components/OwnIcon/OwnIcon";
import { connect } from "react-redux";
import { createSelector } from "reselect";
import { getMostFrequentRoute } from "./../../domains/login/ActionCreators";
import FriendScreenHeader from "./../../components/FriendScreenHeader/FriendScreenHeader";
import FriendScreenCards from "./..//FriendScreenCards/FriendScreenCards";

import { strings } from "../../config/i18n";
import { store } from "../../store";
import { getUserInfoNew } from "./../../domains/follow/ActionCreators";

class FriendDetailScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      enableModal: false,
      user: null
    };
  }

  callback = data => {
    this.setState({
      user: data
    });
  };

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        <Text
          style={{
            left: Platform.OS == "android" ? 20 : 0
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
      )
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
          <ScrollView
            style={{
              width: Dimensions.get("window").width,
              height: Dimensions.get("window").height
            }}
            showsVerticalScrollIndicator={false}
            ref={ref => (this.ref = ref)}
          >
            <FriendScreenHeader
              user={this.state.user}
              friendData={this.props.friendData}
            />
            {/* <FriendScreenCards
           
              {...this.props}
              friendData={this.props.friendData}
              user={this.state.user}
            /> */}
            <View
              style={{
                height: 300,
                backgroundColor: "transparent"
              }}
            />
          </ScrollView>
        </LinearGradient>
      </View>
    );
  }
}

export default FriendDetailScreen;
