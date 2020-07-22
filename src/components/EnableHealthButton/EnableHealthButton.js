import React from "react";
import {
  View,
  Text,
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
  RefreshControl,
  ActivityIndicator,
  TouchableWithoutFeedback,
  NativeModules,
  Image,
  Linking
} from "react-native";
import Svg, {
  G,
  Circle,
  LinearGradient,
  Line,
  Defs,
  Stop,
  Path,
  Rect,
  Polygon
} from "react-native-svg";
import { createSelector } from "reselect";
import ChartsStats from "./../../components/ChartsStats/ChartsStats";
import CO2Wave from "./../../components/CO2Wave/CO2Wave";
import PieChart from "./../../components/AreaStack/PieChart";
import { connect } from "react-redux";
import {
  getStatsNew,
  changeScreenStatistics,
  putDailyActivities,
  getWeeklyActivities,
  changeStatusPerm,
  updateActivities
} from "./../../domains/statistics/ActionCreators";
import {
  deleteMostFrequentRoute,
  getMostFrequentRoute
} from "./../../domains/login/ActionCreators";
import { checkPublic } from "./../../domains/trainings/ActionCreators";
import DescriptionIcon from "../../components/DescriptionIcon/DescriptionIcon";
import DailyActivities from "../../components/DailyActivities/DailyActivities";
import ChartsSustainability from "../../components/ChartsSustainability/ChartsSustainability";
import { strings } from "../../config/i18n";
import WebService from "./../../config/WebService";
import { thisExpression } from "@babel/types";
import AppleHealthKit from "rn-apple-healthkit";
import GoogleFit, { Scopes } from "react-native-google-fit";
import moment from "moment";
import { getPermActivitiesState } from "./../../domains/statistics/Selectors";

import pointsDecimal from "./../../helpers/pointsDecimal";
import Aux from "../../helpers/Aux";
import PointedCircleSvg from "./../../components/PointedCircleSvg/PointedCircleSvg";
import TravelsStats from "./../../components/TravelsStats/TravelsStats";
let IS_DEV = true;

WebService.url.includes("23.97.216.36") ? (IS_DEV = true) : (IS_DEV = false);







class EnableHealthButton extends React.Component {
  constructor() {
    super();
    this.mapRef = null;

    this.state = {
      page: "stats",
      showLoading: false,
      refreshing: false,
      modalActive: false,
      iconChoose: "round_info_icn",
      healthkit: "",
      log: "",
      steps: "",
      activities: "",
      distance: "",
      calories: "",
      activities: "",
      activities2: "",
      activities3: "",
      activities4: "",
      timeActivity: 0,
      results: "",
      distanceApple: 0,
      getDistanceWalkingRunning: 0,
      getDistanceCycling: 0
    };
  }







  componentDidMount() {
    this.askForFitAuth();
    
  }

  componentWillReceiveProps(props) {
  
  }

