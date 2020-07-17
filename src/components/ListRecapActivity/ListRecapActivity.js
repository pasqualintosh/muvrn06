// genera la lista dei recap delle attivita svolte

// riceve
// data
// ovvero le tratte validate
import React from "react";
import {
  View,
  Dimensions,
  Platform,
  TouchableWithoutFeedback,
  Text,
  ScrollView,
  Image,
  RefreshControl,
  ActivityIndicator,
  FlatList,
  NativeModules
} from "react-native";
import { getModalType } from "../../domains/tracking/ActionCreators";
import RecapActivity from "../RecapActivity/RecapActivity";
import RecapActivityIndicator from "../RecapActivityIndicator/RecapActivityIndicator";
import pointsDecimal from "../../helpers/pointsDecimal";
import { connect } from "react-redux";

import RecapTraining from "../RecapTraining/RecapTraining";
import RecapImageFeed from "../RecapImageFeed/RecapImageFeed";
import RecapSocial from "../RecapSocial/RecapSocial";

import InviteFriendFeed from "../InviteFriendFeed/InviteFriendFeed";
import { getSelectedLeaderboardState } from "../../domains/standings/Selectors";
import {
  getWeekActivitiesState,
  getPermActivitiesState
} from "../../domains/statistics/Selectors";

import InfoCityTournamentHomePadding from "../InfoCityTournamentHomePadding/InfoCityTournamentHomePadding";

import Aux from "../../helpers/Aux";

import {
  createSelector,
  createSelectorCreator,
  defaultMemoize
} from "reselect";
import { isEqual } from "lodash";

import {
  getProfile,
  GetListRoute,
  getMostFrequentRoute,
  getRole,
  addCompletePeriodicFeed,
  addOpenPeriodicFeed
} from "./../../domains/login/ActionCreators";
import {
  resumeRoute,
  ResetPreviousRoute
} from "./../../domains/tracking/ActionCreators";
import {
  getStats,
  changeScreenStatistics
} from "./../../domains/statistics/ActionCreators";
import {
  getTrophies,
  getSpecificPosition
} from "./../../domains/standings/ActionCreators";

import {
  getUserLevel,
  changeScreenProfile,
  putEventOfflineFor,
  getSpecialTrainingSessionSubscribed,
  getSpecialTrainingSessions
} from "./../../domains/trainings/ActionCreators";
import {
  setFriendSelected,
  getFollowersUser
} from "./../../domains/follow/ActionCreators";

import Svg, {
  Circle,
  Rect,
  Text as TextSvg,
  Image as ImageSvg
} from "react-native-svg";

import { Tester } from "./../../config/Tester";
import { strings, switchLanguage, getLanguageI18n } from "../../config/i18n";
import { getSponsor } from "./../../helpers/specialTrainingSponsors";

