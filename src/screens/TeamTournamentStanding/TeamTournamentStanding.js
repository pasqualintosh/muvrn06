import React from "react";
import {
  View,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Text,
  TouchableWithoutFeedback,
  Platform,
  ImageBackground,
  ListView
} from "react-native";
import Svg, { Circle, Line } from "react-native-svg";

import { styles, negativeData } from "./Style";
import WavyArea from "./../../components/WavyArea/WavyArea";
import UserItem from "./../../components/UserItem/UserItem";
import UserItemDetailTournament from "./../../components/UserItemDetailTournament/UserItemDetailTournament";

import Aux from "./../../helpers/Aux";
import { connect } from "react-redux";
import pointsDecimal from "../../helpers/pointsDecimal";
import OwnIcon from "../../components/OwnIcon/OwnIcon";
import LinearGradient from "react-native-linear-gradient";
import { getProfile, getRoleState } from "./../../domains/login/Selectors";
import { getLevelState } from "./../../domains/trainings/Selectors";

import { getWeeklyStandingsComplete } from "./../../domains/screen/ActionCreators";
import { strings } from "../../config/i18n";
import InviteItem from "./../../components/InviteItem/InviteItem";

// import { pushNotifications } from "./../../services";

class TeamTournamentStanding extends React.Component {
  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.state = {
      activeSelectable: "global",
      loadData: false,
      dataSource: null,
      number: 0,
      showLoading: true,
      refreshing: false,
      position: "-",
      totPoints: 0,
      infoProfile: null,
      city_id: 0,
      lock: [
        {
          image: require("../../assets/images/wave/5percent.png"),
          number: 8,
          colorStart: "#FFCB03",
          colorEnd: "#F8B126"
        },
        {
          image: require("../../assets/images/wave/10percent.png"),
          number: 13,
          colorStart: "#FAB21E",
          colorEnd: "#FA941E"
        },
        {
          image: require("../../assets/images/wave/15percent.png"),
          number: 28,
          colorStart: "#FA941E",
          colorEnd: "#EA7D00"
        },
        {
          image: require("../../assets/images/wave/20percent.png"),
          number: 53,
          colorStart: "#EA7D00",
          colorEnd: "#EA3600"
        }
      ],
      unlock: [
        {
          image: require("../../assets/images/wave/5percent_bar.png"),
          number: 8
        },
        {
          image: require("../../assets/images/wave/10percent_bar.png"),
          number: 13
        },
        {
          image: require("../../assets/images/wave/15percent_bar.png"),
          number: 28
        },
        {
          image: require("../../assets/images/wave/20percent_bar.png"),
          number: 53
        }
      ]
    };

