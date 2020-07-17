import React from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
  Platform,
  Image,
  ImageBackground,
  NativeModules,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity
} from "react-native";

import { connect } from "react-redux";
import Svg, { Circle, Polygon, Line } from "react-native-svg";
import OwnIcon from "../../components/OwnIcon/OwnIcon";

import LinearGradient from "react-native-linear-gradient";

import { imagesCity, divisionTournamentCitiesInA } from "./../../components/FriendItem/FriendItem";
import { citiesDescription, citiesColor } from "./../CityScreenCards/CityScreenCards";


import ArrowGame from "./../../components/ArrowGame/ArrowGame";
import { strings } from "../../config/i18n";
import {
  getScheduleWeek,
  getWeeklySingleMatch,
  getSeasonRanking,
  getPlayoffMatch
} from "./../../domains/screen/ActionCreators";
import Aux from "../../helpers/Aux";
import pointsDecimal from "../../helpers/pointsDecimal";
import { getCurrentMatchState } from "./../../domains/screen/Selectors";
import { data, currentMatch } from "../../helpers/tournament";
import { orderByB } from "../CitiesStandingsScreen/CitiesStandingsScreen"
import SponsorTournament from "../../components/SponsorTournament/SponsorTournament"
import { playoffPhrase, playoffStart  } from "../ScheduleGameScreen/ScheduleGameScreen"



class CitiesTournamentScreen extends React.Component {
  constructor(props) {
    super(props);

    const IsTeresina = this.props.city == "Teresina"

    // calcolo la settimana corrente

    const Match = currentMatch(data)
    const division = divisionTournamentCitiesInA(this.props.city)
    const Now = new Date().getTime()
    
    
    const playoff = playoffStart(Now)
    console.log(playoff)
    let phrase = 0
    
    if (playoff) {
      // devo vedere in che settimana del playoff sono
      const playoffState = playoffPhrase(Now)
      phrase = playoffState.phrase
      console.log(phrase)
    }


    this.state = {
      day: 0,
      hour: 0,
      minutes: 0,
      hourStartMatch: 0,
      minutesStartMatch: 0,

      weekNum: Match.weekCurrent + phrase,
      
      week: [],
      recapMatch: { total_point_away: 0, total_point_home: 0 },
      match: null,
      match_id: 0,
      refreshing: false,
      start_match: Match.start_match,
      positionCity: '-',
      typePosition: 'th',
      citiesStandings: [],
      endTimer: false,
      backgroundColorCity: "#242438",
      division,
      phrase,
      IsTeresina
    };
  }

  // salvo la posizione della mia citta
  saveCitiesStandings = data => {
    console.log(data);
    let positionCity = 8;

    if (data.length) {
      data = orderByB(data, this.state.division)

      for (i = 0; i < data.length; i++) {
        const City = data[i];
        if (this.props.city === City.city.city_name) {
          positionCity = i + 1;
          i = data.length;
        }
      }
    }


    let typePosition = "th"
    if (positionCity == 1) {
      typePosition = "st"
    } else if (positionCity == 2) {
      typePosition = "nd"
    } else if (positionCity == 3) {
      typePosition = "rd"
    }

    this.setState({
      citiesStandings: data,
      positionCity: positionCity,
      typePosition
    });
  };

  // salvo le partite correnti
  saveWeek = (data, index) => {
    this.setState({
      refreshing: false
    });

    if (data.length) {
      end_match = data[0].season_match.end_match;

      this.timerTournament(end_match);
      this.timer = setInterval(() => this.timerTournament(end_match), 60000);
    }

    this.setState({
      week: data
    });

    this.props.dispatch(getSeasonRanking({}, this.saveCitiesStandings));

    // nome della mia citta
    // this.props.city
    // trovo il match che mi interessa

    let match_id = 0;

    data.forEach(element => {
      if (element.season_match.city_away.city_name === this.props.city) {
        match_id = element.season_match.season_match_id;
        this.setState({
          recapMatch: element,
          match_id
        });
      } else if (element.season_match.city_home.city_name === this.props.city) {
        match_id = element.season_match.season_match_id;
        this.setState({
          recapMatch: element,
          match_id
        });
      }
    });

    if (match_id) {
      this.props.dispatch(
        getWeeklySingleMatch({
          match_id,
          start_match: this.state.start_match,
          saveData: this.saveMatch,
          currentMatch: true
        })
      );
    }
  };

  // ricarico i dati

