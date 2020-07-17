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
import { images, images_bn, listName } from "../InfoUserHome/InfoUserHome";

class SurveySelectAvatarView extends React.Component {
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

  view4Avatar = avatars => {
    return avatars.map((avatar, index) => (
      <View
        key={index * 3}
        style={{
          width: Dimensions.get("window").width,

          flexDirection: "row",
          justifyContent: "flex-start",
          alignContent: "center",
          alignSelf: "center"
        }}
      >
        {this.avatar4(avatar, index)}
      </View>
    ));
  };

  avatar4 = (avatar, index) => {
    console.log(this.props.nameList);
    return avatar.map((item, index2) => (
      <View
        key={item.index}
        style={{
          marginVertical: 12,
          position: "relative",
          width: Dimensions.get("window").width * 0.25
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
        {this.props.nameList[index2 + index * 4].name.length ? 
        <View
          style={{
            paddingTop: 3,
            paddingBottom: 5,
            width: 80,
            justifyContent: "center",
            alignContent: "center",
            flexDirection: "row",
            alignItems: "center",
            alignSelf: "center"
          }}
        >
          <Text
            style={{
              color: "#3D3D3D",
              fontSize: 10,
              textAlign: "center",
              fontFamily: "OpenSans-Regular"
            }}
          >
            {this.props.nameList[index2 + index * 4].name}
          </Text>
        </View> : <View/>}
      </View>
    ));
  };

  render() {
    let translateY = this.bounceValue.interpolate({
      inputRange: [0, 1],
      outputRange: [-10, 0]
    });
    Array.prototype.chunk = function(n) {
      if (!this.length) {
        return [];
      }
      return [this.slice(0, n)].concat(this.slice(n).chunk(n));
    };

    const avatarsList = this.props.avatarsList.chunk(4);

    if (this.state.load) {
      return <View style={{}}>{this.view4Avatar(avatarsList)}</View>;
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

export const AvatarList = (start = 0, end = 65) => {
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

export const NameList = (start = 0, end = 65) => {
  let avatars = [];
  for (let i = start; i < end; i++) {
    avatars = [
      ...avatars,
      {
        name: listName[i + 1],
        index: i
      }
    ];
  }
  return avatars;
};

export const AvatarListBn = (start = 0, end = 65) => {
  let avatars = [];
  for (let i = start; i < end; i++) {
    avatars = [
      ...avatars,
      {
        image: images_bn[i + 1],
        index: i
      }
    ];
  }
  return avatars;
};

export default SurveySelectAvatarView;