    this.displayStandings = false;
  }

  myProfile = () => {
    this.props.navigation.navigate("Info");
  };

  savePlayers = data => {
    // savePlayers
    // const data = [...data2, ...data2];
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    let infoUserGlobalClassification = { index: "-", points: 0 };

    if (this.state.infoProfile) {
      for (index = 0; index < data.length; index++) {
        const condition =
          data[index].user.user_id === this.state.infoProfile.user_id
            ? true
            : false;
        if (condition) {
          infoUserGlobalClassification = {
            ...data[index],
            index
          };
          break;
        }
      }
    }

    const number = data.length;
    // a seconda di quanti utenti ho cancello i bonus futuri
    let lock = [
      {
        image: require("../../assets/images/wave/5percent.png"),
        number: 8,
        colorStart: "#FFCB03",
        colorEnd: "#F8B126"
      },
      {
        image: require("../../assets/images/wave/10percent.png"),
        number: 13,
        colorStart: "#FAB21E",
        colorEnd: "#FA941E"
      },
      {
        image: require("../../assets/images/wave/15percent.png"),
        number: 28,
        colorStart: "#FA941E",
        colorEnd: "#EA7D00"
      },
      {
        image: require("../../assets/images/wave/20percent.png"),
        number: 53,
        colorStart: "#EA7D00",
        colorEnd: "#EA3600"
      }
    ];
    if (number > 52) {
      lock = [];
    } else if (number > 27) {
      lock = [
        {
          image: require("../../assets/images/wave/20percent.png"),
          number: 53,
          colorStart: "#EA7D00",
          colorEnd: "#EA3600"
        }
      ];
    } else if (number > 12) {
      lock = [
        {
          image: require("../../assets/images/wave/15percent.png"),
          number: 28,
          colorStart: "#FA941E",
          colorEnd: "#EA7D00"
        },
        {
          image: require("../../assets/images/wave/20percent.png"),
          number: 53,
          colorStart: "#EA7D00",
          colorEnd: "#EA3600"
        }
      ];
    } else if (number > 7) {
      lock = [
        {
          image: require("../../assets/images/wave/10percent.png"),
          number: 13,
          colorStart: "#FAB21E",
          colorEnd: "#FA941E"
        },
        {
          image: require("../../assets/images/wave/15percent.png"),
          number: 28,
          colorStart: "#FA941E",
          colorEnd: "#EA7D00"
        },
        {
          image: require("../../assets/images/wave/20percent.png"),
          number: 53,
          colorStart: "#EA7D00",
          colorEnd: "#EA3600"
        }
      ];
    }

    this.setState({
      loadData: true,
      refreshing: false,
      dataSource: ds.cloneWithRows(data),
      number,
      lock,
      position: infoUserGlobalClassification.index,
      totPoints: infoUserGlobalClassification.points
    });
  };

  componentWillMount() {
    // const match = this.props.navigation.getParam("match", {});
    const infoProfile = this.props.navigation.getParam("infoProfile", null);
    const city_id = this.props.navigation.getParam("city_id", 0);
    const totPoints = this.props.navigation.getParam("me", 0);

    this.setState({
      // match,
      infoProfile,
      city_id,
      totPoints
    });
    if (infoProfile && infoProfile.city.id) {
      this.props.dispatch(
        getWeeklyStandingsComplete({
          city_id: infoProfile.city.id,
          saveData: this.savePlayers
        })
      );
    } else if (city_id) {
      this.props.dispatch(
        getWeeklyStandingsComplete({
          city_id: city_id,
          saveData: this.savePlayers
        })
      );
    }
  }

  onRefresh() {
    this.setState({ refreshing: true });
    // this.props.dispatch(getLeaderboard());
    // this.props.dispatch(getLeaderboardByCity());

    if (this.state.infoProfile && this.state.infoProfile.city.id) {
      this.props.dispatch(
        getWeeklyStandingsComplete({
          city_id: this.state.infoProfile.city.id,
          saveData: this.savePlayers
        })
      );
    } else if (this.state.city_id) {
      this.props.dispatch(
        getWeeklyStandingsComplete({
          city_id: this.state.city_id,
          saveData: this.savePlayers
        })
      );
    }
  }

  displayWavyArea() {
    if (this.displayStandings)
      return (
        <WavyArea
          data={negativeData}
          color={"#3D3D3D"}
          style={styles.overlayWave}
        />
      );
  }

  //
  bonusLock = (
    image = require("../../assets/images/wave/5percent.png"),
    number = 8,
    colorStart = "#FFCB03",
    colorEnd = "#F8B126"
  ) => {
    console.log("prova");
    return (
      <View>
        <LinearGradient
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 0.0, y: 1.0 }}
          locations={[0, 1.0]}
          colors={[colorStart, colorEnd]}
          style={{
            width: Dimensions.get("window").width,
            height: 100,
            justifyContent: "center",
            flexDirection: "row",
            alignContent: "center",
            alignItems: "center",
            alignSelf: "center"
          }}
        >
          <ImageBackground
            // start={{ x: 0.0, y: 0.0 }}
            // end={{ x: 0.0, y: 1.0 }}
            // locations={[0, 1.0]}
            // colors={["#FAB21E", "#FA941E"]}
            source={image}
            style={{
              width: Dimensions.get("window").width,
              height: 100,
              flexDirection: "row",
              alignContent: "center",
              alignItems: "center",
              alignSelf: "center",
              justifyContent: "space-between"
            }}
          >
            <View style={styles.userPositionContainer}>
              <Text style={[styles.userPosition]}>{number}</Text>
            </View>

            <View
              style={{
                flexDirection: "row"
              }}
            >
              <View
                style={{
                  width: 27,
                  height: 100,
                  flexDirection: "row",
                  alignContent: "center",
                  alignItems: "center",
                  alignSelf: "center",
                  justifyContent: "space-between"
                }}
              >
                <Text style={{ fontSize: 17 }}>🔥</Text>
              </View>
              <View
                style={{
                  width: Dimensions.get("window").width * 0.05,
                  height: 100,
                  flexDirection: "row",
                  alignContent: "center",
                  alignItems: "center",
                  alignSelf: "center",
                  justifyContent: "space-between"
                }}
              />
            </View>
          </ImageBackground>
        </LinearGradient>
        {number === 53 ? (
          <View />
        ) : (
          <View
            style={{
              width: Dimensions.get("window").width,
              height: 2,
              backgroundColor: "#F7F8F9",
              flexDirection: "row",
              alignContent: "center",
              alignItems: "center",
              alignSelf: "center",
              justifyContent: "space-between"
            }}
          ></View>
        )}
      </View>
    );
  };

  bonusUnlock = () => {
    return (
      <View>
        <ImageBackground
          // start={{ x: 0.0, y: 0.0 }}
          // end={{ x: 0.0, y: 1.0 }}
          // locations={[0, 1.0]}
          // colors={["#FAB21E", "#FA941E"]}
          source={require("../../assets/images/wave/5percent_bar.png")}
          style={{
            width: Dimensions.get("window").width,
            height: 100,
            justifyContent: "center",
            flexDirection: "row",
            alignContent: "center",
            alignItems: "center",
            alignSelf: "center"
          }}
        >
          <View
            style={{
              width: Dimensions.get("window").width * 0.9,
              height: 100,

              flexDirection: "row",
              alignContent: "center",
              alignItems: "center",
              alignSelf: "center",
              justifyContent: "space-between"
            }}
          >
            <Text style={{ fontSize: 30 }}>🔥</Text>
            <OwnIcon name="rank_arrow_down_icn" size={30} color={"#FFFFFF"} />
            <View />
            <OwnIcon name="rank_arrow_down_icn" size={30} color={"#FFFFFF"} />
            <Text style={{ fontSize: 30 }}>🔥</Text>
          </View>
        </ImageBackground>
      </View>
    );
  };

  bonusView = rowID => {
    let image = require("../../assets/images/wave/5percent_bar.png");
    if (rowID == 12) {
      image = require("../../assets/images/wave/10percent_bar.png");
    } else if (rowID == 27) {
      image = require("../../assets/images/wave/15percent_bar.png");
    } else if (rowID == 52) {
      image = require("../../assets/images/wave/20percent_bar.png");
    }
    return (
      <ImageBackground
        // start={{ x: 0.0, y: 0.0 }}
        // end={{ x: 0.0, y: 1.0 }}
        // locations={[0, 1.0]}
        // colors={["#FAB21E", "#FA941E"]}
        key={rowID}
        source={image}
        style={{
          width: Dimensions.get("window").width,
          height: 100,
          justifyContent: "center",
          flexDirection: "row",
          alignContent: "center",
          alignItems: "center",
          alignSelf: "center"
        }}
      >
        <View
          style={{
            width: Dimensions.get("window").width * 0.9,
            height: 100,

            flexDirection: "row",
            alignContent: "center",
            alignItems: "center",
            alignSelf: "center",
            justifyContent: "space-between"
          }}
        >
          <Text style={{ fontSize: 30 }}>🔥</Text>

          <View />

          <Text style={{ fontSize: 30 }}>🔥</Text>
        </View>
      </ImageBackground>
    );
  };

  renderPage() {
    this.displayStandings = true;
    // id dell'utente connesso se serve
    const user_id = this.state.infoProfile ? this.state.infoProfile.user_id : 0;
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
          style={{
            top: this.state.infoProfile
              ? Dimensions.get("window").height * 0.04 + 85 - 30
              : 0,
            height: this.state.infoProfile
              ? Dimensions.get("window").height - 230 + 90
              : Dimensions.get("window").height
          }}
          dataSource={this.state.dataSource}
          renderRow={(item, sectionID, rowID) => {
            const row = parseInt(rowID) + 1;
            console.log(row);
            console.log(rowID);
            // i primi tre non li considero
            if (row < 4) {
              return <View key={rowID} />;
            } else if (row === 4 && this.state.infoProfile) {
              // ovvero il primo e ho il profilo quindi sono nella classifica e quindi c'e l'onda ho bisogno di piu spazio all'inizio
              return (
                <Aux key={rowID}>
                  {
                    // aggiungo delo spazio in piu sopra cosi sotto l'onda ho lo stesso colore del primo partecipante
                    <View
                      key={0}
                      style={{
                        height: 30,
                        backgroundColor: "#F7F8F9"
                      }}
                    />
                  }
                  <UserItem
                    myProfile={this.myProfile}
                    navigation={this.props.navigation}
                    user={{
                      points: item.points,

                      referred_route__user__avatar: item.user.avatar,

                      referred_route__user__first_name: item.user.first_name,

                      referred_route__user__last_name: item.user.last_name,

                      id: user_id,
                      referred_route__user_id: item.user.user_id,
                      position: row
                    }}
                    rowID={rowID}
                    level={
                      item.user.level
                        ? item.user.level.name.charAt(0).toUpperCase()
                        : "N"
                    }
                    modalType={
                      item.user.role
                        ? item.user.role === "none" ||
                          item.user.role === "muver"
                          ? 0
                          : parseInt(item.user.role)
                        : 0
                    }
                    activeSelectable={this.props.activeSelectable}
                    blockRanking={
                      this.state.number > 3 ? this.props.blockRanking : false
                    }
                    community={item.referred_route__user__community__name}
                    city={item.referred_route__user__city__city_name}
                  />
                </Aux>
              );
            } else if (
              this.state.number === row &&
              (rowID == 7 || rowID == 12 || rowID == 27 || rowID == 52)
            ) {
              return (
                <View key={rowID}>
                  {this.bonusView(rowID)}
                  <UserItem
                    myProfile={this.myProfile}
                    navigation={this.props.navigation}
                    user={{
                      points: item.points,

                      referred_route__user__avatar: item.user.avatar,

                      referred_route__user__first_name: item.user.first_name,

                      referred_route__user__last_name: item.user.last_name,

                      id: user_id,
                      referred_route__user_id: item.user.user_id,
                      position: row
                    }}
                    rowID={rowID}
                    level={
                      item.user.level
                        ? item.user.level.name.charAt(0).toUpperCase()
                        : "N"
                    }
                    modalType={
                      item.user.role
                        ? item.user.role === "none" ||
                          item.user.role === "muver"
                          ? 0
                          : parseInt(item.user.role)
                        : 0
                    }
                    activeSelectable={this.props.activeSelectable}
                    blockRanking={
                      this.state.number > 3 ? this.props.blockRanking : false
                    }
                    community={item.referred_route__user__community__name}
                    city={item.referred_route__user__city__city_name}
                  />
                  {this.state.lock.map(elem =>
                    this.bonusLock(
                      elem.image,
                      elem.number,
                      elem.colorStart,
                      elem.colorEnd
                    )
                  )}
                  {
                    // aggiungo delo spazio in piu cosi posso scrollare tutta la lista anche se c'e l'onda e la notifica
                    // se la classifica è bloccata, c'e uno spazio in piu dato header piu grande
                    <View
                      key={0}
                      style={{
                        paddingTop: this.props.blockRanking
                          ? Dimensions.get("window").height * 0.23 + 50
                          : Dimensions.get("window").height * 0.23
                      }}
                    />
                  }
                </View>
              );
            } else if (this.state.number === row) {
              return (
                <Aux key={rowID}>
                  <UserItem
                    myProfile={this.myProfile}
                    navigation={this.props.navigation}
                    user={{
                      points: item.points,

                      referred_route__user__avatar: item.user.avatar,

                      referred_route__user__first_name: item.user.first_name,

                      referred_route__user__last_name: item.user.last_name,

                      id: user_id,
                      referred_route__user_id: item.user.user_id,
                      position: row
                    }}
                    rowID={rowID}
                    level={
                      item.user.level
                        ? item.user.level.name.charAt(0).toUpperCase()
                        : "N"
                    }
                    modalType={
                      item.user.role
                        ? item.user.role === "none" ||
                          item.user.role === "muver"
                          ? 0
                          : parseInt(item.user.role)
                        : 0
                    }
                    activeSelectable={this.props.activeSelectable}
                    blockRanking={
                      this.state.number > 3 ? this.props.blockRanking : false
                    }
                    community={item.referred_route__user__community__name}
                    city={item.referred_route__user__city__city_name}
                  />
                  {this.state.lock.map(elem =>
                    this.bonusLock(
                      elem.image,
                      elem.number,
                      elem.colorStart,
                      elem.colorEnd
                    )
                  )}
                  <InviteItem
                    infoProfile={this.props.infoProfile}
                    navigation={this.props.navigation}
                    Points={0}
                    description={strings("invite_your_fri")}
                    colorInvite={["#F8B126", "#FFCB03"]}
                    wave={require("../../assets/images/invite_friend_wave_list_purple.png")}
                    textColor={"#FFFFFF"}
                    textColorInvite={"#3D3D3D"}
                  />
                  {
                    // aggiungo delo spazio in piu cosi posso scrollare tutta la lista anche se c'e l'onda e la notifica
                    // se la classifica è bloccata, c'e uno spazio in piu dato header piu grande
                    <View
                      key={0}
                      style={{
                        paddingTop: this.props.blockRanking
                          ? Dimensions.get("window").height * 0.23 + 50
                          : Dimensions.get("window").height * 0.23
                      }}
                    />
                  }
                </Aux>
              );
            } else {
              console.log("prova");
              if (rowID == 7 || rowID == 12 || rowID == 27 || rowID == 52) {
                return (
                  <View key={rowID}>
                    {this.bonusView(rowID)}
                    <UserItem
                      myProfile={this.myProfile}
                      navigation={this.props.navigation}
                      user={{
                        points: item.points,

                        referred_route__user__avatar: item.user.avatar,

                        referred_route__user__first_name: item.user.first_name,

                        referred_route__user__last_name: item.user.last_name,

                        id: user_id,
                        referred_route__user_id: item.user.user_id,
                        position: row
                      }}
                      rowID={rowID}
                      level={
                        item.user.level
                          ? item.user.level.name.charAt(0).toUpperCase()
                          : "N"
                      }
                      modalType={
                        item.user.role
                          ? item.user.role === "none" ||
                            item.user.role === "muver"
                            ? 0
                            : parseInt(item.user.role)
                          : 0
                      }
                      activeSelectable={this.props.activeSelectable}
                      blockRanking={
                        this.state.number > 3 ? this.props.blockRanking : false
                      }
                      community={item.referred_route__user__community__name}
                      city={item.referred_route__user__city__city_name}
                    />
                  </View>
                );
              }

              return (
                <UserItem
                  myProfile={this.myProfile}
                  navigation={this.props.navigation}
                  user={{
                    points: item.points,

                    referred_route__user__avatar: item.user.avatar,

                    referred_route__user__first_name: item.user.first_name,

                    referred_route__user__last_name: item.user.last_name,

                    id: user_id,
                    referred_route__user_id: item.user.user_id,
                    position: row
                  }}
                  rowID={rowID}
                  level={
                    item.referred_route__user__level__name
                      ? item.referred_route__user__level__name
                          .charAt(0)
                          .toUpperCase()
                      : "N"
                  }
                  modalType={
                    item.referred_route__user__role
                      ? item.referred_route__user__role === "none" ||
                        item.referred_route__user__role === "muver"
                        ? 0
                        : parseInt(item.referred_route__user__role)
                      : 0
                  }
                  activeSelectable={this.props.activeSelectable}
                  blockRanking={
                    this.state.number > 3 ? this.props.blockRanking : false
                  }
                  community={item.referred_route__user__community__name}
                  city={item.referred_route__user__city__city_name}
                />
              );
            }
          }}
        />
      </View>
    );
  }
  renderBody() {
    if (!this.state.loadData) {
      return (
        <View style={{ top: 150 }}>
          <ActivityIndicator size="large" color="#3D3D3D" />
          <View style={styles.challengesList} />
        </View>
      );
    } else {
      return this.renderPage();
    }
  }

  render() {
    return (
      <View
        // style={styles.mainContainer}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh.bind(this)}
          />
        }
      >
        {this.renderBody()}

        {this.state.infoProfile ? (
          <Aux>
            <WavyArea
              data={negativeData}
              color={"#3D3D3D"}
              style={styles.overlayWave}
            />
            <View style={[styles.userContainer, styles.firstUser]}>
              <View
                style={{
                  flexDirection: "column",
                  alignContent: "center"
                }}
              >
                <View>
                  {this.state.totPoints < 100 ? (
                    <UserItemDetailTournament
                      myProfile={this.myProfile}
                      navigation={this.props.navigation}
                      currentUser={true}
                      user={{
                        referred_route__user__first_name: this.state.infoProfile
                          .first_name,
                        referred_route__user__last_name: this.state.infoProfile
                          .last_name,
                        referred_route__user__avatar: this.state.infoProfile
                          .avatar,

                        points: this.state.totPoints,
                        position:
                          this.state.position !== "-" &&
                          typeof this.state.position !== "object"
                            ? this.state.position + 1
                            : "-",
                        id: 0
                        // referred_route__user__city_id: this.state.infoProfile.city
                        //   ? this.state.infoProfile.city.id
                        //     ? this.state.infoProfile.city.id
                        //     : 0
                        //   : 0
                      }}
                      // lo faccio piu piccolo dato che sopra metto il selettore per il periodo
                      style={{ height: 75 }}
                      level={
                        this.props.level
                          ? this.props.level.charAt(0).toUpperCase()
                          : "N"
                      }
                      fontColor={"#fff"}
                      modalType={this.props.role}
                      blockRanking={false}
                      activeSelectable={null}
                      community={null}
                      city={""}
                    />
                  ) : (
                    <UserItem
                      myProfile={this.myProfile}
                      navigation={this.props.navigation}
                      currentUser={true}
                      user={{
                        referred_route__user__first_name: this.state.infoProfile
                          .first_name,
                        referred_route__user__last_name: this.state.infoProfile
                          .last_name,
                        referred_route__user__avatar: this.state.infoProfile
                          .avatar,

                        points: this.state.totPoints,
                        position:
                          this.state.position !== "-" &&
                          typeof this.state.position !== "object"
                            ? this.state.position + 1
                            : "-",
                        id: this.state.infoProfile.user_id
                        // referred_route__user__city_id: this.state.infoProfile.city
                        //   ? this.state.infoProfile.city.id
                        //     ? this.state.infoProfile.city.id
                        //     : 0
                        //   : 0
                      }}
                      // lo faccio piu piccolo dato che sopra metto il selettore per il periodo
                      style={{ height: 75 }}
                      level={
                        this.props.level
                          ? this.props.level.charAt(0).toUpperCase()
                          : "N"
                      }
                      fontColor={"#fff"}
                      modalType={this.props.role}
                      blockRanking={false}
                      activeSelectable={null}
                      community={null}
                      city={""}
                    />
                  )}
                </View>
              </View>
            </View>
          </Aux>
        ) : (
          <View />
        )}
      </View>
    );
  }
}

/* 
state.statistics.reduce(
  (acc, item) => (acc > item.points ? acc : item.points),
  0 ) */
// modal_type
const withConnect = connect(state => {
  return {
    infoProfile: getProfile(state),
    level: getLevelState(state),
    role: getRoleState(state)
  };
});

export default withConnect(TeamTournamentStanding);
