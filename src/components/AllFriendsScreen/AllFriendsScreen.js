import React from "react";
import {
  View,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Text,
  TouchableWithoutFeedback,
  ImageBackground,
  Image,
  TouchableHighlight,
  ScrollView,
  ListView,
  TouchableOpacity,
  PermissionsAndroid,
  Platform
} from "react-native";

import Aux from "../../helpers/Aux";

import Blur from "../../components/Blur/Blur";

import NotificationPoint from "./../../components/NotificationPoint/NotificationPoint";
import IconMenuDrawer from "./../../components/IconMenuDrawer/IconMenuDrawer";

import FriendScreen from "./../../components/FriendScreen/FriendScreen";
import SearchFriendsScreen from "./../../components/SearchFriendsScreen/SearchFriendsScreen";
import MyFriendsScreen from "./../../components/MyFriendsScreen/MyFriendsScreen";
import FacebookFriendScreen from "./../../components/FacebookFriendScreen/FacebookFriendScreen";
import ContactsFriendScreen from "./../../components/ContactsFriendScreen/ContactsFriendScreen";


import HeaderFriendsScreen from "./../../components/HeaderFriendsScreen/HeaderFriendsScreen";

import {

  getListFriend,
  getListRequestFriend,
  getListSendRequestFriend,
} from "./../../domains/follow/ActionCreators";
import {
  
  getTabState,
  
} from "./../../domains/follow/Selectors";

import Settings from "./../../config/Settings";

// import { Analytics, Hits as GAHits } from "react-native-google-analytics";

import { strings } from "../../config/i18n";

import { connect } from "react-redux";

import {
  GoogleAnalyticsTracker,
  GoogleTagManager,
  GoogleAnalyticsSettings
} from "react-native-google-analytics-bridge";

let Tracker = new GoogleAnalyticsTracker(Settings.analyticsCode);
import analytics from "@react-native-firebase/analytics";
async function trackScreenView(screen) {
  // Set & override the MainActivity screen name
  await analytics().setCurrentScreen(screen, screen);
}

class AllFriendsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = { numFriendFacebook: 0, numFriendContacts: 0 };
  }

  componentWillMount() {
    
    this.props.dispatch(getListFriend());
    this.props.dispatch(getListRequestFriend());
    this.props.dispatch(getListSendRequestFriend());


  }

 

 
  render() {
    return (
      <View
      // style={styles.mainContainer}
      
      style={{
        backgroundColor: "white",
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
        backgroundColor: "#FFFFFF",
      }}
    >
     
        {this.props.selected === "FACEBOOK FRIENDS" ? (
            <FacebookFriendScreen
            ref={view => {
              this.view = view;
            }}
            navigation={this.props.navigation}
          />
        ) : this.props.selected === "CONTACTS" ? (
          <ContactsFriendScreen
          ref={view => {
            this.view = view;
          }}
          navigation={this.props.navigation}
        />
        ) : (
          <MyFriendsScreen
          ref={view => {
            this.view = view;
          }}
          navigation={this.props.navigation}
        />
        )}
      
        <HeaderFriendsScreen navigation={this.props.navigation} selected={this.props.selected} numFriendFacebook={this.state.numFriendFacebook} numFriendContacts={this.state.numFriendContacts}/>
        
        </View>
    );
  }
}

const withConnect = connect((state) => {
  return {
   
    selected: getTabState(state),
   
  };
});

export default withConnect(AllFriendsScreen);
