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
  imagesCity,
  divisionTournamentCitiesInA
} from "./../../components/FriendItem/FriendItem";

import ScheduleSingleCityGame from "./../../components/ScheduleSingleCityGame/ScheduleSingleCityGame";

import { medalSmallGlobalView } from "./../TrophiesRanking/TrophiesRanking";
import {
  getSchedule,
  getScheduleWeek,
  getPlayoffMatch
} from "./../../domains/screen/ActionCreators";
import { getProfile } from "./../../domains/login/Selectors";
import { getPlayoffMatchState } from "./../../domains/screen/Selectors";

import { data, currentMatch } from "../../helpers/tournament";

function compare(a, b) {
  console.log(a);
  if (a.season_match.group > b.season_match.group) {
    return -1;
  }
  if (a.season_match.group < b.season_match.group) {
    return 1;
  }
  return 0;
}

function compareSchedule(a, b) {
  if (a.group > b.group) {
    return -1;
  }
  if (a.group < b.group) {
    return 1;
  }
  return 0;
}

export function playoffStart(Now) {
  const endTournament = "2019-11-10T17:00:00Z";
  // const endTournament = "2019-09-23T04:30:00Z"
  return Now >= new Date(endTournament).getTime();
}

export function playoffPhrase(Now) {
  const endTournament = "2019-11-10T17:00:00Z";
  // const endTournament = "2019-09-23T04:30:00Z"
  // calcolo la fase, index del torneo, indexMax per lo scroll
  let phrase = 1;
  let index = 8;
  let indexMax = index + 1;
  if (Now < new Date(endTournament).getTime() + 7 * 86400000) {
    phrase = 1;
    index = 8;
    indexMax = index + 1;
  } else if (Now < new Date(endTournament).getTime() + 14 * 86400000) {
    phrase = 2;
    index = 9;
    indexMax = index + 1;
  } else if (Now < new Date(endTournament).getTime() + 21 * 86400000) {
    phrase = 3;

    index = 10;
    indexMax = index + 1;
  } else if (Now < new Date(endTournament).getTime() + 28 * 86400000) {
    phrase = 4;

    index = 11;
    indexMax = index + 1;
  } else {
    phrase = 4;
    index = 12;
    indexMax = 12;
  }
  return {
    phrase,
    index,
    indexMax
  };
}

class ScheduleGameScreen extends React.Component {
  // ordina i gruppo con B prima
  orderByB = schedule => {
    if (!this.state.division) {
      // metto prima group B
      // schedule = schedule.sort(compare);
      schedule = schedule.sort(compare);
      console.log(schedule);
    }
    return schedule;
  };

  // controllo l'index cosi non vado fuori range
  limitIndex = index => {
    if (index > this.state.indexMax - 1) {
      return this.state.indexMax - 1;
    } else if (index < 0) {
      return 0;
    } else {
      return index;
    }
  };

  constructor(props) {
    super(props);

    // controllo se il torneo è finito
    // se si controllo i playoff

    // fine torneo
    // 2019-11-10T17:00:00Z
    const Now = new Date().getTime();

    const playoff = playoffStart(Now);

    const division = divisionTournamentCitiesInA(
      this.props.infoProfile.city.city_name
    );

    let Match = currentMatch(data, true);
    console.log(Match);
    if (!division) {
      // metto prima group B
      Match.schedule = Match.schedule.map(elem => elem.sort(compareSchedule));
      console.log(Match);
    }

    // this.header.scrollToIndex({ index: indexWeek });
    // this.game.scrollToIndex({ index: indexWeek });

    // let index = 11
    let index = Match.indexWeek;
    let indexMax = 7
    // let indexMax = 13
    if (playoff) {
      // devo vedere in che settimana del playoff sono
      const playoffState = playoffPhrase(Now);
      index = playoffState.index;
      indexMax = playoffState.indexMax;
    }

    this.state = {
      schedule: Match.schedule,
      index,
      division: division,
      indexMax,
      Now: new Date().getTime
    };

    // this.state = {
    //   index: 0,
    //   schedule: []
    // };
  }

