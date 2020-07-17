import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableWithoutFeedback,
  Image,
  NativeModules,
  Animated,
  Easing,
  ActivityIndicator,
  ScrollView
} from "react-native";
import OwnIcon from "../OwnIcon/OwnIcon";
import InteractionManager from "../../helpers/loadingComponent";
import { images, images_bn, listName } from "../InfoUserHome/InfoUserHome";
import SurveySelectAvatarRegister from "../SurveySelectAvatarRegister/SurveySelectAvatarRegister";

import { AvatarList as AvatarListIndex, } from "../SurveySelectAvatarView/SurveySelectAvatarView";

class SurveySelectAvatar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedAvatar: this.props.selectedAvatar,
      animating: false,
      load: false
    };
    this.bounceValue = new Animated.Value(0);
  }

  componentWillMount() {
    this.animateBounceValue();
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        load: true
      });
    });
  }

  animateBounceValue() {
    this.bounceValue.setValue(0);
    this.setState({ animating: true });

    Animated.loop(
      Animated.sequence([
        Animated.timing(this.bounceValue, {
          toValue: 1,
          duration: 800,
          easing: Easing.linear
          // delay: 1000
        }),
        Animated.timing(this.bounceValue, {
          toValue: 0,
          duration: 800,
          easing: Easing.linear
        })
      ]),
      {
        // iterations: 4
      }
    ).start();
  }

  renderTarget = index => {
    if (this.state.selectedAvatar === index + 1) {
      return (
        <View>
          <View
            style={{
              width: 10,
              height: 10,
              position: "absolute",
              top: 0,
              left: 5,
              borderLeftColor: "#707070",
              borderTopColor: "#707070",
              borderLeftWidth: 1,
              borderTopWidth: 1
            }}
          />
          <View
            style={{
              width: 10,
              height: 10,
              position: "absolute",
              top: 0,
              right: 5,
              borderRightColor: "#707070",
              borderTopColor: "#707070",
              borderRightWidth: 1,
              borderTopWidth: 1
            }}
          />
          <View
            style={{
              width: 10,
              height: 10,
              position: "absolute",
              top: 70,
              left: 5,
              borderLeftColor: "#707070",
              borderBottomColor: "#707070",
              borderLeftWidth: 1,
              borderBottomWidth: 1
            }}
          />
          <View
            style={{
              width: 10,
              height: 10,
              position: "absolute",
              top: 70,
              right: 5,
              borderRightColor: "#707070",
              borderBottomColor: "#707070",
              borderRightWidth: 1,
              borderBottomWidth: 1
            }}
          />
        </View>
      );
    }
  };
  render() {
    let translateY = this.bounceValue.interpolate({
      inputRange: [0, 1],
      outputRange: [-10, 0]
    });

    if (this.state.load && this.props.bnAvatarsList) {
      return (
        <View
          style={[
            {
              height: 400
            },
            this.props.style
          ]}
        >
          <ScrollView
            style={[
              {
                height: 255
              },
              styles.flatListContainer,
              this.props.style
            ]}
            showsVerticalScrollIndicator={false}
            ref={c => {
              this.flatList = c;
            }}
          >
            <View
              style={{
                height: 30,
                width: Dimensions.get("window").width
              }}
            />
            <SurveySelectAvatarRegister
              selectedAvatar={this.state.selectedAvatar}
              handleTapAvatar={id => {
                this.setState({ selectedAvatar: id });
                this.props.handleTapAvatar(id);
              }}
              avatarsList={AvatarListIndex(0, 32)}
              
            />
            <View
              style={{
                height: 80,
                width: Dimensions.get("window").width,
                flexDirection: "row",
                justifyContent: "space-around",
                alignContent: "center",
                alignItems: "center"
              }}
            >
              <View
                style={{
                  height: 80,
                  width: Dimensions.get("window").width,
                  flexDirection: "column",
                  justifyContent: "space-around",
                  alignContent: "center",
                  alignItems: "center"
                }}
              >
                <Text
                  style={{
                    fontFamily: "Montserrat-ExtraBold",
                    textAlign: "center",
                    fontSize: 22,
                    color: "#3D3D3D"
                  }}
                >
                  SPECIAL CHARACTERS
                </Text>
                <Text
                  style={{
                    fontFamily: "Montserrat-ExtraBold",
                    textAlign: "center",
                    fontSize: 15,
                    color: "#3D3D3D"
                  }}
                >
                  FROM CENTRO STORICO [PALERMO]
                </Text>
              </View>
            </View>
            <SurveySelectAvatarRegister
              selectedAvatar={this.state.selectedAvatar}
              handleTapAvatar={id => {
                this.setState({ selectedAvatar: id });
                this.props.handleTapAvatar(id);
              }}
              avatarsList={AvatarListIndex(32, 40)}
            />
            <View
              style={{
                height: 40,
                width: Dimensions.get("window").width,
                flexDirection: "row",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center"
              }}
            >
              <View
                style={{
                  height: 40,
                  width: Dimensions.get("window").width,
                  flexDirection: "column",
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center"
                  //
                }}
              >
                <Text
                  style={{
                    fontFamily: "Montserrat-ExtraBold",
                    textAlign: "center",
                    fontSize: 15,
                    color: "#3D3D3D"
                  }}
                >
                  CHRISTMAS EDITION
                </Text>
              </View>
            </View>
            <SurveySelectAvatarRegister
              selectedAvatar={this.state.selectedAvatar}
              handleTapAvatar={id => {
                this.setState({ selectedAvatar: id });
                this.props.handleTapAvatar(id);
              }}
              avatarsList={AvatarListIndex(40, 44)}
            />
            <View
              style={{
                height: 40,
                width: Dimensions.get("window").width,
                flexDirection: "row",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center"
              }}
            >
              <View
                style={{
                  height: 40,
                  width: Dimensions.get("window").width,
                  flexDirection: "column",
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center"
                  //
                }}
              >
                <Text
                  style={{
                    fontFamily: "Montserrat-ExtraBold",
                    textAlign: "center",
                    fontSize: 15,
                    color: "#3D3D3D"
                  }}
                >
                  FROM MUIDE/MEULESTEDE [GHENT]
                </Text>
              </View>
            </View>
            <SurveySelectAvatarRegister
              selectedAvatar={this.state.selectedAvatar}
              handleTapAvatar={id => {
                this.setState({ selectedAvatar: id });
                this.props.handleTapAvatar(id);
              }}
              avatarsList={AvatarListIndex(44, 48)}
            />
            <View
              style={{
                height: 40,
                width: Dimensions.get("window").width,
                flexDirection: "row",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center"
              }}
            >
              <View
                style={{
                  height: 40,
                  width: Dimensions.get("window").width,
                  flexDirection: "column",
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center"
                  //
                }}
              >
                <Text
                  style={{
                    fontFamily: "Montserrat-ExtraBold",
                    textAlign: "center",
                    fontSize: 15,
                    color: "#3D3D3D"
                  }}
                >
                  FROM SANT ANDREU [BARCELONA]
                </Text>
              </View>
            </View>
            <SurveySelectAvatarRegister
              selectedAvatar={this.state.selectedAvatar}
              handleTapAvatar={id => {
                this.setState({ selectedAvatar: id });
                this.props.handleTapAvatar(id);
              }}
              avatarsList={AvatarListIndex(48, 52)}
            />
            <View
              style={{
                height: 40,
                width: Dimensions.get("window").width,
                flexDirection: "row",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center"
              }}
            >
              <View
                style={{
                  height: 40,
                  width: Dimensions.get("window").width,
                  flexDirection: "column",
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center"
                  //
                }}
              >
                <Text
                  style={{
                    fontFamily: "Montserrat-ExtraBold",
                    textAlign: "center",
                    fontSize: 15,
                    color: "#3D3D3D"
                  }}
                >
                  SUSTAINABILITY HEROES
                </Text>
              </View>
            </View>
            <SurveySelectAvatarRegister
              selectedAvatar={this.state.selectedAvatar}
              handleTapAvatar={id => {
                this.setState({ selectedAvatar: id });
                this.props.handleTapAvatar(id);
              }}
              avatarsList={AvatarListIndex(52, 53)}
            />
            <View
              style={{
                height: 40,
                width: Dimensions.get("window").width,
                flexDirection: "row",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center"
              }}
            >
              <View
                style={{
                  height: 40,
                  width: Dimensions.get("window").width,
                  flexDirection: "column",
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center"
                  //
                }}
              >
                <Text
                  style={{
                    fontFamily: "Montserrat-ExtraBold",
                    textAlign: "center",
                    fontSize: 15,
                    color: "#3D3D3D"
                  }}
                >
                  {"From Jätkäsaari [Helsinki]".toUpperCase()}
                </Text>
              </View>
            </View>
            <SurveySelectAvatarRegister
              selectedAvatar={this.state.selectedAvatar}
              handleTapAvatar={id => {
                this.setState({ selectedAvatar: id });
                this.props.handleTapAvatar(id);
              }}
              avatarsList={AvatarListIndex(53, 57)}
            />
            <View
              style={{
                height: 40,
                width: Dimensions.get("window").width,
                flexDirection: "row",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center"
              }}
            >
              <View
                style={{
                  height: 40,
                  width: Dimensions.get("window").width,
                  flexDirection: "column",
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center"
                  //
                }}
              >
                <Text
                  style={{
                    fontFamily: "Montserrat-ExtraBold",
                    textAlign: "center",
                    fontSize: 15,
                    color: "#3D3D3D"
                  }}
                >
                  {"From Pigneto [Roma]".toUpperCase()}
                </Text>
              </View>
            </View>
            <SurveySelectAvatarRegister
              selectedAvatar={this.state.selectedAvatar}
              handleTapAvatar={id => {
                this.setState({ selectedAvatar: id });
                this.props.handleTapAvatar(id);
              }}
              avatarsList={AvatarListIndex(57, 61)}
            />
            <View
              style={{
                height: 40,
                width: Dimensions.get("window").width,
                flexDirection: "row",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center"
              }}
            >
              <View
                style={{
                  height: 40,
                  width: Dimensions.get("window").width,
                  flexDirection: "column",
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center"
                  //
                }}
              >
                <Text
                  style={{
                    fontFamily: "Montserrat-ExtraBold",
                    textAlign: "center",
                    fontSize: 15,
                    color: "#3D3D3D"
                  }}
                >
                  {"From metropolia gzm [Poland]".toUpperCase()}
                </Text>
              </View>
            </View>
            <SurveySelectAvatarRegister
              selectedAvatar={this.state.selectedAvatar}
              handleTapAvatar={id => {
                this.setState({ selectedAvatar: id });
                this.props.handleTapAvatar(id);
              }}
              avatarsList={AvatarListIndex(61, 65)}
            />
            <View
              style={{
                height: 40,
                width: Dimensions.get("window").width,
                flexDirection: "row",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center"
              }}
            >
              <View
                style={{
                  height: 40,
                  width: Dimensions.get("window").width,
                  flexDirection: "column",
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center"
                  //
                }}
              >
                <Text
                  style={{
                    fontFamily: "Montserrat-ExtraBold",
                    textAlign: "center",
                    fontSize: 15,
                    color: "#3D3D3D"
                  }}
                >
                  {"From MVV [Monaco]".toUpperCase()}
                </Text>
              </View>
            </View>
            <SurveySelectAvatarRegister
              selectedAvatar={this.state.selectedAvatar}
              handleTapAvatar={id => {
                this.setState({ selectedAvatar: id });
                this.props.handleTapAvatar(id);
              }}
              avatarsList={AvatarListIndex(65, 69)}
            />
            <View
              style={{
                height: 40,
                width: Dimensions.get("window").width,
                flexDirection: "row",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center"
              }}
            >
              <View
                style={{
                  height: 40,
                  width: Dimensions.get("window").width,
                  flexDirection: "column",
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center"
                  //
                }}
              >
                <Text
                  style={{
                    fontFamily: "Montserrat-ExtraBold",
                    textAlign: "center",
                    fontSize: 15,
                    color: "#3D3D3D"
                  }}
                >
                  {"Teresina".toUpperCase()}
                </Text>
              </View>
            </View>
            <SurveySelectAvatarRegister
              selectedAvatar={this.state.selectedAvatar}
              handleTapAvatar={id => {
                this.setState({ selectedAvatar: id });
                this.props.handleTapAvatar(id);
              }}
              avatarsList={AvatarListIndex(69, 71)}
            />
            <View
              style={{
                height: 40,
                width: Dimensions.get("window").width,
                flexDirection: "row",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center"
              }}
            >
              <View
                style={{
                  height: 40,
                  width: Dimensions.get("window").width,
                  flexDirection: "column",
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center"
                  //
                }}
              >
                <Text
                  style={{
                    fontFamily: "Montserrat-ExtraBold",
                    textAlign: "center",
                    fontSize: 15,
                    color: "#3D3D3D"
                  }}
                >
                  {"CAGLIARI"}
                </Text>
              </View>
            </View>
            <SurveySelectAvatarRegister
              selectedAvatar={this.state.selectedAvatar}
              handleTapAvatar={id => {
                this.setState({ selectedAvatar: id });
                this.props.handleTapAvatar(id);
              }}
              avatarsList={AvatarListIndex(71, 73)}
            />
            <View
              style={{
                width: Dimensions.get("window").width,
                height: 80
              }}
            />
          </ScrollView>
        </View>
      );
    } else {
      return (
        <View
          style={[
            {
              height: 400,
              alignContent: "center",

              alignItems: "center",
              alignSelf: "center"
            },
            this.props.style
          ]}
        >
          <ActivityIndicator
            style={{
              alignContent: "center",
              flex: 1,

              alignItems: "center",
              alignSelf: "center"
            }}
            size="large"
            color="#3d3d3d"
          />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({});

if (NativeModules.RNDeviceInfo.model.includes("iPad")) {
  Object.assign(styles, {
    imageContainer: {
      width: 70,
      height: 70
    },
    image: {
      width: 70,
      height: 70
    },
    flatListContainer: {
      height: 290
    }
  });
}

export const AvatarList = () => {
  let avatars = [];
  for (let i = 0; i < 65; i++) {
    avatars[i] = {
      image: images[i + 1]
    };
  }
  return avatars;
};

export const BnAvatarsList = () => {
  let avatars = [];
  for (let i = 0; i < 65; i++) {
    avatars[i] = {
      image: images_bn[i + 1]
    };
  }
  return avatars;
};

export const NameList = () => {
  let avatars = [];
  for (let i = 0; i < 65; i++) {
    avatars[i] = {
      name: listName[i + 1]
    };
  }
  return avatars;
};

export default SurveySelectAvatar;