class ListRecapActivity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ValueBlur: 0,
      viewRef: null,
      refreshing: false,
      endScrollRefresh: false
    };
  }
  getSameReferredRouteIdFromSavedArray = id => {
    let sameReferredRouteId = [];
    let found = false;

    let count = 0;
    try {
      this.props.dataSaved.forEach(el => {
        if (el.referred_route_id == id) {
          found = true;
          sameReferredRouteId.push(el);
          count++;
        }
      });
    } catch (error) {
      // console.error(error);
    }

    if (found && count > 1) return sameReferredRouteId;
    else return false;
  };

  moveProfile = () => {
    // this.props.dispatch(changeScreenProfile("myself"));
    // this.props.navigation.navigate("Profile");

    this.props.navigation.navigate("ChangeAvatarScreen", {
      avatar: this.props.avatar
    });
  };

  moveRanking = () => {
    // const TypeRanking = "global";
    const TypeRanking = this.props.selectedLeaderboard
      ? this.props.selectedLeaderboard
      : "global";
    this.props.navigation.navigate("StandingsScreen", {
      TypeRanking
    });
  };

  moveSettings = () => {
    this.props.navigation.navigate("PersonalDataScreen");
  };

  getArrayRoutesMerged = () => {
    let loginRoutes = this.props.dataSaved;
    let jsonWithMultiRoutes = [];
    let idToSkip = [];
    let jsonWithMultiRoutesSpread = [];

    try {
      this.props.dataSaved.forEach(element => {
        const condition =
          this.getSameReferredRouteIdFromSavedArray(
            element.referred_route_id
          ) != false;

        // la seconda parte della condizione serve a non ricontrollare lo stesso
        // id della tratta papa'
        if (condition && !idToSkip.includes(element.referred_route_id)) {
          jsonWithMultiRoutes.push(
            this.getSameReferredRouteIdFromSavedArray(element.referred_route_id)
          );
          idToSkip.push(element.referred_route_id);
        }
      });
    } catch (error) {
      // console.error(error);
    }

    let jsonWithSingleRoutes = loginRoutes.filter(el => {
      return !idToSkip.includes(el.referred_route_id);
    });

    try {
      jsonWithMultiRoutes.forEach(el => {
        let emptyTrip = {
          calories: 0,
          coins: 0,
          distance_travelled: 0,
          points: 0,
          time_travelled: 0,
          id: el.id,
          referred_route_id: el.referred_route_id,
          modal_type: [],
          // route: [],

          segment_index: 0,
          validated: false,
          created_at: "2018-08-02T10:40:55.670962Z",
          end_time: "2018-08-02T10:40:34.640000Z",
          updated_at: "2018-08-02T10:40:55.670973Z"
        };
        el.forEach(elem => {
          emptyTrip.calories += elem.calories;
          emptyTrip.coins += elem.coins;
          emptyTrip.distance_travelled += Number.parseFloat(
            elem.distance_travelled
          );
          emptyTrip.referred_route_id = elem.referred_route_id;
          emptyTrip.points += elem.points;
          emptyTrip.time_travelled += elem.time_travelled;
          emptyTrip.modal_type.push(elem.modal_type);
          // emptyTrip.route.push(elem.route);
          emptyTrip.created_at = elem.created_at;
          emptyTrip.end_time = elem.end_time;
          emptyTrip.updated_at = elem.updated_at;
          if (elem.validated) emptyTrip.validated = true;
        });

        jsonWithMultiRoutesSpread.push(emptyTrip);
      });
    } catch (error) {
      // console.error(error);
    }

    let jsonSingleAndMultiRoute = [
      ...jsonWithMultiRoutesSpread,
      ...jsonWithSingleRoutes
    ];

    return jsonSingleAndMultiRoute.sort((a, b) => {
      return new Date(b.created_at) - new Date(a.created_at);
    });

    // // console.log(jsonWithMultiRoutesSpread); // json con le tratte multiple spalmate
    // // console.log(jsonWithMultiRoutes.length); // json con le tratte multiple
    // // console.log(jsonWithSingleRoutes); // json con le tratte singole
    // // console.log(this.props.dataSaved.length); // json con tutte le tratte
  };

  infoCityTournamentPadding = () => {
    return (
      <InfoCityTournamentHomePadding
        infoProfile={this.props.profileState}
        navigation={this.props.navigation}
        ValueBlur={this.props.ValueBlur}
      />
    );
  };

  infoHomePadding = () => {
    return (
      <View style={styles.Container}>
        <View style={styles.centerContainer}>
          <TouchableWithoutFeedback
            disabled={this.props.ValueBlur ? true : false}
            style={{
              opacity: 0
            }}
            onPress={this.moveSettings}
          >
            <View>
              <Text
                style={{
                  fontFamily: "Montserrat-ExtraBold",
                  textAlign: "center",
                  fontSize: 22,
                  color: "#fff"
                }}
              >
                {"                       "}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.ThreeContainer}>
          <TouchableWithoutFeedback
            disabled={this.props.ValueBlur ? true : false}
            style={{
              opacity: 0
            }}
            onPress={this.moveRanking}
          >
            <View>
              <Text
                style={{
                  fontFamily: "OpenSans-Regular",
                  textAlign: "center",
                  fontSize: 14,
                  color: "transparent",
                  fontWeight: "bold"
                }}
              >
                World Ranking
              </Text>
              <Text
                style={{
                  fontFamily: "OpenSans-Regular",
                  textAlign: "center",
                  fontSize: 12,
                  color: "transparent",
                  fontWeight: "bold"
                }}
              >
                World Ranking
              </Text>
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback
            disabled={this.props.ValueBlur ? true : false}
            style={{
              width: 80,
              height: 80,
              position: "absolute",
              right: Dimensions.get("window").width / 2 - 40
            }}
            onPress={this.moveProfile}
          >
            <View
              style={{
                width: 80,
                height: 80,
                position: "absolute",
                right: Dimensions.get("window").width / 2 - 40
              }}
            />
          </TouchableWithoutFeedback>

          <View />
          <View />

          <View />
        </View>
      </View>
    );
  };

  testFeed = () => {
    return (
      <View>
        <RecapTraining
          modal_type="SurveyComplete"
          DataNow={new Date().getTime()}
          Data={new Date().getTime()}
          obtainable_coins={3}
          changeScreen={this.changeScreen}
        />
      </View>
    );
  };

  reload = () => {
    this.props.dispatch(resumeRoute());
  };

  feedOrdedAll = (item, index, DateNow) => {
    // recap di tutte le info online come eventi, sessioni, route e livello
    //

    if (item.Quiz) {
      if (item.enableQuiz.length) {
        // quiz o survey
        return (
          <RecapTraining
            key={index}
            modal_type={item.enableQuiz}
            changeScreen={this.changeScreen}
            dispatch={this.props.dispatch}
          />
        );
      }
    } else if (item.routeNum) {
      // tratta in caricamento
      return (
        <View key={index}>
          <RecapActivityIndicator
            status={
              item.status === "validation" || item.status === "send route"
            }
            modal_type={item.activityChoice}
            validated={false}
            DataNow={DateNow}
            Data={item.dateEnd}
            NumRoute={item.routeNum}
            NumRouteAnalyzed={item.routeAnalyNum}
            reload={this.reload}

            // firstLat={item.route.coordinates[0][1]}
            // firstLon={item.route.coordinates[0][0]}
          />
        </View>
      );
    } else if (item.level) {
      return (
        <View key={index}>
          <RecapTraining
            modal_type="Level"
            DataNow={DateNow.getTime()}
            Data={new Date(item.updated_at).getTime()}
            avatar={this.props.avatar}
            changeScreen={this.changeScreen}
            level={item.level}
            dispatch={this.props.dispatch}
          />
        </View>
      );
    } else if (item.Health) {
      if (item.enableHealth) {
        return (
          <View key={index}>
            <RecapImageFeed
              modal_type="Level"
              DataNow={DateNow.getTime()}
              Data={DateNow.getTime()}
              avatar={this.props.avatar}
              changeScreen={this.changeScreen}
              level={item.level}
              dispatch={this.props.dispatch}
            />
          </View>
        );
      } else {
        <View key={index} />;
      }
    } else if (item.event) {
      return (
        <View key={index}>
          <RecapTraining
            modal_type="Event"
            description={item.event.text_description}
            DataNow={DateNow.getTime()}
            Data={new Date(item.updated_at).getTime()}
            avatar={this.props.avatar}
            changeScreen={this.changeScreen}
            dispatch={this.props.dispatch}
          />
        </View>
      );
    } else if (item.trainingSessionId) {
      return (
        <View key={index}>
          <RecapTraining
            modal_type="Session"
            description={item.text_description}
            DataNow={DateNow.getTime()}
            Data={new Date(item.updated_at).getTime()}
            avatar={this.props.avatar}
            changeScreen={this.changeScreen}
            dispatch={this.props.dispatch}
          />
        </View>
      );
    } else if (item.type) {
      // nessun feed
      if (item.type === "nothing") {
        return <View key={index} />;
      } else if (item.type === "quiz") {
        return (
          <View key={index}>
            <RecapTraining
              modal_type="QuizComplete"
              DataNow={DateNow.getTime()}
              Data={new Date(item.updated_at).getTime()}
              obtainable_coins={item.obtainable_coins}
              changeScreen={this.changeScreen}
              dispatch={this.props.dispatch}
            />
          </View>
        );
      } else if (item.type === "typeform") {
        return (
          <View key={index}>
            <RecapTraining
              modal_type="typeform"
              DataNow={DateNow.getTime()}
              Data={new Date(item.updated_at).getTime()}
              avatar={this.props.avatar}
              dispatch={this.props.dispatch}
              // obtainable_coins={item.obtainable_coins}
              // changeScreen={this.changeScreen}
            />
          </View>
        );
      } else if (item.type === "typeform_2") {
        return (
          <View key={index}>
            <RecapTraining
              modal_type="typeform_2"
              DataNow={DateNow.getTime()}
              Data={new Date(item.updated_at).getTime()}
              avatar={this.props.avatar}
              dispatch={this.props.dispatch}
              // obtainable_coins={item.obtainable_coins}
              // changeScreen={this.changeScreen}
            />
          </View>
        );
      } else if (item.type === "survey") {
        return (
          <View key={item.updated_at}>
            <RecapTraining
              modal_type="SurveyComplete"
              DataNow={DateNow.getTime()}
              Data={new Date(item.updated_at).getTime()}
              obtainable_coins={item.obtainable_coins}
              changeScreen={this.changeScreen}
              dispatch={this.props.dispatch}
            />
          </View>
        );
      } else if (item.type === "addFrequentTrips") {
        return (
          <View key={index}>
            <RecapTraining
              modal_type="addFrequentTrips"
              DataNow={DateNow.getTime()}
              Data={new Date(item.updated_at).getTime()}
              changeScreen={this.changeScreen}
              avatar={this.props.avatar}
              dispatch={this.props.dispatch}
            />
          </View>
        );
      } else if (item.type === "updateProfile") {
        return (
          <View key={item.updated_at}>
            <RecapTraining
              modal_type="updateProfile"
              DataNow={DateNow.getTime()}
              Data={new Date(item.updated_at).getTime()}
              changeScreen={this.changeScreen}
              avatar={this.props.avatar}
              dispatch={this.props.dispatch}
            />
          </View>
        );
      } else if (item.type === "mobilityHabits") {
        return (
          <View key={index}>
            <RecapTraining
              modal_type="mobilityHabits"
              DataNow={DateNow.getTime()}
              Data={new Date(item.updated_at).getTime()}
              changeScreen={this.changeScreen}
              cityName={item.city}
              avatar={this.props.avatar}
              dispatch={this.props.dispatch}
            />
          </View>
        );
      } else if (item.type === "feedback") {
        return (
          <View key={index}>
            <RecapTraining
              modal_type="feedback"
              DataNow={DateNow.getTime()}
              Data={new Date(item.updated_at).getTime()}
              changeScreen={this.changeScreen}
              avatar={this.props.avatar}
              dispatch={this.props.dispatch}
            />
          </View>
        );
      } else if (item.type === "facebookLike") {
        return (
          <View key={index}>
            <RecapSocial
              modal_type="facebookLike"
              DataNow={DateNow.getTime()}
              Data={new Date(item.updated_at).getTime()}
              changeScreen={this.changeScreen}
              avatar={this.props.avatar}
              dispatch={this.props.dispatch}
            />
          </View>
        );
      } else if (item.type === "instagramLike") {
        return (
          <View key={index}>
            <RecapSocial
              modal_type="instagramLike"
              DataNow={DateNow.getTime()}
              Data={new Date(item.updated_at).getTime()}
              changeScreen={this.changeScreen}
              avatar={this.props.avatar}
              dispatch={this.props.dispatch}
            />
          </View>
        );
      } else if (item.type === "rememberLevel") {
        return (
          <View key={index}>
            <RecapTraining
              modal_type="rememberLevel"
              DataNow={DateNow.getTime()}
              Data={new Date(item.updated_at).getTime()}
              changeScreen={this.changeScreen}
              avatar={this.props.avatar}
              dispatch={this.props.dispatch}
            />
          </View>
        );
      } else if (item.type === "inviteFriend") {
        return (
          <View key={index}>
            <InviteFriendFeed
              modal_type="inviteFriend"
              DataNow={DateNow.getTime()}
              Data={new Date(item.updated_at).getTime()}
              changeScreen={this.changeScreen}
              dispatch={this.props.dispatch}
              infoProfile={this.props.profileState}
              navigation={this.props.navigation}
            />
          </View>
        );
      } else if (item.type === "new_st") {
        return (
          <View key={index}>
            <RecapTraining
              modal_type="newST"
              DataNow={DateNow.getTime()}
              Data={new Date(item.updated_at).getTime()}
              changeScreen={this.changeScreen}
              dispatch={this.props.dispatch}
              textSponsor={getSponsor(item.id) ? getSponsor(item.id).name : ""}
              textTraining={item.text_description + ""}
              customisationGdpr={this.props.profileState.customisation_gdpr}
              sponsorshipsGdpr={this.props.profileState.sponsorships_gdpr}
            />
          </View>
        );
      } else if (item.type === "completed_st") {
        return (
          <View key={index}>
            <RecapTraining
              modal_type="completedST"
              DataNow={DateNow.getTime()}
              Data={new Date(item.updated_at).getTime()}
              changeScreen={this.changeScreen}
              dispatch={this.props.dispatch}
              // textSponsor={"Manuel Gaetani"}
              textSponsor={getSponsor(item.id) ? getSponsor(item.id).name : ""}
              textTraining={item.text_description}
              reward={item.id_reward}
            />
          </View>
        );
      } else {
        return <View key={item.updated_at} />;
      }
    } else if (item.user_follower) {
      // singolo amico o gruppo d'amici

      // console.log(item);
      // singolo amico o gruppo d'amici
      if (item.numFollowed > 1) {
        return (
          <View key={item.updated_at + index}>
            <RecapTraining
              modal_type="MultipleFollowed"
              DataNow={DateNow.getTime()}
              Data={new Date(item.updated_at).getTime()}
              avatar={item.user_follower.avatar}
              changeScreen={this.changeScreen}
              dispatch={this.props.dispatch}
              first_name={item.user_follower.first_name}
              last_name={item.user_follower.last_name}
              numFollowed={item.numFollowed}
            />
          </View>
        );
      } else if (item.coin_follower_earned && item.coin_follower_earned === 2) {
        // console.log("InviteAccepted");
        return (
          <View key={item.updated_at + index}>
            <RecapTraining
              modal_type="InviteAccepted"
              DataNow={DateNow.getTime()}
              Data={new Date(item.updated_at).getTime()}
              avatar={item.user_follower.avatar}
              changeScreen={this.changeScreen}
              dispatch={this.props.dispatch}
              first_name={item.user_follower.first_name}
              last_name={item.user_follower.last_name}
              coin_follower_earned={item.coin_follower_earned}
            />
          </View>
        );
      } else if (item.coin_follower_earned && item.coin_follower_earned === 1) {
        // console.log("InviteConfirmed");
        return (
          <View key={item.updated_at + index}>
            <RecapTraining
              modal_type="InviteConfirmed"
              DataNow={DateNow.getTime()}
              Data={new Date(item.updated_at).getTime()}
              avatar={item.user_follower.avatar}
              changeScreen={this.changeScreen}
              dispatch={this.props.dispatch}
              first_name={item.user_follower.first_name}
              last_name={item.user_follower.last_name}
              coin_followed_earned={item.coin_follower_earned}
            />
          </View>
        );
      } else {
        return (
          <View key={item.updated_at + index}>
            <RecapTraining
              modal_type="Followed"
              DataNow={DateNow.getTime()}
              Data={new Date(item.updated_at).getTime()}
              avatar={item.user_follower.avatar}
              changeScreen={this.changeScreen}
              dispatch={this.props.dispatch}
              first_name={item.user_follower.first_name}
              last_name={item.user_follower.last_name}
            />
          </View>
        );
      }
    } else if (item.trophy) {
      return (
        <View key={index}>
          <RecapTraining
            modal_type="Trophies"
            typeTrophie={item.trophy.name}
            DataNow={DateNow.getTime()}
            Data={new Date(item.updated_at).getTime()}
            city={item.city ? item.city : 1}
            // avatar={this.props.avatar}
            changeScreen={this.changeScreen}
            dispatch={this.props.dispatch}
          />
        </View>
      );
    } else if (item.activity_minutes) {
      // feed relativo all'attività effettuata al giorno
      return (
        <View key={index}>
          <RecapTraining
            modal_type="DailyActivities"
            activity_minutes={item.activity_minutes}
            points={item.points}
            activity_day={item.activity_day}
            DataNow={DateNow.getTime()}
            Data={new Date(item.updated_at).getTime()}
            // Data={new Date(item.activity_day).getTime()}
            // avatar={this.props.avatar}
            changeScreen={this.changeScreen}
            dispatch={this.props.dispatch}
          />
        </View>
      );
    } else {
      // tratte dall'online
      if (item.end_time) {
        // if (typeof item.modal_type != "object" && item.points > 0)
        if (typeof item.modal_type != "object") {
          const typeModality = getModalType(item.modal_type);
          return (
            <View key={index}>
              <RecapActivity
                modal_type={typeModality}
                time_travelled_second={item.time_travelled}
                totPoints={item.points}
                validated={item.validated}
                distance_travelled={item.distance_travelled}
                time_travelled={item.time_travelled}
                referred_route_id={item.referred_route_id}
                referred_route={
                  item.referred_route
                    ? item.referred_route
                    : { referred_most_freq_route: null }
                }
                calories={item.calories}
                DataNow={DateNow}
                Data={new Date(item.end_time).getTime()}
                dispatch={this.props.dispatch}
                //route={item.route.coordinates}
                //firstLat={item.route.coordinates[0][1]}
                //firstLon={item.route.coordinates[0][0]}
                fromDb={true}
              />
            </View>
          );
        } else if (item.modal_type) {
          const typeModality = "Multiple";
          return (
            <View key={index}>
              <RecapActivity
                modal_type={typeModality}
                modal_type_array={item.modal_type}
                time_travelled_second={item.time_travelled}
                totPoints={item.points}
                validated={item.validated}
                distance_travelled={item.distance_travelled}
                time_travelled={item.time_travelled}
                referred_route_id={item.referred_route_id}
                referred_route={
                  item.referred_route
                    ? item.referred_route
                    : { referred_most_freq_route: null }
                }
                calories={item.calories}
                DataNow={DateNow}
                Data={new Date(item.end_time).getTime()}
                dispatch={this.props.dispatch}
                //route={item.route}
                //firstLat={item.route[0].coordinates[0][1]}
                //firstLon={item.route[0].coordinates[0][0]}
                fromDb={true}
              />
            </View>
          );
        }
      } else {
        if (typeof item.activityChoice.type !== "Multiple") {
          return (
            <View key={index}>
              <RecapActivity
                modal_type={item.activityChoice.type}
                totPoints={item.totPoints}
                validated={item.validated}
                DataNow={DateNow}
                Data={item.dateEnd}
                fromDb={false}
                id={item.id}
                AllRoute={this.props.AllRoute}
                dispatch={this.props.dispatch}
              />
            </View>
          );
        } else if (typeof item.activityChoice.type === "Multiple") {
          const typeModality = "Multiple";
          // console.log("recap multiplo");
          // console.log(item);
          return (
            <View key={index}>
              <RecapActivity
                modal_type={typeModality}
                totPoints={item.totPoints}
                validated={item.validated}
                DataNow={DateNow}
                Data={item.dateEnd}
                fromDb={false}
                id={item.id}
                AllRoute={this.props.AllRoute}
                dispatch={this.props.dispatch}
              />
            </View>
          );
        }
      }
    }
  };

  // map degli eventi completati dell'ultima sessione attiva
  listStartEvents = () => {
    return (
      <View>
        <RecapTraining
          modal_type="Muv"
          changeScreen={this.changeScreen}
          dispatch={this.props.dispatch}
        />

        {/* <RecapTraining
          modal_type="Trainings"
          changeScreen={this.changeScreen}
          dispatch={this.props.dispatch}
        />
        <RecapTraining
          modal_type="WeeklyChallenge"
          changeScreen={this.changeScreen}
          dispatch={this.props.dispatch}
        /> */}
        <RecapTraining
          modal_type="firstFrequentTrip"
          changeScreen={this.changeScreen}
          dispatch={this.props.dispatch}
          avatar={this.props.avatar}
        />
      </View>
    );
  };

  // per i quiz o survey, spunta solo quanto è attivo ovvero ho fatto tutti gli eventi tranne il quiz
  quizFeed = () => {
    if (this.props.enableQuiz.length) {
      // quiz o survey
      return (
        <RecapTraining
          modal_type={this.props.enableQuiz}
          changeScreen={this.changeScreen}
        />
      );
    }
  };

  // quando scendo tutte le route, ne carico altre 10
  onScrollEndDrag = event => {
    // console.log("scroll");
    // // console.log(this.props.allFeedOrder.length);

    if (this.isCloseToBottom(event.nativeEvent)) {
      this.setState({ endScrollRefresh: true });
      this.props.dispatch(
        GetListRoute({
          numberRoute: this.props.feed.length + 2,
          afterRequest: this.stopLoadingEnd
        })
      );
    }
  };

  stopLoadingEnd = () => {
    this.setState({ endScrollRefresh: false });
  };

  componentDidMount() {}

  componentWillReceiveProps(props) {
    // if (props.status !== "Get route") {
    //   this.setState({ refreshing: false });
    // }
  }

  testSVG2 = () => {
    return (
      <Svg height={100} width={200} viewBox="0 0 100 100">
        <Circle cx="50" cy="50" r="25" fill="white" />
        <ImageSvg
          x="30"
          y="30"
          width="40"
          height="40"
          preserveAspectRatio="xMidYMid slice"
          opacity="1"
          href={require("../../assets/images/bus_icn.png")}
          clipPath="url(#clip)"
        />
        <Rect
          x="70"
          y="35"
          width="60"
          height="30"
          fill="white"
          strokeLinejoin="round"
          strokeLinecap="round"
          stroke="blue"
          strokeWidth="2.5"
        />
        <TextSvg x="70" y="50" fontWeight="bold" fontSize="12" fill="blue">
          HOGWARTS
        </TextSvg>
      </Svg>
    );
  };

  testSVG = () => {
    return (
      <View>
        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,

              backgroundColor: "white"
            }}
          >
            <Image
              style={{
                width: 40,
                height: 40,
                position: "relative",

                right: -5,
                top: 5
              }}
              source={require("../../assets/images/bus_icn.png")}
            />
          </View>
          <View
            style={{
              // width: 100,
              height: 30,
              position: "relative",
              top: 10,
              right: 5,

              borderTopRightRadius: 5,
              borderBottomRightRadius: 5,

              backgroundColor: "white"
            }}
          >
            <View
              style={{
                justifyContent: "center",
                flexDirection: "column",
                alignContent: "center",
                alignSelf: "center",
                height: 30,
                marginRight: 10,
                marginLeft: 10
              }}
            >
              <Text
                style={{
                  color: "#3D3D3D",
                  textAlign: "center",
                  fontSize: 12,
                  fontFamily: "OpenSans-Regular"
                }}
              >
                LOCAL PUBLIC TRANSPORT
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  refreshRouteInProgress = null;
  waitRouteInProgress = null;

  checkRouteInProgress = () => {
    if (this.state.refreshing) {
      this.setState({ refreshing: true });
      if (!this.refreshRouteInProgress) {
        // console.log("ricontrollo le tratte");
        this.refreshRouteInProgress = setTimeout(
          () => {
            this.props.dispatch(resumeRoute());
            this.refreshRouteInProgress = false;
            this.setState({ refreshing: false });
          },
          Platform.OS === "android" ? 2000 : 2000
        );
      } else if (!this.waitRouteInProgress) {
        waitRouteInProgress = setTimeout(
          () => {
            this.refreshRouteInProgress = null;
            this.waitRouteInProgress = null;
            this.props.dispatch(this.checkRouteInProgress());
            this.setState({ refreshing: false });
          },
          Platform.OS === "android" ? 2000 : 2000
        );
      } else if (this.waitRouteInProgress && this.refreshRouteInProgress) {
        waitRouteInProgress = setTimeout(
          () => {
            this.refreshRouteInProgress = null;
            this.waitRouteInProgress = null;
            this.props.dispatch(this.checkRouteInProgress());
            this.setState({ refreshing: false });
          },
          Platform.OS === "android" ? 2000 : 2000
        );
      }
    } else {
      this.refreshRouteInProgress = setTimeout(
        () => {
          this.setState({ refreshing: false });
        },
        Platform.OS === "android" ? 1500 : 1500
      );
    }
  };

  _onRefresh() {
    if (!this.state.refreshing) {
      this.setState({ refreshing: true });

      this.props.dispatch(getUserLevel());

      this.props.dispatch(ResetPreviousRoute());

      this.props.dispatch(GetListRoute());

      setTimeout(
        () => {
          this.props.dispatch(getRole());
        },
        Platform.OS === "android" ? 1000 : 0
      );

      setTimeout(
        () => {
          this.props.dispatch(putEventOfflineFor());
        },
        Platform.OS === "android" ? 1250 : 0
      );

      setTimeout(
        () => {
          this.props.dispatch(getProfile());
        },
        Platform.OS === "android" ? 2000 : 0
      );

      setTimeout(() => {
        // console.log("check");
        this.props.dispatch(resumeRoute());
        this.setState({ refreshing: false });
      }, 2000);

      // this.props.dispatch(stop());
      // poi route
      AfterRefresh = setTimeout(
        () => {
          // console.log("2 secondi ");
          this.props.dispatch(getMostFrequentRoute());
        },
        Platform.OS === "android" ? 5000 : 0
      );

      // poi classifica

      AfterRoute = setTimeout(
        () => {
          this.props.dispatch(getSpecificPosition());
        },
        Platform.OS === "android" ? 6000 : 0
      );

      // poi statistiche

      AfterLeader = setTimeout(
        () => {
          this.props.dispatch(getStats());
        },
        Platform.OS === "android" ? 7000 : 0
      );

      setTimeout(
        () => {
          this.props.dispatch(getTrophies());
        },
        Platform.OS === "android" ? 8000 : 0
      );

      setTimeout(
        () => {
          this.props.dispatch(getFollowersUser());
        },
        Platform.OS === "android" ? 9000 : 1000
      );

      setTimeout(
        () => {
          this.props.dispatch(getSpecialTrainingSessions());
        },
        Platform.OS === "android" ? 6500 : 1200
      );

      setTimeout(
        () => {
          this.props.dispatch(getSpecialTrainingSessionSubscribed());
        },
        Platform.OS === "android" ? 7000 : 1700
      );
    }
  }

  isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 25;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  changeScreen = screen => {
    // if (screen === "trophies" || screen === "stats") {
    //   this.props.dispatch(changeScreenStatistics(screen));
    // } else if (screen === "trainings" || screen === "myself") {
    //   this.props.dispatch(changeScreenProfile(screen));
    // } else if (screen === "friends") {
    //   this.props.dispatch(changeScreenProfile(screen));
    //   this.props.dispatch(setFriendSelected("FOLLOWERS"));
    // } else if (screen === "feedback") {
    //   // this.props.dispatch(addOpenPeriodicFeed(3));
    //   // this.props.dispatch(addCompletePeriodicFeed(3));
    // }
    if (screen === "friends") {
      this.props.dispatch(setFriendSelected("FOLLOWERS"));
    }
  };

  endScroll = endScrollRefresh => {
    return (
      <View>
        {endScrollRefresh ? (
          <ActivityIndicator
            style={{
              alignContent: "center",
              flex: 1,
              paddingTop: 10,

              alignItems: "center",
              alignSelf: "center"
            }}
            size="large"
            color="#3D3D3D"
          />
        ) : (
          <View />
        )}
        <View
          style={{
            height: Dimensions.get("window").height / 10
          }}
        />
        {
          // aggiungo delo spazio in meno dato che il padding lo aggiunto prima su android e quindi qua non lo aggiungo
        }
        <View style={{ height: Dimensions.get("window").height * 0.23 }} />
      </View>
    );
  };

  // aggiungono delle view finali in modo tale che la lista sia visibile tutta anche se c'e la notifica

  // this.props.allFeedOrder.length > 1 perche c'è sempre una scheda periodica quindi ci devono essere almeno due feed ovvero una periodica e una tratta
  render() {
    const DateNow = new Date();
    // console.log("lista");

    // const dataList = [
    //   { baseHeader: true },
    //   ...this.props.PreviousRouteNotValidate,
    //   ...this.props.PreviousRoute,
    //   { enableQuiz: this.props.enableQuiz, Quiz: true },
    //   ...this.props.allFeedOrder
    // ];

    return (
      <FlatList
        style={{
          height: Dimensions.get("window").height - 100,
          width: Dimensions.get("window").width,
          position: "absolute"
        }}
        showsVerticalScrollIndicator={false}
        onScroll={this.props.onScrollBlur}
        onScrollEndDrag={this.onScrollEndDrag}
        scrollEventThrottle={400}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }
        data={this.props.feed}
        extraData={this.state}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => {
          if (index === 0) {
            return this.infoCityTournamentPadding();
            return <View />;
          } else if (this.props.feed.length === index + 1) {
            return (
              <View>
                {this.feedOrdedAll(item, index, DateNow)}
                {this.listStartEvents()}
                {this.endScroll(this.state.endScrollRefresh)}
              </View>
            );
          } else {
            return this.feedOrdedAll(item, index, DateNow);
          }
        }}
      />
    );
  }
}

