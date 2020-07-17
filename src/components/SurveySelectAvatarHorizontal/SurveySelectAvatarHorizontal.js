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
  ActivityIndicator
} from "react-native";
import OwnIcon from "../OwnIcon/OwnIcon";
import InteractionManager from "../../helpers/loadingComponent";
import { images } from "../InfoUserHome/InfoUserHome";

class SurveySelectAvatarHorizontal extends React.Component {
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
    if (this.props.selectedAvatar === index + 1) {
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

    if (this.state.load) {
      return (
        <View
          style={[
            {
              height: 400
            },
            this.props.style
          ]}
        >
          <FlatList
            style={[
              {
                height: 255
              },
              styles.flatListContainer,
              this.props.style
            ]}
            horizontal={true}
            refreshing={this.state.refreshing}
            showsVerticalScrollIndicator={false}
            data={this.props.avatarsList}
            // la chiave deve essere una stringa
            keyExtractor={(item, index) => index.toString()}
            // numColumns={4}
            ref={c => {
              this.flatList = c;
            }}
            renderItem={({ item, index }) => {
              return (
                <View
                  key={item.index}
                  style={{
                    flex: 1,
                    marginVertical: 12
                  }}
                >
                  <TouchableWithoutFeedback
                    onPress={() => {
                      this.setState({ selectedAvatar: item.index + 1 });
                      this.props.handleTapAvatar(item.index + 1);
                      this.props.scrollStart();
                      // }
                    }}
                  >
                    <View
                      style={[
                        {
                          alignSelf: "center",
                          width: 80,
                          height: 80
                        },
                        styles.imageContainer
                      ]}
                    >
                      {this.renderTarget(item.index)}
                      <Image
                        style={[
                          {
                            width: 80,
                            height: 80
                          },
                          styles.image
                        ]}
                        source={item.image}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              );
            }}
          />
        </View>
      );
    } else {
      return (
        <View
          style={[
            {
              height: 100,
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

export const AvatarList = (start = 0, end = 44) => {
  let avatars = [];
  for (let i = start; i < end; i++) {
    avatars = [
      ...avatars,
      {
        image: images[i + 1],
        index: i
      }
    ];
  }
  return avatars;
};

export default SurveySelectAvatarHorizontal;
