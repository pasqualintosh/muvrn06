import React from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
  Image,
  ImageBackground,
  NativeModules,
  Share,
  ScrollView,
  ActivityIndicator,
  TouchableHighlight,
  FlatList
} from "react-native";

import { connect } from "react-redux";

import OwnIcon from "../../components/OwnIcon/OwnIcon";
import DescriptionIcon from "../../components/DescriptionIcon/DescriptionIcon";
import RewardsUser from "../../components/RewardsUser/RewardsUser";
import WavyArea from "./../../components/WavyArea/WavyArea";
import LinearGradient from "react-native-linear-gradient";
import { getBestPlayer } from "./../../domains/screen/ActionCreators";
import { strings } from "../../config/i18n";

class BestPlayersScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      modalActive: false,
      iconChoose: "round_info_icn",
      load: false,
      players: [],
      city: 0
    };
  }
  DescriptionIconModal = typeIcon => {
    // Alert.alert("weather");
    this.setState({
      modalActive: true,
      iconChoose: typeIcon
    });
  };

  DeleteDescriptionIconModal = () => {
    // Alert.alert("weather");
    this.setState({
      modalActive: false
    });
  };

  savePlayers = data => {
    // savePlayers
    if (data.description) {
      this.setState({
        load: true
      });
    } else if (data.length) {
      this.setState({
        load: true,
        players: data
      });
    } else {
      this.setState({
        load: true
      });
    }
  };

  componentWillMount() {
    const infoProfile = this.props.navigation.getParam("infoProfile", {
      city: { id: 0 }
    });

    

    if (infoProfile.city.id) {
      this.setState({ city: infoProfile.city.id})
      this.props.dispatch(
        getBestPlayer({
          city_id: infoProfile.city.id,
          saveData: this.savePlayers
        })
      );
    }
  }

  discount = () => {
    return (
      <View style={styles.gradientContainerDiscount}>
        <View style={styles.gradientContainerCurveDiscount}>
          <WavyArea
            newData={[
              {
                value: 2
              },
              {
                value: 8
              },
              {
                value: 6
              },
              {
                value: 1
              },
              {
                value: 9
              },
              {
                value: 1
              }
            ]}
            // animate={this.state.animate}
            data={[
              {
                value: -3
              },
              {
                value: -2
              },
              {
                value: -2
              },
              {
                value: -3
              },
              {
                value: -4
              },
              {
                value: -2
              }
            ]}
            color={"#F7F8F9"}
            style={{
              height: 40
            }}
          />
          <View
            style={{
              width: Dimensions.get("window").width,
              height: 90,
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            {this.state.load && this.state.players.length > 3 ? (
              <View style={styles.headerContainerDiscount}>
                <View
                  style={{
                    width: 40,
                    height: 90,

                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <OwnIcon
                    name="sacchetto_icn"
                    // click={() => this.DescriptionIconModal("infoTrophies")}
                    size={35}
                    color="#FFCB03"
                  />
                </View>
                <View
                  style={{
                    width: 10,
                    height: 90,

                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                />
                <View
                  style={{
                    width: Dimensions.get("window").width * 0.85 - 50,
                    height: 90,
                    flexDirection: "column",
                    justifyContent: "center"
                  }}
                >
                  <Text style={styles.textDescr}>
                  {this.state.city == 1168 ? ' If the city wins, all the players that contributed will be awarded with honours, virtual Trophies and discounts!':  strings('thanks_to_airli')}
                  </Text>
                </View>
              </View>
            ) : (
              <View style={styles.headerContainerDiscount} />
            )}
          </View>
          {this.state.load && this.state.players.length > 3 ? (
            <WavyArea
              newData={[
                {
                  value: 2
                },
                {
                  value: 8
                },
                {
                  value: 6
                },
                {
                  value: 1
                },
                {
                  value: 9
                },
                {
                  value: 1
                }
              ]}
              // animate={this.state.animate}
              data={[
                {
                  value: 3
                },
                {
                  value: 2
                },
                {
                  value: 2
                },
                {
                  value: 3
                },
                {
                  value: 4
                },
                {
                  value: 2
                }
              ]}
              color={"#F7F8F9"}
              style={{
                height: 40
              }}
            />
          ) : (
            <View
              style={{
                height: 40
              }}
            />
          )}
        </View>
      </View>
    );
  };

  header = () => {
    return (
      <LinearGradient
        start={{ x: 0.0, y: 0.0 }}
        end={{ x: 0.0, y: 1 }}
        locations={[0, 1.0]}
        colors={["#007DC5", "#0C519E"]}
        style={styles.gradientContainer}
      >
        <View style={styles.gradientContainerCurve}>
          <View
            style={{
              width: Dimensions.get("window").width,
              height: 150,
              top: 20,
              width: Dimensions.get("window").width,
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <View style={styles.headerContainer}>
              <View
                style={{
                  width: 40,
                  height: 150,

                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <OwnIcon
                  name="pacco_icn"
                  // click={() => this.DescriptionIconModal("infoTrophies")}
                  size={35}
                  color="#FFCB03"
                />
              </View>
              <View
                style={{
                  width: 10,
                  height: 150,

                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              />
              <View
                style={{
                  width: Dimensions.get("window").width * 0.85 - 50,
                  height: 150,
                  flexDirection: "column",
                  justifyContent: "center"
                }}
              >
                <Text style={styles.textDescr}>
                {this.state.city == 1168 ? 'If the city wins, best players will be awarded with honours, real Trophies and gifts!':  strings('if_your_city_wi')}
                
                </Text>
              </View>
            </View>
          </View>
          <WavyArea
            newData={[
              {
                value: 2
              },
              {
                value: 8
              },
              {
                value: 6
              },
              {
                value: 1
              },
              {
                value: 9
              },
              {
                value: 1
              }
            ]}
            // animate={this.state.animate}
            data={[
              {
                value: 3
              },
              {
                value: 2
              },
              {
                value: 2
              },
              {
                value: 3
              },
              {
                value: 4
              },
              {
                value: 2
              }
            ]}
            color={"#F7F8F9"}
            style={{
              height: 40
            }}
          />
        </View>
      </LinearGradient>
    );
  };

  // Open Sans

  rewardHeader = () => {
    if (this.state.players.length) {
      return (
        <View
          style={{
            width: Dimensions.get("window").width,
            // backgroundColor: "#F7F8F9",
            flexDirection: "column",
            justifyContent: "space-around",
            alignItems: "center",
            top: 80,
            position: "absolute"
          }}
        >
          <View style={styles.rewardContainer}>
            <View style={styles.firstPadding} />
            <View>
              <View style={styles.centerMedals}>
                <Image
                  source={require("../../assets/images/cities/medals_icn.png")}
                  style={{
                    width: 25,
                    height: 25
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      );
    } else {
      return <View />;
    }
  };

  loading = () => {
    console.log("loading best players");
    return (
      <View
        style={{
          width: Dimensions.get("window").width,
          backgroundColor: "#F7F8F9",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          height: 300
        }}
      >
        <RewardsUser key={1} rowID={1} />
        <RewardsUser key={2} rowID={2} />
        <RewardsUser key={3} rowID={3} />
      </View>
    );
  };

  rewards = () => {
    if (this.state.load) {
      return (
        <View
          style={{
            width: Dimensions.get("window").width,
            backgroundColor: "#F7F8F9",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            height: 300
          }}
        >
          {this.state.players.slice(0, 3).map((item, index) => {
            return (
              <RewardsUser
                key={index + 1}
                rowIDColor={index + 1}
                rowID={index + 1}
                user={item.user}
                points={item.points}
                medal={item.medal}
              />
            );
          })}
        </View>
      );
    } else {
      console.log("loading best players");
      return (
        <View
          style={{
            width: Dimensions.get("window").width,
            backgroundColor: "#F7F8F9",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            height: 300
          }}
        >
          <View>
            <ActivityIndicator
              style={{
                alignContent: "center",
                flex: 1,

                alignItems: "center",
                alignSelf: "center"
              }}
              size="large"
              color="#000000"
            />
          </View>
        </View>
      );
    }
  };

  discountHeader = () => {
    if (this.state.load && this.state.players.length > 3) {
      return (
        <View
          style={{
            width: Dimensions.get("window").width,
            // backgroundColor: "#F7F8F9",
            flexDirection: "column",
            justifyContent: "space-around",
            alignItems: "center",
            top: 550,
            position: "absolute"
          }}
        >
          <View style={styles.rewardContainer}>
            <View style={styles.firstPadding} />
            <View>
              <View style={styles.centerMedals}>
                <Image
                  source={require("../../assets/images/cities/medals_icn.png")}
                  style={{
                    width: 25,
                    height: 25
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      );
    } else return <View />;
  };

  discounts = () => {
    if (this.state.load && this.state.players.length > 3) {
      return (
        <View>
        <View
          style={{
            width: Dimensions.get("window").width,
            backgroundColor: "#F7F8F9",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center"
            // height: 300
          }}
        >
          {this.state.players.slice(3).map((item, index) => {
            return (
              <RewardsUser
                key={index}
                rowIDColor={index + 1}
                rowID={index + 4}
                user={item.user}
                points={item.points}
                medal={item.medal}
              />
            );
          })}
          
          </View>
          <WavyArea
            newData={[
              {
                value: 2
              },
              {
                value: 8
              },
              {
                value: 6
              },
              {
                value: 1
              },
              {
                value: 9
              },
              {
                value: 1
              }
            ]}
            // animate={this.state.animate}
            data={[
              {
                value: -3
              },
              {
                value: -2
              },
              {
                value: -2
              },
              {
                value: -3
              },
              {
                value: -4
              },
              {
                value: -2
              }
            ]}
            color={ this.state.players.length % 2 === 0 ? "#F7F8F9" : "#FFFFFF"}
            style={{
              height: 40
            }}
          />
        </View>
      );
    } else {
      return (
        <View
          style={{
            width: Dimensions.get("window").width,
            backgroundColor: "#0C519E",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            height: 300
          }}
        />
      );
    }
  };

  paddingEnd = () => {
    return (
      <View
        style={{
          width: Dimensions.get("window").width,
          height: 100
        }}
      />
    );
  };

  render() {
    let id = 1;
    if (this.props.city && this.props.city.length) {
      // vedo se è tra le città pilota
      id = citiesImage(this.props.city ? this.props.city : "");
    }

    return (
      <ScrollView
        style={{
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height,
          backgroundColor: "#0C519E"
        }}
        showsVerticalScrollIndicator={false}
      >
        <DescriptionIcon
          active={this.state.modalActive}
          icon={this.state.iconChoose}
          DeleteDescriptionIconModal={this.DeleteDescriptionIconModal}
        />
        {this.header()}
        {this.rewardHeader()}
        {this.rewards()}
        {this.discount()}
        {this.discountHeader()}
        {this.discounts()}
        {this.paddingEnd()}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  gradientContainer: {
    // zIndex: -2,
    // position: "absolute",
    // top: 0,
    width: Dimensions.get("window").width,
    height: 170
  },
  gradientContainerDiscount: {
    backgroundColor: "#0C519E",
    width: Dimensions.get("window").width,
    height: 170
  },
  gradientContainerResult: {
    // position: "absolute",
    width: Dimensions.get("window").width,
    height: 150,
    backgroundColor: "transparent"
    // top: 0
  },
  gradientContainerCurve: {
    // position: "absolute",
    width: Dimensions.get("window").width,
    height: 170,
    backgroundColor: "transparent",
    flexDirection: "column",
    justifyContent: "flex-end"
    // top: Dimensions.get("window").height * 0.25
  },
  gradientContainerCurveDiscount: {
    // position: "absolute",
    width: Dimensions.get("window").width,
    height: 170,
    backgroundColor: "#0C519E",
    flexDirection: "column",
    justifyContent: "flex-end"
    // top: Dimensions.get("window").height * 0.25
  },
  firstPadding: {
    paddingLeft: Dimensions.get("window").width * 0.05
  },
  lastPadding: {
    width: 80
  },
  centerMedals: {
    width: 45,
    // height: 100,
    marginRight: 75,
    // borderRightColor: '#FAB21E',
    // borderLeftColor: '#FAB21E',
    // borderRightWidth: 1,
    // borderLeftWidth: 1,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center"
  },
  headerContainer: {
    width: Dimensions.get("window").width * 0.85,
    height: 90,
    // height: 50,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  headerContainerDiscount: {
    width: Dimensions.get("window").width * 0.85,
    height: 40,
    // height: 50,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  rewardContainer: {
    paddingTop: 65,
    paddingBottom: 10,
    width: Dimensions.get("window").width,
    // height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  headerText: {
    fontFamily: "Montserrat-ExtraBold",
    color: "#3F3F3F",
    fontSize: 20,
    textAlign: "left",
    textAlignVertical: "center"
  },
  textDescr: {
    fontFamily: "OpenSans-Regular",
    color: "#ffffff",
    fontSize: 12,
    textAlign: "left",
    textAlignVertical: "center"
  },
  userAvatarImage: {
    width: 55,
    height: 55
  },
  userAvatarMiniImage: {
    width: 40,
    height: 40
  },
  userMedalImage: {
    width: 25,
    height: 25
  },
  backgroundImage: {
    width: Dimensions.get("window").width,
    height: 260,
    position: "absolute",
    top: 30
  },
  gameNumber: {
    color: "#9D9B9C",
    fontSize: 12,
    textAlign: "left",
    // fontWeight: "600",
    fontFamily: "OpenSans-Bold",
    textAlign: "center",
    textAlignVertical: "center"
  },
  pointsText: {
    color: "#ffffff",
    fontSize: 24,
    textAlign: "left",
    // fontWeight: "600",
    fontFamily: "OpenSans-Bold",
    textAlign: "center",
    textAlignVertical: "center"
  },
  points14Text: {
    color: "#ffffff",
    fontSize: 14,
    textAlign: "left",
    // fontWeight: "600",
    fontFamily: "OpenSans-Bold",
    textAlign: "center",
    textAlignVertical: "center"
  },
  points10Text: {
    color: "#3D3D3D",
    fontSize: 10,
    textAlign: "left",
    // fontWeight: "600",
    fontFamily: "OpenSans-Bold",
    textAlign: "center",
    textAlignVertical: "center"
  },
  points10TextRegular: {
    color: "#3D3D3D",
    fontSize: 10,
    textAlign: "left",
    // fontWeight: "600",
    fontFamily: "OpenSans-Regular",
    textAlign: "center",
    textAlignVertical: "center"
  },
  points6Text: {
    color: "#3D3D3D",
    fontSize: 6,
    textAlign: "left",
    // fontWeight: "600",
    fontFamily: "OpenSans-Bold",
    textAlign: "center",
    textAlignVertical: "center"
  },

  Map: {
    fontFamily: "OpenSans-Bold",
    fontSize: 10,
    textAlign: "center",
    color: "#3D3D3D"
  },
  button: {
    width: Dimensions.get("window").width * 0.17,
    height: 30,
    borderRadius: 5,
    alignItems: "center",
    shadowRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    elevation: 1
  },
  value: {
    color: "#3D3D3D",
    fontSize: 30,

    // fontWeight: "600",
    fontFamily: "Montserrat-ExtraBold"
  },
  nameText: {
    color: "#3D3D3D",
    fontSize: 14,
    textAlign: "left",
    // fontWeight: "600",
    fontFamily: "Montserrat-ExtraBold"
  },
  nameWhiteText: {
    color: "#FFFFFF",
    fontSize: 14,
    textAlign: "left",
    // fontWeight: "600",
    fontFamily: "Montserrat-ExtraBold"
  },
  levelText: {
    color: "#3D3D3D",
    fontSize: 14,
    textAlign: "left",

    fontFamily: "OpenSans-Regular"
  },
  timerText: {
    color: "#FFFFFF",
    fontSize: 14,
    textAlign: "center",

    fontFamily: "OpenSans-Regular"
  },
  levelWhiteText: {
    color: "#FFFFFF",
    fontSize: 14,
    textAlign: "left",

    fontFamily: "OpenSans-Regular"
  },
  PointsText: {
    color: "#FFFFFF",
    fontSize: 14,
    textAlign: "left",

    fontFamily: "OpenSans-Bold"
  },
  name10Text: {
    color: "#3D3D3D",
    fontSize: 14,
    textAlign: "left",
    // fontWeight: "600",
    fontFamily: "Montserrat-ExtraBold"
  },
  level10Text: {
    color: "#3D3D3D",
    fontSize: 10,
    textAlign: "left",

    fontFamily: "OpenSans-Regular"
  },
  name12Text: {
    color: "#3D3D3D",
    fontSize: 12,
    textAlign: "left",
    // fontWeight: "600",
    fontFamily: "OpenSans-Bold"
  },

  vs: {
    color: "#9D9B9C",
    opacity: 0.3,
    fontSize: 30,

    fontFamily: "Montserrat-ExtraBold"
  },
  position: {
    color: "#3D3D3D",
    fontSize: 16,
    paddingTop: 4,

    fontFamily: "OpenSans-Regular"
  },
  positionNumber: {
    color: "#3D3D3D",
    fontSize: 20,

    fontWeight: "600",
    fontFamily: "OpenSans-Regular"
  },
  positionWhite: {
    color: "#FFFFFF",
    fontSize: 16,
    paddingTop: 4,

    fontFamily: "OpenSans-Regular"
  },
  positionWhiteNumber: {
    color: "#FFFFFF",
    fontSize: 20,

    fontWeight: "600",
    fontFamily: "OpenSans-Regular"
  },

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  Value: {
    color: "#FFFFFF",
    fontSize: 30,
    textAlign: "center",
    fontFamily: "OpenSans-ExtraBold"
  },
  ValueDescr: {
    color: "#9D9B9C",
    fontSize: 10,
    textAlign: "center",
    fontWeight: "600",
    fontFamily: "OpenSans-Bold"
  },
  cardContainer: {
    width: Dimensions.get("window").width * 0.9,
    // + 45 cosi i punti sono piu sotto e ha piu spazio per fare il giro della card
    height: Dimensions.get("window").height * 0.55 + 25
  },
  card: {
    width: Dimensions.get("window").width * 0.9,
    height: Dimensions.get("window").height * 0.55,
    backgroundColor: "#FE474C",
    borderRadius: 5,
    shadowColor: "rgba(0,0,0,0.5)",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.5,
    justifyContent: "center",
    alignItems: "center"
  },
  card1: {
    backgroundColor: "#FE474C"
  },
  card2: {
    backgroundColor: "#FEB12C"
  },
  label: {
    lineHeight: 470,
    textAlign: "center",
    fontSize: 55,
    fontFamily: "System",
    color: "#ffffff",
    backgroundColor: "transparent"
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "flex-start",
    alignItems: "center",
    width: Dimensions.get("window").width * 0.9,
    height: Dimensions.get("window").height * 0.55,
    borderRadius: 4
  },
  content: {
    marginTop: 14,
    width: Dimensions.get("window").width * 0.83,
    // height: Dimensions.get("window").height * 0.4,
    height: Dimensions.get("window").height * 0.45
    // backgroundColor: "#3d3d3d"
  },

  ImageContent: {
    width: Dimensions.get("window").width * 0.83,
    // height: Dimensions.get("window").height * 0.4,
    height: Dimensions.get("window").height * 0.45
    // backgroundColor: "#3d3d3d"
  },
  avatarImage: {
    // flex: 1,
    // position: "absolute",
    width: 150,
    height: 150,
    alignSelf: "center",
    opacity: 1
  },
  cityImage: {
    flex: 1,
    // position: "absolute",

    width: 214,
    height: 350,
    alignSelf: "center",
    justifyContent: "center",
    flexDirection: "row",
    opacity: 1
  },
  cityCircle: {
    // position: "absolute",
    borderRadius: 100,

    width: 200,
    height: 200,
    alignSelf: "center",
    justifyContent: "center",
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.5)"
  }
});

if (NativeModules.RNDeviceInfo.model.includes("iPad")) {
  Object.assign(styles, {
    avatarImage: {
      flex: 1,
      // position: "absolute",
      width: 102,
      height: 168,
      alignSelf: "center"
    },
    cardContainer: {
      width: Dimensions.get("window").width * 0.8,
      height: Dimensions.get("window").height * 0.45
    },
    card: {
      width: Dimensions.get("window").width * 0.8,
      height: Dimensions.get("window").height * 0.45,
      backgroundColor: "#FE474C",
      borderRadius: 5,
      shadowColor: "rgba(0,0,0,0.5)",
      shadowOffset: {
        width: 0,
        height: 1
      },
      shadowOpacity: 0.5,
      justifyContent: "center",
      alignItems: "center"
    },
    contentContainer: {
      flex: 1,
      backgroundColor: "#fff",
      justifyContent: "flex-start",
      alignItems: "center",
      width: Dimensions.get("window").width * 0.8,
      height: Dimensions.get("window").height * 0.45,
      borderRadius: 4
    },
    content: {
      marginTop: 14,
      width: Dimensions.get("window").width * 0.73,
      height: Dimensions.get("window").height * 0.35,
      backgroundColor: "#3d3d3d"
    },
    nameText: {
      color: "#fff",
      fontSize: 18,
      textAlign: "center",
      fontFamily: "Montserrat-ExtraBold"
    },
    levelText: {
      color: "#E83475",
      fontSize: 16,
      textAlign: "center",
      fontFamily: "Montserrat-ExtraBold"
    }
  });
}

const withData = connect();

export default withData(BestPlayersScreen);
