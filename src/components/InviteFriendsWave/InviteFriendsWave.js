// componente per visualizzare un onda che permette di invitare degli amici

import React from "react";
import {
  View,
  Text,
  Dimensions,
  Image,
  TouchableWithoutFeedback,
  Platform,
  ImageBackground,
  Linking,
  TouchableHighlight,
  ActivityIndicator
} from "react-native";

import { strings } from "../../config/i18n";

import { connect } from "react-redux";
import { styles } from "./Style";

import branch, { RegisterViewEvent, BranchEvent } from "react-native-branch";

import LinearGradient from "react-native-linear-gradient";
import Aux from "./../../helpers/Aux";
import {
  getProfile
} from "./../../domains/login/Selectors";

const defaultBUO = {
  title: "MUV"
};

class InviteFriendsWave extends React.PureComponent {
  randomString() {
    var text = "";
    var possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  invite = () => {
    //console.log(this.props);
    this.generateShortUrl();
  };

  writeToClipboard = async () => {
    await Clipboard.setString(this.state.url);
  };

  addResult(type, slug, payload) {
    let result = { type, slug, payload };
    this.setState({
      results: [result, ...this.state.results].slice(0, 10)
    });
  }

  createBranchUniversalObject = async () => {
    try {
      let result = await branch.createBranchUniversalObject(
        this.randomString(),
        defaultBUO
      );
      if (this.buo) this.buo.release();
      this.buo = result;
      console.log("createBranchUniversalObject", result);
      this.addResult("success", "createBranchUniversalObject", result);
    } catch (err) {
      console.log("createBranchUniversalObject err", err.toString());
      this.addResult("error", "createBranchUniversalObject", err.toString());
    }
  };

  componentWillMount() {
    // this.generateShortUrl();
  }

  generateShortUrl = async () => {
    this.setState({ loadingUrl: true });
    if (!this.buo) await this.createBranchUniversalObject();
    try {
      let linkProperties = {
        sender_id: this.props.infoProfile.user_id,
        first_name: this.props.infoProfile.first_name,
        last_name: this.props.infoProfile.last_name,
        avatar: this.props.infoProfile.avatar,
        points: this.props.Points,
        role: this.props.infoProfile.role,
        coins: this.props.infoProfile.coins,
        level: JSON.stringify(this.props.infoProfile.level),
        roleIndex: JSON.stringify(this.props.roleAll),
        city: this.props.infoProfile.city
          ? this.props.infoProfile.city.city_name
            ? this.props.infoProfile.city.city_name
            : ""
          : ""
        // roleUser: this.props.loginState.role.roleUser,
        // indexRole: this.props.loginState.role.indexRole
      };
      let result = await this.buo.generateShortUrl({}, linkProperties);

      // console.log("generateShortUrl", result);
      // alert(result.url);
      console.log("linkProperties", linkProperties);

      console.log(result.url);

      this.setState({ url: result.url, loadingUrl: false });

      this.addResult("success", "generateShortUrl", result);
      if (this.props.typeInvite === "CityTournament") {
        this.props.navigation.navigate("InviteScreenFromTournament", {
          url: result.url
        });
      } else {
        this.props.navigation.navigate("InviteScreen", { url: result.url });
      }

      if (!this.buo) return;
      this.buo.release();
    } catch (err) {
      console.log("generateShortUrl err", err);
      this.addResult("error", "generateShortUrl", err.toString());
      this.setState({ loadingUrl: false });
    }
  };

  constructor() {
    super();

    this.state = {
      color: "#3d3d3d",
      showLoading: true,
      refreshing: false,

      results: [],
      url: "",
      loadingUrl: false
    };
  }

 //  {/* +"!\n" */}
  render() {
    if (this.props.typeInvite === "Friend") {
      return (
        <Aux>
          <ImageBackground
            source={require("../../assets/images/invite_friend_banner.png")}
            style={styles.backgroundImageAbsolute}
          />
          <View style={styles.backgroundImageAbsolute}>
            <View style={[styles.userContainer, styles.firstUser]}>
              <View style={{ flexDirection: "column", alignContent: "center" }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    alignContent: "center",
                    alignSelf: "center",
                    alignItems: "center"
                  }}
                >
                  <View
                    style={{
                      width: Dimensions.get("window").width * 0.25,
                      alignContent: "center",
                      alignSelf: "center",
                      alignItems: "center"
                    }}
                  >
                    <Image
                      style={{
                        width: 65,
                        height: 65
                      }}
                      source={require("../../assets/images/friends_banner_icn.png")}
                    />
                  </View>
                  <View style={{ width: Dimensions.get("window").width * 0.5 }}>
                    <Text
                      style={{
                        fontFamily: "OpenSans-Regular",
                        fontWeight: "400",
                        color: "#3D3D3D",
                        fontSize: 12,
                        textAlign: "left"
                      }}
                    >
                      {strings("playing_with_fr")} {strings("gaining_2_coins")}
                    </Text>
                  </View>
                  <View style={{ width: 10 }} />
                  <View style={{ width: Dimensions.get("window").width * 0.2 }}>
                    <Image
                      style={{
                        width: 45,
                        height: 45,
                        position: "absolute",
                        top: -65,
                        left: 20
                      }}
                      source={require("../../assets/images/coins_icn_friends_banner.png")}
                    />
                    <LinearGradient
                      start={{ x: 0.0, y: 0.0 }}
                      end={{ x: 1.0, y: 0.0 }}
                      locations={[0, 1.0]}
                      colors={["#7D4D99", "#6497CC"]}
                      style={styles.button}
                    >
                      <TouchableHighlight
                        onPress={this.invite}
                        style={{
                          width: Dimensions.get("window").width * 0.17,
                          height: 30,
                          borderRadius: 5,
                          alignItems: "center"
                        }}

                        // disabled={this.props.status === "Inviting" ? true : false}
                      >
                        <View
                          style={{
                            flex: 1,
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                        >
                          {!this.state.loadingUrl ? (
                            <Text
                              style={{
                                // margin: 10,
                                color: "#FFFFFF",
                                fontFamily: "OpenSans-Regular",

                                fontSize: 14
                              }}
                            >
                               {strings('invite')}
                            </Text>
                          ) : (
                            <ActivityIndicator size="small" color="white" />
                          )}
                        </View>
                      </TouchableHighlight>
                    </LinearGradient>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Aux>
      );
    } else if  (this.props.typeInvite === 'City') {
      return(<Aux>
          <ImageBackground
            source={require("../../assets/images/invite_friend_banner.png")}
            style={styles.backgroundImage}
          />
          <View style={styles.backgroundImageClassic}>
          <View style={[styles.userContainer, styles.firstUser]}>
              <View style={{ flexDirection: "column", alignContent: "center" }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    alignContent: "center",
                    alignSelf: "center",
                    alignItems: "center"
                  }}
                >
                  <View
                    style={{
                      width: Dimensions.get("window").width * 0.25,
                      alignContent: "center",
                      alignSelf: "center",
                      alignItems: "center"
                    }}
                  >
                    <Image
                      style={{
                        width: 65,
                        height: 65
                      }}
                      source={require("../../assets/images/friends_banner_icn.png")}
                    />
                  </View>
                  <View style={{ width: Dimensions.get("window").width * 0.5 }}>
                    <Text
                      style={{
                        fontFamily: "OpenSans-Regular",
                        fontWeight: "400",
                        color: "#3D3D3D",
                        fontSize: 12,
                        textAlign: "left"
                      }}
                    >
                     {"Launch the Weekly Challenge in " + (this.props.infoProfile.city
          ? this.props.infoProfile.city.city_name
            ? this.props.infoProfile.city.city_name
            : "City"
          : "City") +
                     ". Invite at least 3 friends to activate the challenge and being awarded every week with MUV Trophies."}
                    </Text>
                  </View>
                  <View style={{ width: 10 }} />
                  <View style={{ width: Dimensions.get("window").width * 0.2 }}>
                    <Image
                      style={{
                        width: 45,
                        height: 45,
                        position: "absolute",
                        top: -65,
                        left: 20
                      }}
                      source={require("../../assets/images/coins_icn_friends_banner.png")}
                    />
                    <LinearGradient
                      start={{ x: 0.0, y: 0.0 }}
                      end={{ x: 1.0, y: 0.0 }}
                      locations={[0, 1.0]}
                      colors={["#7D4D99", "#6497CC"]}
                      style={styles.button}
                    >
                      <TouchableHighlight
                        onPress={this.invite}
                        style={{
                          width: Dimensions.get("window").width * 0.17,
                          height: 30,
                          borderRadius: 5,
                          alignItems: "center"
                        }}

                        // disabled={this.props.status === "Inviting" ? true : false}
                      >
                        <View
                          style={{
                            flex: 1,
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                        >
                          {!this.state.loadingUrl ? (
                            <Text
                              style={{
                                // margin: 10,
                                color: "#FFFFFF",
                                fontFamily: "OpenSans-Regular",

                                fontSize: 14
                              }}
                            >
                               {strings('invite')}
                            </Text>
                          ) : (
                            <ActivityIndicator size="small" color="white" />
                          )}
                        </View>
                      </TouchableHighlight>
                    </LinearGradient>
                  </View>
                </View>
              </View>
            </View>
            </View>
          </Aux>
      )
      }else {
      return (
        <View>
          <ImageBackground
            source={require("../../assets/images/wave/friend_purple_banner.png")}
            style={styles.backgroundImageStatic}
          />
          <View style={styles.backgroundImageStaticAbsolute}>
            <View style={[styles.userContainerStatic, styles.firstUser]}>
              <View style={{ flexDirection: "column", alignContent: "center" }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    alignContent: "center",
                    alignSelf: "center",
                    alignItems: "center"
                  }}
                >
                  <View
                    style={{
                      width: Dimensions.get("window").width * 0.25,
                      alignContent: "center",
                      alignSelf: "center",
                      alignItems: "center"
                    }}
                  >
                    <Image
                      style={{
                        width: 65,
                        height: 65
                      }}
                      source={require("../../assets/images/friends_banner_icn.png")}
                    />
                  </View>
                  <View style={{ width: Dimensions.get("window").width * 0.5 }}>
                    <Text
                      style={{
                        fontFamily: "OpenSans-Regular",
                        fontWeight: "400",
                        color: "#FFFFFF",
                        fontSize: 12,
                        textAlign: "left"
                      }}
                    >
                      {this.props.cityInTournament
                        ? "Are you sure you’re team is all set? It’s time to invite everyone to play! \nTo win, each step counts!"
                        : "Let your City join the next edition of the Tournament! \nInvite your friends, play hard and be ready for September!"}
                    </Text>
                  </View>
                  <View style={{ width: 10 }} />
                  <View style={{ width: Dimensions.get("window").width * 0.2 }}>
                    <Image
                      style={{
                        width: 45,
                        height: 45,
                        position: "absolute",
                        top: -90,
                        left: 20
                      }}
                      source={require("../../assets/images/coins_icn_friends_banner.png")}
                    />
                    <LinearGradient
                      start={{ x: 0.0, y: 0.0 }}
                      end={{ x: 1.0, y: 0.0 }}
                      locations={[0, 1.0]}
                      colors={["#7D4D99", "#6497CC"]}
                      style={styles.button}
                    >
                      <TouchableHighlight
                        onPress={this.invite}
                        style={{
                          width: Dimensions.get("window").width * 0.17,
                          height: 30,
                          borderRadius: 15,
                          alignItems: "center"
                        }}

                        // disabled={this.props.status === "Inviting" ? true : false}
                      >
                        <View
                          style={{
                            flex: 1,
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                        >
                          {!this.state.loadingUrl ? (
                            <Text
                              style={{
                                // margin: 10,
                                color: "#FFFFFF",
                                fontFamily: "OpenSans-Regular",

                                fontSize: 14
                              }}
                            >
                               {strings('invite')}
                            </Text>
                          ) : (
                            <ActivityIndicator size="small" color="white" />
                          )}
                        </View>
                      </TouchableHighlight>
                    </LinearGradient>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      );
    }
  }
}



const withConnect = connect(state => {
  return {
    roleAll: state.login.role,
    infoProfile: getProfile(state),
    Points:
      state.statistics.statistics === []
        ? 0
        : state.statistics.statistics.reduce((total, elem, index, array) => {
            return total + elem.points;
          }, 0)
  };
});

InviteFriendsWave.defaultProps = {
  cityInTournament: "false"
};

export default withConnect(InviteFriendsWave);
