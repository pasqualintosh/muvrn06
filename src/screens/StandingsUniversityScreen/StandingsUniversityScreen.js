import React from 'react';
import {
  View,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Text,
  TouchableWithoutFeedback,
  ScrollView,
  Image,
  TouchableHighlight,
} from 'react-native';

import ListView from 'deprecated-react-native-listview';

import Svg, {Circle, Line} from 'react-native-svg';

import {styles, negativeData} from './Style';
import WavyArea from './../../components/WavyArea/WavyArea';
import UserItem from './../../components/UserItem/UserItem';

import InviteItem from './../../components/InviteItem/InviteItem';
import InviteNoFriendScreen from './../../components/InviteNoFriendScreen/InviteNoFriendScreen';
import InviteFriendsWave from './../../components/InviteFriendsWave/InviteFriendsWave';
import UniversityGameOnlyPointsItem from './../../components/UniversityGameOnlyPointsItem/UniversityGameOnlyPointsItem';
import Aux from './../../helpers/Aux';
import {getSponsor} from './../../helpers/Sponsors.js';

import {connect} from 'react-redux';

import OwnIcon from '../../components/OwnIcon/OwnIcon';

import {strings} from '../../config/i18n';

import LinearGradient from 'react-native-linear-gradient';
import {getProfile} from './../../domains/login/Selectors';
import {
  getTeamsState,
  getQualificationTournamentState,
  getMyTeamsState,
} from './../../domains/tournaments/Selectors';
import {getQualificationRankingByQualification} from './../../domains/tournaments/ActionCreators';
import {getUniversityImg} from '../../screens/ChooseTeamScreen/ChooseTeamScreen';
import {store} from '../../store';

function compare(a, b) {
  if (a.total_points > b.total_points) return -1;
  if (b.total_points > a.total_points) return 1;

  return 0;
}

