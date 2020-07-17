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
  getStats,
  changeScreenStatistics,
  putDailyActivities,
  getWeeklyActivities,
  changeStatusPerm
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

let IS_DEV = true;

WebService.url.includes("23.97.216.36") ? (IS_DEV = true) : (IS_DEV = false);


export function coefCO2(type) {
  switch (type) {
    case 1:
      // a piedi 
      return 1.0;
      break;
    case 2:
      // in bici
      return 1.0
      break;
    case 3:
    case 5:
    case 6:
    case 7:
      // mezzi pubblici
      return 1.0
      break;
    default:
      return 1.0;
      break;
  }
}

class ChartsScreen extends React.Component {
  constructor() {
    super();
    this.mapRef = null;

    this.state = {
      page: "stats",
      showLoading: true,
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
      timeActivity: 0
    };
  }

  DescriptionIconModal = typeIcon => {
    // Alert.alert("weather");
    this.setState({
      modalActive: true,
      iconChoose: typeIcon
    });
  };

  DeleteDescriptionIconModal = () => {
    // Alert.alert("weather");
    this.setState({
      modalActive: false
    });
  };

  componentWillMount() {
    this.props.dispatch(getStats());
    // this.props.dispatch(getWeeklyActivities());

    // if (this.props.statisticsState.error)
    //   Alert.alert("Oops", "Seems like an error occured");
  }

  componentDidMount() {
    this.askForFitAuth();
    // setTimeout(
    //   () =>
    //     this.setState({
    //       data: [
    //         30,
    //         10,
    //         40,
    //         40,
    //         -4,
    //         -24,
    //         null,
    //         85,
    //         undefined,
    //         0,
    //         35,
    //         53,
    //         -53,
    //         24,
    //         50,
    //         -20,
    //         -80
    //       ]
    //     }),
    //   5000
    // );
  }

  componentWillReceiveProps(props) {
    if (props.statisticsState.statistics.length >= 0)
      this.setState({ showLoading: false });
  }

