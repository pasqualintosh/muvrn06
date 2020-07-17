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
  TouchableHighlight
} from "react-native";

import {
  citiesImage,
  imagesCity
} from "./../../components/FriendItem/FriendItem";

import ArrowGame from "./../../components/ArrowGame/ArrowGame";
import pointsDecimal from "../../helpers/pointsDecimal";

class ScheduleSingleCityGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderHeaderPlayoff = () => {
    // per ogni settimana faccio un header a coppie differenti 

    // prima settimana di playoff
    if (this.props.indexMatch == 0 && this.props.indexWeek == 7) {
      return (<View
        style={{
          width: Dimensions.get("window").width,
          height: 40,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          backgroundColor: '#FFFFFF'
        }}
      >
        <Text style={styles.gameGroup}>START</Text>
      </View>)
    } else if (this.props.indexWeek == 8) {
      if (this.props.indexMatch == 0) {
      return (<View
        style={{
          width: Dimensions.get("window").width,
          height: 40,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          backgroundColor: '#FFFFFF'
        }}
      >
        <Text style={styles.gameGroup}>GRUPPO VINCENTI</Text>
      </View>)
      } else if (this.props.indexMatch == 4) {
        return (<View
          style={{
            width: Dimensions.get("window").width,
            height: 40,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            backgroundColor: '#FFFFFF'
          }}
        >
          <Text style={styles.gameGroup}>GRUPPO PERDENTI</Text>
        </View>)
        } else {
          return (<View />)
        }
    } else if (this.props.indexWeek == 9) {
      if (this.props.indexMatch == 0) {
      return (<View
        style={{
          width: Dimensions.get("window").width,
          height: 40,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          backgroundColor: '#FFFFFF'
        }}
      >
        <Text style={styles.gameGroup}>GRUPPO VINCENTI 1</Text>
      </View>)
      } else if (this.props.indexMatch == 2) {
        return (<View
          style={{
            width: Dimensions.get("window").width,
            height: 40,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            backgroundColor: '#FFFFFF'
          }}
        >
          <Text style={styles.gameGroup}>GRUPPO PERDENTI 1</Text>
        </View>)
        } else if (this.props.indexMatch == 4) {
          return (<View
            style={{
              width: Dimensions.get("window").width,
              height: 40,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              backgroundColor: '#FFFFFF'
            }}
          >
            <Text style={styles.gameGroup}>GRUPPO PERDENTI 2</Text>
          </View>)
          } else if (this.props.indexMatch == 6) {
            return (<View
              style={{
                width: Dimensions.get("window").width,
                height: 40,
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
                backgroundColor: '#FFFFFF'
              }}
            >
              <Text style={styles.gameGroup}>GRUPPO PERDENTI 3</Text>
            </View>)
            }else {
          return (<View />)
        }
    } else if (this.props.indexWeek == 10) {
      if (this.props.indexMatch == 0) {
      return (<View
        style={{
          width: Dimensions.get("window").width,
          height: 40,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          backgroundColor: '#FFFFFF'
        }}
      >
        <Text style={styles.gameGroup}>1st and 2nd PLACE</Text>
      </View>)
      } else if (this.props.indexMatch == 1) {
        return (<View
          style={{
            width: Dimensions.get("window").width,
            height: 40,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            backgroundColor: '#FFFFFF'
          }}
        >
          <Text style={styles.gameGroup}>3rd and 4th PLACE</Text>
        </View>)
        } else if (this.props.indexMatch == 2) {
          return (<View
            style={{
              width: Dimensions.get("window").width,
              height: 40,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              backgroundColor: '#FFFFFF'
            }}
          >
            <Text style={styles.gameGroup}>5th and 6th PLACE</Text>
          </View>)
          } else if (this.props.indexMatch == 3) {
            return (<View
              style={{
                width: Dimensions.get("window").width,
                height: 40,
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
                backgroundColor: '#FFFFFF'
              }}
            >
              <Text style={styles.gameGroup}>7th and 8th PLACE</Text>
            </View>)
            } else if (this.props.indexMatch == 4) {
              return (<View
                style={{
                  width: Dimensions.get("window").width,
                  height: 40,
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                  backgroundColor: '#FFFFFF'
                }}
              >
                <Text style={styles.gameGroup}>9th and 10th PLACE</Text>
              </View>)
              } else if (this.props.indexMatch == 5) {
                return (<View
                  style={{
                    width: Dimensions.get("window").width,
                    height: 40,
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                    backgroundColor: '#FFFFFF'
                  }}
                >
                  <Text style={styles.gameGroup}>11th and 12th PLACE</Text>
                </View>)
                } else if (this.props.indexMatch == 6) {
                  return (<View
                    style={{
                      width: Dimensions.get("window").width,
                      height: 40,
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "row",
                      backgroundColor: '#FFFFFF'
                    }}
                  >
                    <Text style={styles.gameGroup}>13th and 14th PLACE</Text>
                  </View>)
                  } else if (this.props.indexMatch == 7) {
                    return (<View
                      style={{
                        width: Dimensions.get("window").width,
                        height: 40,
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "row",
                        backgroundColor: '#FFFFFF'
                      }}
                    >
                      <Text style={styles.gameGroup}>15th and 16th PLACE</Text>
                    </View>)
                    } else {
          return (<View />)
        }
    } else {
      return (<View />)
    }
  }

  render() {
    let idHome = 1;
    let idAway = 1;
    if (this.props.city_home.city_name) {
      // vedo se è tra le città pilota
      idHome = citiesImage(this.props.city_home.city_name);
    }
    if (this.props.city_away.city_name) {
      idAway = citiesImage(this.props.city_away.city_name);
    }
    let backgroundColor = "transparent";
    if (this.props.rowID) {
      backgroundColor = this.props.indexWeek == 10 ? this.props.indexMatch == 0 ? "#FAB21E" : "#F7F8F9" : this.props.rowID % 2 === 0 ? "#FFFFFF" : "#F7F8F9";
    }

    const statusFuture = this.props.statusMatch == 0
    const statusLive = this.props.statusMatch == 1
    const winAway = this.props.total_point_away > this.props.total_point_home
    const playoff = this.props.indexWeek > 6
    // utile anche  per il colore 

    const groupA = this.props.division == "Group A"

    // prime sette settimane this.props.indexWeek < 7, le successive sono i playoff quindi posso fare le varie suddivioni a seconda della fase
    return (
      <View>

        {!playoff ? this.props.indexMatch == 0 || this.props.indexMatch == 4 ? <View
          style={{
            width: Dimensions.get("window").width,
            height: 40,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            backgroundColor: '#FFFFFF'
          }}
        >
          <Text style={styles.gameGroup}>{groupA ? 'PURPLE' : 'RED'} DIVISION</Text>
        </View> : <View /> : this.renderHeaderPlayoff()}
        <TouchableOpacity onPress={() => this.props.goToGame(this.props.statusMatch, this.props.match, this.props.total_point_away, this.props.total_point_home)} disabled={statusFuture}>
          <View
            style={{
              width: Dimensions.get("window").width,
              height: 80,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              backgroundColor: backgroundColor
            }}
          >
            <View
              style={{
                width: 10,
                height: 10
              }}
            />
            <Image
              source={imagesCity[idHome]}
              style={{
                width: 40,
                height: 40,
                opacity: !winAway ? 1 : !statusFuture && !statusLive ? 0.7 : 1,
              }}
            />
            <View
              style={{
                width: 10,
                height: 10
              }}
            />
            <View
              style={{
                width: (Dimensions.get("window").width - 190) / 2,
                height: 80,

                justifyContent: "center",
                alignContent: "flex-end",
                alignSelf: "flex-end",
                flexDirection: "column",
                alignItems: "flex-end",
                opacity: !winAway ? 1 : !statusFuture && !statusLive ? 0.7 : 1,
              }}
            >
              <Text style={styles.gameNumber}>{this.props.city_home.city_name}</Text>
              {!statusFuture ? <Text style={styles.gamePointsRight}>{pointsDecimal(this.props.total_point_home)}</Text> : <View />}
            </View>
            <View
              style={{
                width: 70,
                height: 80,

                justifyContent: "center",
                alignContent: "center",
                alignSelf: "center",
                flexDirection: "row",
                alignItems: "center"
              }}
            >
              {/* <Text style={styles.gamePointNumber}>1</Text>
            <Text style={styles.gamePointNumber}>|</Text>
            <Text style={styles.gamePointNumber}>3</Text> */}
              <ArrowGame
                width={50}
                right={winAway}
                // color={statusLive ? "#E83475" : "#3D3D3D"}
                color={playoff ? groupA ? '#E83475' : '#3D3D3D' : groupA ? '#60368C' : '#E20000'}
                height={80}
                center={statusFuture || this.props.total_point_away == this.props.total_point_home}
              />
            </View>
            <View
              style={{
                width: (Dimensions.get("window").width - 190) / 2,
                height: 80,
                opacity: winAway ? 1 : !statusFuture && !statusLive ? 0.7 : 1,
                justifyContent: "center",
                alignContent: "flex-start",
                alignSelf: "flex-start",
                flexDirection: "column",
                alignItems: "flex-start"
              }}
            >
              <Text style={styles.gameNumber}>{this.props.city_away.city_name}</Text>
              {!statusFuture ? <Text style={styles.gamePoints}>{pointsDecimal(this.props.total_point_away)}</Text> : <View />}
            </View>
            <View
              style={{
                width: 10,
                height: 10
              }}
            />
            <Image
              source={imagesCity[idAway]}
              style={{
                width: 40,
                height: 40,
                opacity: winAway ? 1 : !statusFuture && !statusLive ? 0.7 : 1,
              }}
            />
            <View
              style={{
                width: 10,
                height: 10
              }}
            />
          </View>
        </TouchableOpacity>
        {this.props.last == this.props.indexMatch + 1 ? <View
          style={{

            height: 400
          }}
        /> : <View

          />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
    color: "#3D3D3D",
    fontSize: 12,

    // fontWeight: "600",
    fontFamily: "OpenSans-Bold",
    textAlign: "center",
    textAlignVertical: "center"
  },
  gameGroup: {
    color: "#3D3D3D",
    fontSize: 12,

    // fontWeight: "600",
    fontFamily: "OpenSans-Bold",
    textAlign: "center",
    textAlignVertical: "center"
  },
  gamePoints: {
    color: "#3D3D3D",
    fontSize: 14,

    // fontWeight: "600",
    fontFamily: "OpenSans-Regular",
    textAlign: "center",
    textAlignVertical: "center"
  },
  gamePointsRight: {
    color: "#3D3D3D",
    fontSize: 14,

    // fontWeight: "600",
    fontFamily: "OpenSans-Regular",
    textAlign: "right",

    textAlignVertical: "center"
  },
  gamePointNumber: {
    color: "#3D3D3D",
    fontSize: 20,

    // fontWeight: "600",
    fontFamily: "OpenSans-ExtraBold",
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

ScheduleSingleCityGame.defaultProps = {
  color: "#F7F8F9",
  avatar: 1,
  points: "1.100",
  city_home: {
    "id": 617,
    "lat": 41.3828939,
    "lon": 2.1774322,
    "city_name": "Barcelona",
    "city_name_eng": null,
    "country_name": "Spain"
  },
  city_away: {
    "id": 1122,
    "lat": 38.1112268,
    "lon": 13.3524434,
    "city_name": "Palermo",
    "city_name_eng": null,
    "country_name": "Italy"
  },
  total_point_home: 0,
  total_point_away: 0,
  statusMatch: 0

};

export default ScheduleSingleCityGame;
