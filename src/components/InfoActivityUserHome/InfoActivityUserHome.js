/**
 * InfoUserHome è il componente per visualizzare info sull'utente nella home
 * tra cui immagine profilo, punti, posizione e nome
 * @push
 */

import React from "react";
import {
  View,
  Dimensions,
  StyleSheet,
  Text,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Platform,
} from "react-native";
import pointsDecimal from "../../helpers/pointsDecimal";
import { connect } from "react-redux";
import { createSelector } from "reselect";
import { limitAvatar } from "./../UserItem/UserItem";
import WavyArea from "./../../components/WavyArea/WavyArea";
import LinearGradient from "react-native-linear-gradient";
import {
  getStatusActivityState
} from "../../domains/statistics/Selectors";


import OwnIcon from "../../components/OwnIcon/OwnIcon";
import { strings } from "../../config/i18n";


class InfoActivityUserHome extends React.PureComponent {
  constructor(props) {
    super(props);
  }


  iconForPoints = () => {
    if(this.props.statusActivity.points == 0 && this.props.statusActivity.bonusType) {
      // se non ho punti ma ho una serie in corso faccio apparire yeah e la fiamma 
      return(
     
        <OwnIcon
        name="yeah_icn"
        // click={() => this.DescriptionIconModal("infoTrophies")}
        size={17}
        color="#FFFFFF"
      />
     
     
      )
    } else if(this.props.statusActivity.points == 100) {
      return(
        <OwnIcon
        name="points100_inc"
        // click={() => this.DescriptionIconModal("infoTrophies")}
        size={17}
        color="#FFFFFF"
      />
      )
    } else if(this.props.statusActivity.points == 200) {
      return(
        <OwnIcon
        name="points200_inc"
        // click={() => this.DescriptionIconModal("infoTrophies")}
        size={17}
        color="#FFFFFF"
      />
      )
    } else if(this.props.statusActivity.points == 300) {
      return(
        <OwnIcon
        name="points300_inc"
        // click={() => this.DescriptionIconModal("infoTrophies")}
        size={17}
        color="#FFFFFF"
      />
      )
    } else {
      return(
       <View/>
      )
    }

  }

  bonusSeries = () => {
    if(this.props.statusActivity.bonusType == 0) {
      return(
        <View/>
      )
    } else if(this.props.statusActivity.bonusType == 1) {
      return(
        <Image
        source={require("../../assets/images/fire_green_icn.png")}
        style={{
          width: 12,
          height: 15,
          position: "absolute",
          right: -6,
          top: -10
          
        }}
      />
      )
    } else if(this.props.statusActivity.bonusType == 2) {
      return(
        <Image
        source={require("../../assets/images/fire_blue_icn.png")}
        style={{
          width: 12,
          height: 15,
          position: "absolute",
          right: -6,
          top: -10
          
        }}
      />
      )
    } else if(this.props.statusActivity.bonusType == 3) {
      return(
        <Image
        source={require("../../assets/images/fire_red_icn.png")}
        style={{
          width: 12,
          height: 15,
          position: "absolute",
          right: -6,
          top: -10
          
        }}
      />
      )
    } else {
      return(
        <View/>
      )
    }

  }
 

 

  render() {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: 10,
            height: 10,
          }}
        />
        <Text
          style={{
            fontFamily: "OpenSans-Regular",
            textAlign: "center",
            fontSize: 12,
            color: "white",
            fontWeight: "600", //  // Semibold

            textAlignVertical: "center",
          }}
        >
          {strings("id_1_42") + ":  "}
        </Text>
          <View style={{ borderBottomColor: "#FFFFFF",
            borderBottomWidth: 1, flexDirection: 'row', paggingTop: 1
            }}>
        <Text
          style={{
            fontFamily: "OpenSans-Regular",
            textAlign: "center",
            fontSize: 12,
            color: "white",
           
            textAlignVertical: "center",
          }}
        >
          {this.props.statusActivity.minActivity}
        </Text>
        {/* <Text
          style={{
            fontFamily: "OpenSans-Regular",
            textAlign: "center",
            fontSize: 12,
            color: "white",
            
            textAlignVertical: "center",
          }}
        >
          {" min"}
        </Text> */}
        </View>
        <Text
          style={{
            fontFamily: "OpenSans-Regular",
            textAlign: "center",
            fontSize: 12,
            color: "white",
            
            textAlignVertical: "center",
          }}
        >
          {"  "}
        </Text>
        <View>
        {this.iconForPoints()}
        {this.bonusSeries()}
        </View>
       
        
        
      </View>
    );
  }
}

// {
//   minActivity: 0,
//   points: 0,
//   dateActivity: "",
//   bonusType: 0
// }


const withData = connect((state) => {
  return {
    statusActivity: getStatusActivityState(state),
    
  };
});

export default withData(InfoActivityUserHome);

export const styles = StyleSheet.create({
  Container: {
    height: 140,
    width: Dimensions.get("window").width,
    backgroundColor: "transparent",
    position: "absolute",
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
  },
  gradientContainer: {
    zIndex: -2,
    position: "absolute",
    top: 0,
    width: Dimensions.get("window").width,
    height:
      Platform.OS === "ios"
        ? Dimensions.get("window").height * 0.25 + 86
        : Dimensions.get("window").height * 0.25 +
          Dimensions.get("window").height * 0.1,
  },
  gradientContainerResult: {
    position: "absolute",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.25,
    backgroundColor: "transparent",
    top: 0,
  },
  gradientContainerCurve: {
    position: "absolute",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.1,
    backgroundColor: "transparent",
    top: Dimensions.get("window").height * 0.25,
  },
  gradientContainerImageSun: {
    position: "absolute",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.1,
    backgroundColor: "#fff",
    top:
      Platform.OS === "ios"
        ? Dimensions.get("window").height * 0.25 + 86
        : Dimensions.get("window").height * 0.25 +
          Dimensions.get("window").height * 0.1,
  },
  gradientContainerImageBicycle: {
    position: "absolute",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.2,
    backgroundColor: "#fff",
    top: Dimensions.get("window").height * 0.45,
  },
  gradientContainerListActivity: {
    position: "absolute",
    zIndex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    top: Dimensions.get("window").height * 0.3,
  },
  gradientContainerTextContainer: {
    position: "absolute",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.25,
    backgroundColor: "#fff",
    top: Dimensions.get("window").height * 0.65,
  },
  sunContainer: {
    position: "absolute",
    width: 50,
    height: 50,
    backgroundColor: "transparent",
  },
  centerContainer: {
    alignItems: "center",
    paddingTop: 10,
    height: 40,
    width: Dimensions.get("window").width * 0.9,
    justifyContent: "space-between",
    flexDirection: "row",
  },
  ThreeContainer: {
    width: Dimensions.get("window").width,
    height: 90,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  circle: {
    width: 16,
    height: 16,
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 15,
  },
  leftContainer: {
    width: Dimensions.get("window").width * 0.35,
    height: Dimensions.get("window").height * 0.23,
    backgroundColor: "transparent",
    position: "absolute",
    left: Dimensions.get("window").width * 0.65,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  line: {
    width: "100%",
    height: 2,
    backgroundColor: "#fff",
    marginTop: 45,
  },
});