  calcolateActivitiesApple = () => {
    let options = {
      startDate: new Date(new Date().toDateString()).toISOString(), // required
      endDate: new Date().toISOString() // optional; default now
      // ascending: false, // optional; default false
      // limit: 10, // optional; default no limit,
      // type: 'Walking',
    };

    AppleHealthKit.getSamples(options, (err, results) => {
      if (err) {
        console.log("errore");
        console.log(err);
        this.setState({ activitiesApple: JSON.stringify(err) });
        return;
      }
      console.log("results");
      console.log(results);

      // controllo se hai il watch
      let checkWatch = "";
      for (i = 0; i < results.length; i++) {
        console.log(results[i].device);
        console.log(results[i].device.search("Watch"));
        if (results[i].device.search("Watch") >= 0) {
          console.log(results[i].device);
          checkWatch = results[i].device;
          break;
        }
      }
      // console.warn("dati", checkWatch);
      let newResult = results;
      if (checkWatch.length) {
        newResult = results.filter(elem => elem.device == checkWatch);
      }

      let timeActivity = 0.0;
      console.log(newResult);
      // se hai l'orologio, devi muoverlo almeno un minuto per considerlo
      const threesold = checkWatch.length ? 60000 : 30000;
      newResult.forEach((elem, index) => {
        if (elem.end && elem.start) {
          const end = moment(elem.end);
          const start = moment(elem.start);
          const activities = end - start;
          console.log(activities);

          if (activities > threesold) {
            timeActivity = activities + timeActivity;
          }
        }
      });
      console.log(timeActivity);
      timeActivity = Math.round(timeActivity / 60000);

      let finalActivities = 0;

      this.setState(
        prevState => {
          if (prevState.timeActivity < timeActivity) {
            finalActivities = timeActivity;
            return { timeActivity };
          } else {
            finalActivities = prevState.timeActivity;
            // finalActivities = 33
          }
        },
        () => {
          this.sendDailyActivities(finalActivities, checkWatch, results);
        }
      );
    });
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
            "AppleExerciseTime",
            "ActiveEnergyBurned",
            "DistanceCycling",
            "DistanceWalkingRunning",
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

        AppleHealthKit.getAppleExerciseTime(options, (err, results) => {
          if (err) {
            console.log("errore");
            console.log(err);
            this.setState({ activitiesApple: JSON.stringify(err) });
            // non ha il watch, quindi calcolo l'attività dalle singole attività
            this.calcolateActivitiesApple(options);

            return;
          }
          console.log("risultati");
          console.log(results);

          if (results.length) {
            let resultsMin = results.length ? results[0].value : 0;

            resultsMin = resultsMin / 60;

            this.setState({ timeActivity: resultsMin });
          }
          // non ha il watch, quindi calcolo l'attività dalle singole attività
          this.calcolateActivitiesApple(options);
        });

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
            let optDay = {
              startDate: new Date(new Date().toDateString()).getTime(),
              endDate: new Date().getTime()
            };

            GoogleFit.getActivitySamples(optDay, (err, res) => {
              console.log(res);
              console.log(err);
              const resFilter = res.filter(
                elem =>
                  elem.activityName != "still" && elem.activityName != "unknown"
              );
              let timeActivity = resFilter.reduce(
                (total, elem, index, array) => {
                  if (elem.end && elem.start) {
                    const time = elem.end - elem.start;
                    return total + time;
                  } else {
                    return total;
                  }
                },
                0
              );

              timeActivity = Math.round(timeActivity / 60000);

              this.setState({
                activitiesDay:
                  "activitiesDay >>> " + JSON.stringify(res ? res : err),
                timeActivity: timeActivity
              });

              this.sendDailyActivities(timeActivity, "Android", []);
            });
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

  onRefresh() {
    this.setState({ refreshing: true });
    this.props.dispatch(getStats());
    // if (this.props.statisticsState.error)
    //   Alert.alert("Oops", "Seems like an error occured");
    const loading = setInterval(() => {
      if (this.props.statisticsState.statistics.length >= 0) {
        this.setState({ refreshing: false });
        clearTimeout(loading);
      }
    }, 1000);

  }

  _handleChangePage = page => {
    // this.setState({ page });
    this.props.changeHeaderTop(page);
    this.props.dispatch(changeScreenStatistics(page));
  };

  getAndroidPieImageY = (y, value) => {
    if (value > 50) return y - value * 0.3;
    else return y - value * 0.5;
  };
  getIosPieImageY = (y, value) => {
    if (value > 50) return -y + value * 0.3;
    else return -y + value * 0.5;
  };

  goToDetailFrequentRoutine = elem => {
    this.props.navigation.navigate("FrequentRoutineMapDetail", {
      routine: elem
    });
  };

  renderMFRDeleteBtn = (index, id, numFrequentTrips) => {
    // al momento tolgo il pulsante

    if (numFrequentTrips > 1)
      return (
        <View style={styles.deleteContainer}>
          <TouchableWithoutFeedback
            onPress={() => {
              Alert.alert(
                strings("frequent_trip"),
                strings("delete_this_fre"),
                [
                  ({
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                  },
                    {
                      text: strings("ok").toLocaleUpperCase(),
                      onPress: () =>
                        this.props.dispatch(deleteMostFrequentRoute({}, id))
                    })
                ],
                { cancelable: false }
              );
            }}
          >
            <View
              style={{
                width: 18,
                height: 18,
                backgroundColor: "#FC6754",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 1,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 0.01 },
                shadowOpacity: 0.2
              }}
            >
              <Text style={styles.iconText}>x</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      );
    else
      return (
        <View
          style={{
            width: 18,
            height: 18,
            backgroundColor: "transparent",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 1,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 0.01 },
            shadowOpacity: 0.2
          }}
        />
      );
  };

  header = () => {
    return (
      <View style={styles.mainContainer}>
        <TouchableWithoutFeedback
          onPress={() => this.props.handleChangePage("trainings")}
        >
          <View style={styles.sideContainer}>
            <Text
              style={[
                styles.text,
                { color: this.props.page == "trainings" ? "#fff" : "#9D9B9C" }
              ]}
            >
              STATS
            </Text>
            <View
              style={[
                styles.underline,
                {
                  backgroundColor:
                    this.props.page == "trainings" ? "#fff" : "#9D9B9C"
                }
              ]}
            />
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => this.props.handleChangePage("myself")}
        >
          <View style={styles.sideContainer}>
            <Text
              style={[
                styles.text,
                { color: this.props.page == "myself" ? "#fff" : "#9D9B9C" }
              ]}
            >
              TROPHIES
            </Text>
            <View
              style={[
                styles.underline,
                {
                  backgroundColor:
                    this.props.page == "myself" ? "#fff" : "#9D9B9C"
                }
              ]}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  };

  renderMFRList = () => {
    const type = [
      "Other",
      "Home",
      "Work",
      "Gym",
      "SCHOOL",
      "Work#2",
      "Mom/Dad",
      "Grandma/Grandpa",
      "Girlfriend/Boyfriend",
      "Kids' school",
      "Friends' Place",
      "Supermarket",
      "Bar/Restaurant",
      "Cinema/Theater"
    ];
    const numFrequentTrips = this.props.routine.length;
    return this.props.routine.map((elem, index) => (
      <View
        key={elem.id}
        style={{
          display: this.props.page == "stats" ? "flex" : "none",
          width: Dimensions.get("window").width,
          height: 50,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          borderBottomWidth: index != this.props.routine.length - 1 ? 1 : 0,
          borderBottomColor: "#9D9B9C"
        }}
      >
        <TouchableOpacity
          onPress={() => this.goToDetailFrequentRoutine(elem)}
          style={{
            width: Dimensions.get("window").width * 0.8,
            height: 50,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <View style={{}}>
            <Svg height="40" width="40">
              <Defs>
                <LinearGradient id="grad" x1="0" y1="0" x2="10" y2="0">
                  <Stop offset="0" stopColor="#7D4D99" stopOpacity="1" />
                  <Stop offset="1" stopColor="#6497CC" stopOpacity="1" />
                </LinearGradient>
                <LinearGradient id="grad2" x1="0" y1="0" x2="10" y2="0">
                  <Stop offset="0" stopColor="#E82F73" stopOpacity="1" />
                  <Stop offset="1" stopColor="#F49658" stopOpacity="1" />
                </LinearGradient>
              </Defs>
              <Circle cx="5" cy="5" r="5" fill="url(#grad)" />
              <Line
                x1="5"
                y1="11"
                x2="5"
                y2="15"
                stroke="#3D3D3D"
                strokeWidth="1"
              />
              <Line
                x1="5"
                y1="17"
                x2="5"
                y2="21"
                stroke="#3D3D3D"
                strokeWidth="1"
              />
              <Line
                x1="5"
                y1="23"
                x2="5"
                y2="27"
                stroke="#3D3D3D"
                strokeWidth="1"
              />
              <Circle cx="5" cy="33" r="5" fill="url(#grad2)" />
            </Svg>
          </View>
          <View style={{ flexDirection: "row", marginRight: 120 }}>
            <Text style={styles.mfrText}>{type[elem.start_type]}</Text>
            <View
              style={{
                width: 40,
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center"
              }}
            >
              <Text style={styles.mfrText}>{"<"}</Text>
              <Text style={styles.mfrText}>{">"}</Text>
            </View>
            <Text style={styles.mfrText}>{type[elem.end_type]}</Text>
          </View>
          {this.renderMFRDeleteBtn(index, elem.id, numFrequentTrips)}
        </TouchableOpacity>
      </View>
    ));
  };
  renderPieChart() {
    let distance = 0;
    this.props.statisticsState.statistics.forEach(element => {
      distance += element.distance_travelled;
    });
    let walkPerc = 0;
    let bikePerc = 0;
    let publicPerc = 0;
    if (this.props.statisticsState.statistics.length > 0) {
      this.props.statisticsState.statistics.forEach((element, index) => {
        // con checkPublic considero anche le tratte in metro/ bus e treno come public generico
        switch (checkPublic(element.modal_type)) {
          case 1:
            walkPerc = this.props.statisticsState.statistics[index]
              ? (this.props.statisticsState.statistics[index]
                .distance_travelled /
                distance) *
              100
              : 0;
            break;
          case 2:
            bikePerc = this.props.statisticsState.statistics[index]
              ? (this.props.statisticsState.statistics[index]
                .distance_travelled /
                distance) *
              100
              : 0;
            break;
          case 3:
          case 5:
          case 6:
          case 7:
            publicPerc = this.props.statisticsState.statistics[index]
              ? (this.props.statisticsState.statistics[index]
                .distance_travelled /
                distance) *
              100
              : 0;
            break;
        }
      });
    } else {
      walkPerc = 33.33;
      bikePerc = 33.33;
      publicPerc = 33.33;
    }
    const data = [walkPerc, publicPerc, bikePerc];
    const colors = ["#6CBA7E", "#FAB21E", "#E83475"];
    const labels = ["walk", "public_transport", "bike"];

    const randomColor = () =>
      ("#" + ((Math.random() * 0xffffff) << 0).toString(16) + "000000").slice(
        0,
        7
      );
    // const pieData = data.filter(value => value > 0).map((value, index) => ({
    const pieData = data.map((value, index) => ({
      value,
      svg: {
        // fill: randomColor(),
        fill: colors[index],
        label: labels[index],
        onPress: () => console.log("press", index)
      },
      key: `pie-${index}`
    }));
    return (
      <PieChart
        style={{
          width: 250,
          height: 250,
          marginTop: 20
        }}
        data={pieData}
        renderDecorator={({ item, pieCentroid, labelCentroid, index }) => {
          // return (
          //   <G key={index}>
          //     <Image
          //       x={pieCentroid[0] - item.value * 0.3}
          //       y={
          //         Platform.OS == "ios"
          //           ? this.getIosPieImageY(pieCentroid[1], item.value)
          //           : this.getAndroidPieImageY(pieCentroid[1], item.value)
          //       }
          //       width="32"
          //       height="32"
          //       href={require("./../../assets/images/sun_home.png")}
          //     />
          //   </G>
          // );
        }}
      />
    );
  }

  renderChartsScreen() {
    const routes = this.props.statisticsState.n_routes;
    let distance = 0;
    let calories = 0;
    let time = 0;
    // calcolo la CO2
    let CO2 = 0
    this.props.statisticsState.statistics.forEach(element => {
      time += element.time_travelled;
      distance += element.distance_travelled;
      calories += element.calories;
      // sommo la CO2
      // la distanza è in km
      CO2 += element.distance_travelled * coefCO2(element.modal_type)
    });



    distanceInt = Number.parseInt(distance);



    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh.bind(this)}
          />
        }
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

          // height: Dimensions.get("window").height
        }}
      >
      {/* <CO2Wave/> */}
        <DailyActivities
          angle={this.state.timeActivity * 4}
          minutes={this.state.timeActivity}
          navigation={this.props.navigation}
        />
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>ACTIVITIES</Text>
        </View>
        {/* </TouchableWithoutFeedback> */}
        <ChartsStats
          routes={pointsDecimal(routes)}
          distance={pointsDecimal(distanceInt)}
          calories={pointsDecimal(calories)}
          time={pointsDecimal(Number.parseInt(time / 60))}
        />
        <View
          style={{
            width: Dimensions.get("window").width * 0.8,
            // flexDirection: "row",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          {this.renderPieChart()}
          <View style={styles.centerTextContainer}>
            <Text style={styles.centerValue}>
              {distanceInt
                ? distanceInt
                : (distance - distanceInt * 1000) * 1000}
            </Text>
            <Text style={styles.centerTextParam}>
              {" "}
              {distanceInt ? strings("kilometers") : strings("meters")}
            </Text>
          </View>
          {/* <ChartsSustainability /> */}
          {/* 
          <View
            style={{
              width: Dimensions.get("window").width * 0.8,
              marginTop: 15,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <Text
              style={{
                fontFamily: "OpenSans-Bold",
                fontWeight: "bold",
                color: "#3d3d3d",
                fontSize: 12
              }}
            >
              Your frequent routes
            </Text>
            <TouchableOpacity
              style={{
                width: 18,
                height: 18,
                backgroundColor: "#87D99A",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 1,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 0.01 },
                shadowOpacity: 0.2
              }}
              onPress={() => this.props.navigation.navigate("Routine")}
            >
              <Text
                style={{
                  fontFamily: "OpenSans-Regular",
                  fontWeight: "400",
                  color: "#fff",
                  fontSize: 10,
                  textAlignVertical: "center"
                }}
              >
                +
              </Text>
            </TouchableOpacity>
          </View> 
          */}
        </View>
        {/* {this.renderHealthData()} */}
        {/* {this.renderMFRList()} */}
      </ScrollView>
    );
  }
  renderHealthData() {
    if (Platform.OS == "ios")
      return (
        <View>
          <Text>{this.state.healthkit}</Text>
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
    console.log(this.props.page);
    if (this.props.statisticsState.error) {
      Alert.alert("Oops", "Seems like an error occured, pull to refresh");
      return <View />;
    } else {
      return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>

          {/* <DescriptionIcon
            active={this.state.modalActive}
            icon={this.state.iconChoose}
            DeleteDescriptionIconModal={this.DeleteDescriptionIconModal}
          /> */}
          {/* <ChartsHeader
            handleChangePage={page => this._handleChangePage(page)}
            page={this.props.page}
          /> 
          {this.state.showLoading ? (
            <ScrollView
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this.onRefresh.bind(this)}
                />
              }
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
                paddingBottom: 30,
                height: Dimensions.get("window").height
              }}
            >
              

              <View
                style={{
                  alignContent: "center",
                  flex: 1,
                  width: Dimensions.get("window").width,
                  height: Dimensions.get("window").height * 0.64,
                  position: "relative",

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
                    color="#3D3D3D"
                  />
                </View>
              </View>
            </ScrollView>
          ) : this.props.page === "stats" ? (
            this.renderChartsScreen()
          ) : this.props.page === "trophies" ? (
            <TrophiesScreen
              trophies={this.props.trophies}
              DescriptionIconModal={this.DescriptionIconModal}
              dispatch={this.props.dispatch}
              detailTrophies={this.props.detailTrophies}
            />
          ) : (
            <RewardsScreen navigation={this.props.navigation} />
          )}*/}
          {this.state.showLoading ? (
            <ScrollView
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this.onRefresh.bind(this)}
                />
              }
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
                paddingBottom: 30,
                height: Dimensions.get("window").height
              }}
            >
              <View
                style={{
                  alignContent: "center",
                  flex: 1,
                  width: Dimensions.get("window").width,
                  height: Dimensions.get("window").height * 0.64,
                  position: "relative",

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
                    color="#3D3D3D"
                  />
                </View>
              </View>
            </ScrollView>
          ) : (
              this.renderChartsScreen()
            )}
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
    top: 120
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
    color: "#9D9B9C",
    fontSize: 9,
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
const getTrophiesState = createSelector(
  [getTrophies],
  trophies => (trophies ? trophies.reverse() : [])
);

const getScreenState = createSelector(
  [getScreen],
  screen => (screen ? screen : "trophies")
);

const withData = connect(state => {
  return {
    // routine: state.login.mostFrequentRoute ? state.login.mostFrequentRoute : [],
    statisticsState: state.statistics ? state.statistics : [],
    perm: getPermActivitiesState(state)

    // trophies: getTrophiesState(state),
    // page: getScreenState(state)
  };
});

export default withData(ChartsScreen);

// export default ChartsScreen;

export const images = {
  1: require("./../../assets/images/trophies/trophy_global_first.png"),
  2: require("./../../assets/images/trophies/trophy_global_second.png"),
  3: require("./../../assets/images/trophies/trophy_global_third.png"),
  4: require("./../../assets/images/trophies/trophy_city_first.png"),
  5: require("./../../assets/images/trophies/trophy_city_second.png"),
  6: require("./../../assets/images/trophies/trophy_city_third.png")
};