  calcolateActivitiesApple = () => {
    let options = {
      startDate: new Date(new Date().toDateString()).toISOString(), // required
      endDate: new Date().toISOString() // optional; default now
      // ascending: false, // optional; default false
      // limit: 10, // optional; default no limit,
      // type: 'Walking',
    };

    let optionsDistance = {
      unit: "meter", // optional; default 'meter'
      date: new Date().toISOString() // optional; default now
    };
    AppleHealthKit.getDistanceWalkingRunning(
      optionsDistance,
      (err, results) => {
        if (err) {
          return;
        }
        console.log(results);
        const timeActivityWalking = Math.round(results.value / 83.3333333);
        // ovvero 5 kilometri orari

        // this.setState({getDistanceWalkingRunning: results.value})

        this.setState(prevState => {
          timeActivity = prevState.timeActivity + timeActivityWalking;
          return { timeActivity };
        });
      }
    );

    AppleHealthKit.getDistanceCycling(optionsDistance, (err, results) => {
      if (err) {
        return;
      }
      console.log(results);
      if (results.value) {
        const timeActivityCycling = Math.round(results.value / 83.3333333);

        // this.setState({getDistanceWalkingRunning: results.value})

        this.setState(prevState => {
          timeActivity = prevState.timeActivity + timeActivityCycling;
          return { timeActivity };
        });
        // this.setState({getDistanceCycling: results.value ? results.value : 0})
      }
    });

    // AppleHealthKit.getDailyDistanceCyclingSamples(options, (err, results) => {
    //   if (err) {
    //     return;
    //   }
    //   console.log(results)
    // });
    // AppleHealthKit.getDailyDistanceSwimmingSamples(options, (err, results) => {
    //   if (err) {
    //     return;
    //   }
    //   console.log(results)
    // });

    // AppleHealthKit.getDailyDistanceWalkingRunningSamples(options, (err, results) => {
    //   if (err) {
    //     return;
    //   }
    //   console.log(results)
    // });

    // AppleHealthKit.getDailyFlightsClimbedSamples(options, (err, results) => {
    //   if (err) {
    //     return;
    //   }
    //   console.log(results)
    // });

    // AppleHealthKit.getSamples(options, (err, results) => {
    //   if (err) {
    //     console.log("errore");
    //     console.log(err);
    //     this.setState({ activitiesApple: JSON.stringify(err) });
    //     return;
    //   }
    //   console.log("results");
    //   console.log(results);
    //   this.setState({ results: JSON.stringify(results) });

    //   // controllo se hai il watch
    //   let checkWatch = "";
    //   let distanceApple = 0
    //   for (i = 0; i < results.length; i++) {
    //     console.log(results[i].device);
    //     console.log(results[i].device.search("Watch"));
    //     if (results[i].device.search("Watch") >= 0) {
    //       console.log(results[i].device);
    //       checkWatch = results[i].device;
    //       break;
    //     }
    //   }
    //   // console.warn("dati", checkWatch);
    //   let newResult = results;
    //   if (checkWatch.length) {
    //     newResult = results.filter(elem => elem.device == checkWatch);
    //   }

    //   let timeActivity = 0.0;
    //   console.log(newResult);
    //   // se hai l'orologio, devi muoverlo almeno un minuto per considerlo
    //   const threesold = checkWatch.length ? 60000 : 30000;
    //   newResult.forEach((elem, index) => {
    //     if (elem.end && elem.start) {
    //       const end = moment(elem.end);
    //       const start = moment(elem.start);
    //       distanceApple += elem.quantity
    //       const activities = end - start;
    //       console.log(activities);

    //       if (activities > threesold) {
    //         timeActivity = activities + timeActivity;
    //       }
    //     }
    //   });
    //   console.log(timeActivity);
    //   timeActivity = Math.round(timeActivity / 60000);

    //   let finalActivities = 0;

    //   this.setState({ distanceApple });

    //   this.setState(
    //     prevState => {
    //       if (prevState.timeActivity < timeActivity) {
    //         finalActivities = timeActivity;
    //         return { timeActivity };
    //       } else {
    //         finalActivities = prevState.timeActivity;
    //         // finalActivities = 33
    //       }
    //     },
    //     () => {
    //       this.sendDailyActivities(finalActivities, checkWatch, results);
    //     }
    //   );
    // });
  };

  sendDailyActivities = (finalActivities, checkWatch, results) => {
    console.log(finalActivities);
    // ho trovato il valore massimo lo mando al db se è nuovo e se è maggiore di 29
    if (finalActivities > 29) {
      let points = 100;
      if (finalActivities > 59) {
        points = 200;
      }
      if (finalActivities > 89) {
        points = 400;
      }
      // mando
      const activities_day = new Date().toISOString().split(".")[0];
      const dailyActivities = {
        activities_minutes: finalActivities,
        points,
        // watch o iphone
        support_device: checkWatch
          ? checkWatch
          : results.length
          ? results[0].device
          : "",
        activities_day
      };

      console.log(dailyActivities);
      // this.props.dispatch(putDailyActivities(dailyActivities));
    }
  };