  _onRefresh = () => {
    this.setState({
      refreshing: true
    });
    // dipende se ho il torneo o no
    if (this.state.phrase) {
      this.props.dispatch(
        getPlayoffMatch({ season_playoff: this.state.phrase })
      );
    } else {
      this.props.dispatch(
        getScheduleWeek({ week: this.state.weekNum }, this.saveWeek)
      );
    }
    
    
  };

  // salvo la mia partita

  saveMatch = data => {
    // this.setState({
    //   match: data
    // })
  };

  componentWillMount() {
    if (this.state.phrase) {
      this.props.dispatch(
        getPlayoffMatch({ season_playoff: this.state.phrase })
      );
    } else {
    this.props.dispatch(
      getScheduleWeek({ week: this.state.weekNum }, this.saveWeek)
    );
    }

    this.setState({

      backgroundColorCity: citiesColor(this.props.city)
    })



    //this.timerTournament();
    // this.timer = setInterval(() => this.timerTournament(), 60000);
  }

  componentWillUnmount() {
    if (this.timer) clearTimeout(this.timer);
    if (this.timerNext) clearTimeout(this.timerNext);
  }

  timerTournament = end_match => {
    // (year, month, day, hours, minutes, seconds, milliseconds)

    let startTournament = new Date(end_match);
    console.log(startTournament);

    let today = new Date();
    console.log(today);

    let e_msec = startTournament - today;
    console.log(e_msec);
    let e_mins = Math.floor(e_msec / 60000);
    let e_hrs = Math.floor(e_mins / 60);
    let e_days = Math.floor(e_hrs / 24);
    let e_a_hrs = e_hrs - e_days * 24;
    let e_a_mins = Math.floor(e_msec / 60000) - e_hrs * 60;
    console.log(e_a_mins);
    console.log(e_days);

    if (e_days < 0) {
      this.setState({
        endTimer: true
      });
      if (this.timer) clearTimeout(this.timer);
      // vedo la prossima settimana quando inizia il match 
      const NextMatch = currentMatch(data, false, 5)
      console.log(NextMatch)
      this.timerNewMatchTournament(NextMatch.start_match)
      this.timer = setInterval(() => this.timerNewMatchTournament(NextMatch.start_match), 60000);
    } else if (e_days > 0 || e_hrs > 0 || e_a_mins > 0) {
      this.setState({
        day: e_days,
        hour: e_a_hrs,
        minutes: e_a_mins
      });
    }
  };

  timerNewMatchTournament = (start_match) => {
    // (year, month, day, hours, minutes, seconds, milliseconds)


    let startTournament = new Date(start_match);
    console.log(startTournament);

    let today = new Date();

    let e_msec = startTournament - today;
    console.log(e_msec);
    let e_mins = Math.floor(e_msec / 60000);
    let e_hrs = Math.floor(e_mins / 60);
    let e_days = Math.floor(e_hrs / 24);
    let e_a_hrs = e_hrs - e_days * 24;
    let e_a_mins = Math.floor(e_msec / 60000) - e_hrs * 60;
    console.log(e_a_mins);
    console.log(e_days);

    if (e_days < 0) {
      this.setState({
        endTimer: false
      });
      if (this.timerNext) clearTimeout(this.timerNext);
      const Match = currentMatch(data)
      this.setState({

        weekNum: Match.weekCurrent,

        start_match: Match.start_match,

      })

      this.props.dispatch(
        getScheduleWeek({ week: Match.weekCurrent }, this.saveWeek)
      );





    } else if (e_days > 0 || e_hrs > 0 || e_a_mins > 0) {
      this.setState({

        hourStartMatch: e_a_hrs,
        minutesStartMatch: e_a_mins
      });
    }
  };

