import React from 'react';
import {
  View,
  Text,
  Dimensions,
  ImageBackground,
  ActivityIndicator,
  Image,
} from 'react-native';
import ListView from 'deprecated-react-native-listview';
import LinearGradient from 'react-native-linear-gradient';
import {styles, negativeData, positiveData, cities} from './Style';
import WavyArea from './../../components/WavyArea/WavyArea';
import CityGameItem from './../../components/CityGameItem/CityGameItem';
import {getSeasonRanking} from './../../domains/screen/ActionCreators';
import {connect} from 'react-redux';
import {divisionTournamentCitiesInA} from './../../components/FriendItem/FriendItem';
import {getProfile} from './../../domains/login/Selectors';

// metto prima il gruppo B
export function compareB(a, b) {
  if (a.group > b.group) {
    return -1;
  }
  if (a.group < b.group) {
    return 1;
  }
  return 0;
}

// metto prima il gruppo A
export function compareA(a, b) {
  if (a.group > b.group) {
    return 1;
  }
  if (a.group < b.group) {
    return -1;
  }
  return 0;
}

// ordina i gruppo con B prima o A prima
export function orderByB(schedule, division) {
  if (!division) {
    // metto prima group B
    schedule = schedule.sort(compareB);
    console.log(schedule);
  } else {
    // metto prima group A
    schedule = schedule.sort(compareA);
    console.log(schedule);
  }
  return schedule;
}

class CitiesStandings extends React.Component {
  constructor(props) {
    super(props);

    const division = divisionTournamentCitiesInA(
      this.props.infoProfile.city.city_name,
    );

    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });

    this.state = {
      dataSource: ds.cloneWithRows([{loading: true}]),
      length: 1,
      division: division,
    };
  }

  saveSchedule = (data) => {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });

    data = orderByB(data, this.state.division);

    this.setState({
      dataSource: ds.cloneWithRows(data),
      length: data.length,
    });
  };

  componentWillMount() {
    this.props.dispatch(getSeasonRanking({}, this.saveSchedule));
  }

  loading = (index) => {
    return (
      <View key={index}>
        <View
          style={{
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height * 0.64,

            flexDirection: 'column',
            alignContent: 'flex-start',
          }}>
          <View
            style={{
              alignContent: 'center',
              flex: 1,
              width: Dimensions.get('window').width,
              height: Dimensions.get('window').height * 0.3,

              alignItems: 'center',
              alignSelf: 'center',
            }}>
            <View>
              <ActivityIndicator
                style={{
                  alignContent: 'center',
                  flex: 1,

                  alignItems: 'center',
                  alignSelf: 'center',
                }}
                size="large"
                color="#000000"
              />
            </View>
          </View>
        </View>
        <View
          style={{
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height * 0.36,
          }}
        />
      </View>
    );
  };

  render() {
    return (
      <View style={styles.mainContainer}>
        {/* <LinearGradient
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 0.0, y: 1.0 }}
          locations={[0, 1.0]}
          colors={["#C8DBAE", "#ACDBE5"]}
          style={styles.header}
        /> */}

        {/* <WavyArea
          data={positiveData}
          color={"#fff"}
          style={[
            styles.overlayWave,
            { top: Dimensions.get("window").height * 0.12 - 20 }
          ]}
        /> */}

        <ListView
          removeClippedSubviews={false}
          dataSource={this.state.dataSource}
          style={styles.challengesList}
          renderRow={(city, sectionID, rowID) =>
            city.loading ? (
              <View>
                <Image
                  source={
                    this.state.division
                      ? require('./../../assets/images/wave/cites_standings_wave_purple.png')
                      : require('./../../assets/images/wave/cites_standings_wave_red.png')
                  }
                  style={styles.secondStandingImage}
                />
                <View style={styles.tableHeader}>
                  <View
                    style={[styles.cityColumn, styles.cityColumnPosition]}
                  />
                  <View style={[styles.teamColumn, styles.cityColumnName]}>
                    <Text style={styles.headerText}>TEAM</Text>
                  </View>
                  <View style={[styles.cityColumn, styles.cityColumnWon]}>
                    <Text style={styles.headerText}>WON</Text>
                  </View>
                  <View style={[styles.cityColumn, styles.cityColumnLost]}>
                    <Text style={styles.headerText}>LOST</Text>
                  </View>
                  <View
                    style={[styles.cityColumn, styles.cityColumnPercentage]}>
                    <Text style={styles.headerText}>POINTS</Text>
                  </View>
                </View>
                {this.loading(1)}
              </View>
            ) : rowID == 0 || rowID == 8 ? (
              <View>
                <Image
                  source={
                    city.group == 'Group A'
                      ? require('./../../assets/images/wave/cites_standings_wave_purple.png')
                      : require('./../../assets/images/wave/cites_standings_wave_red.png')
                  }
                  style={styles.secondStandingImage}
                />
                <View style={styles.tableHeader}>
                  <View
                    style={[styles.cityColumn, styles.cityColumnPosition]}
                  />
                  <View style={[styles.teamColumn, styles.cityColumnName]}>
                    <Text style={styles.headerText}>TEAM</Text>
                  </View>
                  <View style={[styles.cityColumn, styles.cityColumnWon]}>
                    <Text style={styles.headerText}>WON</Text>
                  </View>
                  <View style={[styles.cityColumn, styles.cityColumnLost]}>
                    <Text style={styles.headerText}>LOST</Text>
                  </View>
                  <View
                    style={[styles.cityColumn, styles.cityColumnPercentage]}>
                    <Text style={styles.headerText}>POINTS</Text>
                  </View>
                </View>
                <CityGameItem
                  stylesCityItem={styles.cityItem}
                  key={rowID}
                  city_name={city.city.city_name}
                  won={city.won}
                  lost={city.lost}
                  points={city.points}
                  rowID={rowID}
                  end={this.state.length}
                />
              </View>
            ) : (
              <CityGameItem
                stylesCityItem={styles.cityItem}
                key={rowID}
                city_name={city.city.city_name}
                won={city.won}
                lost={city.lost}
                points={city.points}
                rowID={rowID}
                end={this.state.length}
              />
            )
          }
        />
      </View>
    );
  }
}

const withData = connect((state) => {
  // prendo le info dell'utente, in particolare la citta
  return {
    infoProfile: getProfile(state),
  };
});

export default withData(CitiesStandings);