  askForFitAuth() {
    if (Platform.OS == "ios") {
      let perm = {
        permissions: {
          read: [
            "StepCount"
          ]
        },
        observers: [{ type: "StepCount" }]
      };
      let options = {
        startDate: new Date(new Date().toDateString()).toISOString(), // required
        endDate: new Date().toISOString() // optional; default now
        // ascending: false, // optional; default false
        // limit: 10, // optional; default no limit,
        // type: 'Walking',
      };
      AppleHealthKit.initHealthKit(perm, (err, results) => {
        if (err) {
          err;
          console.log("error initializing Healthkit: ", err);
          return;
        }
        // ho ottenuto il permesso, lo salvo
        if (!this.props.perm) {
          this.props.dispatch(changeStatusPerm(true));
        }

        this.props.dispatch(updateActivities())

        // calcolo soltanto l'Attività a piedi e in bici
        // this.calcolateActivitiesApple(options);

        // AppleHealthKit.getAppleExerciseTime(options, (err, results) => {
        //   if (err) {
        //     console.log("errore");
        //     console.log(err);
        //     this.setState({ activitiesApple: JSON.stringify(err) });
        //     // non ha il watch, quindi calcolo l'attività dalle singole attività
        //     this.calcolateActivitiesApple(options);

        //     return;
        //   }
        //   console.log("risultati");
        //   console.log(results);

        //   if (results.length) {
        //     let resultsMin = results.length ? results[0].value : 0;

        //     resultsMin = resultsMin / 60;

        //     this.setState({ timeActivity: resultsMin });
        //   }
        //   // non ha il watch, quindi calcolo l'attività dalle singole attività
        //   this.calcolateActivitiesApple(options);
        // });

        // AppleHealthKit.getDailyDistanceWalkingRunningSamples(
        //   options,
        //   (err, results) => {
        //     if (err) {
        //       this.setState({ healthkit: JSON.stringify(err) });
        //       return;
        //     }
        //     console.log(results);
        //     this.setState({ healthkit: JSON.stringify(results) });
        //   }
        // );
      });
    } else {
      // The list of available scopes inside of src/scopes.js file
      const options = {
        scopes: [
          Scopes.FITNESS_ACTIVITY_READ,
          Scopes.FITNESS_ACTIVITY_READ_WRITE,
          Scopes.FITNESS_BODY_READ,
          Scopes.FITNESS_BODY_READ_WRITE,
          Scopes.FITNESS_NUTRITION_READ,
          Scopes.FITNESS_LOCATION_READ_WRITE
        ]
      };

      // controllo se google fit è installato
      //       Linking.canOpenURL('googlefit')
      // .then((supported) => {
      //   if (!supported) {
      //     // dico all'utente di installare google fit se vuole partecipare
      //         // com.google.android.apps.fitness
      //         Alert.alert(
      //           "Google fit not exist",
      //           "Do you want download?",
      //           [
      //             {
      //               text: "Yes",
      //               onPress: () => Linking.openURL("market://details?id=com.google.android.apps.fitness")
      //             },
      //             {
      //               text: "No",
      //               onPress: () => {},
      //               style: "cancel"
      //             }
      //           ]
      //         );
      //   } else {
      GoogleFit.authorize(options)
        .then(res => {
          console.log("authorized >>>", res);
          this.setState({ log: "authorized >>> " + JSON.stringify(res) });
          if (res.success) {
            // ho ottenuto il permesso, lo salvo
            if (!this.props.perm) {
              this.props.dispatch(changeStatusPerm(true));
            }

            this.props.dispatch(updateActivities())
            // let optDay = {
            //   startDate: new Date(new Date().toDateString()).getTime(),
            //   endDate: new Date().getTime()
            // };

            // GoogleFit.getActivitySamples(optDay, (err, res) => {
            //   console.log(res);
            //   console.log(err);
            //   const resFilter = res.filter(
            //     elem =>
            //       elem.activityName != "still" && elem.activityName != "unknown"
            //   );
            //   let timeActivity = resFilter.reduce(
            //     (total, elem, index, array) => {
            //       if (elem.end && elem.start) {
            //         const time = elem.end - elem.start;
            //         return total + time;
            //       } else {
            //         return total;
            //       }
            //     },
            //     0
            //   );

            //   timeActivity = Math.round(timeActivity / 60000);

            //   this.setState({
            //     activitiesDay:
            //       "activitiesDay >>> " + JSON.stringify(res ? res : err),
            //     timeActivity: timeActivity
            //   });

            //   this.sendDailyActivities(timeActivity, "Android", []);
            // });
          } else {
            Alert.alert("Enable to extra points");
          }
        })
        .catch(err => {
          console.log("err >>> ", err);
          this.setState({ log: "err >>> " + JSON.stringify(err) });
        });
      //   }
      // })
      // .catch((err) => console.error('An error occurred', err));
      /* GoogleFit.isAvailable( check => {
          console.log(check)
          if (check) {
        GoogleFit.authorize(options)
          .then(res => {
            console.log("authorized >>>", res);
            this.setState({ log: "authorized >>> " + JSON.stringify(res) });
            if (res.success) {
              // const dailyStepOptions = {
              //   startDate: "2019-06-12T00:00:17.971Z", // required ISO8601Timestamp
              //   endDate: new Date().toISOString() // required ISO8601Timestamp
              // };
  
              // let opt = {
              //   startDate: new Date(2019, 6, 30).valueOf(), // simply outputs the number of milliseconds since the Unix Epoch
              //   endDate: new Date(2019, 7, 1).valueOf()
              // };

              let optDay = {
                startDate: new Date( new Date().toDateString()).getTime(),
                endDate: new Date().getTime()
              };
              

              // let opt2 = {
              //   startDate: new Date().getTime() - 3600000,
              //   endDate: new Date().getTime()
              // };
              // let opt3 = {
              //   startDate: new Date().getTime() - 7200000,
              //   endDate: new Date().getTime()
              // };
              // let opt4 = {
              //   startDate: new Date().getTime() - 14400000,
              //   endDate: new Date().getTime()
              // };
              
              GoogleFit.getActivitySamples(optDay, (err, res) => {
                console.log(res);
                console.log(err);
                const resFilter = res.filter( elem => elem.activityName != 'still' && elem.activityName != 'unknown')
                let timeActivity = resFilter.reduce(
                  (total, elem, index, array) => {
                    if (elem.end && elem.start) {
                      const time = elem.end - elem.start;
                      return total + time
                    } else {
                      return total
                    }
                     }
                ,
                  0
                );

                timeActivity = timeActivity / 60000
                
                this.setState({
                  activitiesDay: "activitiesDay >>> " + JSON.stringify(res ? res : err),
                  timeActivity: Math.round(timeActivity)
                });
              });
            //   GoogleFit.getActivitySamples(opt, (err, res) => {
            //     console.log(res);
            //     console.log(err);
            //     this.setState({
            //       activities: "activites >>> " + JSON.stringify(res ? res : err)
            //     });
            //   });
            //   GoogleFit.getActivitySamples(opt2, (err, res) => {
            //     console.log(res);
            //     console.log(err);
            //     this.setState({
            //       activities2: "activites2 >>> " + JSON.stringify(res ? res : err)
            //     });
            //   });
            //   GoogleFit.getActivitySamples(opt3, (err, res) => {
            //     console.log(res);
            //     console.log(err);
            //     this.setState({
            //       activities3: "activites3 >>> " + JSON.stringify(res ? res : err)
            //     });
            //   });
            //   GoogleFit.getActivitySamples(opt4, (err, res) => {
            //     console.log(res);
            //     console.log(err);
            //     this.setState({
            //       activities4: "activites4 >>> " + JSON.stringify(res ? res : err)
            //     });
            //   });
              
  
            //   GoogleFit.getDailyDistanceSamples(dailyStepOptions, (err, res) => {
            //     console.log(res);
            //     console.log(err);
            //     this.setState({
            //       distance: "distance >>> " + JSON.stringify(res ? res : err)
            //     });
            //   });

            //   GoogleFit.getDailyCalorieSamples(dailyStepOptions, (err, res) => {
            //     console.log(res);
            //     console.log(err);
            //     this.setState({
            //       calories: "calories >>> " + JSON.stringify(res ? res : err)
            //     });
            //   });
  
            //   GoogleFit.getDailyStepCountSamples(dailyStepOptions)
            //     .then(res => {
            //       console.log("Daily steps >>> ", res);
            //       this.setState({
            //         steps: "Daily steps >>> " + JSON.stringify(res)
            //       });
            //     })
            //     .catch(err => {
            //       console.warn(err);
            //       this.setState({
            //         steps: "Daily steps >>> " + JSON.stringify(err)
            //       });
            //     });
            }
             
            
          })
          .catch(err => {
            console.log("err >>> ", err);
            this.setState({ log: "err >>> " + JSON.stringify(err) });
          });
        } else {
          // dico all'utente di installare google fit se vuole partecipare 
          // com.google.android.apps.fitness
          Alert.alert(
            "Google fit not exist",
            "Do you want download?",
            [
              {
                text: "Yes",
                onPress: () => Linking.openURL("market://details?id=com.google.android.apps.fitness")
              },
              {
                text: "No",
                onPress: () => {},
                style: "cancel"
              }
            ]
          );
        }
      }) */
    }
  }





 

 
 