  headerWeek = () => {
    const array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    return array.map(elem => (
      <View
        key={elem}
        style={{
          height: 40,
          width: Dimensions.get("window").width / 3,

          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "center"
        }}
      >
        <View
          style={{
            height: 5,
            width: Dimensions.get("window").width / 3,
            flexDirection: "column"
          }}
        />
        <View
          style={{
            height: 30,
            width: Dimensions.get("window").width / 3,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          {item ? (
            <View
              style={{
                height: 30,
                width: Dimensions.get("window").width / 3,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Text
                style={[
                  styles.gameNumber,
                  this.state.index === item - 1 ? { color: "#3D3D3D" } : {}
                ]}
              >
                WEEK {item}
              </Text>
            </View>
          ) : (
            <View
              style={{
                height: 30,
                width: Dimensions.get("window").width / 3,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center"
              }}
            />
          )}
        </View>
        <View
          style={{
            height: 5,
            // backgroundColor: "#3D3D3D",
            width: Dimensions.get("window").width / 3,
            flexDirection: "column"
          }}
        />
      </View>
    ));
  };

  handleScroll(event) {
    const x = event.nativeEvent.contentOffset.x;
    console.log(x);
    const deviceWidth = Dimensions.get("window").width;
    if (x < deviceWidth / 2) {
      this.setState({
        levelCorrent: 0
      });
    } else if (x < (deviceWidth * 3) / 2 + 1) {
      this.setState({
        levelCorrent: 1
      });
    } else if (x < (deviceWidth * 5) / 2 + 1) {
      this.setState({
        levelCorrent: 2
      });
    } else {
      this.setState({
        levelCorrent: 3
      });
    }
  }

  saveSchedule = data => {
    const Now = new Date().getTime();
    if (data.length) {
      let schedule = [];
      let singleSchedule = [];
      let week_name_match = data[0].week_name_match;
      // per sapere che settimana sto analizzando
      let index = 0;
      // in che settimana sono
      let indexWeek = -1;

      // se la partita è finita, in corso e ancora ci deve essere
      // start_match={match.start_match} end_match={match.end_match}

      // 0 deve ancora iniziare, 1 è in corso , 2 finita
      let statusMatch =
        Now < new Date(data[0].start_match).getTime()
          ? 0
          : Now > new Date(data[0].end_match).getTime()
          ? 2
          : 1;
      if (statusMatch == 1) {
        indexWeek = index;
      }

      data.forEach(el => {
        // se è la stessa settimana
        if (el.week_name_match === week_name_match) {
          singleSchedule = [...singleSchedule, { ...el, statusMatch }];
        } else {
          index++;
          if (statusMatch == 1) {
            indexWeek = index;
          }
          schedule = [...schedule, singleSchedule];
          statusMatch =
            Now < new Date(el.start_match).getTime()
              ? 0
              : Now > new Date(el.end_match).getTime()
              ? 2
              : 1;
          (singleSchedule = [{ ...el, statusMatch }]),
            (week_name_match = el.week_name_match);
        }
      });
      if (indexWeek == -1) {
        indexWeek = index - 1;
      }
      // ultima settimana
      schedule = [...schedule, singleSchedule];
      console.log(schedule);

      this.header.scrollToIndex({ index: this.limitIndex(indexWeek) });
      this.game.scrollToIndex({ index: this.limitIndex(indexWeek) });

      // schedule = this.orderByB(schedule);

      this.setState({
        schedule: schedule,
        index: this.limitIndex(indexWeek)
      });
    }
  };

  componentDidMount() {
    setTimeout(() => {
      this.onLayout();
      this.onLayoutHeader();
    }, 400);
  }

  componentWillMount() {
    // se ho il torneo ovvero un determinato index
    if (this.state.index < 7) {
      // prendo i dati che mi arrivano dal live per caricare la settimana corrente
      let week = this.props.navigation.getParam("week", []);
      if (!this.state.division) {
        // metto prima group B
        // schedule = schedule.sort(compare);
        // schedule = schedule.map(elem => elem.sort(compareSchedule));
        // console.log(schedule)
        week = this.orderByB(week);
      }
      const weekCurrent = this.props.navigation.getParam("weekCurrent", 0);
      if (week.length) {
        // se ho qualcosa aggiorno i dati corrente della settimana

        // cerco la settimana d'aggiornare
        if (this.state.schedule.length > weekCurrent) {
          schedule = this.state.schedule;
          console.log(schedule);

          schedule[weekCurrent] = schedule[weekCurrent].map((elem, index) => {
            return {
              ...elem,
              total_point_away: week[index].total_point_away,
              total_point_home: week[index].total_point_home
            };
          });
          console.log(week);
          console.log(schedule);

          this.setState({
            schedule
          });
        }
      }

      this.props.dispatch(
        getScheduleWeek({ week: weekCurrent + 1 }, this.saveSpecificWeek)
      );
    } else {
      // ho i playoff
      // potrei aggiornare i dati sui playoff

      // per le successive settimane chiedo i dati del playoff
      // aggiorna in automatico lo stato redux corrisponde
      this.props.dispatch(
        getPlayoffMatch({ season_playoff: this.state.index - 6 })
      );
    }
  }

  handleScrollHeader(event) {
    // console.log(event.nativeEvent)
    const x = event.nativeEvent.contentOffset.x;
    console.log(x);
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

    let index = this.limitIndex(
      parseInt((x + deviceWidth / 1.8) / deviceWidth)
    );
    console.log(index);

    this.header.scrollToIndex({ index: index });
    this.game.scrollToIndex({ index: index });
    this.setState({
      index
    });
    // se index cambia carico nuovi dati
    if (index !== this.state.index) {
      if (index < 7) {
        // per le prime sette settimane chiedo i dati del torneo
        this.props.dispatch(
          getScheduleWeek({ week: index + 1 }, this.saveSpecificWeek)
        );
      } else {
        // per le successive settimane chiedo i dati del playoff
        // aggiorna in automatico lo stato redux corrisponde
        this.props.dispatch(getPlayoffMatch({ season_playoff: index - 6 }));
      }
    }
  }

  saveSpecificWeek = (week, indexWeek) => {
    if (week.length) {
      // se ho qualcosa aggiorno i dati corrente della settimana

      // cerco la settimana d'aggiornare
      if (this.state.schedule.length > indexWeek - 1) {
        week = this.orderByB(week);
        schedule = this.state.schedule;
        console.log(schedule);

        schedule[indexWeek - 1] = schedule[indexWeek - 1].map((elem, index) => {
          return {
            ...elem,
            total_point_away: week[index].total_point_away,
            total_point_home: week[index].total_point_home
          };
        });
        console.log(week);
        console.log(schedule);

        this.setState({
          schedule
        });
      }
    }
  };

  handleScrollGame(event) {
    const x = event.nativeEvent.contentOffset.x;

    const deviceWidth = Dimensions.get("window").width;
    //   const offset = x % (deviceWidth / 3);
    //   let indexX = parseInt(x / (deviceWidth / 3));
    //   let newX = indexX * deviceWidth;
    //   console.log(newX);
    //   // if (offset >= deviceWidth / 6) {
    //   //   newX += deviceWidth;
    //   // }
    //   console.log(newX);

    //   var interval = Dimensions.get("window").width / 3; // WIDTH OF 1 CHILD COMPONENT

    //   const snapTo = parseInt(x / interval);

    //   var scrollTo = snapTo * interval;

    //  // this.header.scrollToIndex({ index: snapTo });
    //  let indexIndex = parseInt((x + (deviceWidth/ 6)) / (deviceWidth));

    let index = this.limitIndex(
      parseInt((x + deviceWidth / 6) / (deviceWidth / 3))
    );
    this.header.scrollToIndex({ index: index });
    // this.game.scrollToIndex({ index: indexX });
    this.game.scrollToIndex({ index: index });
    this.setState({
      index
    });
    if (index !== this.state.index) {
      if (index < 7) {
        this.props.dispatch(
          getScheduleWeek({ week: index + 1 }, this.saveSpecificWeek)
        );
      } else {
        // per le successive settimane chiedo i dati del playoff
        // aggiorna in automatico lo stato redux corrisponde
        this.props.dispatch(getPlayoffMatch({ season_playoff: index - 6 }));
      }
    }
  }

  changeIndex = index => {
    if (index <= this.state.index) {
      this.decrease();
      if (index < 8) {
        this.props.dispatch(
          getScheduleWeek({ week: index }, this.saveSpecificWeek)
        );
      } else {
        // per le successive settimane chiedo i dati del playoff
        // aggiorna in automatico lo stato redux corrisponde
        this.props.dispatch(getPlayoffMatch({ season_playoff: index - 7 }));
      }
    } else if (index > this.state.index + 1) {
      this.increase();
      if (index < 8) {
        this.props.dispatch(
          getScheduleWeek({ week: index }, this.saveSpecificWeek)
        );
      } else {
        // per le successive settimane chiedo i dati del playoff
        // aggiorna in automatico lo stato redux corrisponde
        this.props.dispatch(getPlayoffMatch({ season_playoff: index - 7 }));
      }
    }
  };

  increase = () => {
    // si deve fare un check inferiori, stessa cosa nelle scroll
    this.setState(function(prevState) {
      const index = this.limitIndex(prevState.index + 1);
      this.header.scrollToIndex({ index: index });

      this.game.scrollToIndex({ index: index });
      return {
        index: index
      };
    });
  };

  decrease = () => {
    this.setState(function(prevState) {
      const index = prevState.index ? this.limitIndex(prevState.index - 1) : 0;
      this.header.scrollToIndex({ index: index });

      this.game.scrollToIndex({ index: index });
      return {
        index: index
      };
    });
  };

  goToGame = (
    statusMatch,
    season_match,
    total_point_away,
    total_point_home
  ) => {
    console.log(season_match);
    const DataSend = {
      match: { season_match, total_point_away, total_point_home },
      infoProfile: this.props.infoProfile
    };
    if (statusMatch == 1) {
      // se è la mia città vado al live
      if (
        this.props.infoProfile.city.city_name ==
          season_match.city_home.city_name ||
        this.props.infoProfile.city.city_name ==
          season_match.city_away.city_name
      ) {
        this.props.navigation.navigate("GameWeekTournamentBlur", DataSend);
      } else {
        // altrimenti vado nel live di un altro match
        this.props.navigation.navigate(
          "GameWeekCityTournamentScreenBlur",
          DataSend
        );
      }
    } else {
      // due è stata completata
      this.props.navigation.navigate(
        "GameCompleteWeekTournamentScreenBlur",
        DataSend
      );
    }
  };

  goToWeekCityGame = () => {
    this.props.navigation.navigate("GameWeekCityTournamentScreenBlur");
  };

  nextPlayoffMatch = index => {
    return (
      <View key={index}>
        <View
          style={{
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height,

            flexDirection: "column",
            alignContent: "flex-start"
          }}
        >
          <View
            style={{
              alignContent: "center",

              width: Dimensions.get("window").width,
              height: 100,

              flexDirection: "column",
              alignItems: "center",
              alignSelf: "center",
              justifyContent: "center"
            }}
          ></View>
          <View
            style={{
              alignContent: "center",

              width: Dimensions.get("window").width,
              height: Dimensions.get("window").width * 0.8,

              alignItems: "center",
              alignSelf: "center",
              justifyContent: "center",
              flexDirection: "column"
            }}
          >
            <Image
              style={{
                alignContent: "center",
                flex: 1,
                width: Dimensions.get("window").width * 0.8,
                height: Dimensions.get("window").width * 0.8,

                alignItems: "center",
                alignSelf: "center"
              }}
              source={require("../../assets/images/next_matches.png")}
            />
          </View>
        </View>
      </View>
    );
  };

  winnerWho = indexMatch => {
    idHome = citiesImage(this.props.infoProfile.city.city_name);

    return (
      <View key={indexMatch}>
        <LinearGradient
          style={{
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height * 1.36,

            flexDirection: "column",
            alignContent: "flex-start"
          }}
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 0.0, y: 1.0 }}
          locations={[0, 1.0]}
          colors={["#007DC5", "#0C519E"]}
        >
          <View
            style={{
              alignContent: "center",

              width: Dimensions.get("window").width,
              height: 100,

              flexDirection: "column",
              alignItems: "center",
              alignSelf: "center",
              justifyContent: "center"
            }}
          />
          <View
            style={{
              alignContent: "center",

              width: Dimensions.get("window").width,
              height: Dimensions.get("window").width * 0.8,

              alignItems: "center",
              alignSelf: "center",
              justifyContent: "center",
              flexDirection: "column"
            }}
          >
            <ImageBackground
              style={{
                alignContent: "center",
                flex: 1,
                width: Dimensions.get("window").width * 0.8,
                height: Dimensions.get("window").width * 0.8,

                alignItems: "center",
                alignSelf: "center"
              }}
              source={require("../../assets/images/winner_bg.png")}
            />
            <Image
              source={require("../../assets/images/question_mark.png")}
              style={{
                width: Dimensions.get("window").width * 0.8 * 0.33,
                height: Dimensions.get("window").width * 0.8 * 0.33,
                position: "absolute"
                // top: Dimensions.get("window").width * 0.4,
                // left: Dimensions.get("window").width * 0.4,
              }}
            />
            <View
              style={{
                width: Dimensions.get("window").width * 0.8 * 0.15,
                height: Dimensions.get("window").width * 0.8 * 0.15,
                position: "absolute",
                bottom: Dimensions.get("window").width * 0.6 * 0.31111111,
                right:
                  Dimensions.get("window").width * 0.2444444 -
                  Dimensions.get("window").width * 0.1 * 0.2444444,
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                alignContent: "center"
              }}
            >
              <Image
                source={imagesCity[idHome]}
                style={{
                  width: Dimensions.get("window").width * 0.8 * 0.08,
                  height: Dimensions.get("window").width * 0.8 * 0.08
                }}
              />
            </View>
          </View>
          <View
            style={{
              alignContent: "center",

              width: Dimensions.get("window").width,
              height: 100,

              flexDirection: "column",
              alignItems: "center",
              alignSelf: "center",
              justifyContent: "center"
            }}
          />
        </LinearGradient>
      </View>
    );
  };

  winner = (info, indexMatch) => {
    idWin = citiesImage(info.firstCity.city_name);
    idLose = citiesImage(info.ownCity.city_name);
    let labelPosition = "th";
    if (info.ownPosition == 1) {
      labelPosition = "st";
    } else if (info.ownPosition == 2) {
      labelPosition = "nd";
    } else if (info.ownPosition == 3) {
      labelPosition = "rd";
    }
    const youWin = info.ownPosition == 1;

    return (
      <View key={indexMatch}>
        <LinearGradient
          style={{
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height * 1.36,

            flexDirection: "column",
            alignContent: "flex-start"
          }}
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 0.0, y: 1.0 }}
          locations={[0, 1.0]}
          colors={["#007DC5", "#0C519E"]}
        >
          <View
            style={{
              alignContent: "center",

              width: Dimensions.get("window").width,
              height: 100,

              flexDirection: "column",
              alignItems: "center",
              alignSelf: "center",
              justifyContent: "center"
            }}
          >
            <View>
              <Text
                style={{
                  color: "#FFFFFF",
                  fontFamily: "Montserrat-ExtraBold",
                  fontSize: 20
                }}
              >
                {youWin
                  ? info.firstCity.city_name.toUpperCase()
                  : info.firstCity.city_name.toUpperCase() + " WINS!"}
              </Text>
            </View>
          </View>
          <View
            style={{
              alignContent: "center",

              width: Dimensions.get("window").width,
              height: Dimensions.get("window").width * 0.8,

              alignItems: "center",
              alignSelf: "center",
              justifyContent: "center",
              flexDirection: "column"
            }}
          >
            <ImageBackground
              style={{
                alignContent: "center",
                flex: 1,
                width: Dimensions.get("window").width * 0.8,
                height: Dimensions.get("window").width * 0.8,

                alignItems: "center",
                alignSelf: "center"
              }}
              source={require("../../assets/images/winner_bg.png")}
            />
            <Image
              source={imagesCity[idWin]}
              style={{
                width: Dimensions.get("window").width * 0.8 * 0.33,
                height: Dimensions.get("window").width * 0.8 * 0.33,
                position: "absolute"
                // top: Dimensions.get("window").width * 0.4,
                // left: Dimensions.get("window").width * 0.4,
              }}
            />
            {youWin ? (
              <View
                style={{
                  width: Dimensions.get("window").width * 0.8 * 0.15,
                  height: Dimensions.get("window").width * 0.8 * 0.15,
                  position: "absolute",
                  bottom: Dimensions.get("window").width * 0.6 * 0.31111111,
                  right:
                    Dimensions.get("window").width * 0.2444444 -
                    Dimensions.get("window").width * 0.1 * 0.2444444,
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  alignContent: "center"
                }}
              >
                <Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#FFFFFF",
                      fontFamily: "Montserrat-ExtraBold"
                    }}
                  >
                    1
                  </Text>

                  <Text
                    style={{
                      fontSize: 8,
                      color: "#FFFFFF",
                      fontFamily: "Montserrat-ExtraBold",
                      marginVertical: 4,
                      paddingBottom: 4
                    }}
                  >
                    st
                  </Text>
                </Text>
              </View>
            ) : (
              <View
                style={{
                  width: Dimensions.get("window").width * 0.8 * 0.15,
                  height: Dimensions.get("window").width * 0.8 * 0.15,
                  position: "absolute",
                  bottom: Dimensions.get("window").width * 0.6 * 0.31111111,
                  right:
                    Dimensions.get("window").width * 0.2444444 -
                    Dimensions.get("window").width * 0.1 * 0.2444444,
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  alignContent: "center"
                }}
              >
                <Image
                  source={imagesCity[idLose]}
                  style={{
                    width: Dimensions.get("window").width * 0.8 * 0.08,
                    height: Dimensions.get("window").width * 0.8 * 0.08
                  }}
                />
                <Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#FFFFFF",
                      fontFamily: "Montserrat-ExtraBold"
                    }}
                  >
                    {info.ownPosition}
                  </Text>

