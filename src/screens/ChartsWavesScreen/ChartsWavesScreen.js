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
  Image
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
  Polygon,
  Gradient,
  Clips,
  DashedLine
} from "react-native-svg";
import { createSelector } from "reselect";

import ChartsStats from "./../../components/ChartsStats/ChartsStats";

import PieChart from "./../../components/AreaStack/PieChart";

import { connect } from "react-redux";
import {
  getStats,
  changeScreenStatistics
} from "./../../domains/statistics/ActionCreators";
import {
  deleteMostFrequentRoute,
  getMostFrequentRoute
} from "./../../domains/login/ActionCreators";
import { checkPublic } from "./../../domains/trainings/ActionCreators";
import DescriptionIcon from "../../components/DescriptionIcon/DescriptionIcon";
import DailyActivities from "../../components/DailyActivities/DailyActivities";

import { strings } from "../../config/i18n";

import WebService from "./../../config/WebService";
import { thisExpression } from "@babel/types";
import AppleHealthKit from "rn-apple-healthkit";
import GoogleFit, { Scopes } from "react-native-google-fit";
import { AreaChart, Grid, YAxis, XAxis } from "react-native-svg-charts";
import * as shape from "d3-shape";
import { Calendar, CalendarList, Agenda } from "react-native-calendars";
import Aux from "../../helpers/Aux";
import moment from "moment";
import pointsDecimal from "../../helpers/pointsDecimal";
import Icon from "react-native-vector-icons/Ionicons";
const XDate = require('xdate');

function weekDayNames(firstDayOfWeek = 0) {
  let weekDaysNames = XDate.locales[XDate.defaultLocale].dayNamesShort;
  const dayShift = firstDayOfWeek % 7;
  if (dayShift) {
    weekDaysNames = weekDaysNames.slice(dayShift).concat(weekDaysNames.slice(0, dayShift));
  }
  return weekDaysNames;
}

let IS_DEV = true;

WebService.url.includes("23.97.216.36") ? (IS_DEV = true) : (IS_DEV = false);

