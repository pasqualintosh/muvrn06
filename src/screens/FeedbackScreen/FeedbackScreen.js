/**
 * scena per il riassunto delle domande più frequenti
 * @author push
 */

import React from "react";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Image,
  Alert,
  Platform,
  Linking,
  NativeModules,
  ImageBackground,
  FlatList,
  Keyboard,
  TextInput
} from "react-native";

import LinearGradient from "react-native-linear-gradient";

import { strings } from "../../config/i18n";
import Icon from "react-native-vector-icons/Ionicons";

import ImagePicker from "react-native-image-picker";

import { postUserForm } from "./../../domains/login/ActionCreators";

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);



class FeedbackScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      // per ogni campo choose, ho un elemento nell'array

      // se è choose metto -1, se un campo imput metto ""
      // i dati vengono caricati dal secondo elemento dall'array
      arrayResponse: [0, -1, "", "", -1],
      sendResponse: false
    };
  }

  dataScroll = [
    {
      type: "start",
      idcomponent: 1,
      title: "It's feedback time about your Walking Trip!",
      image: require("../../assets/images/feedback_in_app_header.png")
    },
    {
      type: "choose",
      idcomponent: 2,
      title: "You need to know this feedback about my last MUV trip:",
      response: [
        {
          id: 0,
          response: "I didn’t have any points!"
        },
        {
          id: 1,
          response: "I cheated and you didn’t get it!"
        },
        {
          id: 2,
          response: "Solving Common Problems"
        },
        {
          id: 3,
          response: "Other"
        }
      ]
    },
    {
      type: "input",
      idcomponent: 3,
      title: "Would you like to tell us something more about what happened?",
      placeholder: "Write something"
    },
    {
      type: "loadImage",
      idcomponent: 4,
      title: "Would you like to tell us something more about what happened?",
      image: require("../../assets/images/upload.png"),
      imageComplete: require("../../assets/images/upload_done.png")
    },

    {
      type: "end",
      idcomponent: 5,
      title: "Nullam id dolor id nibh ultricies vehicula ut id elit.",
      image: require("../../assets/images/feedback_done.png")
    },
    {
      type: "last"
    }
  ];

  renderChoose = (categorie, index) => {
    return (
      <View
        style={{
          width: Dimensions.get("window").width,
          justifyContent: "center",
          flexDirection: "row"
        }}
      >
        <View style={styles.categories}>
          <Text style={styles.indexTitle}>{index}</Text>

          <Text style={styles.TopQuestionTitle}>{categorie.title}</Text>

          <View style={{ height: 30 }} />
          {this.renderQuestion(categorie.response, index)}
          {this.continueButton(index + 1)}
        </View>
      </View>
    );
  };

  // inputWrite

  renderInput = (categorie, index) => {
    return (
      <View
        style={{
          width: Dimensions.get("window").width,
          justifyContent: "center",
          flexDirection: "row"
        }}
      >
        <View style={{ height: 15 }} />
        <View style={styles.categories}>
          <Text style={styles.indexTitle}>{index}</Text>

          <Text style={styles.TopQuestionTitle}>{categorie.title}</Text>

          <View style={{ height: 30 }} />
          <TextInput
            value={this.state.arrayResponse[index]}
            autoCapitalize={"none"}
            placeholder={categorie.placeholder}
            placeholderTextColor={"#D1D1D1"}
            style={styles.inputText}
            onChangeText={text => {
              this.inputWrite(index, text);
            }}
            blurOnSubmit={false}
            onSubmitEditing={text => {
              // this.inputWrite(index, text)
              setTimeout(() => {
                Keyboard.dismiss();
              }, 100);
              this.scroll(index + 1);
            }}
            onEndEditing={text => {}}
            returnKeyType={"next"}
          />
          {this.continueButton(index + 1)}
        </View>
      </View>
    );
  };

  loadImage = index => {
    // More info on all the options is below in the API Reference... just some common use cases shown here
    const options = {
      title: "Select Image",
      // customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
      storageOptions: {
        skipBackup: true,
        path: "images"
      }
    };

    /**
     * The first arg is the options object for customization (it can also be null or omitted for default options),
     * The second arg is the callback which sends object: response (more info in the API Reference)
     */

    ImagePicker.showImagePicker(options, response => {
      console.log("Response = ", response);

      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        const source = { uri: response.uri };

        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
        // salvo l'immagine in base64
        this.inputWrite(index, response.data);

        this.setState({
          avatarSource: source,
          dataImage: response.data
        });
      }
    });
  };

  renderLoadImage = (categorie, index) => {
    return (
      <View
        style={{
          width: Dimensions.get("window").width,
          justifyContent: "center",
          flexDirection: "row"
        }}
      >
        <View style={{ height: 15 }} />
        <View style={styles.categories}>
          <Text style={styles.indexTitle}>{index}</Text>

          <Text style={styles.TopQuestionTitle}>{categorie.title}</Text>

          <View style={{ height: 30 }} />
          <View
            style={{
              alignContent: "center",
              alignItems: "center",
              flexDirection: "column",
              justifyContent: "center"
            }}
          >
            {this.state.arrayResponse[index] ? (
              <TouchableOpacity onPress={() => this.loadImage(index)}>
                <Image
                  source={categorie.imageComplete}
                  style={{
                    width: Dimensions.get("window").width * 0.7,
                    height: Dimensions.get("window").width * 0.7
                  }}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => this.loadImage(index)}>
                <Image
                  source={categorie.image}
                  style={{
                    width: Dimensions.get("window").width * 0.7,
                    height: Dimensions.get("window").width * 0.7
                  }}
                />
              </TouchableOpacity>
            )}
            <Text style={styles.limitImageTitle}>Size limit: 10Mb</Text>
          </View>
          {this.continueButton(index + 1)}
        </View>
      </View>
    );
  };

  renderEnd = (categorie, index) => {
    return (
      <View
        style={{
          width: Dimensions.get("window").width,
          justifyContent: "center",
          flexDirection: "row"
        }}
      >
        <View style={{ height: 15 }} />
        <View style={styles.categories}>
          <View
            style={{
              alignContent: "center",
              alignItems: "center",
              flexDirection: "column",
              justifyContent: "center"
            }}
          >
            <Image
              source={categorie.image}
              style={{
                width: Dimensions.get("window").width * 0.7,
                height: Dimensions.get("window").width * 0.7
              }}
            />
            <Text style={styles.TopQuestionTitle}>{categorie.title}</Text>
          </View>

          {this.endButton(index + 1)}
        </View>
      </View>
    );
  };

  selectResponse = (indexStart, indexServer) => {
    this.setState(prevState => {
      arrayResponseNew = prevState.arrayResponse;
      arrayResponseNew[indexStart] = indexServer;
      return {
        arrayResponse: arrayResponseNew
      };
    });
    this.scroll(indexStart + 1);
  };

  inputWrite = (indexStart, text) => {
    this.setState(prevState => {
      arrayResponseNew = prevState.arrayResponse;
      arrayResponseNew[indexStart] = text;
      return {
        arrayResponse: arrayResponseNew
      };
    });
    // this.scroll(indexStart + 1)
  };

  renderQuestion = (questions, indexStart) => {
    console.log(questions);

    return questions.map((elem, index) => (
      <TouchableOpacity
        key={index + indexStart}
        onPress={() => this.selectResponse(indexStart, elem.id)}
        style={[
          styles.categoriesViewList,
          {
            backgroundColor:
              this.state.arrayResponse[indexStart] == elem.id
                ? "#8EC2E6"
                : "#F7F8F9"
          }
        ]}
      >
        <View style={styles.indexResponse}>
          <Text style={styles.indexResponseText}>{index + 1}</Text>
        </View>
        <View style={styles.viewResponse}>
          <Text style={styles.viewResponseText}>{elem.response}</Text>
        </View>
      </TouchableOpacity>
    ));
  };

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        <Text
          style={{
            left: Platform.OS == "android" ? 20 : 0
          }}
        >
          {"Feedback"}
        </Text>
      )
    };
  };

  scroll = indexElement => {
    if (this.FAQScrollView) {
      this.FAQScrollView.scrollToIndex({ index: indexElement });
    }
  };

  renderStart = () => {
    return (
      <View style={styles.startView}>
        <View
          style={{
            paddingTop: 25,
            paddingBottom: 25
          }}
        >
          <Text style={styles.categoriesTitleText}>
            It's feedback time about your Walking Trip!
          </Text>
        </View>

        <ImageBackground
          source={require("../../assets/images/feedback_in_app_header.png")}
          style={{ width: Dimensions.get("window").width, height: 392 }}
        />
        <View
          style={{
            justifyContent: "center",
            flexDirection: "row"
          }}
        >
          <LinearGradient
            start={{ x: 0.0, y: 0.0 }}
            end={{ x: 1.0, y: 0.0 }}
            locations={[0, 1.0]}
            colors={["#7D4D99", "#6497CC"]}
            style={{
              width: Dimensions.get("window").width * 0.4,
              height: 46,
              borderRadius: 23,
              alignItems: "center",
              shadowRadius: 5,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.5,
              elevation: 1
            }}
          >
            <TouchableHighlight
              onPress={() => this.scroll(1)}
              style={{
                width: Dimensions.get("window").width * 0.4,
                height: 46,
                borderRadius: 23,
                alignItems: "center"
              }}

              // disabled={this.props.status === "Inviting" ? true : false}
            >
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Text
                  style={{
                    // margin: 10,
                    color: "#FFFFFF",
                    fontFamily: "OpenSans-Bold",

                    fontSize: 16
                  }}
                >
                  Iniziamo
                </Text>
              </View>
            </TouchableHighlight>
          </LinearGradient>
        </View>
        <View style={{ height: 30 }} />
      </View>
    );
  };

  paddingEnd = () => {
    return <View style={{ height: 200 }} />;
  };

  saveResponse = () => {
    this.setState({
      sendResponse: false
    });
    this.props.navigation.goBack();
  };

  errorResponse = () => {
    this.setState({
      sendResponse: false
    });
    this.props.navigation.goBack();
  };

  sendResponse = () => {
    this.setState({
      sendResponse: true
    });

    this.props.dispatch(
      postUserForm(
        {
          arrayResponse: this.state.arrayResponse
        },
        this.saveResponse(),
        this.errorResponse()
      )
    );
  };

  endButton = index => {
    return (
      <View
        style={{
          justifyContent: "center",
          alignContent: "center",
          flexDirection: "row",
          paddingTop: 30,
          paddingBottom: 30
        }}
      >
        <LinearGradient
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 1.0, y: 0.0 }}
          locations={[0, 1.0]}
          colors={["#7D4D99", "#6497CC"]}
          style={{
            width: Dimensions.get("window").width * 0.4,
            height: 46,
            borderRadius: 23,
            alignItems: "center",
            shadowRadius: 5,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.5,
            elevation: 1
          }}
        >
          <TouchableHighlight
            onPress={() => this.sendResponse(index)}
            style={{
              width: Dimensions.get("window").width * 0.4,
              height: 46,
              borderRadius: 23,
              alignItems: "center"
            }}

            // disabled={this.props.status === "Inviting" ? true : false}
          >
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Text
                style={{
                  // margin: 10,
                  color: "#FFFFFF",
                  fontFamily: "OpenSans-Bold",

                  fontSize: 16
                }}
              >
                Invia
              </Text>
            </View>
          </TouchableHighlight>
        </LinearGradient>
      </View>
    );
  };

  continueButton = index => {
    return (
      <View
        style={{
          justifyContent: "flex-end",
          flexDirection: "row",
          paddingTop: 30,
          paddingBottom: 30
        }}
      >
        <LinearGradient
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 1.0, y: 0.0 }}
          locations={[0, 1.0]}
          colors={["#7D4D99", "#6497CC"]}
          style={{
            width: Dimensions.get("window").width * 0.4,
            height: 46,
            borderRadius: 23,
            alignItems: "center",
            shadowRadius: 5,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.5,
            elevation: 1
          }}
        >
          <TouchableHighlight
            onPress={() => this.scroll(index)}
            style={{
              width: Dimensions.get("window").width * 0.4,
              height: 46,
              borderRadius: 23,
              alignItems: "center"
            }}

            // disabled={this.props.status === "Inviting" ? true : false}
          >
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Text
                style={{
                  // margin: 10,
                  color: "#FFFFFF",
                  fontFamily: "OpenSans-Bold",

                  fontSize: 16
                }}
              >
                continua
              </Text>
            </View>
          </TouchableHighlight>
        </LinearGradient>
      </View>
    );
  };

  render() {
    return (
      <View
        style={{
          backgroundColor: "#fff"
        }}
      >
        <FlatList
          style={{
            backgroundColor: "#fff",
            height: Dimensions.get("window").height,
            width: Dimensions.get("window").width
          }}
          showsVerticalScrollIndicator={false}
          // scrollEventThrottle={10}

          showsVerticalScrollIndicator={false}
          onScrollToIndexFailed={() => {}}
          // onScroll={this.handleScroll.bind(this)}
          ref={ref => (this.FAQScrollView = ref)}
          // initialScrollIndex={this.state.index}
          keyExtractor={(item, index) => index.toString()}
          // onScrollEndDrag={this.handleScrollHeader.bind(this)}
          data={this.dataScroll}
          renderItem={({ item, index }) => {
            console.log(item);
            if (item.type == "start") {
              return this.renderStart();
            } else if (item.type == "choose") {
              return this.renderChoose(item, index);
            } else if (item.type == "input") {
              return this.renderInput(item, index);
            } else if (item.type == "loadImage") {
              return this.renderLoadImage(item, index);
            } else if (item.type == "end") {
              return this.renderEnd(item, index);
            } else {
              return this.paddingEnd(index);
            }
            s;
          }}
        />
      </View>
    );
  }
}

