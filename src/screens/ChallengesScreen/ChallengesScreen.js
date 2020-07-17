import React from "react";
import { View, Text, ScrollView, Dimensions } from "react-native";

import WavyArea from "./../../components/WavyArea/WavyArea";
import GradientButton from "./../../components/GradientButton/GradientButton";
import ChallengesCityRecap from "./../../components/ChallengesCityRecap/ChallengesCityRecap";
import OnGoingMatch from "./../../components/OnGoingMatch/OnGoingMatch";
import OnGoingGame from "./../../components/OnGoingGame/OnGoingGame";
import LatestMatch from "./../../components/LatestMatch/LatestMatch";

import { styles, negativeData, positiveData } from "./Style";

class ChallengesScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = { height: 0 };
  }
  render() {
    return (
      <ScrollView style={styles.mainContainer}>
        <View style={styles.yourTeamContainer}>
          <View style={styles.cityLogo} />
          <ChallengesCityRecap
            cityName={"Palermo"}
            cityDescription={"Centro storico"}
            cityStats={"123 | .69% Win"}
            style={styles.challengesCityRecap}
          />
          <GradientButton
            buttonStyle={{ width: 70, alignSelf: "flex-end" }}
            buttonText={"Ranking"}
          />
        </View>
        <OnGoingMatch
          stylesResultContainer={styles.resultContainer}
          homeTeamName={"Palermo"}
          homeTeamDescription={"Centro storico"}
          homeTeamScore={"3"}
          awayTeamName={"Barcellona"}
          awayTeamDescription={"Centro storico"}
          awayTeamScore={"1"}
        />
        <OnGoingGame
          stylesOnGoingContainer={styles.onGoingContainer}
          remainingTime={"6h 18min"}
          points={"12345"}
        />
        <LatestMatch
          stylesPointContainer={styles.pointsContainer}
          homeTeamName={"Palermo"}
          homeTeamScore={"3"}
          awayTeamScore={"0"}
          awayTeamName={"Barcellona"}
        />
        <WavyArea
          data={negativeData}
          color={"#fff"}
          style={styles.overlayWave}
        />
        <WavyArea
          data={positiveData}
          color={"#fff"}
          style={[
            styles.overlayWave,
            { top: Dimensions.get("window").height * 0.5 - 30 }
          ]}
        />
        <WavyArea
          data={negativeData}
          color={"#fff"}
          style={[
            styles.overlayWave,
            { top: Dimensions.get("window").height * 0.5 }
          ]}
        />
        <WavyArea
          data={positiveData}
          color={"#fff"}
          style={[
            styles.overlayWave,
            { top: Dimensions.get("window").height * 0.8 - 30 },
            { height: 40 }
          ]}
        />
        <WavyArea
          data={negativeData}
          color={"#fff"}
          style={[
            styles.overlayWave,
            { top: Dimensions.get("window").height * 0.8 }
          ]}
        />
        <View style={styles.onGoingMatchTextContainer}>
          <Text style={styles.onGoingMatchText}>ONGOING MATCH</Text>
        </View>
        <View
          style={[
            styles.onGoingMatchTextContainer,
            { top: Dimensions.get("window").height * 0.5 }
          ]}
        >
          <Text style={styles.onGoingMatchText}>ONGOING GAME</Text>
        </View>
      </ScrollView>
    );
  }
}

export default ChallengesScreen;