  loading = index => {
    return (
      <View key={index}>
        <View
          style={{
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height * 0.64,

            flexDirection: "column",
            alignContent: "flex-start"
          }}
        >
          <View
            style={{
              alignContent: "center",
              flex: 1,
              width: Dimensions.get("window").width,
              height: Dimensions.get("window").height * 0.3,

              alignItems: "center",
              alignSelf: "center"
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
        </View>
        <View
          style={{
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height * 0.36
          }}
        />
      </View>
    );
  };

  goToLive = () => {
    if (this.props.match && this.props.match.season_match) {
      // se ho i dati vado nel live
      this.props.navigation.navigate("GameWeekTournamentBlur", {
        match: this.props.match,
        infoProfile: this.props.infoProfile
      });
    } else {
      // altrimenti ricarico i dati
      if (this.props.match_id) {
        this.props.dispatch(
          getWeeklySingleMatch({
            match_id: this.props.match_id,
            saveData: this.saveMatch,
            start_match: this.state.start_match,
            currentMatch: true
          })
        );
      }
    }
  };

  goToCity = (id, city) => {
    this.props.navigation.navigate("CityDetailScreenBlurFromGlobal", {
      city: id,
      cityName: city,
      cityId: this.props.infoProfile.city ? this.props.infoProfile.city.id : 0,
    });
  };

  render() {
    //  cityInTournament={cityInTournament}
    // id={id}



    // <View style={{
    //   borderBottomColor: this.state.division ? '#60368C' : '#E20000',
    //   borderBottomWidth: 1

    // }}>

    //   <Text>
    //     <Text style={[styles.positionNumber]}>
    //       {this.state.positionCity}
    //     </Text>
    //     <Text style={[styles.position]}>{this.state.typePosition}</Text>
    //   </Text>


    // </View>


    const width = Dimensions.get("window").width * 0.3;
    return (
      <ScrollView
        style={{
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height,
          // backgroundColor: "#F7F8F9"

        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }
      >
        {this.state.recapMatch.season_match || this.props.match ? (
          <Aux>
            <ImageBackground
              source={require("./../../assets/images/cities/city_page_bg.png")}
              style={
                {
                  width: Dimensions.get("window").width,
                  // height: Dimensions.get("window").height * 0.4,
                  height: this.state.IsTeresina ? 240 : 140, backgroundColor: this.state.backgroundColorCity, flexDirection: "column", alignContent: "center", justifyContent: 'flex-start'
                }
              }
            >
              <View
                style={{
                  height: this.state.IsTeresina ? 220 : 120,

                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  alignContent: "center",

                }}
              >
                <TouchableOpacity
                  onPress={() => this.goToCity(this.props.id, this.props.city)}
                // disabled={true}
                >
                  <View
                    style={{
                      width: 110,
                      height: 120,
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <View
                      style={{
                        width: 80,
                        height: 80,
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <Image
                        source={require("../../assets/images/cities/team_live_bg_sx.png")}
                        style={{
                          width: 80,
                          height: 80,
                          position: "absolute"
                        }}
                      />
                      <Image
                        source={imagesCity[this.props.id]}
                        style={{
                          width: 50,
                          height: 50
                        }}
                      />
                    </View>

                    <Text style={[styles.nameNewText]}>
                      {this.props.city.toUpperCase()}
                    </Text>

                  </View>
                </TouchableOpacity>






              </View>

            </ImageBackground>
            <View style={styles.backgroundImage}></View>

            <View style={{
              flex: 3,
              width: Dimensions.get("window").width,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-around",
              alignContent: "center",
              top: -70

            }}>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center"
                }}
              >

                <LinearGradient
                  start={{ x: 0.0, y: 0.0 }}
                  end={{ x: 0.0, y: 1.0 }}
                  locations={[0, 1.0]}
                  colors={["#E82F73", "#F49658"]}
                  style={styles.buttonIcon}
                >






                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate("CitiesStandingBlur")
                    }
                    style={styles.buttonIconTouch}


                  >
                    <View style={{
                      width: 50,
                      height: 93,
                      paddingBottom: 3


                    }}>
                      <View
                        style={{
                          flex: 1,
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "flex-end",

                        }}
                      >

                        <View style={{
                          height: 40, width: 40, flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                        }}>
                          <Text>
                            <Text style={[styles.positionNumber]}>
                              {this.state.positionCity}
                            </Text>
                            <Text style={[styles.position]}>{this.state.typePosition}</Text>
                          </Text>

                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                </LinearGradient>
                <View style={{ height: 10 }} />
                <Text style={styles.Map}>RANKING</Text>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center"
                }}
              >
                <LinearGradient
                  start={{ x: 0.0, y: 0.0 }}
                  end={{ x: 0.0, y: 1.0 }}
                  locations={[0, 1.0]}
                  colors={["#E82F73", "#F49658"]}
                  style={styles.buttonIcon}
                >
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate("ScheduleGameBlur", {
                        week: this.state.week,
                        weekCurrent: this.state.weekNum - 1
                      })
                    }

                    style={styles.buttonIconTouch}


                  >
                    <View style={{
                      width: 50,
                      height: 93,
                      paddingBottom: 3


                    }}>
                      <View
                        style={{
                          flex: 1,
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "flex-end",

                        }}
                      >



                        <Svg height="40" width="40">

                          <View
                            style={{
                              position: "absolute",
                              height: 50,
                              width: 50,
                              flexDirection: "row"
                            }}
                          >
                            <OwnIcon
                              name="schedule_icn_1"
                              size={40}
                              color={"#ffffff"}
                              style={{ top: -3, }}

                            />
                            <OwnIcon
                              name="schedule_icn_2"
                              size={40}
                              color={"#ffffff"}
                              style={{ right: 40 }}
                            />
                            <OwnIcon
                              name="schedule_icn_3"
                              size={40}
                              color={"#ffffff"}
                              style={{ right: 80 }}
                            />
                          </View>
                        </Svg>



                      </View>

                    </View>
                  </TouchableOpacity>
                </LinearGradient>
                <View style={{ height: 10 }} />
                <Text style={styles.Map}>SCHEDULE</Text>
              </View>
              {this.state.weekNum - 1 ? (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center"
                  }}
                >

                  <LinearGradient
                    start={{ x: 0.0, y: 0.0 }}
                    end={{ x: 0.0, y: 1.0 }}
                    locations={[0, 1.0]}
                    colors={["#E82F73", "#F49658"]}
                    style={styles.buttonIcon}
                  >






                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate("BestPlayersScreenBlur", {
                          infoProfile: this.props.infoProfile
                        })
                      }
                      style={styles.buttonIconTouch}


                    >
                      <View style={{
                        width: 50,
                        height: 93,
                        paddingBottom: 3,
                        


                      }}>
                        <View
                          style={{
                            flex: 1,
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "flex-end",

                          }}
                        >

                          <Svg height="40" width="40">

                            <OwnIcon
                              name="best_player_icn"
                              size={40}
                              color={"#FFFFFF"}
                            />
                          </Svg>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </LinearGradient>
                  <View style={{ height: 10 }} />
                  <Text style={styles.Map}>BEST PLAYERS</Text>
                </View>) : (<View />
                )}

            </View>


            <View
              style={{
                height: 15,

                flexDirection: "row"
              }}
            />
            {this.state.IsTeresina ? <View></View> : <View style={{ top: -70 }}>
              <SponsorTournament navigation={this.props.navigation} />
            </View>
            }
            <View
              style={{
                height: 100,

                flexDirection: "row"
              }}
            />
            <ImageBackground
              source={require("./../../assets/images/ongoing_match_wave.png")}
              style={[styles.backgroundImageAbsolute, {top: this.state.IsTeresina ? 210 : 110,}]}
            >
              <Image
                source={require("../../assets/images/cities/sct_logo.png")}
                style={{
                  width: 60,
                  height: 60,
                  position: 'absolute',
                  top: -20,
                  right: 30

                }}
              />

              <View
                style={{
                  height: 120,

                  flexDirection: "column",
                  width: Dimensions.get("window").width,
                  justifyContent: "space-around",
                  alignItems: "center"
                }}
              >
                <View
                  style={{
                    //height: 120,

                    flexDirection: "column",
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center"
                  }}
                >
                  <Text style={[styles.nameText]}>{this.state.endTimer ? "FINAL RESULT" : "ONGOING MATCH"}</Text>
                  <Text style={[styles.levelText]}>
                   { this.state.phrase ? "Playoff - Week " + this.state.weekNum : "Regular Season - Week " + this.state.weekNum}
                  </Text>
                </View>
                <View
                  style={{
                    //height: 120,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center"
                  }}
                >
                  <View
                    style={{
                      //height: 120,

                      width: Dimensions.get("window").width * 0.5 - 25,
                      flexDirection: "column",
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center"
                    }}
                  >
                    <Text style={styles.name10Text}>
                      {this.props.match ? this.props.match.season_match.city_home.city_name : this.state.recapMatch.season_match.city_home.city_name}
                    </Text>
                    <Text style={styles.level10Text}>
                      {citiesDescription(
                        this.props.match ? this.props.match.season_match.city_home.city_name : this.state.recapMatch.season_match.city_home.city_name
                      )}
                    </Text>
                    <Text style={styles.value}>
                      {pointsDecimal(this.props.match ? this.props.match.total_point_home : this.state.recapMatch.total_point_home)}
                    </Text>
                  </View>
                  <View
                    style={{
                      //height: 120,

                      width: 50,
                      flexDirection: "column",
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center"
                    }}
                  >
                  <View style={{ top: 5}}>
                    <ArrowGame
                      width={40}
                      right={
                        (this.props.match ? this.props.match.total_point_home : this.state.recapMatch.total_point_home) <
                        (this.props.match ? this.props.match.total_point_away : this.state.recapMatch.total_point_away)
                      }
                      color={"#E83475"}
                      height={100}
                      center={
                        (this.props.match ? this.props.match.total_point_home : this.state.recapMatch.total_point_home) ==
                        (this.props.match ? this.props.match.total_point_away : this.state.recapMatch.total_point_away)
                      }
                    />
                    </View>
                    <LinearGradient
                      start={{ x: 0.0, y: 0.0 }}
                      end={{ x: 1.0, y: 0.0 }}
                      locations={[0, 1.0]}
                      colors={["#7D4D99", "#6497CC"]}
                      style={styles.button}
                    >
                      <TouchableOpacity
                        onPress={() => this.goToLive()}
                        style={{
                          width: 50,
                          height: 25,
                          borderRadius: 15,
                          alignItems: "center",
                          
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
                          {this.props.match && this.props.match.season_match ? (
                            <Text
                              style={{
                                // margin: 10,
                                color: "#FFFFFF",
                                fontFamily: "OpenSans-Bold",

                                fontSize: 14
                              }}
                            >
                              Live
          </Text>
                          ) : (
                              <ActivityIndicator size="small" color="white" />
                            )}
                        </View>
                      </TouchableOpacity>
                    </LinearGradient>
                  </View>
                  <View
                    style={{
                      //height: 120,

                      width: Dimensions.get("window").width * 0.5 - 25,
                      flexDirection: "column",
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center"
                    }}
                  >
                    <Text style={styles.name10Text}>
                      {this.props.match ? this.props.match.season_match.city_away.city_name : this.state.recapMatch.season_match.city_away.city_name}
                    </Text>
                    <Text style={styles.level10Text}>
                      {citiesDescription(
                        this.props.match ? this.props.match.season_match.city_away.city_name : this.state.recapMatch.season_match.city_away.city_name
                      )}
                    </Text>
                    <Text style={styles.value}>
                      {pointsDecimal(this.props.match ? this.props.match.total_point_away : this.state.recapMatch.total_point_away)}
                    </Text>
                  </View>
                </View>
              </View>

            </ImageBackground>
          </Aux>
        ) : (
            this.loading()
          )}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  backgroundImage: {
    width: Dimensions.get("window").width,
    height: 200,
    top: -40,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: "center",
    alignContent: "center"

  },
  backgroundImageAbsolute: {
    width: Dimensions.get("window").width,
    height: 200,
    position: 'absolute',
    
    
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: "center",
    alignContent: "center"
  },
  Map: {
    fontFamily: "OpenSans-Bold",
    fontWeight: "600",
    fontSize: 9,
    textAlign: "center",
    color: "#3D3D3D"
  },
  button: {
    width: 50,
    height: 25,
    borderRadius: 15,
    alignItems: "center",
    backgroundColor: 'transparent',
                          shadowRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    elevation: 1,
    
    
  },
  buttonIconTouch: {
    width: 50,
    height: 96,
    
    shadowRadius: 5,
shadowColor: "#000",
shadowOffset: { width: 0, height: 5 },
shadowOpacity: 0.5,
elevation: 1,



  },
  buttonIcon: {
    width: 50,
    height: 96,
    // backgroundColor: 'transparent',



    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    
    

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
  nameNewText: {
    color: "#FFFFFF",
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
  nextMatch: {
    color: "#FFFFFF",
    fontSize: 14,
    textAlign: "center",
    // fontWeight: "600",
    fontFamily: "OpenSans-Bold"
  },
  levelText: {
    color: "#3D3D3D",
    fontSize: 10,
    textAlign: "left",

    fontFamily: "OpenSans-Regular"
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
    color: "#FFFFFF",
    fontSize: 16,
    paddingTop: 4,

    fontFamily: "OpenSans-Regular"
  },
  positionNumber: {
    color: "#FFFFFF",
    fontSize: 20,

    // fontWeight: "600",
    fontFamily: "Montserrat-ExtraBold"
  },
  positionWhite: {
    color: "#FFFFFF",
    fontSize: 16,
    paddingTop: 4,

    fontFamily: "OpenSans-Regular"
  },
  positionBlack: {
    color: "#3D3D3D",
    fontSize: 20,
    paddingTop: 15,

    fontFamily: "OpenSans-Regular"
  },
  positionBlackNumber: {
    color: "#3D3D3D",
    fontSize: 35,

    fontWeight: "600",
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

const withData = connect(state => {
  // prendo le info del match corrente
  return {
    match: getCurrentMatchState(state)
  };
});

export default withData(CitiesTournamentScreen);
