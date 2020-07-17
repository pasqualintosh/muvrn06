import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  NativeModules,
  ScrollView,
  Animated,
  TouchableWithoutFeedback,
  ImageBackground,
  RefreshControl
} from "react-native";
import SessionContainer from "./../SessionContainer/SessionContainer";
import HorizontalSessionContainer from "./../SessionContainer/HorizontalSessionContainer";
import HorizontalSpecialTrainingSessionContainer from "./../SpecialTrainingSessionContainer/HorizontalSpecialTrainingSessionContainer";
import { connect } from "react-redux";
import {
  getUserLevel,
  getSpecialTrainingSessions,
  getSpecialTrainingSessionSubscribed
} from "./../../domains/trainings/ActionCreators";
import { getLevelEvents } from "./../../domains/screen/ActionCreators";
import OwnIcon from "../../components/OwnIcon/OwnIcon";
import DescriptionIcon from "../../components/DescriptionIcon/DescriptionIcon";
import { createSelector } from "reselect";

import { strings } from "../../config/i18n";
import { getBackground } from "../../components/SessionContainer/HorizontalSessionContainer";
import { Tester } from "./../../config/Tester";

class LevelContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sessions: null,
      sessions2: null,
      modalActive: false,
      iconChoose: "round_info_icn",
      textActual: "ACTIVE",
      there_are_st: false,
      loading_st: false,
      refreshing: false,
      SessionsCompletedFirstLevel: 0,
      SessionsCompletedSecondLevel: 0
    };
  }

  heightDetail1 = new Animated.Value(0);
  heightDetail2 = new Animated.Value(0);
  heightDetail3 = new Animated.Value(0);
  heightDetail4 = new Animated.Value(0);

  _onRefresh = () => {
    if (!this.state.refreshing) {
      this.updateSessionNumberCompleted();
      this.setState({ refreshing: true });
      this.props.dispatch(
        getLevelEvents({ level_number: 1 }, this.saveSessionsInState)
      );
      this.props.dispatch(
        getLevelEvents({ level_number: 2 }, this.saveSessions2InState)
      );
      this.props.dispatch(getSpecialTrainingSessions());
      this.props.dispatch(getSpecialTrainingSessionSubscribed());
    }
    setTimeout(() => {
      console.log("check");

      this.setState({ refreshing: false });
    }, 2000);
  };

  // click relativo all'avvio dell'animazione
  onClickAnimated = type => {
    // unisco tre animazioni relative a
    // x , y e opacita
    // in 350 ms il valore corrente nello stato deve diventare 100 nel corso del tempo

    switch (type) {
      case 1:
        this.setState(prevState => {
          return { animated1: true };
        });

        this.heightDetail1.setValue(0);

        Animated.spring(this.heightDetail1, {
          toValue: 1,
          duration: 250,

          isInteraction: true
        }).start();
        break;
      case 2:
        this.setState(prevState => {
          return { animated2: true };
        });

        this.heightDetail2.setValue(0);

        Animated.spring(this.heightDetail2, {
          toValue: 1,
          duration: 250,

          isInteraction: true
        }).start();
        break;
      case 3:
        this.setState(prevState => {
          return { animated3: true };
        });

        this.heightDetail3.setValue(0);

        Animated.spring(this.heightDetail3, {
          toValue: 1,
          duration: 250,

          isInteraction: true
        }).start();
        break;
      case 4:
        this.setState(prevState => {
          return { animated4: true };
        });

        this.heightDetail4.setValue(0);

        Animated.spring(this.heightDetail4, {
          toValue: 1,
          duration: 250,

          isInteraction: true
        }).start();
        break;
      default:
        this.setState(prevState => {
          return { animated1: true };
        });

        this.heightDetail1.setValue(0);

        Animated.spring(this.heightDetail1, {
          toValue: 1,
          duration: 250,

          isInteraction: true
        }).start();
        break;
    }
  };

  onClickAnimatedClose = type => {
    // cambia il valore dì animated dello stato per dire che ho chiuso il menu con l'animazione di chiusura

    switch (type) {
      case 1:
        this.heightDetail1.setValue(1);

        Animated.spring(this.heightDetail1, {
          toValue: 0,
          duration: 250,

          isInteraction: true
        }).start(
          this.setState(prevState => {
            return { animated1: false };
          })
        );
        break;
      case 2:
        this.heightDetail2.setValue(1);

        Animated.spring(this.heightDetail2, {
          toValue: 0,
          duration: 250,

          isInteraction: true
        }).start(
          this.setState(prevState => {
            return { animated2: false };
          })
        );
        break;
      case 3:
        this.heightDetail3.setValue(0);

        Animated.spring(this.heightDetail3, {
          toValue: 0,
          duration: 250,

          isInteraction: true
        }).start(
          this.setState(prevState => {
            return { animated3: false };
          })
        );
        break;
      case 4:
        this.heightDetail4.setValue(1);

        Animated.spring(this.heightDetail4, {
          toValue: 0,
          duration: 250,

          isInteraction: true
        }).start(
          this.setState(prevState => {
            return { animated4: false };
          })
        );
        break;
      default:
        this.heightDetail1.setValue(1);

        Animated.spring(this.heightDetail1, {
          toValue: 0,
          duration: 250,

          isInteraction: true
        }).start(
          this.setState(prevState => {
            return { animated1: false };
          })
        );
        break;
    }
  };

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

  saveSessionsInState = response => {
    this.setState({
      sessions: response.sort((a, b) => {
        return a.order - b.order;
      })
    });
  };

  saveSessions2InState = response => {
    this.setState({
      sessions2: response.sort((a, b) => {
        return a.order - b.order;
      })
    });
  };

  checkIfSessionIsCompleted = id => {
    if (this.props.trainingsState.training_sessions) {
      let flag = false;

      this.props.trainingsState.training_sessions.forEach(e => {
        if (e.trainingSessionId == id && e.status == 3) flag = true;
      });

      return flag;
    } else {
      return false;
    }
  };

  getIdSession = id => {
    if (this.props.trainingsState.training_sessions) {
      let flagId = 0;

      // reverse cosi ho l'id piu vecchio, dato che lo devo sbloccare
      // i dati sono salvati in ordine descrescente

      this.props.trainingsState.training_sessions.reverse().forEach(e => {
        if (e.trainingSessionId == id) {
          flagId = e.id;
        }
      });

      return flagId;
    } else {
      return 0;
    }
  };

  statusSession = id => {
    if (this.props.trainingsState.training_sessions) {
      let flag = 0;

      const training_sessionsLength = this.props.trainingsState
        .training_sessions.length;
      for (i = 0; i < training_sessionsLength; i++) {
        const session = this.props.trainingsState.training_sessions[i];
        if (session.trainingSessionId == id) {
          return session.status;
        }
      }

      return flag;
    } else {
      return 0;
    }
  };

  checkIfSessionIsActive = id => {
    if (this.props.trainingsState.training_sessions) {
      let flag = false;

      this.props.trainingsState.training_sessions.forEach(e => {
        if (e.trainingSessionId == id && e.status == 2) flag = true;
      });

      return flag;
    } else {
      return false;
    }
  };

  getCompletedTrainings = id => {
    let count = 0;
    if (this.checkIfSessionIsActive(id)) {
      this.props.trainingsState.training_events.forEach(e => {
        if (e.status == 1) count++;
      });
    }
    return count;
  };

  componentWillReceiveProps(props) {
    if (props.trainingsState) {
      if (props.trainingsState.status == "Get ST Sessions") {
        this.setState({ loading_st: true });
      } else {
        this.updateSessionNumberCompleted();
        this.setState({ loading_st: false });
      }
    }
    if (!this.state.there_are_st) {
      console.log("cerco special trainings disponibili");
      try {
        this.thereAreST();
      } catch (error) {
        console.log(error);
      }
    }
  }

  componentDidMount() {}

  componentWillMount() {
    // prendo il livello e tutte le info associate cosi nella schermata dei trainings ho tutto aggiornato
    this.props.dispatch(getUserLevel());
    if (!this.props.sessions || !this.props.sessions2) {
      this.props.dispatch(
        getLevelEvents({ level_number: 1 }, this.saveSessionsInState)
      );
      this.props.dispatch(
        getLevelEvents({ level_number: 2 }, this.saveSessions2InState)
      );
    }

    this.updateSessionNumberCompleted();

    this.props.dispatch(getSpecialTrainingSessions());
    this.props.dispatch(getSpecialTrainingSessionSubscribed());

    try {
      this.thereAreST();
    } catch (error) {
      console.log(error);
    }
  }
  updateSessionNumberCompleted = () => {
    const level = this.props.trainingsState.level_number;
    let SessionsCompletedFirstLevel = 0;
    let SessionsCompletedSecondLevel = 0;
    if (level > 2) {
      SessionsCompletedFirstLevel = 4;
      SessionsCompletedSecondLevel = 4;
    } else if (level > 1) {
      SessionsCompletedFirstLevel = 4;
      SessionsCompletedSecondLevel = this.props.trainingsState.training_sessions
        .slice(0, 4)
        .filter(elem => elem.status === 3).length;
    } else {
      SessionsCompletedFirstLevel = this.props.trainingsState.training_sessions
        .slice(0, 4)
        .filter(elem => elem.status === 3).length;
    }
    this.setState({
      SessionsCompletedFirstLevel,
      SessionsCompletedSecondLevel
    });
  };

  /**
   * valorizzo un flag nello stato
   * che condiziona la scrollview degli ST
   */
  thereAreST() {
    let st = this.props.trainingsState.special_training_sessions.filter(e => {
      let expired_date = +new Date(e.special_training.end_special_training);
      let now = +new Date();
      let has_expired = now > expired_date ? true : false;
      // let has_expired = false;

      let has_community = false;
      if (this.props.profileState)
        if (
          this.props.profileState.community != {} &&
          this.props.profileState.community != null
        )
          if (
            (this.props.profileState.community.id &&
              this.props.profileState.community.id == e.community_id) ||
            e.community_id == null
          )
            if (
              this.props.profileState.community.id == e.community_id ||
              e.community_id == null
            )
              has_community = true;

      // let user_limit_reached = false;
      // if (e.max_users == e.subscriber_user && e.max_users != null)
      //   user_limit_reached = true;

      const subscribed_special_training = this.props.trainingsState
        .subscribed_special_training
        ? this.props.trainingsState.subscribed_special_training
        : [];
      let special_training_sessions_subscribed = subscribed_special_training.map(
        item => {
          return item.training_title;
        }
      );
      // let is_active = false;

      // if (
      //   this.props.trainingsState.subscribed_special_training.filter(el => {
      //     el.training_title == e.text_description;
      //   }).length > 0
      // )
      //   is_active = true;

      let special_training_sessions_completed = subscribed_special_training.map(
        item => {
          return item.training_title == e.text_description && item.status == 1;
        }
      );

      special_training_sessions_completed = special_training_sessions_completed.includes(
        true
      );

      return (
        (true &&
          !has_expired &&
          !special_training_sessions_subscribed.includes(e.text_description)) ||
        (special_training_sessions_completed && !has_expired)
      );
    });

    console.log("st");
    console.log(st);

    if (st.length > 0) {
      this.setState({ there_are_st: true });
    }
  }

  flatSession = () => {
    return (
      <FlatList
        data={this.props.sessions}
        renderItem={session =>
          this.renderSessionsFlat(
            this.props.trainingsState.level_number,
            1,
            session
          )
        }
        horizontal={true}
        contentContainerStyle={{
          height: Dimensions.get("window").height * 0.25 + 15
        }}
        showsHorizontalScrollIndicator={false}
      />
    );
  };

  renderSessionsFlat(level, levelSession, session) {
    if (session != null) {
      const e = session.item;
      const index = session.index;
      const levelCorrent = level === 1;
      // se è il livello corrente allora vedo anche le sessioni e gli eventi completati
      // se minore no
      if (levelCorrent) {
        const status = this.statusSession(e.id);
        const completeSession = status === 3 ? true : false;
        // se lo status è 0 devo vedere
        /* if (status === 0) {
            e.cost_in_coins;
            e.cost_in_points;
          } */

        return (
          <HorizontalSessionContainer
            key={e.id}
            status={status}
            sessionName={e.name}
            completed={completeSession}
            eventsNumber={e.events.length}
            eventsCompleted={
              completeSession
                ? e.events.length
                : this.getCompletedTrainings(e.id)
            }
            levelCorrent={true}
            events={e.events.sort((a, b) => {
              return a.id - b.id;
            })}
            id={e.id}
            obtainableCoins={e.obtainable_coins}
            scrollSessions={this.scrollSessions}
            index={index ? index : 0}
            dispatch={this.props.dispatch}
            level={levelSession}
          />
        );
      } else if (level > 1) {
        const status = 3;
        const completeSession = true;
        return (
          <HorizontalSessionContainer
            key={e.id}
            status={status}
            sessionName={e.name}
            completed={completeSession}
            eventsNumber={e.events.length}
            eventsCompleted={
              completeSession
                ? e.events.length
                : this.getCompletedTrainings(e.id)
            }
            levelCorrent={true}
            events={e.events.sort((a, b) => {
              return a.id - b.id;
            })}
            id={e.id}
            obtainableCoins={e.obtainable_coins}
            index={index ? index : 0}
            dispatch={this.props.dispatch}
            level={levelSession}
          />
        );
      } else {
        // ancora da sbloccare il nuovo livello

        const status = 0;
        const completeSession = false;
        return (
          <HorizontalSessionContainer
            key={e.id}
            status={status}
            sessionName={e.name}
            completed={completeSession}
            eventsNumber={e.events.length}
            eventsCompleted={
              completeSession
                ? e.events.length
                : this.getCompletedTrainings(e.id)
            }
            levelCorrent={false}
            events={e.events}
            id={e.id}
            obtainableCoins={e.obtainable_coins}
            index={index ? index : 0}
            dispatch={this.props.dispatch}
            level={levelSession}
          />
        );
      }
    } else {
      return (
        <View
          style={{
            // backgroundColor: "#5FC4E2",
            width: Dimensions.get("window").width * 0.62,
            height: Dimensions.get("window").height * 0.25,
            marginHorizontal: 15,
            borderRadius: 4,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <ActivityIndicator
            style={{
              alignContent: "center",
              flex: 1,
              paddingTop: 20,

              alignItems: "center",
              alignSelf: "center"
            }}
            size="large"
            color="#3D3D3D"
          />
        </View>
      );
    }
  }
  scrollSessions = () => {
    if (this.ref) {
      if (this.props.trainingsState.training_sessions) {
        let scrollDown = 0;
        let idSession = [];
        const sessionComplete = this.props.trainingsState.training_sessions.reduce(
          (total, item) => {
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
          },
          []
        );

        const training_sessionsLength = sessionComplete.length;
        for (i = 0; i < training_sessionsLength; i++) {
          const session = sessionComplete[i];

          if (session.status) {
            scrollDown += Dimensions.get("window").height * 0.1 + 20;
          }
        }
        // y 280 per la quarta sessione
        this.ref.scrollTo({
          x: 0,
          y: scrollDown ? scrollDown + 32 : 0,
          animated: true
        });
      } else {
        let scrollDown = 0;
        const training_sessionsLength = this.props.trainingsState
          .training_sessions.length;
        for (i = 0; i < training_sessionsLength; i++) {
          const session = this.props.trainingsState.training_sessions[i];

          if (session.status) {
            scrollDown += Dimensions.get("window").height * 0.1 + 5;
          }
        }
        // y 280 per la quarta sessione
        this.ref.scrollTo({ x: 0, y: scrollDown, animated: true });
      }
    }
  };

  renderSpecialTrainings(currentLevel, level) {
    let special_training_sessions_subscribed = this.props.trainingsState.subscribed_special_training.map(
      item => {
        return item.training_title;
      }
    );

    if (this.props.trainingsState.special_training_sessions != null) {
      let sorted_st = this.props.trainingsState.special_training_sessions.sort(
        (a, b) => {
          if (a.special_training.id > b.special_training.id) {
            return -1;
          }
          if (a.special_training.id < b.special_training.id) {
            return 1;
          }
          return 0;
        }
      );
      return sorted_st.map((e, index) => {
        let has_community = false;
        if (this.props.profileState)
          if (
            this.props.profileState.community != {} &&
            this.props.profileState.community != null
          ) {
            if (
              (this.props.profileState.community.id &&
                this.props.profileState.community.id == e.community_id) ||
              e.community_id == null
            )
              if (
                this.props.profileState.community.id == e.community_id ||
                e.community_id == null
              ) {
                has_community = true;
              }
          } else if (
            e.community_id == null ||
            this.props.profileState.community === null
          ) {
            has_community = true;
          }

        let expired_date = +new Date(e.special_training.end_special_training);
        let now = +new Date();
        let has_expired = now > expired_date ? true : false;
        // let has_expired = false;

        const status = this.statusSession(e.status);
        const completeSession = status === 3 ? true : false;

        let special_training_sessions_completed = this.props.trainingsState.subscribed_special_training.map(
          item => {
            return (
              item.training_title == e.text_description && item.status == 1
            );
          }
        );

        special_training_sessions_completed = special_training_sessions_completed.includes(
          true
        );

        if (
          (!has_expired &&
            has_community &&
            !special_training_sessions_subscribed.includes(
              e.text_description
            )) || // nel caso in cui volessi far vedere solo i non-sottoscritti
          (special_training_sessions_completed && !has_expired)
        ) {
          let user_limit_reached = false;
          if (
            e.max_users ==
              (e.hasOwnProperty("completed_users")
                ? e.completed_users
                : e.subscriber_user) &&
            e.max_users != null
          )
            user_limit_reached = true;

          console.log(
            e.hasOwnProperty("completed_users")
              ? e.completed_users
              : e.subscriber_user
          );

          return (
            <HorizontalSpecialTrainingSessionContainer
              key={index}
              status={2}
              sessionName={e.text_description}
              trainingName={e.special_training.name}
              trainingDescription={e.special_training.description}
              completed={special_training_sessions_completed}
              eventsNumber={e.special_training.length}
              eventsCompleted={special_training_sessions_completed}
              levelCorrent={true}
              events={[e.special_training]}
              // id={e.id}
              special_training_id={e.special_training.id}
              obtainableCoins={0}
              scrollSessions={this.scrollSessions}
              index={index ? index : 0}
              dispatch={this.props.dispatch}
              level={0}
              special_training_subscribed={special_training_sessions_subscribed.includes(
                e.text_description
              )}
              maxUserNumber={e.max_users}
              subscriberUser={e.subscriber_user}
              completed_users={e.completed_users} // cosi se non c'e prendo gli utenti iscritti
              descriptionStSession={e.description_st_session}
              userLimitReached={user_limit_reached}
            />
          );
        }
      });
    } else {
      return (
        <View
          style={{
            // backgroundColor: "#5FC4E2",
            width: Dimensions.get("window").width * 0.62,
            height: Dimensions.get("window").height * 0.25,
            marginHorizontal: 15,
            borderRadius: 4,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <ActivityIndicator
            style={{
              alignContent: "center",
              flex: 1,
              paddingTop: 20,

              alignItems: "center",
              alignSelf: "center"
            }}
            size="large"
            color="#3D3D3D"
          />
        </View>
      );
    }
  }

  renderActiveSpecialTrainings(currentLevel, level) {
    let special_training_sessions_subscribed = this.props.trainingsState.subscribed_special_training.map(
      item => {
        return item.training_title;
      }
    );

    if (this.props.trainingsState.special_training_sessions != null) {
      let sorted_st = this.props.trainingsState.special_training_sessions.sort(
        (a, b) => {
          if (a.special_training.id > b.special_training.id) {
            return -1;
          }
          if (a.special_training.id < b.special_training.id) {
            return 1;
          }
          return 0;
        }
      );
      return sorted_st.map((e, index) => {
        let has_community = false;
        if (this.props.profileState)
          if (
            this.props.profileState.community != {} &&
            this.props.profileState.community != null
          )
            if (
              (this.props.profileState.community.id &&
                this.props.profileState.community.id == e.community_id) ||
              e.community_id == null
            )
              if (
                this.props.profileState.community.id == e.community_id ||
                e.community_id == null
              )
                has_community = true;

        let expired_date = +new Date(e.special_training.end_special_training);
        let now = +new Date();
        let has_expired = now > expired_date ? true : false;
        // let has_expired = false;

        const status = this.statusSession(e.status);
        const completeSession = status === 3 ? true : false;

        let special_training_sessions = this.props.trainingsState
          .subscribed_special_training
          ? this.props.trainingsState.subscribed_special_training
          : [];

        let special_training_sessions_completed = special_training_sessions.map(
          item => {
            return (
              item.training_title == e.text_description && item.status == 1
            );
          }
        );

        special_training_sessions_completed = special_training_sessions_completed.includes(
          true
        );

        if (
          !has_expired &&
          // has_community &&
          (status === 1 || status === 2 || status === 0) &&
          special_training_sessions_subscribed.includes(e.text_description) && // nel caso in cui volessi far vedere solo i completi
          !special_training_sessions_completed
        ) {
          let user_limit_reached = false;

          if (
            e.max_users ==
              (e.hasOwnProperty("completed_users")
                ? e.completed_users
                : e.subscriber_user) &&
            e.max_users != null
          )
            user_limit_reached = true;

          return (
            <HorizontalSpecialTrainingSessionContainer
              key={index}
              status={2}
              sessionName={e.text_description}
              trainingName={e.special_training.name}
              trainingDescription={e.special_training.description}
              completed={special_training_sessions_completed}
              active={true}
              eventsNumber={e.special_training.length}
              eventsCompleted={special_training_sessions_completed}
              levelCorrent={true}
              events={[e.special_training]}
              special_training_id={e.special_training.id}
              obtainableCoins={0}
              scrollSessions={this.scrollSessions}
              index={index ? index : 0}
              dispatch={this.props.dispatch}
              level={0}
              special_training_subscribed={special_training_sessions_subscribed.includes(
                e.text_description
              )}
              maxUserNumber={e.max_users}
              subscriberUser={e.subscriber_user}
              // completed_users={
              //   e.hasOwnProperty("completed_users")
              //     ? e.completed_users
              //     : e.subscriber_user
              // } // cosi se non c'e prendo gli utenti iscritti
              completed_users={e.completed_users} // cosi se non c'e prendo gli utenti iscritti
              descriptionStSession={e.description_st_session}
              userLimitReached={user_limit_reached}
            />
          );
        }
      });
    } else {
      return (
        <View
          style={{
            // backgroundColor: "#5FC4E2",
            width: Dimensions.get("window").width * 0.62,
            height: Dimensions.get("window").height * 0.25,
            marginHorizontal: 15,
            borderRadius: 4,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <ActivityIndicator
            style={{
              alignContent: "center",
              flex: 1,
              paddingTop: 20,

              alignItems: "center",
              alignSelf: "center"
            }}
            size="large"
            color="#3D3D3D"
          />
        </View>
      );
    }
  }

  renderActive(level) {
    let Session = <View />;
    let unlock = false;
    let levelCorrent = level === 1;
    // se è il livello corrente allora vedo anche le sessioni e gli eventi completati
    // se minore no
    if (levelCorrent) {
      if (this.props.sessions != null) {
        this.props.sessions.map((e, index) => {
          const status = this.statusSession(e.id);
          const completeSession = status === 3 ? true : false;
          // se lo status è 0 devo vedere
          /* if (status === 0) {
            e.cost_in_coins;
            e.cost_in_points;
          } */
          if (status === 1 || status === 2) {
            Session = (
              <HorizontalSessionContainer
                key={e.id}
                status={status}
                sessionName={e.name}
                completed={completeSession}
                eventsNumber={e.events.length}
                eventsCompleted={
                  completeSession
                    ? e.events.length
                    : this.getCompletedTrainings(e.id)
                }
                levelCorrent={true}
                events={e.events.sort((a, b) => {
                  return a.id - b.id;
                })}
                id={e.id}
                obtainableCoins={e.obtainable_coins}
                scrollSessions={this.scrollSessions}
                index={index ? index : 0}
                dispatch={this.props.dispatch}
                level={level}
                indexSession={this.state.SessionsCompletedFirstLevel}
              />
            );
          }
        });
      } else {
        Session = (
          <View
            style={{
              // backgroundColor: "#5FC4E2",
              width: Dimensions.get("window").width * 0.62,
              height: Dimensions.get("window").height * 0.25,
              marginHorizontal: 15,
              borderRadius: 4,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <ActivityIndicator
              style={{
                alignContent: "center",
                flex: 1,
                paddingTop: 20,

                alignItems: "center",
                alignSelf: "center"
              }}
              size="large"
              color="#3D3D3D"
            />
          </View>
        );
      }
    } else {
      levelCorrent = level === 2;
      // se è il livello corrente allora vedo anche le sessioni e gli eventi completati
      // se minore no
      if (levelCorrent) {
        if (this.props.sessions2 != null) {
          // se ho uno dei pulsanti da sbloccare

          // se qualcuno è gia attivo allora sicuramente quello disponibile e gia stato sbloccato

          for (index = 0; index < this.props.sessions2.length; index++) {
            const e = this.props.sessions2[index];
            const status = this.statusSession(e.id);
            const completeSession = status === 3 ? true : false;
            let idSession = 0;

            {
              active = completeSession ? true : false;
              if (status === 1 || status === 2) {
                Session = (
                  <View style={{ flexDirection: "row" }}>
                    <HorizontalSessionContainer
                      key={e.id}
                      status={status}
                      sessionName={e.name}
                      completed={completeSession}
                      eventsNumber={e.events.length}
                      eventsCompleted={
                        completeSession
                          ? e.events.length
                          : this.getCompletedTrainings(e.id)
                      }
                      levelCorrent={true}
                      events={e.events.sort((a, b) => {
                        return a.id - b.id;
                      })}
                      id={e.id}
                      obtainableCoins={e.obtainable_coins}
                      scrollSessions={this.scrollSessions2}
                      index={index ? index : 0}
                      dispatch={this.props.dispatch}
                      level={level}
                      indexSession={this.state.SessionsCompletedSecondLevel}
                    />
                    {this.renderActiveSpecialTrainings()}
                  </View>
                );
                break;
              } else if (status === 0) {
                const coins = e.cost_in_coins;
                const points = e.cost_in_points;

                if (!coins && !points) {
                  // se non servono monete o punti
                } else {
                  // se servono monete o punti
                  // se ho uno dei pulsanti da sbloccare
                  active = true;
                  const newActive = active;
                  if (newActive) {
                    // calcolo l'id della sessione che posso calcolare
                    idSession = this.getIdSession(e.id);
                  }
                  active = false;

                  Session = (
                    <View style={{ flexDirection: "row" }}>
                      <HorizontalSessionContainer
                        key={e.id}
                        idSession={idSession}
                        active={newActive}
                        status={status}
                        coins={coins}
                        points={points}
                        sessionName={e.name}
                        completed={completeSession}
                        eventsNumber={e.events.length}
                        eventsCompleted={
                          completeSession
                            ? e.events.length
                            : this.getCompletedTrainings(e.id)
                        }
                        levelCorrent={true}
                        events={e.events.sort((a, b) => {
                          return a.id - b.id;
                        })}
                        id={e.id}
                        obtainableCoins={e.obtainable_coins}
                        scrollSessions={this.scrollSessions2}
                        index={index ? index : 0}
                        dispatch={this.props.dispatch}
                        level={level}
                        indexSession={this.state.SessionsCompletedSecondLevel}
                      />
                      {this.renderActiveSpecialTrainings()}
                    </View>
                  );
                  unlock = true;

                  break;
                }
              }
            }
          }
        } else {
          Session = (
            <View
              style={{
                // backgroundColor: "#5FC4E2",
                width: Dimensions.get("window").width * 0.62,
                height: Dimensions.get("window").height * 0.25,
                marginHorizontal: 15,
                borderRadius: 4,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <ActivityIndicator
                style={{
                  alignContent: "center",
                  flex: 1,
                  paddingTop: 20,

                  alignItems: "center",
                  alignSelf: "center"
                }}
                size="large"
                color="#3D3D3D"
              />
            </View>
          );
        }
      }
    }

    return Session;
  }

  renderSessions(level, levelSession) {
    if (this.props.sessions != null) {
      const levelCorrent = level === 1;
      // se è il livello corrente allora vedo anche le sessioni e gli eventi completati
      // se minore no
      if (levelCorrent) {
        return this.props.sessions.map((e, index) => {
          const status = this.statusSession(e.id);
          const completeSession = status === 3 ? true : false;
          // se lo status è 0 devo vedere
          /* if (status === 0) {
            e.cost_in_coins;
            e.cost_in_points;
          } */

          return (
            <HorizontalSessionContainer
              key={e.id}
              status={status}
              sessionName={e.name}
              completed={completeSession}
              eventsNumber={e.events.length}
              eventsCompleted={
                completeSession
                  ? e.events.length
                  : this.getCompletedTrainings(e.id)
              }
              levelCorrent={true}
              events={e.events.sort((a, b) => {
                return a.id - b.id;
              })}
              id={e.id}
              obtainableCoins={e.obtainable_coins}
              scrollSessions={this.scrollSessions}
              index={index ? index : 0}
              dispatch={this.props.dispatch}
              level={levelSession}
              indexSession={index}
            />
          );
        });
      } else if (level > 1) {
        return this.props.sessions.map((e, index) => {
          const status = 3;
          const completeSession = true;
          return (
            <HorizontalSessionContainer
              key={e.id}
              status={status}
              sessionName={e.name}
              completed={completeSession}
              eventsNumber={e.events.length}
              eventsCompleted={
                completeSession
                  ? e.events.length
                  : this.getCompletedTrainings(e.id)
              }
              levelCorrent={true}
              events={e.events.sort((a, b) => {
                return a.id - b.id;
              })}
              id={e.id}
              obtainableCoins={e.obtainable_coins}
              index={index ? index : 0}
              dispatch={this.props.dispatch}
              level={levelSession}
              indexSession={index}
            />
          );
        });
      } else {
        // ancora da sbloccare il nuovo livello
        return this.props.sessions.map((e, index) => {
          const status = 0;
          const completeSession = false;
          return (
            <HorizontalSessionContainer
              key={e.id}
              status={status}
              sessionName={e.name}
              completed={completeSession}
              eventsNumber={e.events.length}
              eventsCompleted={
                completeSession
                  ? e.events.length
                  : this.getCompletedTrainings(e.id)
              }
              levelCorrent={false}
              events={e.events}
              id={e.id}
              obtainableCoins={e.obtainable_coins}
              index={index ? index : 0}
              dispatch={this.props.dispatch}
              level={levelSession}
              indexSession={index}
            />
          );
        });
      }
    } else {
      return (
        <View
          style={{
            // backgroundColor: "#5FC4E2",
            width: Dimensions.get("window").width * 0.62,
            height: Dimensions.get("window").height * 0.25,
            marginHorizontal: 15,
            borderRadius: 4,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <ActivityIndicator
            style={{
              alignContent: "center",
              flex: 1,
              paddingTop: 20,

              alignItems: "center",
              alignSelf: "center"
            }}
            size="large"
            color="#3D3D3D"
          />
        </View>
      );
    }
  }

  renderSessions2(level, levelSession) {
    if (this.props.sessions2 != null) {
      const levelCorrent = level === 2;
      // se è il livello corrente allora vedo anche le sessioni e gli eventi completati
      // se minore no
      if (levelCorrent) {
        // se ho uno dei pulsanti da sbloccare
        let active = true;

        // se qualcuno è gia attivo allora sicuramente quello disponibile e gia stato sbloccato
        return this.props.sessions2.map((e, index) => {
          const status = this.statusSession(e.id);
          let idSession = 0;
          const completeSession = status === 3 ? true : false;

          // se lo stato è 0 e vedo che ha bisogno delle monete
          // faccio vedere le monete e non il numero di eventi
          if (status === 0) {
            const coins = e.cost_in_coins;
            const points = e.cost_in_points;

            if (!coins && !points) {
              // se non servono monete o punti

              return (
                <HorizontalSessionContainer
                  key={e.id}
                  status={status}
                  sessionName={e.name}
                  completed={completeSession}
                  eventsNumber={e.events.length}
                  eventsCompleted={
                    completeSession
                      ? e.events.length
                      : this.getCompletedTrainings(e.id)
                  }
                  levelCorrent={true}
                  events={e.events.sort((a, b) => {
                    return a.id - b.id;
                  })}
                  id={e.id}
                  obtainableCoins={e.obtainable_coins}
                  scrollSessions={this.scrollSessions2}
                  index={index ? index : 0}
                  dispatch={this.props.dispatch}
                  level={levelSession}
                  indexSession={index}
                />
              );
            } else {
              // se servono monete o punti
              const newActive = active;
              if (newActive) {
                // calcolo l'id della sessione che posso calcolare
                idSession = this.getIdSession(e.id);
              }
              active = false;

              return (
                <HorizontalSessionContainer
                  key={e.id}
                  idSession={idSession}
                  active={newActive}
                  status={status}
                  coins={coins}
                  points={points}
                  sessionName={e.name}
                  completed={completeSession}
                  eventsNumber={e.events.length}
                  eventsCompleted={
                    completeSession
                      ? e.events.length
                      : this.getCompletedTrainings(e.id)
                  }
                  levelCorrent={true}
                  events={e.events.sort((a, b) => {
                    return a.id - b.id;
                  })}
                  id={e.id}
                  obtainableCoins={e.obtainable_coins}
                  scrollSessions={this.scrollSessions2}
                  index={index ? index : 0}
                  dispatch={this.props.dispatch}
                  level={levelSession}
                  indexSession={index}
                />
              );
            }
          } else {
            active = completeSession ? active : false;
            return (
              <HorizontalSessionContainer
                key={e.id}
                status={status}
                sessionName={e.name}
                completed={completeSession}
                eventsNumber={e.events.length}
                eventsCompleted={
                  completeSession
                    ? e.events.length
                    : this.getCompletedTrainings(e.id)
                }
                levelCorrent={true}
                events={e.events.sort((a, b) => {
                  return a.id - b.id;
                })}
                id={e.id}
                obtainableCoins={e.obtainable_coins}
                scrollSessions={this.scrollSessions2}
                index={index ? index : 0}
                dispatch={this.props.dispatch}
                level={levelSession}
                indexSession={index}
              />
            );
          }
        });
      } else if (level > 2) {
        return this.props.sessions2.map((e, index) => {
          const status = 3;
          const completeSession = true;

          return (
            <HorizontalSessionContainer
              key={e.id}
              status={status}
              sessionName={e.name}
              completed={completeSession}
              eventsNumber={e.events.length}
              eventsCompleted={
                completeSession
                  ? e.events.length
                  : this.getCompletedTrainings(e.id)
              }
              levelCorrent={true}
              events={e.events.sort((a, b) => {
                return a.id - b.id;
              })}
              id={e.id}
              obtainableCoins={e.obtainable_coins}
              index={index ? index : 0}
              dispatch={this.props.dispatch}
              level={levelSession}
              indexSession={index}
            />
          );
        });
      } else {
        // ancora da sbloccare il nuovo livello
        return this.props.sessions2.map((e, index) => {
          const status = 0;
          const completeSession = false;
          const coins = e.cost_in_coins;
          const points = e.cost_in_points;
          if (!coins && !points) {
            // se non servono monete o punti
            return (
              <HorizontalSessionContainer
                key={e.id}
                status={status}
                sessionName={e.name}
                completed={completeSession}
                eventsNumber={e.events.length}
                eventsCompleted={
                  completeSession
                    ? e.events.length
                    : this.getCompletedTrainings(e.id)
                }
                levelCorrent={false}
                events={e.events}
                id={e.id}
                obtainableCoins={e.obtainable_coins}
                index={index ? index : 0}
                dispatch={this.props.dispatch}
                level={levelSession}
                indexSession={index}
              />
            );
          } else {
            // se servono monete o punti

            return (
              <HorizontalSessionContainer
                key={e.id}
                active={false}
                status={status}
                coins={coins}
                points={points}
                sessionName={e.name}
                completed={completeSession}
                eventsNumber={e.events.length}
                eventsCompleted={
                  completeSession
                    ? e.events.length
                    : this.getCompletedTrainings(e.id)
                }
                levelCorrent={false}
                events={e.events}
                id={e.id}
                obtainableCoins={e.obtainable_coins}
                index={index ? index : 0}
                dispatch={this.props.dispatch}
                level={levelSession}
                indexSession={index}
              />
            );
          }
        });
      }
    } else {
      return (
        <View
          style={{
            // backgroundColor: "#5FC4E2",
            width: Dimensions.get("window").width * 0.62,
            height: Dimensions.get("window").height * 0.25,
            marginHorizontal: 15,
            borderRadius: 4,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <ActivityIndicator
            style={{
              alignContent: "center",
              flex: 1,
              paddingTop: 20,

              alignItems: "center",
              alignSelf: "center"
            }}
            size="large"
            color="#3D3D3D"
          />
        </View>
      );
    }
  }

  renderSessions3(level, levelSession) {
    if (this.props.sessions2 != null) {
      const levelCorrent = level === 4;
      // se è il livello corrente allora vedo anche le sessioni e gli eventi completati
      // se minore no
      if (levelCorrent) {
        // se ho uno dei pulsanti da sbloccare
        let active = true;

        // se qualcuno è gia attivo allora sicuramente quello disponibile e gia stato sbloccato
        return this.props.sessions2.map((e, index) => {
          const status = this.statusSession(e.id);
          let idSession = 0;
          const completeSession = status === 3 ? true : false;

          // se lo stato è 0 e vedo che ha bisogno delle monete
          // faccio vedere le monete e non il numero di eventi
          if (status === 0) {
            const coins = e.cost_in_coins;
            const points = e.cost_in_points;

            if (!coins && !points) {
              // se non servono monete o punti

              return (
                <HorizontalSessionContainer
                  key={e.id}
                  status={status}
                  sessionName={e.name}
                  completed={completeSession}
                  eventsNumber={e.events.length}
                  eventsCompleted={
                    completeSession
                      ? e.events.length
                      : this.getCompletedTrainings(e.id)
                  }
                  levelCorrent={true}
                  events={e.events.sort((a, b) => {
                    return a.id - b.id;
                  })}
                  id={e.id}
                  obtainableCoins={e.obtainable_coins}
                  scrollSessions={this.scrollSessions2}
                  index={index ? index : 0}
                  dispatch={this.props.dispatch}
                  level={levelSession}
                  // indexSession={index}
                  indexSession={0}
                />
              );
            } else {
              // se servono monete o punti
              const newActive = active;
              if (newActive) {
                // calcolo l'id della sessione che posso calcolare
                idSession = this.getIdSession(e.id);
              }
              active = false;

              return (
                <HorizontalSessionContainer
                  key={e.id}
                  idSession={idSession}
                  active={newActive}
                  status={status}
                  coins={coins}
                  points={points}
                  sessionName={e.name}
                  completed={completeSession}
                  eventsNumber={e.events.length}
                  eventsCompleted={
                    completeSession
                      ? e.events.length
                      : this.getCompletedTrainings(e.id)
                  }
                  levelCorrent={true}
                  events={e.events.sort((a, b) => {
                    return a.id - b.id;
                  })}
                  id={e.id}
                  obtainableCoins={e.obtainable_coins}
                  scrollSessions={this.scrollSessions2}
                  index={index ? index : 0}
                  dispatch={this.props.dispatch}
                  level={levelSession}
                  // indexSession={index}
                  indexSession={0}
                />
              );
            }
          } else {
            active = completeSession ? active : false;
            return (
              <HorizontalSessionContainer
                key={e.id}
                status={status}
                sessionName={e.name}
                completed={completeSession}
                eventsNumber={e.events.length}
                eventsCompleted={
                  completeSession
                    ? e.events.length
                    : this.getCompletedTrainings(e.id)
                }
                levelCorrent={true}
                events={e.events.sort((a, b) => {
                  return a.id - b.id;
                })}
                id={e.id}
                obtainableCoins={e.obtainable_coins}
                scrollSessions={this.scrollSessions2}
                index={index ? index : 0}
                dispatch={this.props.dispatch}
                level={levelSession}
                // indexSession={index}
                indexSession={0}
              />
            );
          }
        });
      } else if (level > 4) {
        return this.props.sessions2.map((e, index) => {
          const status = 3;
          const completeSession = true;

          return (
            <HorizontalSessionContainer
              key={e.id}
              status={status}
              sessionName={e.name}
              completed={completeSession}
              eventsNumber={e.events.length}
              eventsCompleted={
                completeSession
                  ? e.events.length
                  : this.getCompletedTrainings(e.id)
              }
              levelCorrent={true}
              events={e.events.sort((a, b) => {
                return a.id - b.id;
              })}
              id={e.id}
              obtainableCoins={e.obtainable_coins}
              index={index ? index : 0}
              dispatch={this.props.dispatch}
              level={levelSession}
              // indexSession={index}
              indexSession={0}
            />
          );
        });
      } else {
        // ancora da sbloccare il nuovo livello

        return (
          <HorizontalSessionContainer
            status={0}
            sessionName={strings("coming_soon")}
            completed={false}
            levelCorrent={false}
            events={[]}
            id={10}
            obtainableCoins={0}
            index={0}
            dispatch={this.props.dispatch}
            level={levelSession}
            // indexSession={index}
            indexSession={0}
          />
        );
      }
    } else {
      return (
        <View
          style={{
            // backgroundColor: "#5FC4E2",
            width: Dimensions.get("window").width * 0.62,
            height: Dimensions.get("window").height * 0.25,
            marginHorizontal: 15,
            borderRadius: 4,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <ActivityIndicator
            style={{
              alignContent: "center",
              flex: 1,
              paddingTop: 20,

              alignItems: "center",
              alignSelf: "center"
            }}
            size="large"
            color="#3D3D3D"
          />
        </View>
      );
    }
  }

  renderSessions4(level, levelSession) {
    if (this.props.sessions2 != null) {
      const levelCorrent = level === 4;
      // se è il livello corrente allora vedo anche le sessioni e gli eventi completati
      // se minore no
      if (levelCorrent) {
        // se ho uno dei pulsanti da sbloccare
        let active = true;

        // se qualcuno è gia attivo allora sicuramente quello disponibile e gia stato sbloccato
        return this.props.sessions2.map((e, index) => {
          const status = this.statusSession(e.id);
          let idSession = 0;
          const completeSession = status === 3 ? true : false;

          // se lo stato è 0 e vedo che ha bisogno delle monete
          // faccio vedere le monete e non il numero di eventi
          if (status === 0) {
            const coins = e.cost_in_coins;
            const points = e.cost_in_points;

            if (!coins && !points) {
              // se non servono monete o punti

              return (
                <HorizontalSessionContainer
                  key={e.id}
                  status={status}
                  sessionName={e.name}
                  completed={completeSession}
                  eventsNumber={e.events.length}
                  eventsCompleted={
                    completeSession
                      ? e.events.length
                      : this.getCompletedTrainings(e.id)
                  }
                  levelCorrent={true}
                  events={e.events.sort((a, b) => {
                    return a.id - b.id;
                  })}
                  id={e.id}
                  obtainableCoins={e.obtainable_coins}
                  scrollSessions={this.scrollSessions2}
                  index={index ? index : 0}
                  dispatch={this.props.dispatch}
                  level={levelSession}
                  // indexSession={index}
                  indexSession={0}
                />
              );
            } else {
              // se servono monete o punti
              const newActive = active;
              if (newActive) {
                // calcolo l'id della sessione che posso calcolare
                idSession = this.getIdSession(e.id);
              }
              active = false;

              return (
                <HorizontalSessionContainer
                  key={e.id}
                  idSession={idSession}
                  active={newActive}
                  status={status}
                  coins={coins}
                  points={points}
                  sessionName={e.name}
                  completed={completeSession}
                  eventsNumber={e.events.length}
                  eventsCompleted={
                    completeSession
                      ? e.events.length
                      : this.getCompletedTrainings(e.id)
                  }
                  levelCorrent={true}
                  events={e.events.sort((a, b) => {
                    return a.id - b.id;
                  })}
                  id={e.id}
                  obtainableCoins={e.obtainable_coins}
                  scrollSessions={this.scrollSessions2}
                  index={index ? index : 0}
                  dispatch={this.props.dispatch}
                  level={levelSession}
                  // indexSession={index}
                  indexSession={0}
                />
              );
            }
          } else {
            active = completeSession ? active : false;
            return (
              <HorizontalSessionContainer
                key={e.id}
                status={status}
                sessionName={e.name}
                completed={completeSession}
                eventsNumber={e.events.length}
                eventsCompleted={
                  completeSession
                    ? e.events.length
                    : this.getCompletedTrainings(e.id)
                }
                levelCorrent={true}
                events={e.events.sort((a, b) => {
                  return a.id - b.id;
                })}
                id={e.id}
                obtainableCoins={e.obtainable_coins}
                scrollSessions={this.scrollSessions2}
                index={index ? index : 0}
                dispatch={this.props.dispatch}
                level={levelSession}
                // indexSession={index}
                indexSession={0}
              />
            );
          }
        });
      } else if (level > 4) {
        return this.props.sessions2.map((e, index) => {
          const status = 3;
          const completeSession = true;

          return (
            <HorizontalSessionContainer
              key={e.id}
              status={status}
              sessionName={e.name}
              completed={completeSession}
              eventsNumber={e.events.length}
              eventsCompleted={
                completeSession
                  ? e.events.length
                  : this.getCompletedTrainings(e.id)
              }
              levelCorrent={true}
              events={e.events.sort((a, b) => {
                return a.id - b.id;
              })}
              id={e.id}
              obtainableCoins={e.obtainable_coins}
              index={index ? index : 0}
              dispatch={this.props.dispatch}
              level={levelSession}
              // indexSession={index}
              indexSession={0}
            />
          );
        });
      } else {
        // ancora da sbloccare il nuovo livello

        return (
          <HorizontalSessionContainer
            status={0}
            sessionName={strings("coming_soon")}
            completed={false}
            levelCorrent={false}
            events={[]}
            id={10}
            obtainableCoins={0}
            index={0}
            dispatch={this.props.dispatch}
            level={levelSession}
            // indexSession={index}
            indexSession={0}
          />
        );
      }
    } else {
      return (
        <View
          style={{
            // backgroundColor: "#5FC4E2",
            width: Dimensions.get("window").width * 0.62,
            height: Dimensions.get("window").height * 0.25,
            marginHorizontal: 15,
            borderRadius: 4,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <ActivityIndicator
            style={{
              alignContent: "center",
              flex: 1,
              paddingTop: 20,

              alignItems: "center",
              alignSelf: "center"
            }}
            size="large"
            color="#3D3D3D"
          />
        </View>
      );
    }
  }
  expandDetail = type => {
    switch (type) {
      case 1:
        if (this.state.animated1) {
          this.onClickAnimatedClose(type);
        } else {
          this.onClickAnimated(type);
        }
        break;
      case 2:
        if (this.state.animated2) {
          this.onClickAnimatedClose(type);
        } else {
          this.onClickAnimated(type);
        }
        break;
      case 3:
        if (this.state.animated3) {
          this.onClickAnimatedClose(type);
        } else {
          this.onClickAnimated(type);
        }
        break;
      case 4:
        if (this.state.animated4) {
          this.onClickAnimatedClose(type);
        } else {
          this.onClickAnimated(type);
        }
        break;
    }
  };

  renderSpecialTrainingsScrollview(level) {
    if (this.props.profileState.customisation_gdpr && this.state.there_are_st)
      return (
        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: Dimensions.get("window").width * 0.9,
              alignSelf: "center"
            }}
          >
            <TouchableWithoutFeedback
              onPress={() => {
                this.props.dispatch(getSpecialTrainingSessions());
                this.props.dispatch(getSpecialTrainingSessionSubscribed());
              }}
            >
              <View>
                <Text style={styles.levelTitle}>SPECIAL TRAININGS</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View style={{ height: 10 }} />

          <ScrollView
            horizontal={true}
            contentContainerStyle={{
              height: Dimensions.get("window").height * 0.25 + 15
            }}
            showsHorizontalScrollIndicator={false}
          >
            {this.renderSpecialTrainings(level, 1)}
          </ScrollView>
        </View>
      );
  }

  renderPage() {
    const level = this.props.trainingsState.level_number;

    // dal livello so quali livelli sono stati completati
    const heightDetail1 = this.heightDetail1.interpolate({
      inputRange: [0, 1],
      outputRange: [50, Dimensions.get("window").height * 0.25 + 85]
    });
    const angle1 = this.heightDetail1.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "180deg"]
    });
    const heightDetail2 = this.heightDetail2.interpolate({
      inputRange: [0, 1],
      outputRange: [50, Dimensions.get("window").height * 0.25 + 85]
    });
    const angle2 = this.heightDetail2.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "180deg"]
    });
    const heightDetail3 = this.heightDetail3.interpolate({
      inputRange: [0, 1],
      outputRange: [50, Dimensions.get("window").height * 0.25 + 85]
    });
    const angle3 = this.heightDetail3.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "180deg"]
    });
    const heightDetail4 = this.heightDetail4.interpolate({
      inputRange: [0, 1],
      outputRange: [50, Dimensions.get("window").height * 0.25 + 85]
    });
    const angle4 = this.heightDetail4.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "180deg"]
    });
    return (
      <View style={{ backgroundColor: "#F7F8F9" }}>
        <DescriptionIcon
          active={this.state.modalActive}
          icon={this.state.iconChoose}
          DeleteDescriptionIconModal={this.DeleteDescriptionIconModal}
        />
        <View style={[styles.levelContainer, { backgroundColor: "#FFFFFF" }]}>
          <View
            style={{
              alignContent: "center",
              flexDirection: "row",
              justifyContent: "center"
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: Dimensions.get("window").width * 0.9
              }}
            >
              <Text style={styles.levelTitle}>{this.state.textActual}</Text>
              <View>
                <OwnIcon
                  name="round_info_icn"
                  click={() => this.DescriptionIconModal("trainingActive")}
                  size={25}
                  color="#3D3D3D"
                />
              </View>
            </View>
          </View>
          <View
            style={{
              height: 10
              // height: Dimensions.get("window").height * 0.25,
              // width: Dimensions.get("window").width * 0.9,
              // flexDirection: "row",
              // backgroundColor: "#3e3"
            }}
          />

          <ScrollView
            horizontal={true}
            contentContainerStyle={{
              height: Dimensions.get("window").height * 0.25 + 15
            }}
            style={{
              width: Dimensions.get("window").width
            }}
            showsHorizontalScrollIndicator={false}
          >
            <View style={{ flexDirection: "row" }}>
              {this.renderActive(level)}
              {this.renderActiveSpecialTrainings()}
            </View>
          </ScrollView>
          <View style={{ height: 30 }} />
          {this.renderSpecialTrainingsScrollview(level)}
          <View style={{ height: 30 }} />
        </View>

        <ImageBackground
          source={require("./../../assets/images/recap/route_summary_banner_ligth_gray.png")}
          style={{
            width: Dimensions.get("window").width,
            height: 50,
            top: -30
          }}
        />
        <View style={{ top: -40 }}>
          <View style={styles.levelContainer}>
            <Animated.View
              style={{
                alignContent: "center",

                flexDirection: "column",
                justifyContent: "flex-start",
                height: heightDetail1,
                backgroundColor: "#F7F8F9"
              }}
            >
              {this.state.animated1 ? (
                <View
                  style={{
                    alignContent: "center",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "center",

                    backgroundColor: "#F7F8F9"
                  }}
                >
                  <TouchableWithoutFeedback
                    onPress={() => this.expandDetail(1)}
                  >
                    <View
                      style={{
                        height: 50,

                        alignContent: "center",
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        width: Dimensions.get("window").width,
                        backgroundColor: "#F7F8F9"
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "flex-start",

                          height: 50,
                          width: Dimensions.get("window").width * 0.05
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            backgroundColor:
                              level === 1 ? getBackground(level) : "#F7F8F9",
                            height: 50,
                            width: 10
                          }}
                        />
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",

                          width: Dimensions.get("window").width * 0.9
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "center"
                          }}
                        >
                          <Text style={styles.levelTitle}>NEWBIE </Text>
                          <Text style={styles.levelTitleNum}>
                            {"[" +
                              this.state.SessionsCompletedFirstLevel +
                              "/4]"}
                          </Text>
                        </View>
                        <Animated.View
                          style={{ transform: [{ rotateZ: angle1 }] }}
                        >
                          <OwnIcon
                            name="arrow_down_icn"
                            size={24}
                            color="#3D3D3D"
                          />
                        </Animated.View>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                  <View
                    style={{
                      height: 10
                    }}
                  />
                  <ScrollView
                    horizontal={true}
                    contentContainerStyle={{
                      height: Dimensions.get("window").height * 0.25 + 15
                    }}
                    showsHorizontalScrollIndicator={false}
                  >
                    {this.renderSessions(level, 1)}
                  </ScrollView>
                  <View
                    style={{
                      height: 10
                    }}
                  />
                </View>
              ) : (
                <View
                  style={{
                    height: 50,
                    alignContent: "center",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    width: Dimensions.get("window").width
                  }}
                >
                  <TouchableWithoutFeedback
                    onPress={() => this.expandDetail(1)}
                  >
                    <View
                      style={{
                        height: 50,

                        alignContent: "center",
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        width: Dimensions.get("window").width,
                        backgroundColor: "#F7F8F9"
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "flex-start",

                          height: 50,
                          width: Dimensions.get("window").width * 0.05
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            backgroundColor:
                              level === 1 ? getBackground(level) : "#F7F8F9",
                            height: 50,
                            width: 10
                          }}
                        />
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          width: Dimensions.get("window").width * 0.9
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "center"
                          }}
                        >
                          <Text style={styles.levelTitle}>NEWBIE </Text>
                          <Text style={styles.levelTitleNum}>
                            {"[" +
                              this.state.SessionsCompletedFirstLevel +
                              "/4]"}
                          </Text>
                        </View>
                        <Animated.View
                          style={{ transform: [{ rotateZ: angle1 }] }}
                        >
                          <OwnIcon
                            name="arrow_down_icn"
                            size={24}
                            color="#3D3D3D"
                          />
                        </Animated.View>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              )}
            </Animated.View>

            <View
              style={{
                height: 1,
                flex: 1,
                backgroundColor: "white"
              }}
            />
          </View>
          <View style={styles.levelContainer}>
            <Animated.View
              style={{
                alignContent: "center",

                flexDirection: "column",
                justifyContent: "flex-start",
                height: heightDetail2,
                backgroundColor: "#F7F8F9"
              }}
            >
              {this.state.animated2 ? (
                <View
                  style={{
                    alignContent: "center",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "center",

                    backgroundColor: "#F7F8F9"
                  }}
                >
                  <TouchableWithoutFeedback
                    onPress={() => this.expandDetail(2)}
                  >
                    <View
                      style={{
                        height: 50,

                        alignContent: "center",
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        width: Dimensions.get("window").width,
                        backgroundColor: "#F7F8F9"
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "flex-start",

                          height: 50,
                          width: Dimensions.get("window").width * 0.05
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            backgroundColor:
                              level === 2 ? getBackground(level) : "#F7F8F9",
                            height: 50,
                            width: 10
                          }}
                        />
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",

                          width: Dimensions.get("window").width * 0.9
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "center"
                          }}
                        >
                          <Text style={styles.levelTitle}>ROOKIE </Text>
                          <Text style={styles.levelTitleNum}>
                            {"[" +
                              this.state.SessionsCompletedSecondLevel +
                              "/4]"}
                          </Text>
                        </View>
                        <Animated.View
                          style={{ transform: [{ rotateZ: angle2 }] }}
                        >
                          <OwnIcon
                            name="arrow_down_icn"
                            size={24}
                            color="#3D3D3D"
                          />
                        </Animated.View>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                  <View
                    style={{
                      height: 10
                    }}
                  />
                  <ScrollView
                    horizontal={true}
                    contentContainerStyle={{
                      height: Dimensions.get("window").height * 0.25 + 15
                    }}
                    showsHorizontalScrollIndicator={false}
                  >
                    {this.renderSessions2(level, 2)}
                  </ScrollView>
                  <View
                    style={{
                      height: 10
                    }}
                  />
                </View>
              ) : (
                <View
                  style={{
                    height: 50,
                    alignContent: "center",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    width: Dimensions.get("window").width
                  }}
                >
                  <TouchableWithoutFeedback
                    onPress={() => this.expandDetail(2)}
                  >
                    <View
                      style={{
                        height: 50,

                        alignContent: "center",
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        width: Dimensions.get("window").width,
                        backgroundColor: "#F7F8F9"
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "flex-start",

                          height: 50,
                          width: Dimensions.get("window").width * 0.05
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            backgroundColor:
                              level === 2 ? getBackground(level) : "#F7F8F9",
                            height: 50,
                            width: 10
                          }}
                        />
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          width: Dimensions.get("window").width * 0.9
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "center"
                          }}
                        >
                          <Text style={styles.levelTitle}>ROOKIE </Text>
                          <Text style={styles.levelTitleNum}>
                            {"[" +
                              this.state.SessionsCompletedSecondLevel +
                              "/4]"}
                          </Text>
                        </View>
                        <Animated.View
                          style={{ transform: [{ rotateZ: angle2 }] }}
                        >
                          <OwnIcon
                            name="arrow_down_icn"
                            size={24}
                            color="#3D3D3D"
                          />
                        </Animated.View>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              )}
            </Animated.View>
            <View
              style={{
                height: 1,
                flex: 1,
                backgroundColor: "white"
              }}
            />
          </View>
          <View style={styles.levelContainer}>
            <Animated.View
              style={{
                alignContent: "center",

                flexDirection: "column",
                justifyContent: "flex-start",
                height: heightDetail3,
                backgroundColor: "#F7F8F9"
              }}
            >
              {this.state.animated3 ? (
                <View
                  style={{
                    alignContent: "center",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "center",

                    backgroundColor: "#F7F8F9"
                  }}
                >
                  <TouchableWithoutFeedback
                    onPress={() => this.expandDetail(3)}
                  >
                    <View
                      style={{
                        height: 50,

                        alignContent: "center",
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        width: Dimensions.get("window").width,
                        backgroundColor: "#F7F8F9"
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "flex-start",

                          height: 50,
                          width: Dimensions.get("window").width * 0.05
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            backgroundColor:
                              level === 3 ? getBackground(level) : "#F7F8F9",
                            height: 50,
                            width: 10
                          }}
                        />
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",

                          width: Dimensions.get("window").width * 0.9
                        }}
                      >
                        <Text style={styles.levelTitle}>PRO</Text>
                        <Animated.View
                          style={{ transform: [{ rotateZ: angle3 }] }}
                        >
                          <OwnIcon
                            name="arrow_down_icn"
                            size={24}
                            color="#3D3D3D"
                          />
                        </Animated.View>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                  <View
                    style={{
                      height: 10
                    }}
                  />
                  <ScrollView
                    horizontal={true}
                    contentContainerStyle={{
                      height: Dimensions.get("window").height * 0.25 + 15,
                      flex: 1 // tolgiere quando ci sono più feed
                    }}
                    showsHorizontalScrollIndicator={false}
                  >
                    {this.renderSessions3(level, 3)}
                  </ScrollView>
                  <View
                    style={{
                      height: 10
                    }}
                  />
                </View>
              ) : (
                <View
                  style={{
                    height: 50,
                    alignContent: "center",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    width: Dimensions.get("window").width
                  }}
                >
                  <TouchableWithoutFeedback
                    onPress={() => this.expandDetail(3)}
                  >
                    <View
                      style={{
                        height: 50,

                        alignContent: "center",
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        width: Dimensions.get("window").width,
                        backgroundColor: "#F7F8F9"
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "flex-start",

                          height: 50,
                          width: Dimensions.get("window").width * 0.05
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            backgroundColor:
                              level === 3 ? getBackground(level) : "#F7F8F9",
                            height: 50,
                            width: 10
                          }}
                        />
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          width: Dimensions.get("window").width * 0.9
                        }}
                      >
                        <Text style={styles.levelTitle}>PRO</Text>
                        <View>
                          <Animated.View
                            style={{ transform: [{ rotateZ: angle3 }] }}
                          >
                            <OwnIcon
                              name="arrow_down_icn"
                              size={24}
                              color="#3D3D3D"
                            />
                          </Animated.View>
                        </View>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              )}
            </Animated.View>
            <View
              style={{
                height: 1,
                flex: 1,
                backgroundColor: "white"
              }}
            />
          </View>
          <View style={styles.levelContainer}>
            <Animated.View
              style={{
                alignContent: "center",

                flexDirection: "column",
                justifyContent: "flex-start",
                height: heightDetail4,
                backgroundColor: "#F7F8F9"
              }}
            >
              {this.state.animated4 ? (
                <View
                  style={{
                    alignContent: "center",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "center",

                    backgroundColor: "#F7F8F9"
                  }}
                >
                  <TouchableWithoutFeedback
                    onPress={() => this.expandDetail(4)}
                  >
                    <View
                      style={{
                        height: 50,

                        alignContent: "center",
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        width: Dimensions.get("window").width,
                        backgroundColor: "#F7F8F9"
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "flex-start",

                          height: 50,
                          width: Dimensions.get("window").width * 0.05
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            backgroundColor:
                              level === 4 ? getBackground(level) : "#F7F8F9",
                            height: 50,
                            width: 10
                          }}
                        />
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",

                          width: Dimensions.get("window").width * 0.9
                        }}
                      >
                        <Text style={styles.levelTitle}>STAR</Text>
                        <Animated.View
                          style={{ transform: [{ rotateZ: angle4 }] }}
                        >
                          <OwnIcon
                            name="arrow_down_icn"
                            size={24}
                            color="#3D3D3D"
                          />
                        </Animated.View>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                  <View
                    style={{
                      height: 10
                    }}
                  />
                  <ScrollView
                    horizontal={true}
                    contentContainerStyle={{
                      height: Dimensions.get("window").height * 0.25 + 15,
                      flex: 1 // tolgiere quando ci sono più feed
                    }}
                    showsHorizontalScrollIndicator={false}
                  >
                    {this.renderSessions4(level, 4)}
                  </ScrollView>
                  <View
                    style={{
                      height: 10
                    }}
                  />
                </View>
              ) : (
                <View
                  style={{
                    height: 50,
                    alignContent: "center",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    width: Dimensions.get("window").width
                  }}
                >
                  <TouchableWithoutFeedback
                    onPress={() => this.expandDetail(4)}
                  >
                    <View
                      style={{
                        height: 50,

                        alignContent: "center",
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        width: Dimensions.get("window").width,
                        backgroundColor: "#F7F8F9"
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "flex-start",

                          height: 50,
                          width: Dimensions.get("window").width * 0.05
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            backgroundColor:
                              level === 4 ? getBackground(level) : "#F7F8F9",
                            height: 50,
                            width: 10
                          }}
                        />
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          width: Dimensions.get("window").width * 0.9
                        }}
                      >
                        <Text style={styles.levelTitle}>STAR</Text>
                        <Animated.View
                          style={{ transform: [{ rotateZ: angle4 }] }}
                        >
                          <OwnIcon
                            name="arrow_down_icn"
                            size={24}
                            color="#3D3D3D"
                          />
                        </Animated.View>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              )}
            </Animated.View>
            <View
              style={{
                height: 1,
                flex: 1,
                backgroundColor: "white"
              }}
            />
          </View>
        </View>
      </View>
    );
  }

  // width: Dimensions.get("window").width * 0.62,
  //   height: Dimensions.get("window").height * 0.25,

  render() {
    if (!this.props.sessions) {
      return (
        <ScrollView
          style={{ flex: 1, marginBottom: 0 }}
          showsVerticalScrollIndicator={false}
          ref={ref => (this.ref = ref)}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
        >
          <View>
            <View
              style={{
                width: Dimensions.get("window").width,
                height: Dimensions.get("window").height * 0.64,
                position: "relative",

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
            </View>
            <View
              style={{
                width: Dimensions.get("window").width,
                height: Dimensions.get("window").height * 0.36
              }}
            />
          </View>
        </ScrollView>
      );
    } else {
      return (
        <ScrollView
          style={{ flex: 1, marginBottom: 0 }}
          showsVerticalScrollIndicator={false}
          ref={ref => (this.ref = ref)}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
        >
          <View
            style={{
              height: 25,
              backgroundColor: "#FFFFFF"
            }}
          />
          {this.renderPage()}
          {/* spazio per vedere i training anche se c'e l'onda o il play attivo */}
          <View
            style={{
              height: Dimensions.get("window").height * 0.23,

              backgroundColor: "#F7F8F9"
            }}
          />
        </ScrollView>
      );
    }
  }
}

const styles = StyleSheet.create({
  levelContainer: {
    width: Dimensions.get("window").width,
    flexDirection: "column"
  },
  levelTitle: {
    color: "#3D3D3D",
    fontSize: 18,
    textAlign: "left",
    fontFamily: "Montserrat-ExtraBold"
  },
  levelTitleNum: {
    color: "#9D9B9C",
    fontSize: 12,
    textAlign: "left",
    fontFamily: "OpenSans-Regular",
    marginVertical: 3
  },
  absolute: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  }
});

if (NativeModules.RNDeviceInfo.model.includes("iPad")) {
  Object.assign(styles, {
    levelTitle: {
      color: "#fff",
      fontSize: 14,
      textAlign: "left",
      fontFamily: "Montserrat-ExtraBold"
    }
  });
}

const getSession = state => state.screen.sessions;

const getSessionState = createSelector(
  [getSession],
  session => session
);

const getSession2 = state => state.screen.sessions2;

const getSessionState2 = createSelector(
  [getSession2],
  session => session
);

const getProfileLogin = state => state.login.infoProfile;

const getProfileState = createSelector(
  [getProfileLogin],
  profile => profile
);

const withData = connect(state => {
  return {
    sessions: getSessionState(state),
    sessions2: getSessionState2(state),
    trainingsState: state.trainings,
    profileState: getProfileState(state)
    // profileState: state.login.infoProfile
  };
});

export default withData(LevelContainer);
