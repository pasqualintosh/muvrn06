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




class MyFriendsScreen extends React.Component {
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



  // componentWillMount() {
  //   this.props.dispatch(getListFriend());
  //   this.props.dispatch(getListRequestFriend());
  //   this.props.dispatch(getListSendRequestFriend());
  //   // searchUsers('ang', data => console.log(data))
  //   // sendRequestFriend({ message: "Prova", to_user: 5})
  // }

  onRefresh() {
    this.setState({ refreshing: true });

    // if (this.props.selected === "FOLLOWING") {
    this.props.dispatch(getListFriend());
    this.props.dispatch(getListRequestFriend());
    this.props.dispatch(getListSendRequestFriend());

    const loading = setInterval(() => {
      {
        this.setState({ refreshing: false });
        clearTimeout(loading);
      }
    }, 1000);
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
              width: 28,
              height: 28,
              // alignSelf: "center",
              position: "absolute",
              top: -5,
              right: -5,
            }}
          >
            <Image
              source={require("../../assets/images/friend/friend_add_icn.png")}
              style={{
                width: 28,
                height: 28,
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }



  renderFriendList() {
    this.displayStandings = true;

    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });

    return (
      <View>
        <ListView
          removeClippedSubviews={false}
          enableEmptySections={true}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh.bind(this)}
            />
          }
          style={styles.challengesList}
          dataSource={ds.cloneWithRows(this.props.alltypeFriend)}
          renderRow={(item, sectionID, rowID) => {
            const row = parseInt(rowID) + 1;
            if (
              row === 1
              // &&
              // item.user_followed.user_id != this.props.infoProfile.user_id
            ) {
              return (
                <Aux key={rowID}>
                  <View
                    key={0}
                    style={{
                      height: 40,
                      // backgroundColor: "#F7F8F9"
                    }}
                  />
                  {item.length ? (
                    <FriendSingleReceiveInvite invites={item} row={row} />
                  ) : (
                    <View />
                  )}

                  {
                    // qui fanno le richieste d'invito ricevute
                    // aggiungo delo spazio in piu cosi posso scrollare tutta la lista anche se c'e l'onda e la notifica
                  }
                </Aux>
              );
            } else if (this.props.alltypeFriend.length === row) {
              return (
                <Aux key={rowID}>
                  <FriendsThreesome group={item} row={row} />
                  {
                    // aggiungo delo spazio in piu cosi posso scrollare tutta la lista anche se c'e l'onda e la notifica
                    <View
                      key={0}
                      style={{
                        paddingTop: Dimensions.get("window").height * 0.23,
                      }}
                    />
                  }
                </Aux>
              );
            } else {
              return <FriendsThreesome group={item} row={row} />;
            }
          }}
        />
      </View>
    );
  }

  renderNoFriends = () => {
    return (
      <ScrollView style={styles.challengesList}>
        <View
          style={{
            width: Dimensions.get("window").width * 0.9,
            top: 100,
            flexDirection: "column",
            alignContent: "center",
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
          }}
        >
          <Image
            style={{
              width: 150,
              height: 150,
            }}
            source={require("../../assets/images/friends_banner_icn.png")}
          />
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate("SearchFriendsScreen")
            }
          >
            <Image
              style={{
                width: 50,
                height: 50,
              }}
              source={require("../../assets/images/friend/friend_add_icn.png")}
            />
          </TouchableOpacity>
          <View style={{ width: 50, height: 50 }}></View>
          <Text
            style={{
              color: "#3D3D3D",
              fontFamily: "OpenSans-Regular",

              fontSize: 14,
              fontWeight: "bold",

              // marginBottom: 4,
              marginVertical: 0,
              textAlign: "center",
            }}
          >
            MUV ha bisogno della tua autorizzazione per cercare i tuoi amici tra
            i tuoi contatti. Clicca su “+” e concedi l’autorizzazione a MUV di
            accedere alla lista dei tipo contatti.
          </Text>
          <View style={{ width: 400, height: 400 }}></View>
        </View>
      </ScrollView>
    );
  };

  


  renderFriendPage() {
    const number = this.props.alltypeFriend.length;
    // se non ho amici che richieste d'amicizia in arrivo
    // lunghezza uguale a 1 dato che nella prima posizione ho un array per le richieste in arrivo
    if (number == 1 && this.props.alltypeFriend[0].length == 0) {
      return this.renderNoFriends();
    } else {
      return this.renderFriendList();
    }
  }

  onSelect = (value) => {
    this.props.dispatch(setFriendSelected(value));
  };






  


  renderFriend = () => {
    return <Aux>{this.renderFriendPage()}</Aux>;
  };




  render() {
    return (
      
        
         this.renderFriend()
       
       
        
      
    );
  }
}

const withConnect = connect((state) => {
  return {
   

   
    status: getStatusState(state),
    selected: getTabState(state),
    
    alltypeFriend: getAllTypeFriendState(state), // prima elemento richieste ricevute in un array, successivi amici
    numFriendsState: getNumFriendsState(state),
  };
});

export default withConnect(MyFriendsScreen);

// export default StandingsScreen;
