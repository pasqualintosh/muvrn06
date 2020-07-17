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
import Aux from "../../helpers/Aux";

import Svg, {
  Circle,
  Line,
  Defs,
  Pattern,
  Path,
  Rect,
  Ellipse
} from "react-native-svg";

import LinearGradient from "react-native-linear-gradient";

import {
  citiesImage,
  imagesCity
} from "./../../components/FriendItem/FriendItem";
import { citiesDescription } from "./../CityScreenCards/CityScreenCards";
import { images } from "./../../components/InfoUserHome/InfoUserHome";
import GameUserItem from "./../../components/GameUserItem/GameUserItem";
import GameReverseUserItem from "./../../components/GameReverseUserItem/GameReverseUserItem";
import { medalSmallGlobalView } from "./../TrophiesRanking/TrophiesRanking";

class GameTournamentScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0
    };
  }

  changePage = index => {
    this.game.scrollToIndex({ index: index - 1 });
    this.setState({
      index: index - 1
    });
  };

  headerGame = () => {
    const array = [
      { game: 1, status: 2 },
      { game: 2, status: 2 },
      { game: 3, status: 1 },
      { game: 4, status: 0 },
      { game: 5, status: 0 },
      { game: 7, status: 0 },
      { game: 8, status: 0 }
    ];

    return array.map(elem => (
      <TouchableOpacity
        key={elem.game}
        disabled={!elem.status}
        style={{
          height: 30,
          width: Dimensions.get("window").width / 7,

          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "center"
        }}
        onPress={() => this.changePage(elem.game)}
      >
        <View
          style={{
            height: 30,
            width: Dimensions.get("window").width / 7,

            flexDirection: "column",
            justifyContent: "flex-end",
            alignItems: "center"
          }}
        >
          <View
            style={{
              height: 3,
              width: Dimensions.get("window").width / 8,
              flexDirection: "column"
            }}
          />
          <View
            style={{
              height: 22,
              width: Dimensions.get("window").width / 8,
              flexDirection: "row",
              justifyContent: "flex-start",
              left: -5,
              opacity: elem.status ? 1 : 0.2
            }}
          >
            <Svg height={22} width={22} viewBox="0 0 100 100">
              <Circle
                cx="50"
                cy="50"
                r="12"
                //stroke="white"
                fill={elem.status === 2 ? "#3363AD" : "#F7F8F9"}
              />
            </Svg>

            <View
              style={{
                height: 22,
                width: Dimensions.get("window").width / 8 - 22,
                flexDirection: "row",
                justifyContent: "center",
                left: -5
              }}
            >
              <Text style={styles.gameNumber}>{elem.game}</Text>
            </View>
          </View>
          <View
            style={{
              height: 5,
              backgroundColor:
                this.state.index === elem.game - 1 ? "#E83475" : "#9D9B9C",
              width: Dimensions.get("window").width / 8,
              flexDirection: "column",
              opacity: elem.status ? 1 : 0.2
            }}
          />
        </View>
      </TouchableOpacity>
    ));
  };

  handleScrollHeader(event) {
    // console.log(event.nativeEvent)
    const x = event.nativeEvent.contentOffset.x;
    // console.log(x);
    const deviceWidth = Dimensions.get("window").width;
    // console.log(deviceWidth)
    // const offset = x % deviceWidth;
    // console.log(offset);
    // let newIndex = parseInt(x / deviceWidth) * deviceWidth;
    // let newX = newIndex / 3;
    // console.log(newX);
    // if (offset >= deviceWidth / 2) {
    //   newX += deviceWidth / 3;
    // }
    // console.log(newX);
    // console.log(this.header.getScrollResponder());

    let index = parseInt((x + deviceWidth / 1.8) / deviceWidth);

    // this.header.scrollToIndex({ index: index });
    this.game.scrollToIndex({ index: index });
    this.setState({
      index
    });
  }

  singlePage = id => {
    return (
      <Aux>
        <ImageBackground
          source={require("./../../assets/images/wave/live_match_bg.png")}
          style={styles.backgroundImage}
        />
        <View
          style={{
            width: Dimensions.get("window").width,
            height: 10
            // backgroundColor: "blue"
          }}
        />
        <View
          style={{
            width: Dimensions.get("window").width,
            height: 170,
            // backgroundColor: "red",
            justifyContent: "center",
            flexDirection: "row"
          }}
        >
          <View
            style={{
              width: Dimensions.get("window").width / 3,
              height: 170,
              alignItems: "center",
              justifyContent: "space-around",
              flexDirection: "column"
            }}
          >
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <Text style={[styles.nameWhiteText]}>
                {"Palermo".toUpperCase()}
              </Text>
              <Text style={[styles.levelWhiteText]}>
                {citiesDescription("Palermo")}
              </Text>
            </View>
            <View
              style={{
                width: 80,
                height: 80,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Image
                source={imagesCity[id]}
                style={{
                  width: 60,
                  height: 60
                }}
              />
            </View>
            <Text style={[styles.PointsText]}>{57.584}</Text>
          </View>
          <View
            style={{
              width: Dimensions.get("window").width / 3,
              height: 170,
              alignItems: "center",
              justifyContent: "space-around",
              flexDirection: "column"
            }}
          >
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <OwnIcon name="timer_icn" size={35} color={"#FFFFFF"} />

              <Text style={styles.timerText}>6h 34 min</Text>
            </View>
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <View style={{ width: 100, height: 50 }} />

              <View style={{ width: 100, height: 50, position: "absolute" }} />
            </View>
          </View>
          <View
            style={{
              width: Dimensions.get("window").width / 3,
              height: 170,
              alignItems: "center",
              justifyContent: "space-around",
              flexDirection: "column"
            }}
          >
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <Text style={[styles.nameWhiteText]}>{"Roma".toUpperCase()}</Text>
              <Text style={[styles.levelWhiteText]}>
                {citiesDescription("Roma")}
              </Text>
            </View>
            <View
              style={{
                width: 80,
                height: 80,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Image
                source={imagesCity[3]}
                style={{
                  width: 60,
                  height: 60
                }}
              />
            </View>
            <Text style={[styles.PointsText]}>{57.584}</Text>
          </View>
        </View>
        <View
          style={{
            width: Dimensions.get("window").width,
            height: 10
            // backgroundColor: "blue"
          }}
        />
        <View
          style={{
            width: Dimensions.get("window").width,
            height: 70,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column"
            // backgroundColor: "black"
          }}
        >
          <View
            style={{
              width: Dimensions.get("window").width * 0.9,
              height: 70,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row"
              // backgroundColor: "green"
            }}
          >
            <View
              style={{
                width: 70,
                height: 70,
                alignItems: "center",
                justifyContent: "flex-start",
                flexDirection: "row"
                // backgroundColor: "green"
              }}
            >
              <Image style={styles.userAvatarImage} source={images[5]} />
            </View>
            <View
              style={{
                width: Dimensions.get("window").width * 0.9 - 140,
                height: 70,
                alignItems: "center",
                justifyContent: "flex-start",
                flexDirection: "row"
                // backgroundColor: "green"
              }}
            >
              <Text style={styles.points14Text}>Roberto F.</Text>
            </View>
            <View
              style={{
                width: 70,
                height: 70,
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row"
                // backgroundColor: "green"
              }}
            >
              <Text style={styles.points14Text}>1.100</Text>
            </View>
          </View>
        </View>

        <View
          style={{
            width: Dimensions.get("window").width,
            flexDirection: "row",
            justifyContent: "flex-start"
          }}
        >
          <GameUserItem color={"#FFFFFF"} avatar={1} />
          <GameReverseUserItem color={"#FFFFFF"} avatar={2} />
          <View
            style={{
              width: Dimensions.get("window").width,
              flexDirection: "row",
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
              height: 60,
              position: "absolute"
            }}
          >
            <Image
              style={styles.userMedalImage}
              source={medalSmallGlobalView[1]}
            />
          </View>
        </View>
        <View
          style={{
            width: Dimensions.get("window").width,
            flexDirection: "row",
            justifyContent: "flex-start"
          }}
        >
          <GameUserItem
            color={"#F7F8F9"}
            avatar={3}
            points={"2.200"}
            community={"Benetton"}
          />
          <GameReverseUserItem color={"#F7F8F9"} avatar={4} />
          <View
            style={{
              width: Dimensions.get("window").width,
              flexDirection: "row",
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
              height: 60,
              position: "absolute"
            }}
          >
            <Image
              style={styles.userMedalImage}
              source={medalSmallGlobalView[2]}
            />
          </View>
        </View>
        <View
          style={{
            width: Dimensions.get("window").width,
            flexDirection: "row",
            justifyContent: "flex-start"
          }}
        >
          <GameUserItem color={"#FFFFFF"} avatar={5} />
          <GameReverseUserItem color={"#FFFFFF"} avatar={6} />
          <View
            style={{
              width: Dimensions.get("window").width,
              flexDirection: "row",
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
              height: 60,
              position: "absolute"
            }}
          >
            <Image
              style={styles.userMedalImage}
              source={medalSmallGlobalView[3]}
            />
          </View>
        </View>
        <View
          style={{
            width: Dimensions.get("window").width,
            flexDirection: "row",
            justifyContent: "flex-start"
          }}
        >
          <GameUserItem color={"#F7F8F9"} avatar={7} />
          <GameReverseUserItem color={"#F7F8F9"} avatar={8} />
        </View>

        <View
          style={{
            height: 100,

            flexDirection: "row"
          }}
        />
      </Aux>
    );
  };

  render() {
    let id = 1;
    if (this.props.city && this.props.city.length) {
      // vedo se è tra le città pilota
      id = citiesImage(this.props.city ? this.props.city : "");
    }

    return (
      <View
        style={{
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height,
          backgroundColor: "#F7F8F9"
        }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            height: 30,

            flexDirection: "row"
          }}
        >
          {this.headerGame()}
        </View>
        <FlatList
          style={{
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height * 2
          }}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={10}
          horizontal
          pagingEnabled
          showsVerticalScrollIndicator={false}
          // onScroll={this.handleScroll.bind(this)}
          ref={ref => (this.game = ref)}
          onScrollEndDrag={this.handleScrollHeader.bind(this)}
          data={[{ key: "a" }, { key: "b" }, { key: "c" }]}
          renderItem={({ item }) => (
            <ScrollView
              style={{
                width: Dimensions.get("window").width,
                height: Dimensions.get("window").height,
                backgroundColor: "#F7F8F9"
              }}
              showsVerticalScrollIndicator={false}
            >
              {this.singlePage(id)}
            </ScrollView>
          )}
        />
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
    top: 0
  },
  gameNumber: {
    color: "#9D9B9C",
    fontSize: 16,
    textAlign: "left",
    // fontWeight: "600",
    fontFamily: "Montserrat-ExtraBold",
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

export default withData(GameTournamentScreen);