  renderChartsScreen() {
    const routes = this.props.statisticsState.n_routes;
    let distance = this.props.statisticsState.statistics.total_distance,
      calories = this.props.statisticsState.statistics.total_calories,
      time = this.props.statisticsState.statistics.total_duration,
      CO2 = this.props.statisticsState.statistics.total_co2,
      distanceInt = Number.parseInt(distance);

    return (
      <ScrollView
       
        style={{
          backgroundColor: "#fff",
          height: Dimensions.get("window").height,
          width: Dimensions.get("window").width
        }}
        contentContainerStyle={{
          alignItems: "center",
          backgroundColor: "#fff",
          justifyContent: "flex-start",
          alignItems: "center",
          width: Dimensions.get("window").width,
          paddingBottom: 30
        }}
      >
        <DailyActivities
          angle={this.state.timeActivity * 4}
          minutes={this.state.timeActivity}
          navigation={this.props.navigation}
        />
 
        {this.renderHealthData()}
        <View
          style={{
            height: 200,
            backgroundColor: "transparent"
          }}
        />
        {/* {this.renderMFRList()} */}
      </ScrollView>
    );
  }

  renderHealthData() {
    if (Platform.OS == "ios")
      return (
        <View>
          <Text>quantity: {this.state.distanceApple}</Text>
          <Text>
            getDistanceWalkingRunning: {this.state.getDistanceWalkingRunning}m
          </Text>
          <Text>getDistanceCycling: {this.state.getDistanceCycling}m</Text>
          <Text>{this.state.healthkit}</Text>
          <Text>{this.state.results}</Text>
          <Text>{this.state.activitiesApple}</Text>
        </View>
      );
    else
      return (
        <View>
          <Text>{this.state.log}</Text>
          <Text>timeActivity: {this.state.timeActivity}</Text>
          <Text>{this.state.activitiesDay}</Text>
          <Text>{this.state.activities}</Text>
          <Text>{this.state.activities2}</Text>
          <Text>{this.state.activities3}</Text>
          <Text>{this.state.activities4}</Text>
          <Text>{this.state.steps}</Text>
          <Text>{this.state.distance}</Text>
          <Text>{this.state.calories}</Text>
        </View>
      );
  }