                  <Text
                    style={{
                      fontSize: 8,
                      color: "#FFFFFF",
                      fontFamily: "Montserrat-ExtraBold",
                      marginVertical: 4,
                      paddingBottom: 4
                    }}
                  >
                    {labelPosition}
                  </Text>
                </Text>
              </View>
            )}
          </View>
          <View
            style={{
              alignContent: "center",

              width: Dimensions.get("window").width,
              height: 100,

              flexDirection: "column",
              alignItems: "center",
              alignSelf: "center",
              justifyContent: "center"
            }}
          >
            <View>
              <Text
                style={{
                  color: "#FFFFFF",
                  fontFamily: "Montserrat-ExtraBold",
                  fontSize: 30
                }}
              >
                {youWin ? "WINNER" : ""}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    );
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

  // la posizione iniziale per flatlist non funziona e ti conseguenza devo muovero quando viene creata la view
  onLayout() {
    if (this.game) {
      this.game.scrollToIndex({ index: this.limitIndex(this.state.index) });
    }
    
  }

  onLayoutHeader() {
    if (this.header) {
    this.header.scrollToIndex({ index: this.limitIndex(this.state.index) });
    }
  }

  render() {
    let id = 1;
    if (this.props.city && this.props.city.length) {
      // vedo se è tra le città pilota
      id = citiesImage(this.props.city ? this.props.city : "");
    }

    return (
      <View>
        <View>
          <FlatList
            style={{
              width: Dimensions.get("window").width,
              height: Dimensions.get("window").height * 2,
              backgroundColor: "#F7F8F9",
              top: 40
            }}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={10}
            horizontal
            pagingEnabled
            showsVerticalScrollIndicator={false}
            onScrollToIndexFailed={() => {}}
            // onScroll={this.handleScroll.bind(this)}
            ref={ref => (this.game = ref)}
            // initialScrollIndex={this.state.index}
            keyExtractor={(item, index) => index.toString()}
            onScrollEndDrag={this.handleScrollHeader.bind(this)}
            data={[...this.state.schedule, ...this.props.playoff]}
            renderItem={({ item, index }) => (
              <ScrollView
                key={index}
                style={{
                  width: Dimensions.get("window").width,
                  height: Dimensions.get("window").height,
                  backgroundColor: "#FFFFFF"
                }}
                showsVerticalScrollIndicator={false}
              >
                {item.loading ? (
                  this.loading(index)
                ) : item.length ? (
                  <View>
                    {item.map((match, indexMatch) =>
                      match.firstCity ? (
                        this.winner(match, indexMatch)
                      ) : ( 
                        index < 7 ? 
                        <ScheduleSingleCityGame
                          indexMatch={indexMatch}
                          indexWeek={index}
                          key={match.season_match_id}
                          goToGame={this.goToGame}
                          city_home={match.city_home}
                          city_away={match.city_away}
                          total_point_home={match.total_point_home}
                          total_point_away={match.total_point_away}
                          statusMatch={match.statusMatch}
                          rowID={match.season_match_id}
                          match={match}
                          division={match.group}
                          last={item.length}

                          //division={this.state.division}
                          // divisionMatch={this.state.division}
                        />
                       : <ScheduleSingleCityGame
                          indexMatch={indexMatch}
                          indexWeek={index}
                          key={match.season_match.season_match_id}
                          goToGame={this.goToGame}
                          city_home={match.season_match.city_home}
                          city_away={match.season_match.city_away}
                          total_point_home={match.total_point_home}
                          total_point_away={match.total_point_away}
                          statusMatch={
        this.state.Now < new Date(match.season_match.start_match).getTime()
          ? 0
          : this.state.Now > new Date(match.season_match.end_match).getTime()
          ? 2
          : 1}
                          rowID={match.season_match.season_match_id}
                          match={match.season_match}
                          division={match.group}
                          last={item.length}

                          //division={this.state.division}
                          // divisionMatch={this.state.division}
                        />
                    ))}
                  </View>
                ) : index == 11 ? (
                  this.winnerWho(index)
                ) : (
                  this.nextPlayoffMatch(index)
                )}
              </ScrollView>
            )}
          />
        </View>
        <View
          style={{
            height: 40,
            position: "absolute",
            flexDirection: "row",
            justifyContent: "center",
            alignContent: "flex-end",
            alignItems: "flex-end",
            backgroundColor: "#F7F8F9",
            width: Dimensions.get("window").width
          }}
        >
          <View
            style={{
              height: 5,
              backgroundColor: "#3D3D3D",
              width: Dimensions.get("window").width / 3,
              flexDirection: "column"
            }}
          />
        </View>
        <View
          style={{
            height: 40,
            position: "absolute",
            flexDirection: "row",

            width: Dimensions.get("window").width
          }}
        >
          <FlatList
            // style={{
            //   height: 40,
            //   position: "absolute",
            //   flexDirection: "row",

            //   width: Dimensions.get("window").width
            // }}
            horizontal={true}
            onScrollToIndexFailed={() => {}}
            ref={ref => (this.header = ref)}
            onScrollEndDrag={this.handleScrollGame.bind(this)}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={10}
            horizontal
            //pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            // onScroll={this.handleScroll.bind(this)}
            data={[
              "",
              "WEEK 1",
              "WEEK 2",
              "WEEK 3",
              "WEEK 4",
              "WEEK 5",
              "WEEK 6",
              "WEEK 7",
              "LAST 16",
              "QUARTER-FINAL",
              "SEMI-FINAL",
              "FINAL",
              "WINNER",
              ""
            ]}
            // initialScrollIndex={this.state.index}
            renderItem={({ item, index }) => {
              {
                if (index > 0 && index < this.state.indexMax + 1) {
                  return (
                    <View
                      key={index}
                      style={{
                        height: 40,
                        width: Dimensions.get("window").width / 3,

                        flexDirection: "column",
                        justifyContent: "flex-end",
                        alignItems: "center"
                      }}
                    >
                      <View
                        style={{
                          height: 5,
                          width: Dimensions.get("window").width / 3,
                          flexDirection: "column"
                        }}
                      />
                      <TouchableOpacity
                        style={{
                          height: 30,
                          width: Dimensions.get("window").width / 3,
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center"
                        }}
                        onPress={() => this.changeIndex(index)}
                      >
                        <View
                          style={{
                            height: 30,
                            width: Dimensions.get("window").width / 3,
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center"
                          }}
                        >
                          <Text
                            style={[
                              styles.gameNumber,
                              this.state.index === index - 1
                                ? { color: "#3D3D3D" }
                                : {}
                            ]}
                          >
                            {item}
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <View
                        style={{
                          height: 5,
                          // backgroundColor: "#3D3D3D",
                          width: Dimensions.get("window").width / 3,
                          flexDirection: "column"
                        }}
                      />
                    </View>
                  );
                } else
                  return (
                    <View
                      key={index}
                      style={{
                        height: 40,
                        width: Dimensions.get("window").width / 3,

                        flexDirection: "column",
                        justifyContent: "flex-end",
                        alignItems: "center"
                      }}
                    >
                      <View
                        style={{
                          height: 5,
                          width: Dimensions.get("window").width / 3,
                          flexDirection: "column"
                        }}
                      />
                      <View
                        style={{
                          height: 30,
                          width: Dimensions.get("window").width / 3,
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center"
                        }}
                      >
                        <Text style={[styles.gameNumber, { opacity: 0.5 }]}>
                          {item}
                        </Text>
                      </View>
                      <View
                        style={{
                          height: 5,
                          // backgroundColor: "#3D3D3D",
                          width: Dimensions.get("window").width / 3,
                          flexDirection: "column"
                        }}
                      />
                    </View>
                  );
              }
            }}
          />
        </View>
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

const withData = connect(state => {
  // prendo le info dell'utente, in particolare la citta
  return {
    infoProfile: getProfile(state),
    playoff: getPlayoffMatchState(state)
  };
});

export default withData(ScheduleGameScreen);
