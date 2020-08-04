import React from "react";
import {
  View,
  Text,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Platform,
  ImageBackground,
  Animated,
  AsyncStorage,
  NativeModules,
  Alert,
  StatusBar,
  Image,
  ListView,
  RefreshControl,
} from "react-native";

import { connect } from "react-redux";

import OwnIcon from "../../components/OwnIcon/OwnIcon";

import { createSelector } from "reselect";



import InteractionManager from "../../helpers/loadingComponent";

import Aux from "../../helpers/Aux";
import UserItemPooling from "./../../components/UserItemPooling/UserItemPooling";
import WaveTopLive from "./../../components/WaveTopLive/WaveTopLive";
import {getGroupPoolingState} from "../../domains/tracking/Selectors"
import { store } from "../../store";

class PoolingUsersScreen extends React.Component {
  constructor(props) {
    super(props);
    this.clickBack = this.clickBack.bind(this);
    // prendo il nickname 
    const myNickname = store.getState().login.infoProfile && store.getState().login.infoProfile.username  ? store.getState().login.infoProfile.username : "" 
    // vedo se sono il master 
    const masterIs = this.props.groupPooling.filter(elem => elem.master && elem.user.username == myNickname).length ? true : false

    this.state = {
      myNickname,
      masterIs,
      clickDebug: 0,
      modalActive: false,
      iconChoose: null,
      load: false,
      firstCurveData: [
        {
          value: 1,
        },
        {
          value: 2,
        },
        {
          value: 3,
        },
        {
          value: 2,
        },
        {
          value: 1,
        },
        {
          value: 1,
        },
      ],
      firstCurveDataAnimated: [
        {
          value: 1.2,
        },
        {
          value: 2.15,
        },
        {
          value: 3,
        },
        {
          value: 2.2,
        },
        {
          value: 1.1,
        },
        {
          value: 0.85,
        },
      ],
      secondCurveData: [
        {
          value: 0,
        },
        {
          value: 1,
        },
        {
          value: 1.2,
        },
        {
          value: 1.8,
        },
        {
          value: 2.5,
        },
        {
          value: 3,
        },
      ],
      animationLoop: 5,
      curvyWidth: Dimensions.get("window").width * 2 * 5,
      curvyLeft: -Dimensions.get("window").width * 0.75 * 5,
      time: 0,
      interval: 0,
      start: null,
      progress: new Animated.Value(0),
      opacity: 1,
      NumSegment: 0,
      data: [
        {
          month: new Date(2015, 0, 1),
          apples: 3840,
          bananas: 1400,
          cherries: 1200,
          dates: 0,
        },
        {
          month: new Date(2015, 1, 1),
          apples: 1600,
          bananas: 2400,
          cherries: 960,
          dates: -240,
        },
        {
          month: new Date(2015, 2, 1),
          apples: 640,
          bananas: 3500,
          cherries: 3640,
          dates: -1000,
        },
        {
          month: new Date(2015, 3, 1),
          apples: 3320,
          bananas: 480,
          cherries: 640,
          dates: -560,
        },
      ],
      keys1: ["dates"],
      keys: ["bananas", "cherries"],
      totDistanceAlsoNotValid: 0,
      totPointsRoute: 0,
      totPointsAlsoNotValid: 0,
      totPointsSegment: 0,
      totDistanceSegment: 0,
      totPointsSegmentValid: 0,
      hoursTraffic: false,
      pointsLive: 0,
    };
  }