  render() {
    {
      return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
         
            {this.renderChartsScreen()}

        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    width: Dimensions.get("window").width * 0.8,
    height: 50,
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
  centerTextContainer: {
    position: "absolute",
    top: 100
  },

  centerCircleValue: {
    fontFamily: "Montserrat-ExtraBold",
    color: "#ffffff",
    fontSize: 49,
    textAlign: "center",
    textAlignVertical: "center"
  },
  centerCircleContainer: {
    position: "absolute",
    top: 140
  },
  centerTextCircleParam: {
    fontFamily: "Montserrat-ExtraBold",
    textAlign: "center",

    color: "#ffffff",
    fontSize: 11
  },
  centerValue: {
    fontFamily: "Montserrat-ExtraBold",
    color: "#3F3F3F",
    fontSize: 37,
    textAlign: "center",
    textAlignVertical: "center"
  },
  centerTextParam: {
    fontFamily: "OpenSans-Regular",
    textAlign: "center",
    fontWeight: "400",
    color: "#3d3d3d",
    fontSize: 8,
    fontWeight: "bold"
  },
  iconText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#fff",
    fontSize: 10,
    textAlignVertical: "center"
  },
  mfrText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "bold",
    color: "#3D3D3D",
    fontSize: 13,
    marginRight: 0
  },
  deleteContainer: {
    width: 18,
    height: 18
  },
  mainContainer: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.06,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff"
  },
  sideContainer: {
    width: Dimensions.get("window").width * 0.5,
    height: Dimensions.get("window").height * 0.06,
    // backgroundColor: "#6397CB",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  text: {
    fontFamily: "Montserrat-ExtraBold",
    color: "#fff",
    fontSize: 10,
    marginVertical: 1
  },
  underline: {
    width: Dimensions.get("window").width * 0.25,
    height: 6,
    backgroundColor: "#FFFFFF",
    marginVertical: 4
  }
});

if (NativeModules.RNDeviceInfo.model.includes("iPad")) {
  Object.assign(styles, {
    deleteContainer: {
      width: 18,
      height: 18,
      right: 35
    }
  });
}

// trofei
const getTrophies = state => state.standings.trophies;
const getScreen = state => state.statistics.selectedScreen;

// prendo i trofei
// reverse cosi metto prima quelli nuovi
const getTrophiesState = createSelector([getTrophies], trophies =>
  trophies ? trophies.reverse() : []
);

const getScreenState = createSelector([getScreen], screen =>
  screen ? screen : "trophies"
);

const withData = connect(state => {
  return {
    statisticsState: state.statistics ? state.statistics : [],
    perm: getPermActivitiesState(state)
    // trophies: getTrophiesState(state),
    // page: getScreenState(state)
  };
});

export default withData(EnableHealthButton);

// export default ChartsScreen;

export const images = {
  1: require("./../../assets/images/trophies/trophy_global_first.png"),
  2: require("./../../assets/images/trophies/trophy_global_second.png"),
  3: require("./../../assets/images/trophies/trophy_global_third.png"),
  4: require("./../../assets/images/trophies/trophy_city_first.png"),
  5: require("./../../assets/images/trophies/trophy_city_second.png"),
  6: require("./../../assets/images/trophies/trophy_city_third.png")
};
