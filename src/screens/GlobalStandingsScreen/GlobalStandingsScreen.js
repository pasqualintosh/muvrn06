import React from 'react';
import {
  View,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Text,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';

import ListView from 'deprecated-react-native-listview';

import Svg, {Circle, Line} from 'react-native-svg';

import {styles, negativeData} from './Style';
import WavyArea from './../../components/WavyArea/WavyArea';
import UserItem from './../../components/UserItem/UserItem';
import Aux from './../../helpers/Aux';
import {
  getLeaderboard,
  getMonthlyLeaderboard,
  getWeeklyLeaderboard,
  getLeaderboardByCity,
  getMonthlyLeaderboardByCity,
  getWeeklyLeaderboardByCity,
} from './../../domains/standings/ActionCreators';
import {connect} from 'react-redux';
import pointsDecimal from '../../helpers/pointsDecimal';
import OwnIcon from '../../components/OwnIcon/OwnIcon';
import {getProfile} from './../../domains/login/Selectors';

// import { pushNotifications } from "./../../services";

class GlobalStandingsScreen extends React.Component {
  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });

    this.state = {
      activeSelectable: 'global',
      loadData: false,

      dataSource: null,
      number: 0,

      showLoading: true,
      refreshing: false,
      position: 0,
      totPoints: 0,
    };

    this.displayStandings = false;
  }

  myProfile = () => {
    this.props.navigation.navigate('Info');
  };

  componentWillMount() {
    // pushNotifications.configure();
    // pushNotifications.userIsStillNotification();

    // this.props.dispatch(getLeaderboardByCity());

    this.props.dispatch(getLeaderboard({}, this.setResponse));
  }

  onRefresh() {
    this.setState({refreshing: true});
    // this.props.dispatch(getLeaderboard());
    // this.props.dispatch(getLeaderboardByCity());

    this.props.dispatch(getLeaderboard({}, this.setResponse));

    const loading = setInterval(() => {
      if (this.props.standingsState.standing.length > 0) {
        this.setState({refreshing: false});
        clearTimeout(loading);
      }
    }, 1000);
  }

  setResponse = (response, user_id) => {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });

    let infoUserGlobalClassification = {index: '-', points: 0};

    for (index = 0; index < response.length; index++) {
      const condition =
        response[index].referred_route__user_id === user_id ? true : false;
      if (condition) {
        infoUserGlobalClassification = {
          ...response[index],
          index,
        };
        break;
      }
    }

    console.log(infoUserGlobalClassification);

    const standing = [...response];

    this.setState({
      dataSource: ds.cloneWithRows(standing),
      number: standing.length,
      position: infoUserGlobalClassification.index,
      totPoints: infoUserGlobalClassification.points,
      loadData: true,
    });
  };
  displayWavyArea() {
    if (this.displayStandings)
      return (
        <WavyArea
          data={negativeData}
          color={'#3D3D3D'}
          style={styles.overlayWave}
        />
      );
  }

  static navigationOptions = {
    headerTitle: (
      <Text
        style={{
          left: Platform.OS == 'android' ? 20 : 0,
        }}>
        Global ranking
      </Text>
    ),
  };

  renderPage() {
    this.displayStandings = true;
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
          dataSource={this.state.dataSource}
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
                        backgroundColor: '#F7F8F9',
                      }}
                    />
                  }
                  <UserItem
                    myProfile={this.myProfile}
                    navigation={this.props.navigation}
                    user={{
                      ...item,
                      position: row,
                      id: this.props.infoProfile.user_id,
                    }}
                    rowID={rowID}
                    level={
                      item.referred_route__user__level__name
                        ? item.referred_route__user__level__name
                            .charAt(0)
                            .toUpperCase()
                        : 'N'
                    }
                    modalType={
                      item.referred_route__user__role
                        ? item.referred_route__user__role === 'none' ||
                          item.referred_route__user__role === 'muver'
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
                </Aux>
              );
            } else if (this.state.number === row) {
              return (
                <Aux key={rowID}>
                  <UserItem
                    myProfile={this.myProfile}
                    navigation={this.props.navigation}
                    user={{
                      ...item,
                      position: row,
                      id: this.props.infoProfile.user_id,
                    }}
                    rowID={rowID}
                    level={
                      item.referred_route__user__level__name
                        ? item.referred_route__user__level__name
                            .charAt(0)
                            .toUpperCase()
                        : 'N'
                    }
                    modalType={
                      item.referred_route__user__role
                        ? item.referred_route__user__role === 'none' ||
                          item.referred_route__user__role === 'muver'
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
                  {
                    // aggiungo delo spazio in piu cosi posso scrollare tutta la lista anche se c'e l'onda e la notifica
                    // se la classifica è bloccata, c'e uno spazio in piu dato header piu grande
                    <View
                      key={0}
                      style={{
                        paddingTop: this.props.blockRanking
                          ? Dimensions.get('window').height * 0.23 + 50
                          : Dimensions.get('window').height * 0.23,
                      }}
                    />
                  }
                </Aux>
              );
            } else {
              return (
                <UserItem
                  myProfile={this.myProfile}
                  navigation={this.props.navigation}
                  user={{
                    ...item,
                    position: row,
                    id: this.props.infoProfile.user_id,
                  }}
                  rowID={rowID}
                  level={
                    item.referred_route__user__level__name
                      ? item.referred_route__user__level__name
                          .charAt(0)
                          .toUpperCase()
                      : 'N'
                  }
                  modalType={
                    item.referred_route__user__role
                      ? item.referred_route__user__role === 'none' ||
                        item.referred_route__user__role === 'muver'
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
        <View style={{top: 150}}>
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
        }>
        {this.renderBody()}
        <WavyArea
          data={negativeData}
          color={'#3D3D3D'}
          style={styles.overlayWave}
        />
        <View style={[styles.userContainer, styles.firstUser]}>
          <View
            style={{
              flexDirection: 'column',
              alignContent: 'center',
            }}>
            <View>
              <UserItem
                myProfile={this.myProfile}
                navigation={this.props.navigation}
                currentUser={true}
                user={{
                  referred_route__user__first_name: this.props.infoProfile
                    .first_name,
                  referred_route__user__last_name: this.props.infoProfile
                    .last_name,
                  referred_route__user__avatar: this.props.infoProfile.avatar,

                  points: this.state.totPoints,
                  position:
                    this.state.position !== '-' &&
                    typeof this.state.position !== 'object'
                      ? this.state.position + 1
                      : '-',
                  id: this.props.infoProfile.user_id,
                  referred_route__user__city_id: this.props.infoProfile.city
                    ? this.props.infoProfile.city.id
                      ? this.props.infoProfile.city.id
                      : 0
                    : 0,
                }}
                // lo faccio piu piccolo dato che sopra metto il selettore per il periodo
                style={{height: 75}}
                level={
                  this.props.level
                    ? this.props.level.charAt(0).toUpperCase()
                    : 'N'
                }
                fontColor={'#fff'}
                modalType={this.props.role}
                blockRanking={
                  this.state.number > 3 ? this.props.blockRanking : false
                }
                activeSelectable={this.props.activeSelectable}
                community={
                  this.props.infoProfile.community
                    ? this.props.infoProfile.community.name
                    : null
                }
                city={
                  this.props.infoProfile.city
                    ? this.props.infoProfile.city.city_name
                      ? this.props.infoProfile.city.city_name
                      : ''
                    : ''
                }
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
}
/* 
state.statistics.reduce(
  (acc, item) => (acc > item.points ? acc : item.points),
  0 ) */
// modal_type

const withConnect = connect((state) => {
  return {
    standingsState: state.standings,
    infoProfile: getProfile(state),
    statisticsState: state.statistics,
    level: state.trainings.name ? state.trainings.name : 'Newbie',
    role: state.login.role
      ? state.login.role.roleUser
        ? state.login.role.roleUser
        : 0
      : 0,
  };
});

export default withConnect(GlobalStandingsScreen);

// export default StandingsScreen;