  clickBack = () => {
    this.props.navigation.goBack();
  };

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        <Text
          style={{
            left: Platform.OS == "android" ? 20 : 0,
          }}
        >
          Group
        </Text>
      ),
    };
  };

  componentWillMount() {
    this.updateColorSegment(this.props);
    
  }

  

  componentDidMount() {
    //this.animation.play();
    //console.log(this.animation);

    InteractionManager.runAfterInteractions(() => {
      this.setState({
        load: true,
      });
    });
  }

  componentWillReceiveProps(props) {
    const { activityChoice, distanceLive } = props;

    if (activityChoice && props.activityChoice.type === "") {
      if (this.state.anim) {
        this.state.anim.reset();
      }

      props.navigation.goBack();
    } else {
      if (
        activityChoice &&
        this.props.activityChoice.type != activityChoice.type &&
        activityChoice.type !== ""
      ) {
        // this.animation.play();
        // this.props.navigation.goBack();

        // se cambio mezzo, ricalcolo tutte le informazioni
        this.updateColorSegment(props);
      }
    }
  }

  updateColorSegment = (props) => {
    let r;
    let g;
    let b;

    let modalSplitIndex = 0;

    switch (props.activityChoice.type) {
      case "Walking":
        {
          r = 108;
          g = 186;
          b = 126;
          modalSplitIndex = 0;
        }
        break;
      case "Biking":
        {
          r = 232;
          g = 52;
          b = 117;
          modalSplitIndex = 1;
        }
        break;
      case "Public":
        if (props.activityChoice.coef === 800) {
          r = 250;
          g = 178;
          b = 30;
          modalSplitIndex = 2;
        } else if (props.activityChoice.coef === 1200) {
          r = 250;
          g = 178;
          b = 30;
          modalSplitIndex = 4;
        } else {
          r = 250;
          g = 178;
          b = 30;
          modalSplitIndex = 3;
        }
        break;
        case "Carpooling":
        {
          r = 51;
          g = 99;
          b = 173;
          modalSplitIndex = 5;
        }
        break;


      default:
        {
          r = 108;
          g = 186;
          b = 126;
          modalSplitIndex = 0;
        }
        break;
    }
    const colors = [`rgba(${r}, ${g}, ${b}, 1)`, `rgba(${r}, ${g}, ${b}, 0.4)`];
    this.setState({
      r,
      g,
      b,
      modalSplitIndex,
      colors,
    });
  };

  componentWillUnmount() {}

  moveMap = () => {
    return (
      <TouchableWithoutFeedback
        onPress={() => this.props.navigation.navigate("Mappa")}
        style={{}}
      >
        <View
          style={{
            position: "absolute",
            shadowRadius: 5,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.5,
            backgroundColor: "transparent",
            elevation: 2,
            borderRadius: 20,
            height: 40,
            width: 40,
            alignContent: "center",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "white",
            top: 40,
            right: 40,
          }}
        >
          <OwnIcon name="map_icn" size={35} color={"rgba(61, 61, 61, 1)"} />
        </View>
      </TouchableWithoutFeedback>
    );
  };

  onRefresh() {
    this.setState({ refreshing: true });
    // const loading = setInterval(() => {
    //   if (this.props.standingsState.standing.length > 0) {
    //     this.setState({ refreshing: false });
    //     clearTimeout(loading);
    //   }
    // }, 1000);
  }

  endScroll = (endScrollRefresh) => {
    return (
      <View>
        <View
          style={{
            height: Dimensions.get("window").height / 10,
          }}
        />
        {
          // aggiungo delo spazio in meno dato che il padding lo aggiunto prima su android e quindi qua non lo aggiungo
        }
        <View style={{ height: Dimensions.get("window").height * 0.23 }} />
      </View>
    );
  };

  renderPoolingUsers = () => {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });
    let dataSource = ds.cloneWithRows([]);
    const friends = this.props.groupPooling;
    dataSource = ds.cloneWithRows(friends);

    const number = friends.length;

    

    return (
      <View>
        <ListView
          removeClippedSubviews={false}
          enableEmptySections={true}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh.bind(this)}
            />
          }
          style={styles.challengesList}
          dataSource={dataSource}
          // onScrollEndDrag={this.onScrollEndDrag}
          renderHeader={() => <View
            style={{
              height: 100,
              width: Dimensions.get("window").width,
            }}
          >
            <View
              style={{
                height: 80,
                width: Dimensions.get("window").width,

                // top: -150
              }}
            >
              <WaveTopLive
                width="100%"
                height="50"
                colors={this.state.colors}

                // scale={width/24}
              />
            </View>

            {this.moveMap()}
          </View>}
          renderRow={(item, sectionID, rowID) => {
            const row = parseInt(rowID) + 1;
            
              return (
                <Aux key={rowID}>
                  

                  <UserItemPooling
                    navigation={this.props.navigation}
                    // myProfile={this.myProfile}
                    user={{
                      ...item.user,
                      position: row,
                    }}
                    rowID={rowID}
                    level={"N"}
                    modalType={
                      item.referred_route__user__role
                        ? item.referred_route__user__role === "none" ||
                          item.referred_route__user__role === "muver"
                          ? 0
                          : parseInt(item.referred_route__user__role)
                        : 0
                    }
                    blockRanking={false}
                    community={""}
                    city={""}
                    master={item.master}
                    myNickname={this.state.myNickname}
                    masterIs={this.state.masterIs}
                    all={item}

                  />
                  {number === row ?  this.endScroll() : <View/>}
                </Aux>
              );
          
          }}
        />
      </View>
    );
  };

  render() {
    if (this.state.load) {
      return (
        <Aux style={{}}>
          <StatusBar backgroundColor="white" barStyle="dark-content" />

          <View
            style={{
              width: Dimensions.get("window").width,
              height: Dimensions.get("window").height,
              justifyContent: "flex-start",
              alignItems: "flex-start",
              // backgroundColor: "#3e3"
            }}
          >
            {this.renderPoolingUsers()}
          </View>
        </Aux>
      );
    } else {
      return <View />;
    }
  }
}

