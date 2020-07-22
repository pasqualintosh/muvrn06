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
  Platform,
} from "react-native";

import { styles, negativeData } from "./Style";
import WavyArea from "./../../components/WavyArea/WavyArea";
import FriendItem from "./../../components/FriendItem/FriendItem";

import FriendsThreesome from "./../../components/FriendsThreesome/FriendsThreesome";
import FriendSingleReceiveInvite from "./../../components/FriendSingleReceiveInvite/FriendSingleReceiveInvite";

import Aux from "./../../helpers/Aux";
import {
  getFollowingUser,
  getFollowersUser,
  postFollowUser,
  deleteFollowedUser,
  setFriendSelected,
  getListFriend,
  getListRequestFriend,
  getListSendRequestFriend,
  searchUsers,
  sendRequestFriend,
} from "./../../domains/follow/ActionCreators";
import {
  getFollowedState,
  getFollowState,
  getStatusState,
  getTabState,
  getlistFriendWithSendRequestState,
  getAllTypeFriendState,
  getNumFriendsState,
} from "./../../domains/follow/Selectors";
import { getProfile } from "./../../domains/login/Selectors";
import { connect } from "react-redux";
import { strings } from "../../config/i18n";

class HeaderFriendsScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showLoading: true,
      refreshing: false,

      results: [],
      url: "",
      loadingUrl: false,
    };
    this.buo = null;

    this.displayStandings = false;
  }


  header() {
    return (
      <View
        style={{
          flexDirection: "row",
          alignContent: "center",
          alignSelf: "center",
          width: Dimensions.get("window").width * 0.9,
          height: 40,
          justifyContent: "space-around",
        }}
      >
        <TouchableOpacity
          onPress={() => this.onSelect("FRIENDS")}
          style={{
            flexDirection: "column",
            alignContent: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              flexDirection: "column",
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: "#000000",
                fontFamily: "OpenSans-Regular",

                fontSize: 10,

                fontWeight:
                  this.props.selected == "FRIENDS" ? "bold" : "normal",
                // marginBottom: 4,
                marginVertical: 0,
                textAlign: "center",
              }}
            >
               {strings('id_20_10')}
            </Text>
            <View
              style={{
                borderBottomColor: "#FFFFFF",
                borderBottomWidth: this.props.selected == "FRIENDS" ? 4 : 0,
                borderRadius: 2,
              }}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => this.onSelect("FACEBOOK FRIENDS")}
          style={{
            flexDirection: "column",
            alignContent: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              flexDirection: "column",
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: "#000000",
                fontFamily: "OpenSans-Regular",

                fontSize: 10,
                fontWeight:
                  this.props.selected == "FACEBOOK FRIENDS" ? "bold" : "normal",
                // marginBottom: 4,
                marginVertical: 0,
                textAlign: "center",
              }}
            >
                {strings('id_20_11')}
            </Text>
            <View
              style={{
                borderBottomColor: "#FFFFFF",
                borderBottomWidth:
                  this.props.selected == "FACEBOOK FRIENDS" ? 4 : 0,
              }}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.onSelect("CONTACTS")}
          style={{
            flexDirection: "column",
            alignContent: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              flexDirection: "column",
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: "#000000",
                fontFamily: "OpenSans-Regular",

                fontSize: 10,
                fontWeight:
                  this.props.selected == "CONTACTS" ? "bold" : "normal",
                // marginBottom: 4,
                marginVertical: 0,
                textAlign: "center",
              }}
            >
               {strings('id_20_12')}
            </Text>
            <View
              style={{
                borderBottomColor: "#FFFFFF",
                borderBottomWidth: this.props.selected == "CONTACTS" ? 4 : 0,
              }}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  }


  // width: 56,
  //             height: 56,
  //             // alignSelf: "center",
  //             position: "absolute",
  //             top: -5,
  //             right: -5,
  //             flexDirection: 'column',
  //             alignContent: 'center',
  //             alignItems: 'center',
  //             justifyContent: 'center'

   

  headerCounter() {
    return (
      <View
        style={{
          flexDirection: "row",
          alignContent: "center",
          alignSelf: "center",
          width: Dimensions.get("window").width * 0.9,
          height: 70,
          justifyContent: "space-around",
        }}
      >
        <View
          style={{
            flexDirection: "column",
            alignContent: "center",
            justifyContent: "center",
            height: 70,
            width: Dimensions.get("window").width * 0.9 - 140,
          }}
        >
          <Text
            style={{
              fontFamily: "Montserrat-ExtraBold",
              color: "#000000",
              fontSize: 18,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            YOUR FRIENDS
          </Text>
        </View>

        <View
          style={{
            flexDirection: "column",
            alignContent: "center",
            justifyContent: "center",
            width: 70,
            height: 70,
            borderRadius: 70 / 2,
            borderColor: "#FFFFFF",
            borderWidth: 3,
          }}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontFamily: "OpenSans-Regular",

              fontSize: 18,
              fontWeight: "bold",
              // marginBottom: 4,
              marginVertical: 0,
              textAlign: "center",
            }}
          >
            {this.props.numFriendsState}
          </Text>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate("SearchFriendsScreen")
            }
            style={{
              width: 38,
              height: 38,
              // alignSelf: "center",
              position: "absolute",
              top: -10,
              right: -10,
             
            }}
          >
            <Image
              source={require("../../assets/images/friend/friend_add_icn.png")}
              style={{
                width: 28,
                height: 28,
                margin: 5
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  headerCounterFacebook() {
    return (
      <View
        style={{
          flexDirection: "row",
          alignContent: "center",
          alignSelf: "center",
          width: Dimensions.get("window").width * 0.9,
          height: 70,
          justifyContent: "space-around",
        }}
      >
        <View
          style={{
            flexDirection: "column",
            alignContent: "center",
            justifyContent: "center",
            height: 70,
            width: Dimensions.get("window").width * 0.9 - 140,
          }}
        >
          <Text
            style={{
              fontFamily: "Montserrat-ExtraBold",
              color: "#000000",
              fontSize: 18,
              fontWeight: "bold",
              textAlign: "right",
            }}
          >
            {strings('id_20_16')}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "column",
            alignContent: "center",
            justifyContent: "center",
            width: 70,
            height: 70,
            borderRadius: 70 / 2,
            borderColor: "#FFFFFF",
            borderWidth: 3,
          }}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontFamily: "OpenSans-Regular",

              fontSize: 18,
              fontWeight: "bold",
              // marginBottom: 4,
              marginVertical: 0,
              textAlign: "center",
            }}
          >
            {this.props.numFriendFacebook}
          </Text>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate("SearchFriendsScreen")
            }
            style={{
              width: 38,
              height: 38,
              // alignSelf: "center",
              position: "absolute",
              top: -10,
              right: -10,
             
            }}
          >
            <Image
              source={require("../../assets/images/friend/friend_add_icn.png")}
              style={{
                width: 28,
                height: 28,
                margin: 5
              }}
            />
            </TouchableOpacity>
        </View>
      </View>
    );
  }

  headerCounterContacts() {
    return (
      <View
        style={{
          flexDirection: "row",
          alignContent: "center",
          alignSelf: "center",
          width: Dimensions.get("window").width * 0.9,
          height: 70,
          justifyContent: "space-around",
        }}
      >
        <View
          style={{
            flexDirection: "column",
            alignContent: "center",
            justifyContent: "center",
            height: 70,
            width: Dimensions.get("window").width * 0.9 - 140,
          }}
        >
          <Text
            style={{
              fontFamily: "Montserrat-ExtraBold",
              color: "#000000",
              fontSize: 18,
              fontWeight: "bold",
              textAlign: "right",
            }}
          >
           {strings('id_20_20')}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "column",
            alignContent: "center",
            justifyContent: "center",
            width: 70,
            height: 70,
            borderRadius: 70 / 2,
            borderColor: "#FFFFFF",
            borderWidth: 3,
          }}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontFamily: "OpenSans-Regular",

              fontSize: 18,
              fontWeight: "bold",
              // marginBottom: 4,
              marginVertical: 0,
              textAlign: "center",
            }}
          >
            {this.props.numFriendContacts}
          </Text>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate("SearchFriendsScreen")
            }
            style={{
              width: 38,
              height: 38,
              // alignSelf: "center",
              position: "absolute",
              top: -10,
              right: -10,
             
            }}
          >
            <Image
              source={require("../../assets/images/friend/friend_add_icn.png")}
              style={{
                width: 28,
                height: 28,
                margin: 5
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }





  onSelect = (value) => {
    this.props.dispatch(setFriendSelected(value));
  };


  render() {
    return (
      <ImageBackground
        source={require("../../assets/images/friend/friends_page_wave.png")}
        style={styles.backgroundImageAbsolute}
      >
        {this.header()}
     
        {this.props.selected === "FACEBOOK FRIENDS" ? (
         this.headerCounterFacebook()
        ) : this.props.selected === "CONTACTS" ? (
          this.headerCounterContacts()
        ) : (this.headerCounter())
          }
      </ImageBackground>
    );
  }
}

const withConnect = connect((state) => {
  return {
    // selected: getTabState(state),

    numFriendsState: getNumFriendsState(state),
  };
});

export default withConnect(HeaderFriendsScreen);

// export default StandingsScreen;
