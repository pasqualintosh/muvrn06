/**
 * scena per il riassunto della tratta
 * lo zoom si adatta a seconda le coordinate settate in fitToCoordinates
 * con il comppnente MapView.Polyline creiamo un tratto che unisce le coordinate utile per sapere il percorso effettuato
 * MapView.Marker componente per mettere dei punti nella mappa utili per sapere dove è inziato il tracciamento e dove è finito
 * @author push
 */

import React from "react";
import {
  View,
  Text,
  Dimensions,
  ImageBackground,
  Alert,
  Image,
  Platform,
  TouchableWithoutFeedback,
  StyleSheet,
  Animated,
  ScrollView,
  TouchableHighlight,
  FlatList
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import SurveySelectAvatarHorizontal from "../../components//SurveySelectAvatarHorizontal/SurveySelectAvatarHorizontal";

import SurveySelectAvatarView, {
  AvatarList,
  NameList
} from "../../components//SurveySelectAvatarView/SurveySelectAvatarView";

import GoOnButton from "../../components/GoOnButton/GoOnButton";
import WavyArea from "../../components/WavyArea/WavyArea";
import { updateState, getCity } from "./../../domains/register/ActionCreators";
import {
  styles,
  negativeData,
  positiveData
} from "../../components/CustomSurveySlide/Style.js";

import { images } from "../../components/ProfileScreenCards/ProfileScreenCards";
import OwnIcon from "../../components/OwnIcon/OwnIcon";
import { SafeAreaView } from "react-navigation";

import { UpdateProfile } from "./../../domains/login/ActionCreators";
import { connect } from "react-redux";
import InteractionManager from "../../helpers/loadingComponent";

import Svg, { Circle, Line } from "react-native-svg";

import { strings } from "../../config/i18n";
import { changeScreenProfile } from "./../../domains/trainings/ActionCreators";
import { limitAvatar } from "../../components/UserItem/UserItem";

const deviceWidth = Dimensions.get("window").width;
const FIXED_BAR_WIDTH = 280;
const BAR_SPACE = 10;

class DetailChangeAvatarScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      load: false,
      page: "CLASSIC",
      levelCorrent: 0,
      progress: [
        {
          label: "walk",
          value: 0,
          color: "#6CBA7E"
        },
        {
          label: "bike",
          value: 0,
          color: "#E83475"
        },
        {
          label: "bus",
          value: 0,
          color: "#FAB21E"
        },
        {
          label: "car",
          value: 0,
          color: "#60368C"
        },
        {
          label: "motorbike",
          value: 0,
          color: "#5FC4E2"
        },
        {
          label: "car_pooling",
          value: 0,
          color: "#3363AD"
        }
      ],
      avatar: null,
      total: 0,
      hidePassword: true,
      hidePasswordIcon: "ios-eye",
      avatar: null,
      activeBackgroundGeolocation: false,
      mostFrequentRaceFrequency: "-",
      canSlide: false,
      mfrFrequencyPivotFlag: false,
      mfrRoutesPivotFlag: false
    };
  }

  numItems = 4;
  itemWidth = FIXED_BAR_WIDTH / this.numItems - (this.numItems - 1) * BAR_SPACE;
  animVal = new Animated.Value(0);

  handleChangePage = page => {
    this.scrollStart(false);
    this.setState({ page });
  };

  componentDidMount() {
    this.setState({
      avatar: this.props.navigation.getParam("avatar")
    });

    InteractionManager.runAfterInteractions(() => {
      this.setState({
        load: true
      });
    });

    setTimeout(() => {
      if (this.scrollDetailRef) {
        // x: deviceWidth,
        this.scrollDetailRef.scrollTo({
          animated: true,
          x: deviceWidth * (this.props.level_number - 1)
        });
      }
    }, 1000);
  }

  headerChooseType = () => {
    return (
      <View style={styles.endFlex}>
        <View style={styles.mainContainerHeader}>
          {/* <TouchableWithoutFeedback
            onPress={() => this.handleChangePage("MY AVATARS")}
          >
            <View style={styles.sideContainer}>
              <Text
                style={[
                  styles.text,
                  {
                    color:
                      this.state.page == "MY AVATARS" ? "#3D3D3D" : "#9D9B9C"
                  }
                ]}
              >
                MY AVATARS
              </Text>
              <View
                style={[
                  styles.underline,
                  {
                    backgroundColor:
                      this.state.page == "MY AVATARS" ? "#3D3D3D" : "#9D9B9C"
                  }
                ]}
              />
            </View>
          </TouchableWithoutFeedback> */}
          <TouchableWithoutFeedback
            onPress={() => this.handleChangePage("CLASSIC")}
          >
            <View style={styles.sideContainer}>
              <Text
                style={[
                  styles.text,
                  {
                    color: this.state.page == "CLASSIC" ? "#3D3D3D" : "#9D9B9C"
                  }
                ]}
              >
                CLASSIC
              </Text>
              <View
                style={[
                  styles.underline,
                  {
                    backgroundColor:
                      this.state.page == "CLASSIC" ? "#3D3D3D" : "#9D9B9C"
                  }
                ]}
              />
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => this.handleChangePage("SPECIAL")}
          >
            <View style={styles.sideContainer}>
              <Text
                style={[
                  styles.text,
                  {
                    color: this.state.page == "SPECIAL" ? "#3D3D3D" : "#9D9B9C"
                  }
                ]}
              >
                SPECIAL
              </Text>
              <View
                style={[
                  styles.underline,
                  {
                    backgroundColor:
                      this.state.page == "SPECIAL" ? "#3D3D3D" : "#9D9B9C"
                  }
                ]}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  };

  ConfermNewAvatar = () => {
    const avatar = this.props.navigation.getParam("avatar");
    const saveData = this.props.navigation.getParam(
      "ConfermNewAvatar",
      avatar =>
        this.props.dispatch(
          UpdateProfile({
            data: {
              public_profile: { avatar }
            }
          })
        )
    );
    if (avatar !== this.state.avatar) {
      saveData(this.state.avatar);
    }
    // this.props.navigation.goBack();
    this.props.dispatch(changeScreenProfile("myself"));
    this.props.navigation.navigate("Info");
  };

  handleTapAvatar = id => {
    this.setState({ avatar: id, canSlide: true }, () => {
      const saveData = this.props.navigation.getParam(
        "ConfermNewAvatar",
        () => {}
      );
      saveData(this.state.avatar);
    });
  };

  static navigationOptions = {
    headerTitle: (
      <Text
        style={{
          left: Platform.OS == "android" ? 20 : 0
        }}
      >
        Avatar
      </Text>
    )
  };

  traslate = new Animated.Value(0);

  // click relativo all'avvio dell'animazione
  onClickAnimated = () => {
    // unisco tre animazioni relative a
    // x , y e opacita
    // in 350 ms il valore corrente nello stato deve diventare 100 nel corso del tempo
    let level = this.state.levelCorrent < 3 ? this.state.levelCorrent + 1 : 3;
    this.setState(prevState => {
      return { animated: true, levelCorrent: level };
    });
    // this.traslate.setValue(0);

    Animated.spring(this.traslate, {
      toValue: level,
      duration: 250,

      isInteraction: true
    }).start(
      this.setState(prevState => {
        return { animated: false };
      })
    );
    // poi setto che ho fatto l'animazione di apertura nello stato, utile per poi fare quella di chiusura
  };

  // relativa all'animazione di chiusura
  // metodo dopo l'animazionez
  onClickAnimatedClose = () => {
    // cambia il valore dì animated dello stato per dire che ho chiuso il menu con l'animazione di chiusura
    const level = this.state.levelCorrent > 0 ? this.state.levelCorrent - 1 : 0;
    this.setState(prevState => {
      return { animated: true, levelCorrent: level };
    });
    Animated.spring(this.traslate, {
      toValue: level,
      duration: 250,

      isInteraction: true
    }).start(
      this.setState(prevState => {
        return { animated: false };
      })
    );
  };

  handleScroll(event) {
    const x = event.nativeEvent.contentOffset.x;
    console.log(x);
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

  renderAvatarView() {
    let avatar = this.props.navigation.getParam("avatar", 1);

    avatar = limitAvatar(avatar);

    return (
      <ScrollView
        contentContainerStyle={{ paddingBottom: 300 }}
        showsVerticalScrollIndicator={false}
        ref={ref => (this.scrollViewRef = ref)}
      >
        <View
          style={{
            // height: Dimensions.get("window").height,
            flexDirection: "row",
            // width: Dimensions.get("window").width * 0.8,
            justifyContent: "flex-start",
            alignContent: "center",
            alignSelf: "center",
            alignItems: "center"
          }}
        >
          <ScrollView
            horizontal //scrolling left to right instead of top to bottom
            showsHorizontalScrollIndicator={false} //hides native scrollbar
            scrollEventThrottle={10} //how often we update the position of the indicator bar
            pagingEnabled //scrolls from one image to the next, instead of allowing any value inbetween
            ref={ref => (this.scrollDetailRef = ref)}
            onScroll={this.handleScroll.bind(this)}
          >
            <View
              style={{
                flexDirection: "column",
                width: deviceWidth,
                justifyContent: "center",
                alignContent: "center",
                alignSelf: "center",
                alignItems: "center"
              }}
            >
              <Text style={styles.labelLevel}>NEWBIE</Text>
              <Image
                style={styles.avatarImage}
                // source={require("../../assets/images/avatars/0Biker1xhdpi.png")}
                source={
                  images[this.state.avatar ? this.state.avatar : avatar][
                    this.props.role
                  ][0]
                }
              />
            </View>
            <View
              style={{
                flexDirection: "column",
                width: deviceWidth,
                justifyContent: "center",
                alignContent: "center",
                alignContent: "center",
                alignSelf: "center",
                alignItems: "center"
              }}
            >
              <Text style={styles.labelLevel}>ROOKIE</Text>
              <Image
                style={[
                  styles.avatarImage,
                  this.props.level_number > 1 ? {} : { tintColor: "lightgray" }
                ]}
                // source={require("../../assets/images/avatars/0Biker1xhdpi.png")}
                source={
                  images[this.state.avatar ? this.state.avatar : avatar][
                    this.props.role
                  ][1]
                }
              />
            </View>
            <View
              style={{
                flexDirection: "column",
                width: deviceWidth,
                justifyContent: "center",
                alignContent: "center",
                alignContent: "center",
                alignSelf: "center",
                alignItems: "center"
              }}
            >
              <Text style={styles.labelLevel}>PRO</Text>
              <Image
                style={[
                  styles.avatarImage,
                  this.props.level_number > 2 ? {} : { tintColor: "lightgray" }
                ]}
                // source={require("../../assets/images/avatars/0Biker1xhdpi.png")}
                source={
                  images[this.state.avatar ? this.state.avatar : avatar][
                    this.props.role
                  ][2]
                }
              />
            </View>
            <View
              style={{
                flexDirection: "column",
                width: deviceWidth,
                justifyContent: "center",
                alignContent: "center",
                alignContent: "center",
                alignSelf: "center",
                alignItems: "center"
              }}
            >
              <Text style={styles.labelLevel}>STAR</Text>
              <Image
                style={[
                  styles.avatarImage,
                  this.props.level_number > 3 ? {} : { tintColor: "lightgray" }
                ]}
                // source={require("../../assets/images/avatars/0Biker1xhdpi.png")}
                source={
                  images[this.state.avatar ? this.state.avatar : avatar][
                    this.props.role
                  ][3]
                }
              />
            </View>
          </ScrollView>
        </View>

        <View
          style={{
            flexDirection: "row",
            flex: 1,
            alignContent: "center",
            justifyContent: "center",
            top: -20
          }}
        >
          {[1, 2, 3, 4].map((elem, index) => (
            <Svg key={index} height={30} width={30} viewBox="0 0 100 100">
              <Circle
                cx="50"
                cy="50"
                r="12"
                //stroke="white"
                fill={index === this.state.levelCorrent ? "#3D3D3D" : "#9D9B9C"}
              />
            </Svg>
          ))}
        </View>
        {this.state.page === "CLASSIC"
          ? this.renderAvatarsList()
          : this.renderAvatarsSpecialList()}
      </ScrollView>
    );
  }

  renderAvatarsList() {
    const avatar = this.props.navigation.getParam("avatar");

    return (
      <View style={{}}>
        {/* <SurveySelectAvatarHorizontal
          selectedAvatar={this.state.avatar ? this.state.avatar : avatar}
          handleTapAvatar={id => this.handleTapAvatar(id)}
          {...this.props}
          avatarsList={AvatarList(0, 32)}
          style={{ height: 100 }}
          scrollStart={this.scrollStart}
        /> */}
        <SurveySelectAvatarView
          selectedAvatar={this.state.avatar ? this.state.avatar : avatar}
          handleTapAvatar={id => this.handleTapAvatar(id)}
          {...this.props}
          avatarsList={AvatarList(0, 32)}
          scrollStart={this.scrollStart}
          nameList={NameList(0, 32)}
        />
      </View>
    );
  }

  scrollStart = (animated = true) => {
    // if (this.scrollViewRef) {
    //   console.log('scroll');
    // this.scrollViewRef.scrollToEnd({animated: true})
    if (this.scrollViewRef) {
      this.scrollViewRef.scrollTo({ x: 0, y: 0, animated: animated });
    }
  };

  renderAvatarsSpecialList() {
    const avatar = this.props.navigation.getParam("avatar");

    return (
      <View style={{ paddingTop: 10 }}>
        <View
          style={{
            paddingLeft: Dimensions.get("window").width * 0.1
          }}
        >
          <Text style={styles.headerText}>SUSTAINABILITY HEROES</Text>
        </View>

        <SurveySelectAvatarView
          selectedAvatar={this.state.avatar ? this.state.avatar : avatar}
          handleTapAvatar={id => this.handleTapAvatar(id)}
          {...this.props}
          avatarsList={AvatarList(52, 53)}
          scrollStart={this.scrollStart}
          nameList={NameList(52, 53)}
        />
        <View
          style={{
            paddingLeft: Dimensions.get("window").width * 0.1,
            paddingTop: 10
          }}
        >
          <Text style={styles.headerText}>FROM CENTRO STORICO [PALERMO]</Text>
        </View>
        {/* <SurveySelectAvatarHorizontal
          selectedAvatar={this.state.avatar ? this.state.avatar : avatar}
          handleTapAvatar={id => this.handleTapAvatar(id)}
          {...this.props}
          avatarsList={AvatarList(32, 40)}
          style={{ height: 100 }}
          scrollStart={this.scrollStart}
        /> */}
        <SurveySelectAvatarView
          selectedAvatar={this.state.avatar ? this.state.avatar : avatar}
          handleTapAvatar={id => this.handleTapAvatar(id)}
          {...this.props}
          avatarsList={AvatarList(32, 40)}
          scrollStart={this.scrollStart}
          nameList={NameList(32, 40)}
        />
        <View
          style={{
            paddingLeft: Dimensions.get("window").width * 0.1,
            paddingTop: 10
          }}
        >
          <Text style={styles.headerText}>FROM MUIDE/MEULESTEDE [GHENT]</Text>
        </View>
        {/* <SurveySelectAvatarHorizontal
          selectedAvatar={this.state.avatar ? this.state.avatar : avatar}
          handleTapAvatar={id => this.handleTapAvatar(id)}
          {...this.props}
          avatarsList={AvatarList(44, 48)}
          style={{ height: 100 }}
          scrollStart={this.scrollStart}
        /> */}
        <SurveySelectAvatarView
          selectedAvatar={this.state.avatar ? this.state.avatar : avatar}
          handleTapAvatar={id => this.handleTapAvatar(id)}
          {...this.props}
          avatarsList={AvatarList(44, 48)}
          scrollStart={this.scrollStart}
          nameList={NameList(44, 48)}
        />
        <View
          style={{
            paddingLeft: Dimensions.get("window").width * 0.1,
            paddingTop: 10
          }}
        >
          <Text style={styles.headerText}>FROM SANT ANDREU [BARCELONA]</Text>
        </View>
        {/* <SurveySelectAvatarHorizontal
          selectedAvatar={this.state.avatar ? this.state.avatar : avatar}
          handleTapAvatar={id => this.handleTapAvatar(id)}
          {...this.props}
          avatarsList={AvatarList(48, 52)}
          style={{ height: 100 }}
          scrollStart={this.scrollStart}
        /> */}
        <SurveySelectAvatarView
          selectedAvatar={this.state.avatar ? this.state.avatar : avatar}
          handleTapAvatar={id => this.handleTapAvatar(id)}
          {...this.props}
          avatarsList={AvatarList(48, 52)}
          scrollStart={this.scrollStart}
          nameList={NameList(48, 52)}
        />
        <View
          style={{
            paddingLeft: Dimensions.get("window").width * 0.1,
            paddingTop: 10
          }}
        >
          <Text style={styles.headerText}>
            {"From Jätkäsaari [Helsinki]".toUpperCase()}
          </Text>
        </View>
        {/* <SurveySelectAvatarHorizontal
          selectedAvatar={this.state.avatar ? this.state.avatar : avatar}
          handleTapAvatar={id => this.handleTapAvatar(id)}
          {...this.props}
          avatarsList={AvatarList(48, 52)}
          style={{ height: 100 }}
          scrollStart={this.scrollStart}
        /> */}
        <SurveySelectAvatarView
          selectedAvatar={this.state.avatar ? this.state.avatar : avatar}
          handleTapAvatar={id => this.handleTapAvatar(id)}
          {...this.props}
          avatarsList={AvatarList(53, 57)}
          scrollStart={this.scrollStart}
          nameList={NameList(53, 57)}
        />
        <View
          style={{
            paddingLeft: Dimensions.get("window").width * 0.1,
            paddingTop: 10
          }}
        >
          <Text style={styles.headerText}>
            {"From Pigneto [Roma]".toUpperCase()}
          </Text>
        </View>
        <SurveySelectAvatarView
          selectedAvatar={this.state.avatar ? this.state.avatar : avatar}
          handleTapAvatar={id => this.handleTapAvatar(id)}
          {...this.props}
          avatarsList={AvatarList(57, 61)}
          scrollStart={this.scrollStart}
          nameList={NameList(57, 61)}
        />

        <View
          style={{
            paddingLeft: Dimensions.get("window").width * 0.1,
            paddingTop: 10
          }}
        >
          <Text style={styles.headerText}>
            {"From metropolia gzm [Poland]".toUpperCase()}
          </Text>
        </View>
        <SurveySelectAvatarView
          selectedAvatar={this.state.avatar ? this.state.avatar : avatar}
          handleTapAvatar={id => this.handleTapAvatar(id)}
          {...this.props}
          avatarsList={AvatarList(61, 65)}
          scrollStart={this.scrollStart}
          nameList={NameList(61, 65)}
        />
        <View
          style={{
            paddingLeft: Dimensions.get("window").width * 0.1,
            paddingTop: 10
          }}
        >
          <Text style={styles.headerText}>
            {/* {"From MVV [Monaco]".toUpperCase()} */}
            {"MVV Region [Munich]".toUpperCase()}
          </Text>
        </View>
        <SurveySelectAvatarView
          selectedAvatar={this.state.avatar ? this.state.avatar : avatar}
          handleTapAvatar={id => this.handleTapAvatar(id)}
          {...this.props}
          avatarsList={AvatarList(65, 69)}
          scrollStart={this.scrollStart}
          nameList={NameList(65, 69)}
        />
        <View
          style={{
            paddingLeft: Dimensions.get("window").width * 0.1,
            paddingTop: 10
          }}
        >
          <Text style={styles.headerText}>{"Teresina".toUpperCase()}</Text>
        </View>
        <SurveySelectAvatarView
          selectedAvatar={this.state.avatar ? this.state.avatar : avatar}
          handleTapAvatar={id => this.handleTapAvatar(id)}
          {...this.props}
          avatarsList={AvatarList(69, 71)}
          scrollStart={this.scrollStart}
          nameList={NameList(69, 71)}
        />
        <View
          style={{
            paddingLeft: Dimensions.get("window").width * 0.1,
            paddingTop: 10
          }}
        >
          <Text style={styles.headerText}>{"Cagliari".toUpperCase()}</Text>
        </View>
        <SurveySelectAvatarView
          selectedAvatar={this.state.avatar ? this.state.avatar : avatar}
          handleTapAvatar={id => this.handleTapAvatar(id)}
          {...this.props}
          avatarsList={AvatarList(71, 73)}
          scrollStart={this.scrollStart}
          nameList={NameList(71, 73)}
        />
        <View
          style={{
            paddingLeft: Dimensions.get("window").width * 0.1,
            paddingTop: 10
          }}
        >
          <Text style={styles.headerText}>CHRISTMAS EDITION</Text>
        </View>
        <SurveySelectAvatarView
          selectedAvatar={this.state.avatar ? this.state.avatar : avatar}
          handleTapAvatar={id => this.handleTapAvatar(id)}
          {...this.props}
          avatarsList={AvatarList(40, 44)}
          scrollStart={this.scrollStart}
          nameList={NameList(40, 44)}
        />
      </View>
    );
  }

  render() {
    const endBoxScroll = Platform.OS === "ios" ? 180 : 160;
    if (this.state.load) {
      return (
        <View>
          <ImageBackground
            source={require("../../assets/images/bg-login.png")}
            style={styles.backgroundImage}
          >
            {/* BODY */}
            <SafeAreaView
              style={{
                height: Dimensions.get("window").height,
                width: Dimensions.get("window").width,
                backgroundColor: "transparent"
              }}
            >
              {this.headerChooseType()}

              {this.renderAvatarView()}
            </SafeAreaView>
            <ImageBackground
              source={require("../../assets/images/white_wave_profile.png")}
              style={style.backgroundImageWaveDown}
            >
              <View
                style={{
                  height: 180,
                  backgroundColor: "transparent",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  alignContent: "center"
                }}
              >
                <View
                  // start={{ x: 0.0, y: 0.0 }}
                  // end={{ x: 0.0, y: 1.0 }}
                  // locations={[0, 1.0]}
                  // colors={["#6497cc", "#7d4d99"]}
                  style={{
                    width: Dimensions.get("window").width,
                    height: 140,
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignContent: "center"
                  }}
                >
                  <View style={style.buttonContainer}>
                    <LinearGradient
                      start={{ x: 0.0, y: 0.0 }}
                      end={{ x: 0.0, y: 1.0 }}
                      locations={[0, 1.0]}
                      colors={["#E82F73", "#F49658"]}
                      style={style.buttonBox}
                    >
                      <TouchableHighlight
                        onPress={() => this.ConfermNewAvatar()}
                        style={{
                          width: Dimensions.get("window").width * 0.68,
                          height: 40,

                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: 3
                        }}
                      >
                        <View
                          style={{
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                        >
                          <Text style={style.buttonGoOnText}>
                            {strings("ok")}
                          </Text>
                        </View>
                      </TouchableHighlight>
                    </LinearGradient>
                  </View>
                </View>
              </View>
            </ImageBackground>
          </ImageBackground>
        </View>
      );
    } else {
      return <View />;
    }
  }
}

const style = StyleSheet.create({
  mainContainer: {
    justifyContent: "center",
    alignItems: "center"
  },
  titleContainer: {
    position: "absolute",
    top: 0,
    // top:
    //   Platform.OS === "ios"
    //     ? Dimensions.get("window").height * 0 + 18
    //     : Dimensions.get("window").height * 0,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.15,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center"
  },
  titleIconContainer: {},
  textTitle: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#3d3d3d",
    fontSize: 14,
    marginVertical: 1,
    fontWeight: "bold"
  },
  iconContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around"
  },
  contentContainer: {
    position: "absolute",
    top: Dimensions.get("window").height * 0.15,
    width: Dimensions.get("window").width * 0.8,
    height: Dimensions.get("window").height * 0.8,
    backgroundColor: "transparent"
  },
  footerContainer: {
    position: "absolute",
    top: Dimensions.get("window").height * 0.7,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.3,
    backgroundColor: "violet"
  },
  overlayWave: {
    width: Dimensions.get("window").width,
    height: 100
  },
  backgroundImage: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
  },
  backgroundImageWave: {
    height: 100,
    width: Dimensions.get("window").width,
    position: "absolute"
    // top: Dimensions.get("window").height * 0.04 + 14
  },
  backgroundImageWaveDown: {
    height: 180,
    width: Dimensions.get("window").width,
    position: "absolute",
    bottom: 0
  },
  buttonContainer: {
    width: Dimensions.get("window").width,
    height: 80,
    backgroundColor: "transparent",
    position: "absolute",
    justifyContent: "flex-start",
    alignItems: "center",
    shadowRadius: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5
  },
  buttonBox: {
    width: Dimensions.get("window").width * 0.68,
    height: 40,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 3,
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 3 },
    elevation: 1
  },
  buttonGoOnText: {
    color: "#3363AD",
    fontFamily: "OpenSans-Regular",
    fontSize: 14,
    color: "#FFFFFF"
  }
});

const withData = connect(state => {
  return {
    role: state.login.role
      ? state.login.role.roleUser
        ? state.login.role.roleUser
        : 0
      : 0,
    level_number: state.trainings.level_number
      ? state.trainings.level_number
      : 1
  };
});

export default withData(DetailChangeAvatarScreen);