export default FeedbackScreen;

const styles = StyleSheet.create({
  inputText: {
    // textDecorationColor: '#FFFFFF',
    color: "#D1D1D1",
    flex: 1,
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    textAlign: "left",
    fontSize: 12,
    paddingBottom: 8,
    borderBottomColor: "#707070",
    borderBottomWidth: 1
  },
  viewCicle: {
    width: 50,
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center"
  },
  first: {
    flex: 1,
    height:
      Dimensions.get("window").height * 0.1 > 100
        ? Dimensions.get("window").height * 0.1
        : 100,
    flexDirection: "row",
    borderTopColor: "#9D9B9C",
    borderTopWidth: 0.3,
    backgroundColor: "#fff"
  },
  indexResponse: {
    height: 53,
    width: 40,
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center"
  },
  viewResponse: {
    height: 53,
    width: Dimensions.get("window").width - 40,
    flexDirection: "column",
    justifyContent: "center"
  },
  startView: {
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center"
  },
  categoriesViewList: {
    marginTop: 15,
    width: Dimensions.get("window").width * 0.9,
    height: 53,
    justifyContent: "flex-start",
    flexDirection: "row",
    backgroundColor: "#F7F8F9",
    shadowRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    elevation: 1
  },
  rowListTitle: {
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",

    flexDirection: "row"
  },
  rowList: {
    justifyContent: "flex-start",
    alignContent: "center",
    alignItems: "center",

    flexDirection: "row"
  },
  rowListResponse: {
    justifyContent: "flex-start",
    alignContent: "center",
    alignItems: "center",

    flexDirection: "row",
    paddingTop: 8,
    paddingBottom: 8
  },

  categoriesTitleText: {
    //  alignSelf: "flex-start",
    textAlignVertical: "center",
    textAlign: "center",
    fontSize: 20,
    // fontWeight: "bold",
    // left: 20,
    fontFamily: "OpenSans-Bold",
    color: "#3D3D3D"
  },
  TopQuestionTitle: {
    fontSize: 15,
    fontFamily: "OpenSans-Bold",
    color: "#707070"
  },
  limitImageTitle: {
    fontSize: 12,
    fontFamily: "OpenSans-Regular",
    color: "#D5D5D5"
  },
  indexTitle: {
    fontSize: 25,
    fontFamily: "Montserrat-ExtraBold",
    color: "#000000"
  },
  categoriesView: {
    paddingTop: 10,
    paddingBottom: 10,
    width: Dimensions.get("window").width,
    justifyContent: "center",
    flexDirection: "row"
  },
  categories: {
    //height: 20,
    // width: 60,
    paddingTop: 25,
    paddingBottom: 25,
    width: Dimensions.get("window").width * 0.9,
    justifyContent: "flex-start",
    flexDirection: "column"
  },
  categorieText: {
    //  alignSelf: "flex-start",
    // textAlignVertical: "center",
    // textAlign: "left",
    fontSize: 10,
    // fontWeight: "bold",
    // left: 20,
    fontFamily: "OpenSans-Bold",
    color: "#FFFFFF"
  },
  Question: {
    fontSize: 12,
    textAlign: "left",
    // fontWeight: "bold",
    // left: 20,
    fontFamily: "OpenSans-Bold",
    color: "#3D3D3D"
  },
  indexResponseText: {
    fontSize: 15,
    textAlign: "center",
    // fontWeight: "bold",
    // left: 20,
    color: "#000000",
    fontFamily: "Montserrat-ExtraBold"
  },
  viewResponseText: {
    fontSize: 12,
    textAlign: "left",
    // fontWeight: "bold",
    // left: 20,
    color: "#000000",
    fontFamily: "OpenSans-Regular"
  },
  QuestionResponse: {
    fontSize: 12,
    textAlign: "left",
    // fontWeight: "bold",
    // left: 20,
    color: "#707070",
    fontFamily: "OpenSans-Regular"
  },

  other: {
    flex: 1,
    height: Dimensions.get("window").height * 0.1,
    flexDirection: "row",
    borderTopColor: "#9D9B9C",
    borderTopWidth: 0.3,

    backgroundColor: "#fff"
  },
  lastPadding: {
    flex: 1,
    height: Dimensions.get("window").height * 0.2,
    flexDirection: "row"
  },
  last: {
    flex: 1,
    height: Dimensions.get("window").height * 0.1,
    flexDirection: "row",
    borderTopColor: "#9D9B9C",
    borderTopWidth: 0.3
  },
  leftFrequentRoute: {
    // alignSelf: "center",
    // textAlignVertical: "center",
    // flex: 1,
    fontSize: 15,
    fontWeight: "bold"
    // left: 20
  },
  left: {
    alignSelf: "flex-start",
    textAlignVertical: "center",
    textAlign: "left",
    fontSize: 12,
    fontWeight: "bold",
    left: 20,
    fontFamily: "OpenSans-Bold",
    color: "#3D3D3D"
  },
  leftDescription: {
    alignSelf: "auto",
    textAlignVertical: "center",
    textAlign: "left",
    fontSize: 11,
    left: 20,
    fontFamily: "OpenSans-Regular",
    color: "#3D3D3D"
  },
  session: {
    alignSelf: "flex-start",
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "flex-start",
    alignItems: "flex-start",
    flex: 1,
    height: Dimensions.get("window").height * 0.1
  },
  sessionFirst: {
    alignSelf: "flex-start",
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "flex-start",
    alignItems: "flex-start",
    flex: 1,
    height:
      Dimensions.get("window").height * 0.1 > 100
        ? Dimensions.get("window").height * 0.1
        : 100
  },
  right: {
    alignSelf: "center",
    right: 20,
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    fontSize: 13,
    color: "#3D3D3D"
  },
  rightAndroid: {
    alignSelf: "center",
    right: 10
  },
  rightText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    fontSize: 13,
    color: "#3D3D3D"
  },
  centerTextContainer: {
    // width: 200,
    // height: 200,
    position: "absolute",
    top: Dimensions.get("window").height * 0.1 + 190
  },
  centerValue: {
    fontFamily: "Montserrat-ExtraBold",
    color: "#3F3F3F",
    fontSize: 37,
    textAlign: "center",
    textAlignVertical: "center"
  },
  centerTextParam: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#9D9B9C",
    fontSize: 9,
    fontWeight: "bold"
  },
  iconText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#fff",
    fontSize: 10,
    textAlignVertical: "center"
  },
  mfrText: {
    fontFamily: "OpenSans-Regular",
    // color: "black",
    marginRight: 0,
    fontWeight: "bold",
    color: "#3D3D3D",
    fontSize: 13,
    textAlign: "center"
  },
  modalContent: {
    backgroundColor: "white",
    padding: 22,

    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  modalContentAndroid: {
    width: 120,
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  button: {
    backgroundColor: "lightblue",
    padding: 12,
    margin: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  }
});