const styles = {
  challengesList: {
    height: Dimensions.get("window").height,
    backgroundColor: "#FFFFFF",
  },
  routeParametersLabel: {
    fontFamily: "OpenSans-ExtraBold",
    fontWeight: "bold",
    color: "#3D3D3D",
    fontSize: 14,
    textAlign: "center",
  },
  routeParametersValue: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "600",
    color: "#3D3D3D",
    fontSize: 20,
    textAlign: "center",
  },
  userNameTxt: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "bold",
    color: "#3D3D3D",
    fontSize: 12,
  },
  routeParametersLabel: {
    fontFamily: "OpenSans-ExtraBold",
    fontWeight: "bold",
    color: "#3D3D3D",
    fontSize: 14,
    textAlign: "center",
  },
};

if (NativeModules.RNDeviceInfo.model.includes("iPad")) {
  Object.assign(styles, {
    circle6: {
      width: Dimensions.get("window").width / 4 + 60,
      height: Dimensions.get("window").width / 4 + 60,
      borderRadius: Dimensions.get("window").width / 4,
      justifyContent: "center",
      alignSelf: "center",
      // backgroundColor: "#33e"
    },
  });
}

export const modalSplitImage = {
  0: require("./../../assets/images/live_walk.png"),
  1: require("./../../assets/images/live_bike.png"),
  2: require("./../../assets/images/live_bus.png"),
  3: require("./../../assets/images/live_train.png"),
  4: require("./../../assets/images/live_metro.png"),
};

export const modalSplitBackground = {
  0: require("./../../assets/images/pooling_circles_walk.png"),
  1: require("./../../assets/images/pooling_circles_bike.png"),
  2: require("./../../assets/images/pooling_circles_walk.png"),
  3: require("./../../assets/images/pooling_circles_walk.png"),
  4: require("./../../assets/images/pooling_circles_walk.png"),
  5: require("./../../assets/images/pooling_circles_car.png"),
};

// quali dati prendere

const getStatusButton = (state) => state.login.StatusButton;
const getActivity = (state) => state.tracking.activityChoice;

const getStatusButtonState = createSelector(
  [getStatusButton],
  (StatusButton) => StatusButton
);

const getActivityState = createSelector(
  [getActivity],
  (activityChoice) => activityChoice
);






const withActivity = connect((state, props) => {
  return {

    StatusButton: getStatusButtonState(state),
    activityChoice: getActivityState(state),
   groupPooling: getGroupPoolingState(state)


  };
});

export default withActivity(PoolingUsersScreen);
