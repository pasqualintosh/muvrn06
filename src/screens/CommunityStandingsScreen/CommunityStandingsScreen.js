import React from "react";
import {
  View,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Text,
  TouchableWithoutFeedback,
  ListView
} from "react-native";


import Svg, { Circle, Line } from "react-native-svg";

import { styles, negativeData } from "./Style";
import WavyArea from "./../../components/WavyArea/WavyArea";
import UserItem from "./../../components/UserItem/UserItem";
import Aux from "./../../helpers/Aux";
import {
  getLeaderboard,
  getMonthlyLeaderboard,
  getWeeklyLeaderboard,
  getLeaderboardByCity,
  getMonthlyLeaderboardByCity,
  getWeeklyLeaderboardByCity,
  getWeeklyLeaderboardByCommunity
} from "./../../domains/standings/ActionCreators";
import { connect } from "react-redux";
import pointsDecimal from "../../helpers/pointsDecimal";
import OwnIcon from "../../components/OwnIcon/OwnIcon";
import { createSelector } from "reselect";
import { changeScreenProfile } from "./../../domains/trainings/ActionCreators";

// import { pushNotifications } from "./../../services";

class CommunityStandingsScreen extends React.Component {
  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.state = {
      activeSelectable: "community",
      showLoading: true,
      refreshing: false
    };

    this.displayStandings = false;
  }
  componentWillMount() {
    // pushNotifications.configure();
    // pushNotifications.userIsStillNotification();

    // this.props.dispatch(getLeaderboardByCity());
    if (this.props.standingsState.error) {
      Alert.alert("Oops", "Seems like an error occured, pull to refresh");
    }
  }

  onRefresh() {
    this.setState({ refreshing: true });

    this.props.dispatch(getWeeklyLeaderboardByCommunity());

    if (this.props.checkBlock) {
      // quando aggiorno controllo anche l'orario per sapere se devo frizzare la classifica
      this.props.checkBlock();
    }
    if (this.props.standingsState.error) {
      Alert.alert("Oops", "Seems like an error occured, pull to refresh");
    }

    const loading = setInterval(() => {
      if (this.props.standingsState.standing.length > 0) {
        this.setState({ refreshing: false });
        clearTimeout(loading);
      }
    }, 1000);
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

  renderPage(number, dataSource, position, totPoints) {
    this.displayStandings = true;
    return (
      <View>
        <ListView
          removeClippedSubviews={false}
          enableEmptySections={true}
          refreshControl={
            <RefreshControl
              refreshing={this.props.standingsState.fetchingData}
              onRefresh={this.onRefresh.bind(this)}
            />
          }
          style={styles.challengesList}
          dataSource={dataSource}
          renderRow={(item, sectionID, rowID) => {
            const row = parseInt(rowID) + 1;
            if (row === 1) {
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
                    //navigation={this.props.navigation}
                    myProfile={this.myProfile}
                    user={{ ...item, position: row }}
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
                    blockRanking={false}
                  />
                </Aux>
              );
            } else if (number === row) {
              return (
                <Aux key={rowID}>
                  <UserItem
                    //navigation={this.props.navigation}
                    myProfile={this.myProfile}
                    user={{ ...item, position: row }}
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
                    blockRanking={false}
                  />
                  {
                    // aggiungo delo spazio in piu cosi posso scrollare tutta la lista anche se c'e l'onda e la notifica
                    // se la classifica è bloccata, c'e uno spazio in piu dato header piu grande
                    <View
                      key={0}
                      style={{
                        paddingTop: this.props.blockRanking
                          ? Dimensions.get("window").height * 0.23 + 80
                          : Dimensions.get("window").height * 0.23 + 80
                      }}
                    />
                  }
                </Aux>
              );
            } else {
              return (
                <UserItem
                  //navigation={this.props.navigation}
                  myProfile={this.myProfile}
                  user={{ ...item, position: row }}
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
                  blockRanking={false}
                />
              );
            }
          }}
        />
      </View>
    );
  }
  renderBody(number, dataSource, position, totPoints) {
    // se non ho utenti e ancora devo caricare la lista
    if (this.props.standingsState.fetchingData && number === 0) {
      return (
        <View style={{ top: 150 }}>
          <ActivityIndicator size="large" color="#3D3D3D" />
          <View style={styles.challengesList} />
        </View>
      );
    } else {
      return this.renderPage(number, dataSource, position, totPoints);
    }
  }

  myProfile = () => {
    this.props.navigation.navigate("Info");
  };

  render() {
    let number = 0;
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    let dataSource = ds.cloneWithRows([]);
    let position = "-";
    let totPoints = 0;
    dataSource = ds.cloneWithRows(this.props.standingsState.communityStanding);
    position = this.props.standingsState.infoUserCommunityClassification.index;
    totPoints = this.props.standingsState.infoUserCommunityClassification
      .points;
    number = this.props.standingsState.infoUserCommunityClassification.number;
    return (
      <View
        // style={styles.mainContainer}
        refreshControl={
          <RefreshControl
            refreshing={this.props.standingsState.fetchingData}
            onRefresh={this.onRefresh.bind(this)}
          />
        }
      >
        {this.renderBody(number, dataSource, position, totPoints)}
        <WavyArea
          data={negativeData}
          color={this.props.colorWave}
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
              <UserItem
                //navigation={this.props.navigation}
                myProfile={this.myProfile}
                user={{
                  referred_route__user__first_name: this.props.infoProfile
                    .first_name,
                  referred_route__user__last_name: this.props.infoProfile
                    .last_name,
                  referred_route__user__avatar: this.props.infoProfile.avatar,

                  points: totPoints,
                  position:
                    position !== "-" && typeof position !== "object"
                      ? position + 1
                      : "-"
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
                activeSelectable={this.props.activeSelectable}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const getProfile = state => state.login.infoProfile;
const getProfileNotSave = state => state.login.infoProfileNotSave;

const getProfileState = createSelector(
  [getProfile, getProfileNotSave],
  (infoProfile, infoProfileNotSave) => {
    return {
      ...infoProfile,
      ...infoProfileNotSave
    };
  }
);

const getStandings = state => state.standings;

const getStandingsState = createSelector(
  [getStandings],
  StandingsState => StandingsState
);

const getLevel = state => state.trainings.name;

const getLevelState = createSelector(
  [getLevel],
  level => (level ? level : "Newbie")
);

const getRole = state => state.login.role;

const getRoleState = createSelector(
  [getRole],
  role => (role.roleUser ? (role.roleUser ? role.roleUser : 0) : 0)
);

/* 
state.statistics.reduce(
  (acc, item) => (acc > item.points ? acc : item.points),
  0 ) */
// modal_type
const withConnect = connect(state => {
  return {
    // standingsState: getStandingsState(state),
    infoProfile: getProfileState(state),
    level: getLevelState(state),
    role: getRoleState(state)
  };
});

export default withConnect(CommunityStandingsScreen);

// export default StandingsScreen;
