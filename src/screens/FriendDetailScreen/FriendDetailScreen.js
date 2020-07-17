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

class FriendDetailScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: "myself",
      enableModal: false,
      completeQuiz: false
    };
  }
  _handleChangePage = page => {
    this.setState({ page });
  };
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

  componentWillMount() {
    // this.props.dispatch(getStats());
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
              handleChangePage={page => this._handleChangePage(page)}
              page={this.state.page}
              can_follow={this.props.can_follow}
              friendData={this.props.friendData}
            />

            <FriendScreenCards
              {...this.props}
              friendData={this.props.friendData}
            />
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