class StandingsUniversityScreen extends React.Component {
  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });

    this.state = {
      showLoading: true,
      refreshing: false,
      refreshingFriend: false,
      endScrollRefresh: false,
      tournament_qualification_end: new Date('2020-03-16 08:00:00'),
      standings: [],
      my_team: {},
    };

    this.team = {};
    this.university = null;
    this.tournament_qualification_id = null;
    this.tournament_qualification = null;
    this.displayStandings = false;
  }

  saveRankingInState = (data = []) => {
    let my_team = {},
      sorted_standing = [...data.sort(compare)];

    sorted_standing.forEach((elem, index) => {
      if (elem.team.name == this.team.name)
        my_team = {
          ...elem.team,
          position: index + 1,
          total_points: elem.total_points,
        };
    });

    this.setState(
      {standings: sorted_standing, showLoading: false, my_team},
      () => {
        console.log(this);
      },
    );
  };

  componentWillMount() {
    this.updateUniversityTournamentStart();
    try {
      this.university = this.props.navigation.state.params.university;
      this.tournament_qualification_id = this.props.navigation.state.params.tournament_qualification_id;
      this.tournament_qualification = this.props.navigation.state.params.tournament_qualification;
      this.team = this.props.navigation.state.params.university;

      this.props.dispatch(
        getQualificationRankingByQualification(
          this.tournament_qualification_id,
          this.saveRankingInState,
        ),
      );
    } catch (error) {
      console.log(error);
    }

    if (this.tournament_qualification)
      this.setState({
        tournament_qualification_end: this.tournament_qualification.end_time,
      });
  }

  onRefresh() {
    this.setState({refreshing: true});
  }

  // quando scendo tutti gli utenti, ne carico altri

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

  renderPage(number, dataSource, position, totPoints) {
    this.displayStandings = true;

    return (
      <View>
        <ListView
          removeClippedSubviews={false}
          enableEmptySections={true}
          refreshControl={
            <RefreshControl
              refreshing={false}
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
                        backgroundColor: '#F7F8F9',
                      }}
                    />
                  }
                  <UniversityGameOnlyPointsItem
                    navigation={this.props.navigation}
                    name={item.team.name}
                    country={item.team.description}
                    logo={item.team.logo}
                    id={item.team.id}
                    rowID={rowID}
                    university={item.team}
                    position={row}
                    points={item.total_points}
                  />
                </Aux>
              );
            } else if (number === row) {
              return (
                <Aux key={rowID}>
                  <UniversityGameOnlyPointsItem
                    navigation={this.props.navigation}
                    name={item.team.name}
                    country={item.team.description}
                    logo={item.team.logo}
                    id={item.team.id}
                    rowID={rowID}
                    university={item.team}
                    position={row}
                    points={item.total_points}
                  />
                  {this.endList()}
                </Aux>
              );
            } else {
              return (
                <UniversityGameOnlyPointsItem
                  navigation={this.props.navigation}
                  name={item.team.name}
                  country={item.team.description}
                  logo={item.team.logo}
                  id={item.team.id}
                  rowID={rowID}
                  university={item.team}
                  position={row}
                  points={item.total_points}
                />
              );
            }
          }}
        />
      </View>
    );
  }

  renderEmptyFriend() {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshingFriend}
            onRefresh={this.onRefreshFriend.bind(this)}
          />
        }
        style={{
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
        }}>
        <View
          style={{
            width: Dimensions.get('window').width,
            height: 150,
            flexDirection: 'column',
            justifyContent: 'center',
            alignContent: 'center',
            alignSelf: 'center',
            alignItems: 'center',
          }}
        />
        <InviteNoFriendScreen
          infoProfile={this.props.infoProfile}
          navigation={this.props.navigation}
          Points={0}
        />
        <View
          style={{
            width: Dimensions.get('window').width,
            height: 150,
            flexDirection: 'column',
            justifyContent: 'center',
            alignContent: 'center',
            alignSelf: 'center',
            alignItems: 'center',
          }}
        />
      </ScrollView>
    );
  }

  // metto aggiungi amici alla fine sono sono in friend
  // aggiungo delo spazio in piu cosi posso scrollare tutta la lista anche se c'e l'onda e la notifica
  // se la classifica è bloccata, c'e uno spazio in piu dato header piu grande
  endList = () => {
    return (
      <View
        style={{
          paddingTop: Dimensions.get('window').height * 0.23 + 40,
        }}
      />
    );
  };

  renderBody(number, dataSource, position, totPoints) {
    console.log(number);
    // se non ho utenti e ancora devo caricare la lista
    if (number == 0) {
      return (
        <View style={{top: 200}}>
          <ActivityIndicator size="large" color="#3D3D3D" />
          <View style={styles.challengesList} />
        </View>
      );
    } else {
      return this.renderPage(number, dataSource, position, totPoints);
    }
  }

  selectType = (selectedTime) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignContent: 'center',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignContent: 'center',
            justifyContent: 'flex-end',
            width: Dimensions.get('window').width / 2 - 15,
          }}>
          <TouchableWithoutFeedback
            onPress={() => this.props.changeActiveSelectable('City')}>
            <View
              style={{
                flexDirection: 'column',
                alignContent: 'center',
                justifyContent: 'center',
                height: 40,
                // right: 10
              }}>
              <Text
                style={{
                  color: selectedTime ? '#FFFFFF' : '#9D9B9C',
                  fontFamily: 'Montserrat-ExtraBold',

                  fontSize: 10,
                  fontWeight: 'bold',
                  // marginBottom: 4,
                  marginVertical: 0,
                  textAlign: 'center',
                }}>
                {this.props.city}
              </Text>
              <View
                style={{
                  borderBottomColor: '#FAB21E',
                  borderBottomWidth: selectedTime ? 1 : 0,
                }}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View
          style={{
            flexDirection: 'column',
            alignContent: 'center',
            justifyContent: 'center',
            height: 30,
            width: 30,
          }}
        />

        <View
          style={{
            flexDirection: 'column',
            alignContent: 'center',
            justifyContent: 'center',
            height: 25,
            width: 25,
            position: 'absolute',
          }}>
          {/* <Svg height={30} width={30} viewBox="0 0 100 100">
                  <Circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="#FAB21E"
                    strokeWidth="2"
                    fill="#3D3D3D"
                  />
                  <Line
                    x1="50"
                    y1="50"
                    x2="50"
                    y2="25"
                    stroke="white"
                    strokeWidth="2"
                  />
                  <Line
                    x1="50"
                    y1="50"
                    x2="75"
                    y2="75"
                    stroke="white"
                    strokeWidth="2"
                  />
                </Svg> */}
          <OwnIcon name="world_icn" size={25} color="#FFFFFF" />
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignContent: 'center',
            justifyContent: 'flex-start',
            width: Dimensions.get('window').width / 2 - 15,
          }}>
          <TouchableWithoutFeedback
            onPress={() => this.props.changeActiveSelectable('Global')}
            style={{flex: 1}}>
            <View
              style={{
                flexDirection: 'column',
                alignContent: 'center',
                justifyContent: 'center',
                height: 40,
              }}>
              <Text
                style={{
                  color: selectedTime ? '#9D9B9C' : '#FFFFFF',
                  fontFamily: 'Montserrat-ExtraBold',

                  fontSize: 10,
                  fontWeight: 'bold',
                  // marginBottom: 4,
                  marginVertical: 0,
                  textAlign: 'center',
                }}>
                WORLD
              </Text>
              <View
                style={{
                  borderBottomColor: '#FAB21E',
                  borderBottomWidth: selectedTime ? 0 : 1,
                }}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  };

  selectTypeNew = (community, checkSponsor) => {
    // community
    // controllo se è una community o sponsor

    // deve essere una community e avere un nome

    if (community && !checkSponsor) {
      return (
        <View
          style={{
            flexDirection: 'row',
            alignContent: 'center',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignContent: 'center',
              justifyContent: 'flex-end',
              width: Dimensions.get('window').width * 0.5 - 90,
            }}>
            <TouchableWithoutFeedback
              onPress={() => this.props.changeActiveSelectable('City')}>
              <View
                style={{
                  flexDirection: 'column',
                  alignContent: 'center',
                  justifyContent: 'center',
                  height: 40,
                  // right: 10
                }}>
                <Text
                  style={{
                    color:
                      this.props.activeSelectable == 'city'
                        ? '#FFFFFF'
                        : '#9D9B9C',
                    fontFamily: 'Montserrat-ExtraBold',

                    fontSize: 10,
                    fontWeight: 'bold',
                    // marginBottom: 4,
                    marginVertical: 0,
                    textAlign: 'center',
                  }}>
                  {this.props.city}
                </Text>
                <View
                  style={{
                    borderBottomColor: '#FAB21E',
                    borderBottomWidth:
                      this.props.activeSelectable == 'city' ? 1 : 0,
                  }}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignContent: 'center',
              justifyContent: 'center',
              width: 180,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                width: 30,

                // - 38
              }}>
              <OwnIcon name="rank_arrow_up_icn" size={20} color={'#9D9B9C'} />
              <OwnIcon
                name="rank_arrow_down_icn"
                size={20}
                color={'#FFFFFF'}
                style={{right: 12}}
              />
            </View>
            <TouchableWithoutFeedback
              onPress={() => this.props.changeActiveSelectable('Global')}
              style={{flex: 1}}>
              <View
                style={{
                  flexDirection: 'column',
                  alignContent: 'center',
                  justifyContent: 'center',
                  height: 40,
                }}>
                <Text
                  style={{
                    color:
                      this.props.activeSelectable == 'global'
                        ? '#FFFFFF'
                        : '#9D9B9C',
                    fontFamily: 'Montserrat-ExtraBold',

                    fontSize: 10,
                    fontWeight: 'bold',
                    // marginBottom: 4,
                    marginVertical: 0,
                    textAlign: 'center',
                  }}>
                  WORLD
                </Text>
                <View
                  style={{
                    borderBottomColor: '#FAB21E',
                    borderBottomWidth:
                      this.props.activeSelectable == 'global' ? 1 : 0,
                  }}
                />
              </View>
            </TouchableWithoutFeedback>
            <View
              style={{
                flexDirection: 'row',
                alignContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                width: 30,
                // - 38
              }}>
              <OwnIcon name="rank_arrow_up_icn" size={20} color={'#9D9B9C'} />
              <OwnIcon
                name="rank_arrow_down_icn"
                size={20}
                color={'#FFFFFF'}
                style={{right: 12}}
              />
            </View>

            <TouchableWithoutFeedback
              onPress={() => this.props.changeActiveSelectable('Friend')}
              style={{flex: 1}}>
              <View
                style={{
                  flexDirection: 'column',
                  alignContent: 'center',
                  justifyContent: 'center',
                  height: 40,
                }}>
                <Text
                  style={{
                    color:
                      this.props.activeSelectable == 'friend'
                        ? '#FFFFFF'
                        : '#9D9B9C',
                    fontFamily: 'Montserrat-ExtraBold',

                    fontSize: 10,
                    fontWeight: 'bold',
                    // marginBottom: 4,
                    marginVertical: 0,
                    textAlign: 'center',
                  }}>
                  FRIENDS
                </Text>
                <View
                  style={{
                    borderBottomColor: '#FAB21E',
                    borderBottomWidth:
                      this.props.activeSelectable == 'friend' ? 1 : 0,
                  }}
                />
              </View>
            </TouchableWithoutFeedback>
            <View
              style={{
                flexDirection: 'row',
                alignContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                width: 30,
                // - 38
              }}>
              <OwnIcon name="rank_arrow_up_icn" size={20} color={'#9D9B9C'} />
              <OwnIcon
                name="rank_arrow_down_icn"
                size={20}
                color={'#FFFFFF'}
                style={{right: 12}}
              />
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignContent: 'center',
              justifyContent: 'flex-start',
              width: Dimensions.get('window').width * 0.5 - 90,
            }}>
            <TouchableWithoutFeedback
              onPress={() => this.props.changeActiveSelectable('Community')}
              style={{flex: 1}}>
              <View
                style={{
                  flexDirection: 'column',
                  alignContent: 'center',
                  justifyContent: 'center',
                  height: 40,
                }}>
                <Text
                  style={{
                    color:
                      this.props.activeSelectable == 'community'
                        ? '#FFFFFF'
                        : '#9D9B9C',
                    fontFamily: 'Montserrat-ExtraBold',

                    fontSize: 10,
                    fontWeight: 'bold',
                    // marginBottom: 4,
                    marginVertical: 0,
                    textAlign: 'center',
                  }}>
                  COMMUNITY
                </Text>
                <View
                  style={{
                    borderBottomColor: '#FFFFFF',
                    borderBottomWidth:
                      this.props.activeSelectable == 'community' ? 1 : 0,
                  }}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      );
    } else {
      return (
        <View
          style={{
            flexDirection: 'row',
            alignContent: 'center',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignContent: 'center',
              justifyContent: 'flex-end',
              width: Dimensions.get('window').width * 0.3,
            }}>
            <TouchableWithoutFeedback
              onPress={() => this.props.changeActiveSelectable('City')}>
              <View
                style={{
                  flexDirection: 'column',
                  alignContent: 'center',
                  justifyContent: 'center',
                  height: 40,
                  // right: 10
                }}>
                <Text
                  style={{
                    color:
                      this.props.activeSelectable == 'city'
                        ? '#FFFFFF'
                        : '#9D9B9C',
                    fontFamily: 'Montserrat-ExtraBold',

                    fontSize: 10,
                    fontWeight: 'bold',
                    // marginBottom: 4,
                    marginVertical: 0,
                    textAlign: 'center',
                  }}>
                  {this.props.city}
                </Text>
                <View
                  style={{
                    borderBottomColor: '#FAB21E',
                    borderBottomWidth:
                      this.props.activeSelectable == 'city' ? 1 : 0,
                  }}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignContent: 'center',
              justifyContent: 'center',
              width: 120,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                width: 30,

                // - 38
              }}>
              <OwnIcon name="rank_arrow_up_icn" size={20} color={'#9D9B9C'} />
              <OwnIcon
                name="rank_arrow_down_icn"
                size={20}
                color={'#FFFFFF'}
                style={{right: 12}}
              />
            </View>
            <TouchableWithoutFeedback
              onPress={() => this.props.changeActiveSelectable('Global')}
              style={{flex: 1}}>
              <View
                style={{
                  flexDirection: 'column',
                  alignContent: 'center',
                  justifyContent: 'center',
                  height: 40,
                }}>
                <Text
                  style={{
                    color:
                      this.props.activeSelectable == 'global'
                        ? '#FFFFFF'
                        : '#9D9B9C',
                    fontFamily: 'Montserrat-ExtraBold',

                    fontSize: 10,
                    fontWeight: 'bold',
                    // marginBottom: 4,
                    marginVertical: 0,
                    textAlign: 'center',
                  }}>
                  WORLD
                </Text>
                <View
                  style={{
                    borderBottomColor: '#FAB21E',
                    borderBottomWidth:
                      this.props.activeSelectable == 'global' ? 1 : 0,
                  }}
                />
              </View>
            </TouchableWithoutFeedback>
            <View
              style={{
                flexDirection: 'row',
                alignContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                width: 30,
                // - 38
              }}>
              <OwnIcon name="rank_arrow_up_icn" size={20} color={'#9D9B9C'} />
              <OwnIcon
                name="rank_arrow_down_icn"
                size={20}
                color={'#FFFFFF'}
                style={{right: 12}}
              />
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignContent: 'center',
              justifyContent: 'flex-start',
              width: Dimensions.get('window').width * 0.3,
            }}>
            <TouchableWithoutFeedback
              onPress={() => this.props.changeActiveSelectable('Friend')}
              style={{flex: 1}}>
              <View
                style={{
                  flexDirection: 'column',
                  alignContent: 'center',
                  justifyContent: 'center',
                  height: 40,
                }}>
                <Text
                  style={{
                    color:
                      this.props.activeSelectable == 'friend'
                        ? '#FFFFFF'
                        : '#9D9B9C',
                    fontFamily: 'Montserrat-ExtraBold',

                    fontSize: 10,
                    fontWeight: 'bold',
                    // marginBottom: 4,
                    marginVertical: 0,
                    textAlign: 'center',
                  }}>
                  FRIENDS
                </Text>
                <View
                  style={{
                    borderBottomColor: '#FAB21E',
                    borderBottomWidth:
                      this.props.activeSelectable == 'friend' ? 1 : 0,
                  }}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      );
    }
  };

  updateUniversityTournamentStart = () => {
    if (
      store.getState().tournaments &&
      store.getState().tournaments.allowed_tournaments &&
      store.getState().tournaments.allowed_tournaments.length
    ) {
      this.setState({
        tournament_qualification_end: new Date(
          store.getState().tournaments.allowed_tournaments[0].start_time,
        ),
      });
    }
  };

  getCountdownTxt = () => {
    let today = new Date();
    console.log(this.state.tournament_qualification_end);
    let e_msec = new Date(this.state.tournament_qualification_end) - today;
    let e_mins = Math.floor(e_msec / 60000);
    let e_hrs = Math.floor(e_mins / 60);
    let e_a_mins = Math.floor(e_msec / 60000) - e_hrs * 60;
    let e_days = Math.floor(e_hrs / 24);
    let e_a_hrs = e_hrs - e_days * 24;

    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <OwnIcon name="timer_icn" size={24} color={'#FC6754'} />
        <View style={{width: 5, height: 5}} />

        <Aux>
          <Text style={{}}>
            <Text style={styles.countdownTxt}>{e_days}</Text>
            <Text style={styles.countdownTxt}>{'d '}</Text>
            <Text style={styles.countdownTxt}>{e_a_hrs}</Text>
            <Text style={styles.countdownTxt}>{'h '}</Text>
            <Text style={styles.countdownTxt}>{e_a_mins}</Text>
            <Text style={styles.countdownTxt}>{'m'}</Text>
          </Text>
        </Aux>
      </View>
    );
  };

  renderCountdown() {
    // #FC6754
    return (
      // <LinearGradient
      //   start={{ x: 0.0, y: 0.0 }}
      //   end={{ x: 0.0, y: 1.0 }}
      //   locations={[0, 1.0]}
      //   colors={["#e82f73", "#f49658"]}
      //   style={styles.selectableHeaderBlock}
      // >
      <View
        style={[
          styles.selectableHeaderBlock,
          {
            backgroundColor: '#FFFFFF',
          },
        ]}>
        <View style={{height: 5}} />

        <View style={styles.HeaderTimer}>{this.getCountdownTxt()}</View>

        <View style={{height: 5}} />
        {/* </LinearGradient> */}
      </View>
    );
  }

  render() {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });

    dataSource = ds.cloneWithRows(this.state.standings);
    // position = this.props.standingsState.infoUserGlobalClassification.index;
    // totPoints = this.props.standingsState.infoUserGlobalClassification.points;
    let position = 1,
      totPoints = 0,
      number = this.state.standings.length,
      colorWave = this.university.color;

    return (
      <View
        // style={styles.mainContainer}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={this.onRefresh.bind(this)}
          />
        }>
        {this.renderCountdown()}
        {this.renderBody(number, dataSource, position, totPoints)}
        <WavyArea
          data={negativeData}
          color={colorWave}
          style={styles.overlayWave}
        />
        <View style={[styles.userContainer, styles.firstUser]}>
          <View
            style={{
              flexDirection: 'column',
              alignContent: 'center',
            }}>
            {/* {this.selectTypeNew(community, checkSponsor)} */}
            <View>
              <UniversityGameOnlyPointsItem
                style={{height: 85, backgroundColor: 'transparent'}}
                textColor={'#FFFFFF'}
                navigation={this.props.navigation}
                name={this.state.my_team.name}
                country={this.state.my_team.description}
                logo={this.state.my_team.logo}
                id={this.state.my_team.position}
                rowID={this.state.my_team.position}
                position={this.state.my_team.position}
                colorText={'#FFFFFF'}
                points={this.state.my_team.total_points}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const withConnect = connect((state) => {
  return {
    infoProfile: getProfile(state),
    standings: getTeamsState(state),
    mystanding: getQualificationTournamentState(state),
    myteam: getMyTeamsState(state),
  };
});

export default withConnect(StandingsUniversityScreen);

// export default StandingsScreen;