class ChartsWavesScreen extends React.Component {
  constructor() {
    super();
    this.mapRef = null;

    // giorno diviso in 24 ore e dati
    // settimana divisa in 28 dati, 7 giorni per 4 fase orarie

    const now = new Date();



    this.state = {
      page: "DAILY",
      showLoading: true,
      refreshing: false,
      modalActive: false,
      iconChoose: "round_info_icn",
      healthkit: "",
      log: "",
      steps: "",
      activities: "",
      statusLoad: "",
      yearNow: now.getFullYear(),
      monthNow: now.getMonth() + 1,
      data: [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
      ],
      dayActivities: 0,
      weekActivities: [],
      data2: [
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1
      ],
      activitiesDay: "",
      timeActivity: [],
      timeActivity2: [],
      dateValue: [],
      markedDates: {},
      minutesActivities: 0,
      calories: 0,
      maxY: 10
      // data: [
      //   0,
      //   0,
      //   0,
      //   0,
      //   -4,
      //   -24,
      //   null,
      //   85,
      //   undefined,
      //   0,
      //   35,
      //   53,
      //   -53,
      //   24,
      //   50,
      //   -20,
      //   -80
      // ]
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
    // this.props.dispatch(getStats());
    // if (this.props.statisticsState.error)
    //   Alert.alert("Oops", "Seems like an error occured");
  }

  componentDidMount() {
    this.askForFitAuth();
    // setTimeout(
    //   () =>
    //     this.setState({
    //       data: [50, 10, 40, 55, 10, 24, 75, 51, 35, 53, 53, 24, 50, 20, 50, 50, 10, 40, 55, 10, 24, 75, 51, 35]
    //     }),
    //   2000
    // );
  }

  componentWillReceiveProps(props) {
   
  }



  askForFitAuth() {
    this.setState({
      calories: 0
    })
    
      if (Platform.OS == "ios") {
        let perm = {
          permissions: {
            read: [
              "AppleExerciseTime",
            "ActiveEnergyBurned",
            "DistanceCycling",
            "DistanceWalkingRunning",
            "StepCount",
            ]
          }
        };
        let options = {
          startDate: new Date(new Date().toDateString()).toISOString(), // required
          endDate: new Date().toISOString(), // optional; default now
          // ascending: false, // optional; default false
          // limit: 10, // optional; default no limit,
          // type: 'Walking',
        };

        AppleHealthKit.initHealthKit(perm, (err, results) => {
          if (err) {

            let data = Array.from({ length: 24 }, (_, idx) =>
                idx < Hours ? 1 : 0
              );

              this.setState({ data: data, showLoading: false, });

            console.log("error initializing Healthkit: ", err);
            return;
          }

          

          AppleHealthKit.getActiveEnergyBurned(
            options,
            (err, results) => {
              if (err) {
                console.log('errore');
                console.log(err);
                this.setState({ activitiesApple: JSON.stringify(err) });
                return;
              }
              console.log('risultati');
              console.log(results);

              let calories = 0
              results.forEach( elem => 
                {
                  calories += elem.value
                })

                this.setState({
                  
                  calories: Math.round(calories),
                 
                });

            }
          );

          AppleHealthKit.getSamples(
            options,
            (err, results) => {
              if (err) {
                console.log('errore');
                console.log(err);
                
                let data = Array.from({ length: 24 }, (_, idx) =>
                idx < Hours ? 1 : 0
              );

              this.setState({ data: data, showLoading: false, activitiesApple: JSON.stringify(err) });
                return;
              }
              console.log('risultati');
              console.log(results);
              const Hours = new Date().getHours();

              // metto il grafico con valore iniziale a 1 fino all'ora corrente, per il futuro metto 0
              let data = Array.from({ length: 24 }, (_, idx) =>
                idx < Hours ? 1 : 0
              );

              console.log(results);
              console.log(err);

              // controllo se hai il watch 
              let checkWatch = ''
              for (i = 0; i < results.length; i++) {
                if (results[i].device.search('Watch') >= 0) {
                  checkWatch = results[i].device;
                  break
                }
              }
              console.warn('dati', checkWatch)
              let timeActivity = results
              if (checkWatch.length) {
                timeActivity = results.filter(elem => elem.device == checkWatch)
              }
              console.warn('dati', timeActivity)
              timeActivity.forEach((elem, index) => {
                if (elem.end && elem.start) {
                  
                
                  const end =  moment(elem.end)
                  const start =  moment(elem.start)
                  
                 
                  const time = (end + start) / 2;
                  const activities = (end - start) / 60000;
                 
                  const hour = new Date(time).getHours();
                  
                  data[hour] = Math.round(activities) + data[hour];
                  
                } 
              });
              console.warn('dati', data)
              this.setState({ activitiesApple: JSON.stringify(results), data: data, showLoading: false, 
                maxY: Math.max(...data)});
              
            }
          );





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
        GoogleFit.authorize(options)
          .then(res => {
            console.log("authorized >>>", res);
            this.setState({ log: "authorized >>> " + JSON.stringify(res) });

            let Now = new Date();

            const millisecond = Now.getTime();
            // vedo che giorno è oggi
            // Sunday is 0, Monday is 1, and so on.
            // tolgo un giorno cosi quando è lunedi da 0 e domenica da 6
            const millisecondMon = millisecond - 86400000;
            // calcolo il tempo iniziale della settimana
            const DayNowFromMon = new Date(millisecondMon).getDay();

            let optDay = {
              startDate: new Date(new Date().toDateString()).valueOf(),
              endDate: new Date().valueOf()
            };

            GoogleFit.getActivitySamples(optDay, (err, res) => {
              const Hours = new Date().getHours();
              // let data = [
              //   1,
              //   1,
              //   1,
              //   1,
              //   1,
              //   1,
              //   1,
              //   1,
              //   1,
              //   1,
              //   1,
              //   1,
              //   1,
              //   1,
              //   1,
              //   1,
              //   1,
              //   1,
              //   1,
              //   1,
              //   1,
              //   1,
              //   1,
              //   1
              // ];

              // metto il grafico con valore iniziale a 1 fino all'ora corrente, per il futuro metto 0
              let data = Array.from({ length: 24 }, (_, idx) =>
                idx < Hours ? 1 : 0
              );

              console.log(res);
              console.log(err);
              console.warn("risultati oggi",res);
              const resFilter = res.filter(
                elem => elem.activityName != 'still' && elem.activityName != 'unknown'
              );

              let calories = 0;

              resFilter.forEach((elem, index) => {
                if (elem.end && elem.start) {
                  const time = (elem.end + elem.start) / 2;
                  const activities = (elem.end - elem.start) / 60000;
                  const day = new Date(time).toLocaleString();
                  const hour = new Date(time).getHours();
                  data[hour] = Math.round(activities) + data[hour];
                  calories += elem.calories ? elem.calories : 0;

                }
              })

              console.warn('dati', data)

              this.setState({
                activitiesDay:
                  "activitiesDay >>> " + JSON.stringify(res ? res : err),
                calories: Math.round(calories),
                showLoading: false ,
                // timeActivity: timeActivity,
                data,
                maxY: Math.max(...data) / 2 + 10
              });
            });
          })
          .catch(err => {
            console.log("err >>> ", err);
            this.setState({ log: "err >>> " + JSON.stringify(err) });
          });
      }
  }

  daysInMonth = (month, year) => {
    //     // July
    // daysInMonth(7,2009); // 31
    // // February
    // daysInMonth(2,2009); // 28
    // daysInMonth(2,2008); // 29
    return new Date(year, month, 0).getDate();
  }

  askForFitAuthMonthly() {
    this.setState({
      calories: 0
    })

    
      if (Platform.OS == "ios") {
        let perm = {
          permissions: {
            read: [
              "AppleExerciseTime",
            "ActiveEnergyBurned",
            "DistanceCycling",
            "DistanceWalkingRunning",
            "StepCount",
            ]
          }
        };
        const Days = new Date().getDate();
        dayCurrent =
          new Date(new Date().toDateString()).valueOf() -
          86400000 * (Days - 1);
        let options = {
          startDate: new Date(dayCurrent).toISOString(), // required
          endDate: new Date().toISOString(), // optional; default now
          // ascending: false, // optional; default false
          // limit: 10 // optional; default no limit
        };
        AppleHealthKit.initHealthKit(perm, (err, results) => {
          if (err) {
            err;
            console.log("error initializing Healthkit: ", err);
            return;
          }

          const optWeek = {
            startDate: new Date(
              new Date(new Date().toDateString()).valueOf() -
              86400000 * (Days - 1)
            ).toISOString(),
            endDate: new Date().toISOString()
          };

          AppleHealthKit.getActiveEnergyBurned(
            optWeek,
            (err, results) => {
              if (err) {
                console.log('errore');
                console.log(err);
                this.setState({ activitiesApple: JSON.stringify(err) });
                return;
              }
              console.log('risultati');
              console.log(results);

              let calories = 0
              results.forEach( elem => 
                {
                  calories += elem.value
                })

                this.setState({
                  
                  calories: Math.round(calories),
                 
                });

            }
          );

          AppleHealthKit.getAppleExerciseTime(
            options,
            (err, results) => {
              if (err) {
                console.log('errore');
                console.log(err);
                this.setState({ activitiesApple: JSON.stringify(err) });
                return;
              }
              console.log('risultati');
              console.log(results);
             
              let resultsMin = results.map(elem => {
                const d = new Date(moment(elem.startDate));
                const datestring =
                  d.getFullYear() +
                  "-" +
                  ("0" + (d.getMonth() + 1)).slice(-2) +
                  "-" +
                  ("0" + d.getDate()).slice(-2);
                return ({
                  date: datestring,
                  value: Math.round(elem.value / 60),
                  
                })
              })
              




              this.setState(state => {

                const dateValue = [
                  ...state.dateValue,
                  ...resultsMin
                ];
                console.log(dateValue);

                let minutesActivities = 0;
               
                
                let dateArray = dateValue.map(elem => {
                  let value = elem.value;
                  minutesActivities += value;
                  
                  let color = '#F39558'
                  if (value > 29 && value < 60) {
                    color = '#EF7361'
                  } else if (value > 59 && value < 90) {
                    color = '#EB506A'
                  } else if (value > 59) {
                    color = '#E82F72'
                  }
                  // return {
                  //   [elem.date]: {
                  //     customStyles: {
                  //       container: {
                  //         backgroundColor: color
                  //       },
                  //       text: {
                  //         color: 'white',

                  //       },
                  //     }
                  //   }
                  // };
                  return {
                    [elem.date]:
                    {
                      customStyles: {
                        container: {
                          backgroundColor: color
                        },
                        text: {
                          color: 'white',

                        },
                      }

                    }
                  };
                });

                
               

                dateArray = dateArray.map(a => {
                  return JSON.stringify(a).slice(1, -1);
                });

                let arrString = dateArray.join(",");
                let markedDates = JSON.parse("{" + arrString + "}");
                console.log(markedDates);
                return { markedDates, dateValue, minutesActivities,   };
              });
            }
          );

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

        GoogleFit.authorize(options)
          .then(res => {
            console.log("authorized >>>", res);
            this.setState({ log: "authorized >>> " + JSON.stringify(res) });

            let Now = new Date();

            const millisecond = Now.getTime();
            // vedo che giorno è oggi
            // Sunday is 0, Monday is 1, and so on.
            // tolgo un giorno cosi quando è lunedi da 0 e domenica da 6
            const millisecondMon = millisecond - 86400000;
            // calcolo il tempo iniziale della settimana
            const Days = new Date().getDate();
            console.log(Days)

            for (dayIndex = 0; dayIndex < Days; dayIndex++) {
              let dayCurrent = new Date(new Date().toDateString()).valueOf();
              const indexDay = dayIndex;
              let optDay = {
                startDate: dayCurrent,
                endDate: new Date().valueOf()
              };
              if (indexDay < Days - 1) {
                dayCurrent =
                  new Date(new Date().toDateString()).valueOf() -
                  86400000 * (Days - indexDay - 1);
                optDay = {
                  startDate: dayCurrent,
                  endDate: dayCurrent + 86400000
                };
              }
              console.log(optDay)

              GoogleFit.getActivitySamples(optDay, (err, res) => {
                let data = 0;

                console.log(res);
                console.log(err);
                const resFilter = res.filter(
                  elem => elem.activityName != 'still' && elem.activityName != 'unknown'
                );

                let calories = 0

                let timeActivity = resFilter.map((elem, index) => {
                  if (elem.end && elem.start) {
                    const activities = (elem.end - elem.start) / 60000;

                    data = Math.round(activities) + data;
                    calories +=  elem.calories ? elem.calories : 0

                    return { activities };
                  } else {
                    return { activities: 0 };
                  }
                });
                console.log(data)

                // se ho un'attività ovvero almeno 1 min 
                if (data) {
                  this.setState(state => {
                    const d = new Date(dayCurrent);
                    const datestring =
                      d.getFullYear() +
                      "-" +
                      ("0" + (d.getMonth() + 1)).slice(-2) +
                      "-" +
                      ("0" + d.getDate()).slice(-2);
                    const dateValue = [
                      ...state.dateValue,
                      {
                        date: datestring,
                        value: data,
                        calories: calories
                       
                      }
                    ];
                    console.log(dateValue);
  
                    let minutesActivities = 0;
                    let caloriesTot = 0;
                   
                    let dateArray = dateValue.map(elem => {
                      let value = elem.value;
                      caloriesTot += elem.calories;
                      minutesActivities += value;
                      let color = '#F39558'
                      if (value > 29 && value < 60) {
                        color = '#EF7361'
                      } else if (value > 59 && value < 90) {
                        color = '#EB506A'
                      } else if (value > 59) {
                        color = '#E82F72'
                      }
                      // return {
                      //   [elem.date]: {
                      //     customStyles: {
                      //       container: {
                      //         backgroundColor: color
                      //       },
                      //       text: {
                      //         color: 'white',
  
                      //       },
                      //     }
                      //   }
                      // };
                      return {
                        [elem.date]:
                        {
                          customStyles: {
                            container: {
                              backgroundColor: color
                            },
                            text: {
                              color: 'white',
    
                            },
                          }
    
                        }
                      };
                    });
  
                    dateArray = dateArray.map(a => {
                      return JSON.stringify(a).slice(1, -1);
                    });
  
                    let arrString = dateArray.join(",");
                    let markedDates = JSON.parse("{" + arrString + "}");
                    console.log(markedDates);
                    return { markedDates, dateValue, minutesActivities, calories: Math.round(caloriesTot), };
                  });
                }

                
              });
            }
          })
          .catch(err => {
            console.log("err >>> ", err);
            this.setState({ log: "err >>> " + JSON.stringify(err) });
          });
      }
  }

  askForFitAuthWeek() {
    this.setState({
      calories: 0
    })
    
      if (Platform.OS == "ios") {
        let perm = {
          permissions: {
            read: [
              "AppleExerciseTime",
              "ActiveEnergyBurned",
              "DistanceCycling",
              "DistanceWalkingRunning",
              "StepCount",
              
            ]
          }
        };

        AppleHealthKit.initHealthKit(perm, (err, results) => {
          if (err) {
            err;
            console.log("error initializing Healthkit: ", err);
            return;
          }

          let Now = new Date();

          const millisecond = Now.getTime();
          // vedo che giorno è oggi
          // Sunday is 0, Monday is 1, and so on.
          // tolgo un giorno cosi quando è lunedi da 0 e domenica da 6
          const millisecondMon = millisecond - 86400000;
          // calcolo il tempo iniziale della settimana
          const DayNowFromMon = new Date(millisecondMon).getDay();

          const optWeek = {
            startDate: new Date(
              new Date(new Date().toDateString()).valueOf() -
              86400000 * (DayNowFromMon)
            ).toISOString(),
            endDate: new Date().toISOString()
          };

          AppleHealthKit.getActiveEnergyBurned(
            optWeek,
            (err, results) => {
              if (err) {
                console.log('errore');
                console.log(err);
                this.setState({ activitiesApple: JSON.stringify(err) });
                return;
              }
              console.log('risultati');
              console.log(results);

              let calories = 0
              results.forEach( elem => 
                {
                  calories += elem.value
                })

                this.setState({
                  
                  calories: Math.round(calories),
                 
                });

            }
          );

          for (dayIndex = 0; dayIndex <= DayNowFromMon; dayIndex++) {
            const indexDay = dayIndex;
            let optDayIos = {
              startDate: new Date(new Date().toDateString()).toISOString(),
              endDate: new Date().toISOString()
            };
            if (indexDay != DayNowFromMon) {
              optDayIos = {
                startDate: new Date(
                  new Date(new Date().toDateString()).valueOf() -
                  86400000 * (DayNowFromMon - indexDay)
                ).toISOString(),
                endDate: new Date(
                  new Date(new Date().toDateString()).valueOf() -
                  86400000 * (DayNowFromMon - indexDay - 1)
                ).toISOString()
              };
            }
            AppleHealthKit.getSamples(
              optDayIos,
              (err, results) => {
                if (err) {
                  console.log('errore');
                  console.log(err);
                  this.setState({ activitiesApple: JSON.stringify(err) });
                  return;
                }


                let data = [1, 1, 1, 1];

                console.log(results);
                console.log(err);

                // controllo se hai il watch 
                let checkWatch = ''
                for (i = 0; i < results.length; i++) {
                  if (results[i].device.search('Watch' > 0)) {
                    checkWatch = results[i].device;
                    break
                  }

                }
                let timeActivity = results
                if (checkWatch) {
                  timeActivity = results.filter(elem => elem.device == checkWatch)
                }
                

                timeActivity = timeActivity.map((elem, index) => {
                  if (elem.end && elem.start) {
                    const end =  moment(elem.end)
                    const start =  moment(elem.start)
                    const time = (end + start) / 2;
                    const activities = (end - start) / 60000;
                    const day = new Date(time).toLocaleString();
                    const hour = new Date(time).getHours();
                    if (hour < 6) {
                      data[0] = Math.round(activities) + data[0];
                    } else if (hour < 12) {
                      data[1] = Math.round(activities) + data[1];
                    } else if (hour < 18) {
                      data[2] = Math.round(activities) + data[2];
                    } else {
                      data[3] = Math.round(activities) + data[3];
                    }


                    return { time, activities, };
                  } else {
                    return { time: 0, activities: 0, day: 0 };
                  }
                });
                this.setState(state => {
                  let data2 = state.data2;
                  data2[indexDay * 4] = data[0];
                  data2[indexDay * 4 + 1] = data[1];
                  data2[indexDay * 4 + 2] = data[2];
                  data2[indexDay * 4 + 3] = data[3];
                  return { data2: data2,  };
                });
              }
            );
          }


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
        GoogleFit.authorize(options)
          .then(res => {
            console.log("authorized >>>", res);
            this.setState({ log: "authorized >>> " + JSON.stringify(res) });

            let Now = new Date();

            const millisecond = Now.getTime();
            // vedo che giorno è oggi
            // Sunday is 0, Monday is 1, and so on.
            // tolgo un giorno cosi quando è lunedi da 0 e domenica da 6
            const millisecondMon = millisecond - 86400000;
            // calcolo il tempo iniziale della settimana
            const DayNowFromMon = new Date(millisecondMon).getDay();

            for (dayIndex = 0; dayIndex <= DayNowFromMon; dayIndex++) {
              const indexDay = dayIndex;
              let optDay = {
                startDate: new Date(new Date().toDateString()).valueOf(),
                endDate: new Date().valueOf()
              };
              if (indexDay != DayNowFromMon) {
                optDay = {
                  startDate: new Date(
                    new Date(new Date().toDateString()).valueOf() -
                    86400000 * (DayNowFromMon - indexDay)
                  ).valueOf(),
                  endDate: new Date(
                    new Date(new Date().toDateString()).valueOf() -
                    86400000 * (DayNowFromMon - indexDay - 1)
                  ).valueOf()
                };
              }
              GoogleFit.getActivitySamples(optDay, (err, res) => {
                let data = [1, 1, 1, 1];

                console.log(res);
                console.log(err);
                const resFilter = res.filter(
                  elem => elem.activityName != 'still' && elem.activityName != 'unknown'
                );

                let calories = 0
                    

                let timeActivity = resFilter.map((elem, index) => {
                  if (elem.end && elem.start) {
                    const time = (elem.end + elem.start) / 2;
                    const activities = (elem.end - elem.start) / 60000;
                    const day = new Date(time).toLocaleString();
                    const hour = new Date(time).getHours();
                    calories +=  elem.calories ? elem.calories : 0
                    if (hour < 6) {
                      data[0] = Math.round(activities) + data[0];
                    } else if (hour < 12) {
                      data[1] = Math.round(activities) + data[1];
                    } else if (hour < 18) {
                      data[2] = Math.round(activities) + data[2];
                    } else {
                      data[3] = Math.round(activities) + data[3];
                    }

                    return { time, activities, day };
                  } else {
                    return { time: 0, activities: 0, day: 0 };
                  }
                });

                this.setState(state => {
                  let data2 = state.data2;
                  data2[indexDay * 4] = data[0];
                  data2[indexDay * 4 + 1] = data[1];
                  data2[indexDay * 4 + 2] = data[2];
                  data2[indexDay * 4 + 3] = data[3];
                  return { data2: data2, activitiesDay:
                    "activitiesDay >>> " + JSON.stringify(res ? res : err), 
                    calories: state.calories + Math.round(calories)
                  };
                });
              });
            }
          })
          .catch(err => {
            console.log("err >>> ", err);
            this.setState({ log: "err >>> " + JSON.stringify(err) });
          });
      }
  }

  onRefresh() {
    this.setState({ refreshing: true });
    // this.props.dispatch(getStats());
    // if (this.props.statisticsState.error)
    //   Alert.alert("Oops", "Seems like an error occured");
    const loading = setInterval(() => {
  
        this.setState({ refreshing: false });
        clearTimeout(loading);
      
    }, 1000);
  }

  handleChangePage = page => {
    if (page == "WEEKLY") {
      this.askForFitAuthWeek();
    } else if (page == "DAILY") {
      this.askForFitAuth();
    } else {
      // MONTHLY
      this.askForFitAuthMonthly();
    }

    this.setState({ page });
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
          onPress={() => this.handleChangePage("DAILY")}
        >
          <View style={styles.sideContainer}>
            <Text
              style={[
                styles.text,
                { color: this.state.page == "DAILY" ? "#3D3D3D" : "#9D9B9C" }
              ]}
            >
              DAILY
            </Text>
            <View
              style={[
                styles.underline,
                {
                  backgroundColor:
                    this.state.page == "DAILY" ? "#3D3D3D" : "#9D9B9C"
                }
              ]}
            />
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => this.handleChangePage("WEEKLY")}
        >
          <View style={styles.sideContainer}>
            <Text
              style={[
                styles.text,
                { color: this.state.page == "WEEKLY" ? "#3D3D3D" : "#9D9B9C" }
              ]}
            >
              WEEKLY
            </Text>
            <View
              style={[
                styles.underline,
                {
                  backgroundColor:
                    this.state.page == "WEEKLY" ? "#3D3D3D" : "#9D9B9C"
                }
              ]}
            />
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => this.handleChangePage("MONTHLY")}
        >
          <View style={styles.sideContainer}>
            <Text
              style={[
                styles.text,
                { color: this.state.page == "MONTHLY" ? "#3D3D3D" : "#9D9B9C" }
              ]}
            >
              MONTHLY
            </Text>
            <View
              style={[
                styles.underline,
                {
                  backgroundColor:
                    this.state.page == "MONTHLY" ? "#3D3D3D" : "#9D9B9C"
                }
              ]}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  };

  renderWeekly = () => {
    const contentInset = { top: 10, bottom: 10 };
    const contentInsetX = { left: 10, right: 10 };
    const data = [0, 4, 8, 12, 16, 20, 24, 28];

    const CustomGrid = ({ x, y, data, ticks }) => (
      <G>
        {// Vertical grid
          [0, 3.5, 7.5, 11.5, 15.5, 19.5, 23.5, 27.5].map((data, index) => (
            <Line
              key={data}
              y1={"0%"}
              y2={"100%"}
              x1={x(data)}
              x2={x(data)}
              stroke="#3d3d3d"
              strokeWidth="2"
              fill="none"
              // strokeLinecap='round'
              // strokeLinejoin='bevel'
              // strokeDashoffset='8'
              // strokeDasharray={[2,2,2,2,2,2,2,2]}
              strokeLinecap="round"
              strokeDasharray="0, 10"
            />
          ))}
      </G>
    );
    return (
      <Aux>
        <View
          style={{
            height: 240,
            flexDirection: "row",
            width: Dimensions.get("window").width,
            alignContent: "center",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <YAxis
            data={[0, 10, 20, 30, 40, 50, 60]}
            style={{ height: 220 }}
            contentInset={contentInset}
            svg={{
              fill: "#3D3D3D",
              fontSize: 10
            }}
            numberOfTicks={6}
            formatLabel={value => `${value}'`}
          />

          <AreaChart
            style={{
              height: 200,
              width: Dimensions.get("window").width * 0.8,
              backgroundColor: "#f6f6f6",
              marginLeft: 16
            }}
            data={this.state.data2}
            // contentInset={{ top: 30, bottom: 30 }}
            // curve={shape.curveStep}
            curve={shape.curveNatural}
            yMin={0}
            yMax={60}
            //svg={{ fill: 'rgba(134, 65, 244, 0.8)' }}
            animate={true}
            contentInset={{ top: 100, bottom: 0 }}
            svg={{
              fill: "url(#gradient)"
              // clipPath: 'url(#clip-path-1)',
            }}
            numberOfTicks={18}
            showGrid={true}
            extras={[Gradient, Clips, Line, DashedLine]}
          >
            {/* <Grid belowChart={true} direction='VERTICAL' svg={{ stroke: "#3d3d3d",
              strokeWidth: "2",
              fill:"none", strokeLinecap: "round",
              strokeDasharray:"0, 10" }}></Grid> */}
            <CustomGrid />
            <Defs>
              <LinearGradient id="grad" x1="0" y1="0" x2="10" y2="0">
                <Stop offset="0" stopColor="#7D4D99" stopOpacity="1" />
                <Stop offset="1" stopColor="#6497CC" stopOpacity="1" />
              </LinearGradient>
              <LinearGradient
                id={"gradient"}
                x1={"0"}
                y={"0%"}
                x2={"0%"}
                y2={"100%"}
              >
                <Stop offset="0" stopColor="#E82F73" stopOpacity="1" />
                <Stop offset="1" stopColor="#F49658" stopOpacity="1" />
              </LinearGradient>
            </Defs>
          </AreaChart>
        </View>
        {/* <XAxis
          style={{
            marginHorizontal: -10,
            width: Dimensions.get("window").width * 0.8 + 20,
            marginLeft: 25
          }}
          data={[0, 4, 8, 12, 16, 20, 24]}
          formatLabel={index => `${4 * index}`}
          contentInset={{
            left: 10,
            right: 10,
            height: 50,
            width: 50,
            borderRadius: 25,
            backgroundColor: "#EB436E"
          }}
          svg={{ fontSize: 10, cx: "50", cy: "50", r: "30", fill: "black" }}
          // numberOfTicks={4}
          contentInset={contentInsetX}
        /> */}
        <View
          style={{
            // marginHorizontal: -10,
            width: Dimensions.get("window").width * 0.8,
            // marginLeft: 25,
            // marginLeft: 32 + Dimensions.get("window").width * 0.1,
            marginLeft: 32 + Dimensions.get("window").width * 0.1,
            flexDirection: "row",
            // justifyContent: 'space-around'
            justifyContent: "space-between",
            alignContent: "center"
          }}
        >
          {
            weekDayNames(1).map((elem) => { console.warn('giorno', elem);
             return( <View
              style={{
                height: 22,
                width: 22,
               
                alignContent: "center",
                justifyContent: "center",
                flexDirection: "row",
                alignItems: "center"
              }}
            ><Text style={{ fontSize: 10, color: "#9D9B9C" }}>{elem}</Text></View>)}
          )}
        </View>
      </Aux>
    );
  };

  calcolateActivities = (month) => {
    // cancello gli altri mesi 
    console.log(month)
    console.log(this.state.yearNow)
    console.log(this.state.monthNow)
    this.setState({
      markedDates: {}, dateValue: [], minutesActivitie: 0, calories: 0
    })
    const monthNow = month.month;
    const year = month.year;

    // se metto l'anno e il mese corrente 
    if (year == this.state.yearNow && monthNow == this.state.monthNow) {
      this.askForFitAuthMonthly();
    } else {

    

    const Days = this.daysInMonth(monthNow, year);

    
      if (Platform.OS == "ios") {
        let perm = {
          permissions: {
            read: [
              "AppleExerciseTime",
            "ActiveEnergyBurned",
            "DistanceCycling",
            "DistanceWalkingRunning",
            "StepCount",
            ]
          }
        };


        let dayFirstMonthly = new Date(year, monthNow - 1, 1).toISOString();
        let dayLastMonthly = new Date(year, monthNow - 1, Days).toISOString();
        let options = {
          startDate: dayFirstMonthly, // required
          endDate: dayLastMonthly, // optional; default now
          // ascending: false, // optional; default false
          // limit: 10 // optional; default no limit
        };
        AppleHealthKit.initHealthKit(perm, (err, results) => {
          if (err) {
            err;
            console.log("error initializing Healthkit: ", err);
            return;
          }

         

          AppleHealthKit.getActiveEnergyBurned(
            options,
            (err, results) => {
              if (err) {
                console.log('errore');
                console.log(err);
                this.setState({ activitiesApple: JSON.stringify(err) });
                return;
              }
              console.log('risultati');
              console.log(results);

              let calories = 0
              results.forEach( elem => 
                {
                  calories += elem.value
                })

                this.setState({
                  
                  calories: Math.round(calories),
                 
                });

            }
          );

          AppleHealthKit.getAppleExerciseTime(
            options,
            (err, results) => {
              if (err) {
                console.log('errore');
                console.log(err);
                this.setState({ activitiesApple: JSON.stringify(err) });
                return;
              }
              console.log('risultati');
              console.log(results);

              let resultsMin = results.map(elem => {
                const d = new Date(moment(elem.startDate));
                const datestring =
                  d.getFullYear() +
                  "-" +
                  ("0" + (d.getMonth() + 1)).slice(-2) +
                  "-" +
                  ("0" + d.getDate()).slice(-2);
                return ({
                  date: datestring,
                  value: Math.round(elem.value / 60)
                })
              })


              this.setState(state => {

                const dateValue = [
                  ...state.dateValue,
                  ...resultsMin
                ];
                console.log(dateValue);

                let minutesActivities = 0

                let dateArray = dateValue.map(elem => {
                  let value = elem.value;
                  minutesActivities += value;
                  let color = '#F39558'
                  if (value > 29 && value < 60) {
                    color = '#EF7361'
                  } else if (value > 59 && value < 90) {
                    color = '#EB506A'
                  } else if (value > 59) {
                    color = '#E82F72'
                  }
                  // return {
                  //   [elem.date]: {
                  //     customStyles: {
                  //       container: {
                  //         backgroundColor: color
                  //       },
                  //       text: {
                  //         color: 'white',

                  //       },
                  //     }
                  //   }
                  // };

                  return {
                    [elem.date]:
                    {
                      customStyles: {
                        container: {
                          backgroundColor: color
                        },
                        text: {
                          color: 'white'
                        },
                      }
                    }
                  };
                });

                dateArray = dateArray.map(a => {
                  return JSON.stringify(a).slice(1, -1);
                });

                let arrString = dateArray.join(",");
                let markedDates = JSON.parse("{" + arrString + "}");
                console.log(markedDates);
                return { markedDates, dateValue, minutesActivities };
              });
            }
          );


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

        GoogleFit.authorize(options)
          .then(res => {
            console.log("authorized >>>", res);
            this.setState({ log: "authorized >>> " + JSON.stringify(res) });

            let Now = new Date();

            for (dayIndex = 0; dayIndex < Days; dayIndex++) {

              const indexDay = dayIndex;
              let dayCurrent = new Date(year, monthNow - 1, indexDay + 1).valueOf();
              let optDay = {
                startDate: dayCurrent,
                endDate: dayCurrent + 86400000
              };
              // if (indexDay < Days - 1) {
              //   dayCurrent =
              //   new Date(year,monthNow, dayIndex + 1).valueOf();
              //   optDay = {
              //     startDate: dayCurrent,
              //     endDate: dayCurrent + 86400000
              //   };
              // }

              GoogleFit.getActivitySamples(optDay, (err, res) => {
                let data = 0;

                console.log(res);
                console.log(err);
                const resFilter = res.filter(
                  elem => elem.activityName != 'still' && elem.activityName != 'unknown'
                );

                let calories = 0

                let timeActivity = resFilter.map((elem, index) => {
                  if (elem.end && elem.start) {
                    const activities = (elem.end - elem.start) / 60000;
                    calories +=  elem.calories ? elem.calories : 0

                    data = Math.round(activities) + data;

                    return { activities };
                  } else {
                    return { activities: 0 };
                  }
                });

                if (data) {
                  this.setState(state => {
                    const d = new Date(dayCurrent);
                    const datestring =
                      d.getFullYear() +
                      "-" +
                      ("0" + (d.getMonth() + 1)).slice(-2) +
                      "-" +
                      ("0" + d.getDate()).slice(-2);
                    const dateValue = [
                      ...state.dateValue,
                      {
                        date: datestring,
                        value: data
                      }
                    ];
                    console.log(dateValue);
                    let minutesActivities = 0;
                    let dateArray = dateValue.map(elem => {
                      let value = elem.value;
                      minutesActivities += value;
                      let color = '#F39558'
                      if (value > 29 && value < 60) {
                        color = '#EF7361'
                      } else if (value > 59 && value < 90) {
                        color = '#EB506A'
                      } else if (value > 59) {
                        color = '#E82F72'
                      }
                      // return {
                      //   [elem.date]: {
                      //     customStyles: {
                      //       container: {
                      //         backgroundColor: color
                      //       },
                      //       text: {
                      //         color: 'white',
  
                      //       },
                      //     }
                      //   }
                      // };
                      return {
                        [elem.date]:
                        {
                          customStyles: {
                            container: {
                              backgroundColor: color
                            },
                            text: {
                              color: 'white',
    
                            },
                          }
    
                        }
                      };
                    });
  
                    dateArray = dateArray.map(a => {
                      return JSON.stringify(a).slice(1, -1);
                    });
  
                    let arrString = dateArray.join(",");
                    let markedDates = JSON.parse("{" + arrString + "}");
                    console.log(markedDates);
                    return { 
                      markedDates, 
                      dateValue, 
                      minutesActivities,  
                      calories: state.calories + Math.round(calories) };
                  });
                }
              });
            }
          })
          .catch(err => {
            console.log("err >>> ", err);
            this.setState({ log: "err >>> " + JSON.stringify(err) });
          });
      }
    }


  }

  renderDay = () => {
    const contentInset = { top: 10, bottom: 10 };
    const contentInsetX = { left: 10, right: 10 };
    return (
      <Aux>
        <View
          style={{
            height: 240,
            flexDirection: "row",
            width: Dimensions.get("window").width,
            alignContent: "center",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <YAxis
            data={this.state.data}
            style={{ height: 220 }}
            contentInset={contentInset}
            svg={{
              fill: "#3D3D3D",
              fontSize: 10
            }}
            numberOfTicks={6}
            formatLabel={value => `${value}'`}
          />

          <AreaChart
            style={{
              height: 200,
              width: Dimensions.get("window").width * 0.8,
              backgroundColor: "#f6f6f6",
              marginLeft: 16
            }}
            data={this.state.data}
            // contentInset={{ top: 30, bottom: 30 }}
            curve={shape.curveNatural}
            yMin={0}
            //yMax={this.state.maxY}
            // gridMin={0}
            // gridMax={60}
            // svg={{ fill: 'rgba(134, 65, 244, 0.8)' }}
            animate={true}
            contentInset={{ top: 100, bottom: 0 }}
            svg={{
              fill: "url(#gradient)"
              // clipPath: 'url(#clip-path-1)',
            }}
            extras={[Gradient, Clips, Line, DashedLine]}
          >
            <Defs>
              <LinearGradient id="grad" x1="0" y1="0" x2="10" y2="0">
                <Stop offset="0" stopColor="#7D4D99" stopOpacity="1" />
                <Stop offset="1" stopColor="#6497CC" stopOpacity="1" />
              </LinearGradient>
              <LinearGradient
                id={"gradient"}
                x1={"0"}
                y={"0%"}
                x2={"0%"}
                y2={"100%"}
              >
                <Stop offset="0" stopColor="#E82F73" stopOpacity="1" />
                <Stop offset="1" stopColor="#F49658" stopOpacity="1" />
              </LinearGradient>
            </Defs>
          </AreaChart>
        </View>
        <XAxis
          style={{
            marginHorizontal: -10,
            width: Dimensions.get("window").width * 0.8 + 20,
            marginLeft: 25
          }}
          data={[0, 4, 8, 12, 16, 20, 24]}
          formatLabel={index => `${4 * index}`}
          contentInset={{ left: 10, right: 10 }}
          svg={{ fontSize: 10, fill: "#3D3D3D" }}
          // numberOfTicks={4}
          contentInset={contentInsetX}
        />
      </Aux>
    );
  };

  renderChartsScreen() {

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
        {this.header()}
        {this.state.page == "DAILY" ? (
          this.renderDay()
        ) : this.state.page == "WEEKLY" ? (
          this.renderWeekly()
        ) : (
              <Calendar
                style={{
                  // borderWidth: 1,
                  // borderColor: "gray",
                  width: Dimensions.get("window").width
                }}
                minutesActivities={pointsDecimal(this.state.minutesActivities, ".")}
                theme={{
                  backgroundColor: "#ffffff",
                  calendarBackground: "#ffffff",
                  textSectionTitleColor: "#3d3d3d",
                  selectedDayBackgroundColor: "#00adf5",
                  selectedDayTextColor: "#ffffff",
                  todayTextColor: "#00adf5",
                  dayTextColor: "#3d3d3d",
                  textDisabledColor: "#3d3d3d",
                  dotColor: "#00adf5",
                  selectedDotColor: "#ffffff",
                  arrowColor: "#9D9B9C",
                  monthTextColor: "#3d3d3d",
                  indicatorColor: "red",
                  // textDayFontFamily: 'monospace',
                  // textMonthFontFamily: 'monospace',
                  // textDayHeaderFontFamily: 'monospace',
                  textDayFontWeight: "300",
                  textMonthFontWeight: "bold",
                  textDayHeaderFontWeight: "300",
                  textDayFontSize: 16,
                  textMonthFontSize: 16,
                  textDayHeaderFontSize: 16
                }}
                // Initially visible month. Default = Date()
                // markingType={"custom"}
                markingType={'custom'}
                markedDates={this.state.markedDates}
                // current={new Date().toDateString()}
                // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
                // minDate={"2019-04-01"}
                // minYear={2019}
                // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
                // maxDate={new Date().toDateString()}
                // Max amount of months allowed to scroll to the past. Default = 50
                pastScrollRange={0}
                // Max amount of months allowed to scroll to the future. Default = 50
                futureScrollRange={0}
                // Handler which gets executed on day press. Default = undefined
                onDayPress={day => {
                  console.log("selected day", day);
                }}
                // Handler which gets executed on day long press. Default = undefined
                onDayLongPress={day => {
                  console.log("selected day", day);
                }}
                // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
                monthFormat={"MMM yyyy"}
                // Handler which gets executed when visible month changes in calendar. Default = undefined
                onMonthChange={month => {
                  console.log("month changed", month);
                  this.calcolateActivities(month)
                }}
                // Hide month navigation arrows. Default = false
                // hideArrows={true}
                // Replace default arrows with custom ones (direction can be 'left' or 'right')
                // renderArrow={(direction) => (<Arrow />)}
                // Do not show days of other months in month page. Default = false
                hideExtraDays={true}
                // If hideArrows=false and hideExtraDays=false do not switch month when tapping on greyed out
                // day from another month that is visible in calendar page. Default = false
                disableMonthChange={true}
                // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
                firstDay={1}
                // Hide day names. Default = false
                hideDayNames={false}
                // showIndicator={this.state.dateValue.length > 10}
                // Show week numbers to the left. Default = false
                showWeekNumbers={false}
                // Handler which gets executed when press arrow icon left. It receive a callback can go back month
                onPressArrowLeft={substractMonth => substractMonth()}
                // Handler which gets executed when press arrow icon left. It receive a callback can go next month
                onPressArrowRight={addMonth => addMonth()}
              />
            )}
            {this.renderCaloriesBurned()}
        {this.renderHealthData()}
      </ScrollView>
    );
  }

  renderCaloriesBurned() {
    return(
      <View>
           <View style={styles.headerContainer}>
          <Text style={styles.headerText}>CALORIES BURNED</Text>
          <Icon
              name="md-arrow-forward"
              size={18}
              color="#FAB21E"
              style={{}}
            />
          <View style={styles.caloriesContainer}>
          <Text style={styles.caloriesText}>{this.state.calories} Kcal</Text>
          </View>
          
        </View>
        <View style={styles.headerContainer}>
        <View style={styles.caloriesStartEndIconContainer} >
        <Icon
              name="md-arrow-forward"
              size={20}
              color="#6497CC"
              style={{}}
            />
             <Icon
              name="md-close"
              size={15}
              color="#3D3D3D"
              style={{}}
            />
            <Text style={styles.headerText}>13</Text>
        </View>
          <View style={styles.caloriesCenterIconContainer} >
          <Icon
              name="md-arrow-forward"
              size={20}
              color="#6497CC"
              style={{}}
            />
             <Icon
              name="md-close"
              size={15}
              color="#3D3D3D"
              style={{}}
            />
            <Text style={styles.headerText}>13</Text>
        </View>
          <View style={styles.caloriesStartEndIconContainer} >
          <Icon
              name="md-arrow-forward"
              size={20}
              color="#6497CC"
              style={{}}
            />
             <Icon
              name="md-close"
              size={15}
              color="#3D3D3D"
              style={{}}
            />
            <Text style={styles.headerText}>13</Text>
        </View>
         
         
        </View>
          </View>
    )
  }


  renderHealthData() {
     
      if (Platform.OS == "ios")
        return (
          <View>
            <Text>{this.state.healthkit}</Text>
            <Text>{this.state.calories}</Text>
            <Text>{this.state.activitiesApple}</Text>
            <Text>{this.state.activitiesApple2}</Text>
          </View>
        );
      else
        return (
          <View>
            <Text>{this.state.log}</Text>
            <Text>{this.state.calories}</Text>
            <Text>{this.state.activitiesDay}</Text>
            {this.state.timeActivity2.map(elem => (
              <Text>
                {elem.time} {elem.activities} {elem.day}
              </Text>
            ))}
            {this.state.timeActivity.map(elem => (
              <Text>
                {elem.time} {elem.activities} {elem.day}
              </Text>
            ))}
            <Text>{this.state.activities}</Text>
            <Text>{this.state.steps}</Text>
          </View>
        );
    
  }
  render() {
    console.log(this.props.page);
    if (this.state.statusLoad == 'Error') {
      Alert.alert("Oops", "Seems like an error occured, pull to refresh");
      return <View />;
    } else {
      return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
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
    width: Dimensions.get("window").width * 0.9,
    paddingBottom: 5,
    paddingTop: 5,
    // height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  caloriesContainer: {
    // width: Dimensions.get("window").width * 0.8,
    // height: 50,
    flexDirection: "row",
    paddingBottom: 5,
    paddingTop: 5,
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: '#FAB21E',
    borderBottomWidth: 1
  },
  caloriesStartEndIconContainer: {
    width: Dimensions.get("window").width * 0.3 - 1,
    paddingBottom: 15,
    paddingTop: 15,
    // height: 50,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderBottomColor: '#3d3d3d',
    borderBottomWidth: 1,
  },
  caloriesCenterIconContainer: {
    width: Dimensions.get("window").width * 0.3 + 2,
    paddingBottom: 15,
    paddingTop: 15,
    // height: 50,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderBottomColor: '#3d3d3d',
    borderBottomWidth: 1,
    borderRightColor: '#3d3d3d',
    borderRightWidth: 1,
    borderLeftColor: '#3d3d3d',
    borderLeftWidth: 1,
  },
  headerText: {
    fontFamily: "Montserrat-ExtraBold",
    color: "#3F3F3F",
    fontSize: 20,
    textAlign: "left",
    textAlignVertical: "center"
  },
  caloriesText: {
    fontFamily: "OpenSans-Regular",
    color: "#9D9B9C",
    fontSize: 10,
    textAlign: "center",
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
    width: Dimensions.get("window").width / 3,
    height: 40,
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
    // statisticsState: state.statistics ? state.statistics : []
    // trophies: getTrophiesState(state),
    // page: getScreenState(state)
  };
});

export default withData(ChartsWavesScreen);
