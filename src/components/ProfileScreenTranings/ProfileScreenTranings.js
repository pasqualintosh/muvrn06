import React from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  Platform
} from "react-native";
import LevelContainer from "./../LevelContainer/LevelContainer";

import Settings from "./../../config/Settings";
import DeviceInfo from "react-native-device-info";
// import { Analytics, Hits as GAHits } from "react-native-google-analytics";

import { connect } from "react-redux";
import { createSelector } from "reselect";
import BonusQuestion from "./../../components//BonusQuestion/BonusQuestion";

class ProfileScreenTrainings extends React.Component {
  constructor(props) {
    super(props);
    this.ref = null;
    this.state = {
      enableModal: false,
      completeQuiz: false
    };
  }

  componentWillMount() {
    // const ga = new Analytics(
    //   Settings.analyticsCode,
    //   DeviceInfo.getUniqueID(),
    //   1,
    //   DeviceInfo.getUserAgent()
    // );
    // const screenView = new GAHits.ScreenView(
    //   Settings.analyticsAppName,
    //   this.constructor.name,
    //   DeviceInfo.getReadableVersion(),
    //   DeviceInfo.getBundleId()
    // );
    // ga.send(screenView);
  }

  componentDidMount() {
    // chiedo i dati delle routine al db
    // this.props.dispatch(getMostFrequentRoute());
    // this.props.dispatch(postMostFrequentRouteNotSave());

    if (
      this.props.enableQuiz.length &&
      !this.state.completeQuiz &&
      !this.state.enableModal
    ) {
      this.setState({
        enableModal: true,
        page: "trainings"
      });
    }
  }

  componentWillReceiveProps(props) {
    const { enableQuiz } = props;
    // se ricevo che il quiz si deve attivare e non è ancora attivo, setto lo stato a true
    if (
      enableQuiz.length &&
      !this.state.completeQuiz &&
      !this.state.enableModal
    ) {
      this.setState({
        enableModal: true
      });
    }
  }
  /* 
  static getDerivedStateFromProps(nextProps, prevState) {
    const { enableQuiz } = nextProps;
    // se ricevo che il quiz si deve attivare e non è ancora attivo, setto lo stato a true
    if (
      enableQuiz.length &&
      !prevState.enableModal &&
      !prevState.completeQuiz
    ) {
      return {
        enableModal: true
      };
    }
  }
  */

  deleteModal = () => {
    // dico che il quiz è stato completato cosi non spunta piu
    this.setState({ enableModal: false, completeQuiz: true });
  };

  /* componentDidMount() {
    // this.ref.scrollTo({ x: 0, y: 200, animated: true });
  } */

  render() {
    return (
      <View>
        {this.state.enableModal ? (
          <BonusQuestion
            typeQuiz={this.props.enableQuiz}
            quiz={this.props.trainingsState.quiz}
            idQuiz={this.props.trainingsState.idQuiz}
            deleteModal={this.deleteModal}
            // typeQuiz={this.props.trainingsState.typeQuiz}
          />
        ) : (
          <View />
        )}
        <View style={styles.mainContainer}>
          <LevelContainer trainingsState={this.props.trainingsState} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
    // backgroundColor: "#ffffff20",
    // backgroundColor: "#fff",
    alignSelf: "center"
  }
});
// const infoRoutine = connect();

const getTrainings = state => state.trainings;

const getTypeQuiz = state => state.trainings.typeQuiz;

const getTrainingsState = createSelector(
  [getTrainings],
  trainings => trainings
);

const enableQuizState = createSelector(
  [getTrainingsState],
  trainings =>
    trainings.training_events.filter(elem =>
      elem.event.quiz || elem.event.survey ? elem.status : !elem.status
    ).length
      ? false
      : true
);

// so prendo il quiz solo se non è attivo
const getQuizTypeState = createSelector(
  [getTypeQuiz, getTrainingsState],
  (TypeQuiz, trainings) =>
    trainings.training_events.filter(elem =>
      elem.event.quiz || elem.event.survey ? !elem.status : 0
    ).length
      ? TypeQuiz
      : ""
);

const getScreen = state => state.trainings.selectedScreen;

const getScreenState = createSelector(
  [getScreen],
  screen => (screen ? screen : "myself")
);

const infoRoutine = connect(state => {
  trainingsState = getTrainingsState(state);
  return {
    trainingsState,
    enableQuiz: trainingsState.quiz.length
      ? enableQuizState(state)
        ? getQuizTypeState(state)
        : ""
      : ""
    // enableQuiz: "quiz"
  };
});

export default infoRoutine(ProfileScreenTrainings);