const styles = {
  Container: {
    height: Dimensions.get("window").height * 0.23,
    width: Dimensions.get("window").width,
    flexDirection: "column",
    justifyContent: "space-around"
  },
  centerContainer: {
    alignItems: "center",
    height: Dimensions.get("window").height * 0.1,
    justifyContent: "center"
  },
  ThreeContainer: {
    flex: 3,
    height: Dimensions.get("window").height * 0.13,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center"
  },
  circle: {
    width: 16,
    height: 16,
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 15
  },
  leftContainer: {
    width: Dimensions.get("window").width * 0.35,
    height: Dimensions.get("window").height * 0.23,
    backgroundColor: "transparent",
    position: "absolute",
    left: Dimensions.get("window").width * 0.65,
    justifyContent: "center",
    alignItems: "flex-start"
  },
  line: {
    width: "100%",
    height: 2,
    backgroundColor: "#fff",
    marginTop: 45
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  button: {
    backgroundColor: "#a1a1a1"
  },
  listItem: {
    borderBottomWidth: 2,
    borderBottomColor: "#ddd",
    padding: 20
  },
  list: {
    marginBottom: 20
  },
  listTrainings: {
    marginBottom: 20
  }
};

const getPoints = state => state.statistics.statistics;

const getRoute = state => state.login.Route;

const getAllPreviousRoute = state => state.tracking.PreviousRoute;

const getAllEvents = state => state.trainings.training_events;

const getAllSession = state => state.trainings.training_sessions;

const getLevel = state => state.trainings.level_number;

const getChange_level = state => state.trainings.change_level;

const getQuiz = state => state.trainings.quiz;

const getFollow = state => state.follow;

const getFollowState = createSelector(
  [getFollow],
  follow => (follow ? follow.follow : [])
);

const getFollowedState = createSelector(
  [getFollow],
  follow => (follow ? follow.follow : [])
);

const getFollowedGroup = createSelector(
  [getFollowedState],
  followed => {
    // suddivido i follow per giorno
    let feedGroup = [];

    for (indexFollowed = 0; indexFollowed < followed.length; indexFollowed++) {
      const elem = followed[indexFollowed];
      // console.log("singolo");
      // console.log(elem);
      let singleFeedGroup = elem;
      singleFeedGroup.numFollowed = 1;

      for (
        indexFollowed2 = indexFollowed + 1;
        indexFollowed2 < followed.length;
        indexFollowed2++
      ) {
        const elem2 = followed[indexFollowed2];
        // console.log("singolo successivo");
        // console.log(elem2);
        const date = new Date(elem.updated_at);
        const day = date.toDateString();
        const date2 = new Date(elem2.updated_at);
        const day2 = date2.toDateString();
        if (day === day2) {
          singleFeedGroup.numFollowed = singleFeedGroup.numFollowed
            ? singleFeedGroup.numFollowed + 1
            : 1;

          indexFollowed++;
          continue;
        } else {
          break;
        }
      }
      feedGroup = [...feedGroup, singleFeedGroup];
    }
    // console.log("gruppo");
    // console.log(feedGroup);
    return feedGroup;
  }
);

const getQuizComplete = state =>
  state.trainings.quizComplete ? state.trainings.quizComplete : [];

const getTypeQuiz = state => state.trainings.typeQuiz;

const getLengthPreviousRoute = state =>
  state.tracking.PreviousRoute.length
    ? state.tracking.PreviousRoute.reduce(
        (acc, item) => acc + item.route.length,
        0
      )
    : 0;

// trofei
const getTrophiesRedux = state => state.standings.trophies;

// prendo i trofei
const getTrophiesState = createSelector(
  [getTrophiesRedux],
  trophies => (trophies ? trophies : [])
);

// prendo livello se maggiore di 1
const getLevelState = createSelector(
  [getLevel, getChange_level],
  (level_number, change_level) =>
    level_number > 1 ? [{ level: level_number, updated_at: change_level }] : []
);
// prendo solo quei quiz in cui ho risposto
// ? per il momento da togliere appena uniformo i dati
const getQuizCompleteState = createSelector(
  [getQuizComplete],
  quizComplete =>
    quizComplete.filter(elem =>
      elem.answer_chosen_id ? elem.answer_chosen_id.length : true
    )
);

// prendo gli eventi completati
const getCompleteEvents = createSelector(
  [getAllEvents],
  training_events => {
    /* training_events.filter(
      item =>
        item.status &&
        item.event.text_description !== "Answer a quick quiz" &&
        item.event.text_description !==
          "Answer a quick survey about your mobility habits"
    ) */

    // return training_sessions.filter(item => item.status === 3);
    let idEvents = [];
    return training_events.reduce((total, item) => {
      if (
        item.status &&
        item.event.text_description !== "Answer a quick quiz" &&
        item.event.text_description !==
          "Answer a quick survey about your mobility habits" &&
        idEvents.indexOf(item.event.id) === -1
      ) {
        idEvents = [...idEvents, item.event.id];
        return [...total, item];
      } else {
        // se si ripete non lo salvo
        return total;
      }
    }, []);
  }
);

const userTypeformObj = state => {
  return {
    email: state.login.username,
    typeform_user: state.login.typeform_user
  };
};

const newSTObj = state => state.trainings.special_training_sessions;
const profileDataObj = state => state.login.infoProfile;
const specialTraining = state => state.trainings.special_training_sessions;

const getNewSTFeedPush = createSelector(
  [newSTObj, profileDataObj],
  (newST, profileData) => {
    let new_st = [];
    const Now = new Date();
    if (newST && newST.length) {
      // // console.log(state.trainings.special_training_sessions);
      // // mi prendo solo gli special trainings attivi
      console.log("profileData");
      console.log(profileData);

      newST.forEach(e => {
        if (
          e.special_training &&
          Now <= new Date(e.special_training.end_special_training)
        ) {
          if (e.community_id == null)
            new_st.push({
              text_description: e.text_description,
              ...e.special_training
            });
          else {
            if (profileData.community != null && profileData.community != {}) {
              if (profileData.community.id == e.community_id) {
                new_st.push({
                  text_description: e.text_description,
                  ...e.special_training
                });
              }
            }
          }
        }
      });
    }

    return new_st;
  }
);

const completedSTObj = state =>
  state.trainings.completed_st_pivots
    ? state.trainings.completed_st_pivots
    : [];

const subscribedSTObj = state =>
  state.trainings.subscribed_special_training
    ? state.trainings.subscribed_special_training
    : [];

const frequentTrips = state => state.login.mostFrequentRoute;
// se ho meno di 3 frequent trips ti dico di aggiungerne una
const frequentTripsState = createSelector(
  [frequentTrips],
  route => (route ? (route.length < 3 ? 1 : 0) : 0)
);

const infoProfile = state => state.login.infoProfile;

const getCityState = createSelector(
  [infoProfile],
  infoProfile =>
    infoProfile.city
      ? infoProfile.city.city_name
        ? infoProfile.city.city_name
        : "City"
      : "City"
);

const getinfoProfileState = createSelector(
  [infoProfile],
  info => {
    if (info) {
      // controllo i vari dati di info e vedo se manca qualche dato
      if (!info.birthdate) {
        return 1;
      } else if (!info.height) {
        return 1;
      } else if (!info.weight) {
        return 1;
      } else if (!info.gender) {
        return 1;
      } else if (!info.first_name.length) {
        return 1;
      } else if (!info.last_name.length) {
        return 1;
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  }
);

// funzione random con un seme cosi con un valore restituisce sempre un valore
export function alea(seed) {
  if (seed === undefined) {
    seed = +new Date() + Math.random();
  }
  function Mash() {
    var n = 4022871197;
    return function(r) {
      for (var t, s, u = 0, e = 0.02519603282416938; u < r.length; u++)
        (s = r.charCodeAt(u)),
          (f = e * (n += s) - ((n * e) | 0)),
          (n = 4294967296 * ((t = f * ((e * n) | 0)) - (t | 0)) + (t | 0));
      return (n | 0) * 2.3283064365386963e-10;
    };
  }
  return (function() {
    var m = Mash(),
      a = m(" "),
      b = m(" "),
      c = m(" "),
      x = 1,
      y;
    (seed = seed.toString()), (a -= m(seed)), (b -= m(seed)), (c -= m(seed));
    a < 0 && a++, b < 0 && b++, c < 0 && c++;
    return function() {
      var y = x * 2.3283064365386963e-10 + a * 2091639;
      (a = b), (b = c);
      return (c = y - (x = y | 0));
    };
  })();
}

const getPeriodicFeed = state =>
  state.login.periodicFeed ? state.login.periodicFeed : {};

// le vari feed peridioci che possono esserci
const getPeriodicFeed0 = state =>
  state.login.periodicFeed
    ? state.login.periodicFeed[0]
    : { open: "", completed: "" };
const getPeriodicFeed1 = state =>
  state.login.periodicFeed
    ? state.login.periodicFeed[1]
    : { open: "", completed: "" };
const getPeriodicFeed2 = state =>
  state.login.periodicFeed
    ? state.login.periodicFeed[2]
    : { open: "", completed: "" };
const getPeriodicFeed3 = state =>
  state.login.periodicFeed
    ? state.login.periodicFeed[3]
    : { open: "", completed: "" };
const getPeriodicFeed4 = state =>
  state.login.periodicFeed
    ? state.login.periodicFeed[4]
    : { open: "", completed: "" };

const getPeriodicFeedState = createSelector(
  getPeriodicFeed,
  items => items
);

const getPeriodicOpenFeedState = createSelector(
  [
    getPeriodicFeed0,
    getPeriodicFeed1,
    getPeriodicFeed2,
    getPeriodicFeed3,
    getPeriodicFeed4
  ],
  (item0, item1, item2, item3, item4) => {
    const open0 = item0.open;
    const open1 = item1.open;
    const open2 = item2.open;
    const open3 = item3.open;
    const open4 = item4.open;

    return {
      open0,
      open1,
      open2,
      open3,
      open4
    };
  }
);

const getPeriodicCompletedFeedState = createSelector(
  [
    getPeriodicFeed0,
    getPeriodicFeed1,
    getPeriodicFeed2,
    getPeriodicFeed3,
    getPeriodicFeed4
  ],
  (item0, item1, item2, item3, item4) => {
    const completed0 = item0.completed;
    const completed1 = item1.completed;
    const completed2 = item2.completed;
    const completed3 = item3.completed;
    const completed4 = item4.completed;

    return {
      completed0,
      completed1,
      completed2,
      completed3,
      completed4
    };
  }
);

const getCheckTypeformFeed = createSelector(
  userTypeformObj,
  userTypeform => {
    let languageSet = "";
    if (Platform.OS == "ios") {
      languageSet = NativeModules.SettingsManager.settings.AppleLocale;
      if (languageSet === undefined) {
        // iOS 13 workaround, take first of AppleLanguages array  ["en", "en-NZ"]
        languageSet = NativeModules.SettingsManager.settings.AppleLanguages[0];
        if (languageSet == undefined) {
          languageSet = "en"; // default language
        }
      }
    } else languageSet = NativeModules.I18nManager.localeIdentifier;

    languageSet = languageSet.substr(0, 2);

    if (
      languageSet == "it" ||
      languageSet == "en" ||
      languageSet == "es" ||
      languageSet == "ct"
    ) {
      if (!userTypeform.typeform_user) {
        return {
          8: { open: "", completed: "" }
        };
      } else {
        // non ritorno nulla dato che non c'e il feed da visualizzare
        return {};
      }
    } else {
      // non ritorno nulla dato che non c'e il feed da visualizzare
      return {};
    }
  }
);

const getUpdateProfileState = createSelector(
  [getCityState, getPeriodicFeedState],
  (city, feedUpdateObject) => {
    const now = new Date();

    // data di riferimento per il calcolo di quanti giorni sono passati
    const baseDay = new Date("12/6/2018").getTime();
    const day = now.getTime();
    const differenceDay = parseInt((day - baseDay) / 86400000);
    // console.log(differenceDay);

    // numero di giorni in cui la notifica non spunta e poi viene resettata
    const dayNotUpdateFeed = 2;
    // const dayNotUpdateFeed = 0;
    const activeFeed = differenceDay % (dayNotUpdateFeed + 1);
    console.log("feed attivo o no");
    console.log(activeFeed);
    // se è
    if (activeFeed === 0) {
      // aggiungo i possibili feed
      const feedUpdateAll = Object.values({
        0: { open: "", completed: "" },
        1: { open: "", completed: "" },
        2: { open: "", completed: "" },
        3: { open: "", completed: "" },
        4: { open: "", completed: "" },
        5: { open: "", completed: "" },
        6: { open: "", completed: "" },
        7: { open: "", completed: "" },
        8: { open: "", completed: "" },
        ...feedUpdateObject
      });
      // quelli aperti
      const feedUpdate = feedUpdateAll.map(feed => feed.open);
      // quelli completati
      const feedUpdateCompleted = feedUpdateAll.map(feed => feed.completed);
      // console.log("from object to array");
      // console.log(feedUpdate);
      // console.log(feedUpdateCompleted);

      // se uguale a 0 allora è il giorno in cui deve spuntare
      // setto una funzione random con il seme il numero di giorni cosi nel giorno corrente da sempre lo stesso valore random
      const randomFunc = alea(differenceDay);
      const random = randomFunc();
      // console.log("valore random per i feed ");
      // console.log(random);
      // quali feed ho ancora disponibili
      const day = now.toDateString();
      let indexTypeFeed = [];

      for (indexFeed = 0; indexFeed < feedUpdate.length; indexFeed++) {
        // se non l'ho mai completato
        if (feedUpdateCompleted[indexFeed] === "") {
          // mai aperto allora lo considero
          if (feedUpdate[indexFeed] === "") {
            // non c'e la data quindi lo devo fare ancora
            indexTypeFeed = [...indexTypeFeed, indexFeed];
          } else if (feedUpdate[indexFeed] === day) {
            // ho la data di oggi quindi ho finito per oggi
            indexTypeFeed = [...indexTypeFeed, indexFeed];

            // // console.log("feed periodico completato");
            // // per averne uno al giorno
            // return {
            //   type: "nothing",
            //   updated_at: now.setHours(8)
            // };
          } else {
            // prendo i millisecondi di quando il feed è stato aperto e la data corrente
            // se sono passati almeno 7 giorni allora devo riconsiderare
            const millisecondFeed = new Date(feedUpdate[indexFeed]).getTime();
            const millisecondNow = now.getTime();
            // console.log(millisecondFeed);
            // console.log(millisecondNow);
            if (millisecondNow > millisecondFeed + 604800000) {
              indexTypeFeed = [...indexTypeFeed, indexFeed];
            }
          }
        } else if (feedUpdateCompleted[indexFeed] !== "") {
          // completato quindi non lo considero tra i feed da considerare
          // oppure per alcuni dovrebbe passare molto tempo tipo 3 mesi
          // se è il giorno corrente allora non considero altri feed per oggi

          if (feedUpdateCompleted[indexFeed] === day) {
            indexTypeFeed = [...indexTypeFeed, indexFeed];

            // return {
            //   type: "nothing",
            //   updated_at: now.setHours(8)
            // };
          }

          // si è deciso che anche se è stato completato rimane per quel giorno nel feed
        } else {
          // niente quindi è una tipologia gia finita
        }
      }

      // vedo i feed disponibili
      // console.log(indexTypeFeed);
      const indexLength = indexTypeFeed.length;
      // console.log(indexLength);
      // console.log("feed periodico");
      // ce ci sono feed disponibili
      if (indexLength) {
        // usando il numero random vedo quale tra i feed disponibili posso prendere
        const chosenIndexFeed = parseInt(random * indexTypeFeed.length);
        // const chosenTypeFeed = 2;
        // prendo l'indice corrispodente
        console.log(indexTypeFeed);
        const chosenTypeFeed = indexTypeFeed[chosenIndexFeed];
        console.log(chosenTypeFeed);

        const dateFeedPeriodic = now.getHours() >= 8 ? now.setHours(8) : now;

        if (chosenTypeFeed === 0) {
          return {
            type: "updateProfile",
            updated_at: dateFeedPeriodic
          };
        } else if (chosenTypeFeed === 1) {
          return {
            type: "addFrequentTrips",
            updated_at: dateFeedPeriodic
          };
        } else if (chosenTypeFeed === 2) {
          return {
            type: "mobilityHabits",
            updated_at: dateFeedPeriodic,
            city: city
          };
        } else if (chosenTypeFeed === 3) {
          return {
            type: "feedback",
            updated_at: dateFeedPeriodic
          };
        } else if (chosenTypeFeed === 4) {
          return {
            type: "rememberLevel",
            updated_at: dateFeedPeriodic
          };
        } else if (chosenTypeFeed === 5) {
          return {
            type: "inviteFriend",
            updated_at: dateFeedPeriodic
          };
        } else if (chosenTypeFeed === 6) {
          return {
            type: "facebookLike",
            updated_at: dateFeedPeriodic
          };
        } else if (chosenTypeFeed === 7) {
          return {
            type: "instagramLike",
            updated_at: dateFeedPeriodic
          };
        } else if (chosenTypeFeed === 8) {
          return {
            type: "typeform",
            updated_at: dateFeedPeriodic
          };
        } else {
          return {
            type: "nothing",
            updated_at: dateFeedPeriodic
          };
        }
      } else {
        return {
          type: "nothing",
          updated_at: now.setHours(8)
        };
      }
    } else {
      return {
        type: "nothing",
        updated_at: now.setHours(8)
      };
    }
  }
);

const getCompleteSession = createSelector(
  [getAllSession],
  training_sessions => {
    // return training_sessions.filter(item => item.status === 3);
    let idSession = [];
    return training_sessions.reduce((total, item) => {
      if (
        item.status === 3 &&
        idSession.indexOf(item.trainingSessionId) === -1
      ) {
        idSession = [...idSession, item.trainingSessionId];
        return [...total, item];
      } else {
        // se si ripete non lo salvo
        return total;
      }
    }, []);
  }
);

const getPreviousRouteNotSaveState = createSelector(
  [getAllPreviousRoute],
  PreviousRoute => PreviousRoute.filter(item => !item.Saved)
);

const getLengthPreviousRouteState = createSelector(
  [getLengthPreviousRoute],
  length => length
);

const ChangeRouteState = createSelector(
  [getLengthPreviousRouteState, getAllPreviousRoute],
  (_, PreviousRoute) => PreviousRoute.filter(item => !item.Saved)
);

const getPreviousRoute = createSelector(
  [ChangeRouteState],
  PreviousRoute => PreviousRoute.filter(item => item.modal_type)
);

const getPreviousRouteValiding = createSelector(
  [ChangeRouteState],
  PreviousRoute => PreviousRoute.filter(item => !item.modal_type)
);

const getPreviousRouteNotValidateState = createSelector(
  [getAllPreviousRoute],
  PreviousRoute =>
    PreviousRoute.reduce((acc, item) => acc + item.route.length, 0)
);

const getRouteState = createSelector(
  [getRoute],
  // Route => Route.filter(item => item.points)
  // Route => Route.filter(item => item.validated == true)
  Route => {
    // return Route;
    // controllo se end_time per vedere se ci sono tratte multiple
    let end_time = [];
    return Route.reduce((total, item) => {
      if (end_time.indexOf(item.end_time) === -1) {
        end_time = [...end_time, item.end_time];
        return [...total, item];
      } else {
        // se si ripete non lo salvo
        return total;
      }
    }, []);
  }
);

const getNewSTFeed = createSelector(
  getNewSTFeedPush,
  newST => {
    return newST.map(e => {
      return {
        type: "new_st",
        ...e,
        updated_at: e.start_special_training
          ? e.start_special_training
          : new Date()
      };
    });
  }
);

const getSoddFrustTypeform = state => state.login.typeform_soddfrust_2;

const getSoddFrustFeed = createSelector(
  getSoddFrustTypeform,
  soddFrustTypeform => {
    if (soddFrustTypeform == 0)
      return {
        type: "typeform_2",
        updated_at: new Date()
      };
    else
      return {
        type: "nothing",
        updated_at: new Date()
      };
  }
);

const getCompletedSTFeed = createSelector(
  [completedSTObj, newSTObj, subscribedSTObj],
  (completedST, newST, subscribedST) => {
    // if (state.trainings.completed_st_pivots.length > 0) {
    //   return state.trainings.completed_st_pivots;
    // } else return [];

    return completedST.map(e => {
      let st = newST.filter(el => {
        return el.special_training;
      });

      let id_st = st.filter(el => {
        return el.text_description == e.text_description;
      })[0].special_training.id;

      let id_reward = subscribedST.filter(el => {
        return el.training_title == e.text_description;
      })[0].reward_id;

      return {
        type: "completed_st",
        ...e,
        text_description: e.text_description,
        id: id_st,
        id_reward
      };
    });
  }
);

const getTypeformFeed = createSelector(
  userTypeformObj,
  userTypeform => {
    // console.log("check typeform");
    let random_n = Math.random() * 100;
    // if (random_n > 0 && random_n < 10) {
    // if (Tester.includes(userTypeform.email)) {
    // if (false) {

    // const languageSet = getLanguageI18n();
    let languageSet = "";
    if (Platform.OS == "ios") {
      languageSet = NativeModules.SettingsManager.settings.AppleLocale;
      if (languageSet === undefined) {
        // iOS 13 workaround, take first of AppleLanguages array  ["en", "en-NZ"]
        languageSet = NativeModules.SettingsManager.settings.AppleLanguages[0];
        if (languageSet == undefined) {
          languageSet = "en"; // default language
        }
      }
    } else languageSet = NativeModules.I18nManager.localeIdentifier;

    languageSet = languageSet.substr(0, 2);

    // if (new Date().getDay() == 1)
    if (new Date().getDay() >= 1 && new Date().getDay() <= 3)
      if (
        languageSet == "it" ||
        languageSet == "en" ||
        languageSet == "es" ||
        languageSet == "ct"
      )
        if (!userTypeform.typeform_user)
          return {
            type: "typeform",
            updated_at: new Date()
          };
        else
          return {
            type: "nothing",
            updated_at: new Date()
          };
      else
        return {
          type: "nothing",
          updated_at: new Date()
        };
    else
      return {
        type: "nothing",
        updated_at: new Date()
      };
    // } else {
    //   return {
    //     type: "nothing",
    //     updated_at: new Date()
    //   };
    // }
    // }
  }
);

// getUpdateProfileState Profile Profile

const getAllFeedOrder = createSelector(
  [
    getRouteState,
    getCompleteEvents,
    getCompleteSession,
    getLevelState,
    getQuizCompleteState,
    getTrophiesState,
    getUpdateProfileState,
    getFollowedGroup,
    getNewSTFeed,
    getCompletedSTFeed,
    getWeekActivitiesState
    // getSoddFrustFeed
  ],

  (
    Route,
    Events,
    Session,
    Level,
    Quiz,
    Trophies,
    Profile,
    Followed,
    NewST,
    CompletedST,
    WeekActivities
    // soddFrustFeed
  ) => {
    return [
      ...Route,
      ...Events,
      ...Session,
      ...Level,
      ...Quiz,
      ...Trophies,
      Profile,
      ...Followed,
      ...NewST,
      ...CompletedST,
      ...WeekActivities
      // soddFrustFeed
    ].sort(compare);
  }
);

function compare(a, b) {
  if (new Date(a.end_time).getTime() < new Date(b.end_time).getTime()) return 1;
  else if (new Date(a.end_time).getTime() > new Date(b.end_time).getTime())
    return -1;
  else if (new Date(a.end_time).getTime() < new Date(b.updated_at).getTime())
    return 1;
  else if (new Date(a.end_time).getTime() > new Date(b.updated_at).getTime())
    return -1;
  else if (new Date(a.updated_at).getTime() < new Date(b.end_time).getTime())
    return 1;
  else if (new Date(a.updated_at).getTime() > new Date(b.end_time).getTime())
    return -1;
  else if (new Date(a.updated_at).getTime() < new Date(b.updated_at).getTime())
    return 1;
  else if (new Date(a.updated_at).getTime() > new Date(b.updated_at).getTime())
    return -1;
  return 0;
}

const RouteEndState = createSelector(
  [getRouteState],
  RouteBackend => RouteBackend.map(elem => new Date(elem.end_time).getTime())
);

const getTrainings = state => state.trainings;

const getTrainingsState = createSelector(
  [getTrainings],
  trainings => trainings
);

const getQuizState = createSelector(
  [getQuiz],
  Quiz => Quiz
);
const getQuizTypeState = createSelector(
  [getTypeQuiz, getTrainingsState],
  (TypeQuiz, trainings) =>
    trainings.training_events.filter(elem =>
      elem.event.quiz || elem.event.survey ? !elem.status : 0
    ).length
      ? TypeQuiz
      : ""
);

const getPreviousRouteAllState = createSelector(
  [getPreviousRoute, RouteEndState],
  (PreviousRoute, RouteBackend) => {
    return PreviousRoute.filter(
      item => !RouteBackend.includes(item.route[0].key)
    );
  }
);

const getPreviousRouteState = createSelector(
  [getPreviousRouteAllState],
  PreviousRouteReverse => {
    // console.log("controllo validi");

    let PreviousRoutePack = [];
    // console.log(PreviousRouteReverse);

    for (i = PreviousRouteReverse.length - 1; i >= 0; i--) {
      // console.log(i);
      if (!PreviousRouteReverse[i].isSegment) {
        let PreviousRouteMultiple = {
          id: [i],

          activityChoice: PreviousRouteReverse[i].activityChoice,
          dateEnd:
            PreviousRouteReverse[i].route[
              PreviousRouteReverse[i].route.length - 1
            ].key,

          totPoints: Number.parseFloat(PreviousRouteReverse[i].totPoints),
          validated: PreviousRouteReverse[i].validated
            ? PreviousRouteReverse[i].validated
            : false
        };

        let pointValidation = PreviousRouteReverse[i].totPoints;

        // eventuali altri segment
        while (i > 0 && PreviousRouteReverse[i - 1].isSegment) {
          // console.log("tratte multiple");
          PreviousRouteMultiple = {
            dateEnd: PreviousRouteMultiple.dateEnd,
            activityChoice: { type: "Multiple" },
            id: [...PreviousRouteMultiple.id, i - 1],

            totPoints:
              PreviousRouteMultiple.totPoints +
              Number.parseFloat(PreviousRouteReverse[i - 1].totPoints),
            validated: PreviousRouteReverse[i - 1].validated
              ? PreviousRouteReverse[i - 1].validated
              : PreviousRouteMultiple.validated
          };

          pointValidation = pointValidation
            ? pointValidation
            : PreviousRouteReverse[i - 1].totPoints;

          i--;
        }
        // se la trace ha punti
        /* if (parseInt(pointValidation)) {
          PreviousRoutePack = [...PreviousRoutePack, PreviousRouteMultiple];
        } */
        PreviousRoutePack = [...PreviousRoutePack, PreviousRouteMultiple];
      }
    }
    return PreviousRoutePack;
  }
);

const getPointsState = createSelector(
  [getPoints],
  statistics =>
    statistics === []
      ? 0
      : statistics.reduce((total, elem, index, array) => {
          return total + elem.points;
        }, 0)
);

/* 
const getPreviousRouteNotValidateState2 = createSelector(
  [getPreviousRoute],
  PreviousRoute => PreviousRoute.filter(item => !item.Saved).reverse()
);

const getPreviousRouteNotValidateStateSingle = createSelector(
  [getPreviousRouteNotValidateState],
  PreviousRoute => {
    let PreviousRouteSingle = [];
    for (i = 0; i < PreviousRoute.length - 1; i++) {
      if (!PreviousRoute[i].isSegment && !PreviousRoute[i + 1].isSegment) {
        PreviousRouteSingle = [...PreviousRouteSingle, PreviousRoute[i]];
      }
    }
    if (!PreviousRoute[PreviousRoute.length - 1].isSegment) {
      PreviousRouteSingle = [
        ...PreviousRouteSingle,
        PreviousRoute[PreviousRoute.length - 1]
      ];
    }
  }
); 
*/

const getPreviousRouteNotValidateStateMultiple = createSelector(
  [ChangeRouteState],
  PreviousRoute => {
    let PreviousRouteReverse = PreviousRoute;
    let PreviousRoutePack = [];
    // console.log("controllo non validi");

    // console.log(PreviousRouteReverse);
    for (i = PreviousRouteReverse.length - 1; i >= 0; i--) {
      // console.log(i);

      if (!PreviousRouteReverse[i].isSegment) {
        // almeno uno deve essere in corso di validazione

        // controllo la fine se è stata validata ovvero tutte le altre sono state validate se l'ultima è valida
        let isValidation = PreviousRouteReverse[i].modal_type ? false : true;

        if (isValidation) {
          // se almeno una trace è in corso di validazione allora l'aggiungo
          let PreviousRouteMultiple = {
            status: PreviousRouteReverse[i].status,
            routeNum: PreviousRouteReverse[i].route.length,
            routeAnalyNum: PreviousRouteReverse[i].routeAnalyzed.length,
            activityChoice: PreviousRouteReverse[i].activityChoice,
            dateEnd:
              PreviousRouteReverse[i].route[
                PreviousRouteReverse[i].route.length - 1
              ].key
          };

          // eventuali altri segment
          while (i > 0 && PreviousRouteReverse[i - 1].isSegment) {
            // console.log("tratte multiple");

            PreviousRouteMultiple = {
              dateEnd: PreviousRouteMultiple.dateEnd,
              activityChoice: { type: "Multiple" },
              status:
                PreviousRouteMultiple.status !== ""
                  ? PreviousRouteReverse[i - 1].status
                  : PreviousRouteMultiple.status,
              routeNum:
                PreviousRouteMultiple.routeNum +
                PreviousRouteReverse[i - 1].route.length,

              routeAnalyNum:
                PreviousRouteMultiple.routeAnalyNum +
                PreviousRouteReverse[i - 1].routeAnalyzed.length
            };

            i--;
          }
          PreviousRoutePack = [...PreviousRoutePack, PreviousRouteMultiple];
        }
      }
    }
    return PreviousRoutePack;
  }
);

// da index a lingua
convertLanguagesLanguage = indexLang => {
  switch (indexLang) {
    case 0:
      return "en";
      break;
    case 1:
      return "nl";
      break;
    case 2:
      return "sv";
      break;
    case 3:
      return "es";
      break;
    case 4:
      return "it";
      break;
    case 5:
      return "ca";
      break;
    case 6:
      return "pt";
      break;
    case 7:
      return "br";
      break;
    default:
      return "en";
      break;
  }
};

// l'evento del quiz o del survey non deve completato mentre il resto si
// quindi tutti gli eventi 1 ma soltanto quiz e survey 0
// in logica negato quindi se tutti almeno uno ha la condizione opposta non abilito
const enableQuizState = createSelector(
  [getTrainingsState],
  trainings =>
    trainings.training_events.filter(elem =>
      elem.event.quiz || elem.event.survey ? elem.status : !elem.status
    ).length
      ? false
      : true
);

const getProfileLogin = state => state.login.infoProfile;

const getProfileState = createSelector(
  [getProfileLogin],
  profile => profile
);

const getInfoUserGlobalClassification = state =>
  state.standings.infoUserGlobalClassification;

const getInfoUserGlobalClassificationState = createSelector(
  [getInfoUserGlobalClassification],
  infoUserGlobalClassification => infoUserGlobalClassification
);

// const getSelectedTimingState = createSelector(
//   [getSelectedTiming],
//   selectedTiming => selectedTiming
// );

const getFeedState = createSelector(
  [
    getPreviousRouteNotValidateStateMultiple,
    getPreviousRouteState,
    enableQuizState,
    getQuizTypeState,
    getAllFeedOrder
    // getPermActivitiesState
  ],
  (
    PreviousRouteNotValidate,
    PreviousRoute,
    enableQuiz,
    typeQuiz,
    allFeedOrder
    // permHealth
  ) => [
    { baseHeader: true },
    ...PreviousRouteNotValidate,
    ...PreviousRoute,
    { enableQuiz: enableQuiz ? typeQuiz : "", Quiz: true },
    // { enableHealth: !permHealth, Health: true },
    ...allFeedOrder
  ]
);

const info = connect(state => {
  // prendo solo le tratte gia validate ovvero hanno la modalita specificata
  // reverse, ruoto l'array essendo che le route piu nuove sono alla fine, cosi nella home ho prima quelle piu nuove
  //  userState: state.login

  // const RouteEnd = RouteEndState(state);

  /* riuniti tutti in allfeedorder cosi posso ordinare
  loginRoutes: getRouteState(state),
    eventsComplete: getCompleteEvents(state),
    sessionsComplete: getCompleteSession(state), */

  // controllo se quelle salvate in memoria sia le stesse di quelle prese dal db, se cosi le escludo
  // in infoProfile metto anche eventuali dati dell'utente che ancora il db non ha aggiornato

  // const RouteRemain = getPreviousRouteState(state);

  return {
    infoUserGlobalClassification: getInfoUserGlobalClassificationState(state),
    // standing: state.standings.standing,
    selectedLeaderboard: getSelectedLeaderboardState(state),
    profileState: getProfileState(state),
    // selectedTiming: getSelectedTimingState(state),
    AllRoute: getAllPreviousRoute(state),
    // PreviousRoute: getPreviousRouteState(state),
    // PreviousRouteNotValidate: getPreviousRouteNotValidateStateMultiple(state),

    // allFeedOrder: getAllFeedOrder(state),
    feed: getFeedState(state)

    // quiz: getQuizState(state),
    // enableQuiz: enableQuizState(state) ? getQuizTypeState(state) : ""
    // enableQuiz: "quiz"
  };
});

export default info(ListRecapActivity);