import React from "react";
import {
  View,
  Text,
  Dimensions,
  TouchableWithoutFeedback,
  Platform,
  ScrollView,
  Modal
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { years } from "./../../assets/years";
import { styles } from "./Style";

class MotoOwning extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showAutocomplete: false,
      modalVisible: false
    };
  }

  renderScrollAutofocus(optionList) {
    if (this.state.showAutocomplete && this.props.motoOwningAnswer > 0)
      return (
        <View
          style={{
            backgroundColor: this.props.checkboxColor,
            height: 100,
            width: Dimensions.get("window").width * 0.2,
            alignSelf: "center",
            position: "absolute",
            top: Platform.OS === "ios" ? 25 : 90
          }}
        >
          <ScrollView
            onTouchStart={e => {
              this.props.handleOnTouchStart(e);
            }}
            onMomentumScrollEnd={e => {
              this.props.handleOnMomentumScrollEnd(e);
            }}
            onScrollEndDrag={e => {
              this.props.handleOnScrollEndDrag(e);
            }}
          >
            {optionList}
          </ScrollView>
        </View>
      );
  }

  renderModal(optionList) {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.modalVisible}
        onRequestClose={() => {
          // alert("Modal has been closed.");
        }}
        // presentationStyle={"pageSheet"}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            this.setState({ modalVisible: false });
          }}
        >
          <View
            style={{
              marginTop: Dimensions.get("window").width * 0.25,
              width: Dimensions.get("window").width * 0.8,
              height: Dimensions.get("window").width * 0.8, // quadrata
              alignSelf: "center",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#fff"
            }}
          >
            {optionList}
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }

  render() {
    // const optionList = years().map((item, index) => (
    const optionList = this.props.motoYearPossibilities.map((item, index) => (
      <TouchableWithoutFeedback
        key={index}
        onPress={() => {
          this.props.handleOnScrollEndDrag();
          this.props.handleMotoYearChange(item);
          this.props.handleAnimateEngine();
          this.setState({ showAutocomplete: false });
        }}
      >
        <View
          style={{
            borderBottomColor: "#aaa",
            borderBottomWidth: 1,
            height: 25,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Text
            style={{
              fontFamily: "OpenSans-Regular",
              fontWeight: "400",
              color: "#3d3d3d",
              fontSize: 12
            }}
          >
            {item.length ? item.replace(/_/g, " ") : ""}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    ));

    const modalOptionList = this.props.motoYearPossibilities.map(
      (item, index) => (
        <TouchableWithoutFeedback
          key={index}
          onPress={() => {
            this.props.handleOnScrollEndDrag();
            this.props.handleMotoYearChange(item);
            this.setState({ modalVisible: false });
          }}
        >
          <View
            style={{
              width: Dimensions.get("window").width * 0.4,
              height: 30,
              borderBottomColor: "#ccc",
              borderBottomWidth: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#fff"
            }}
          >
            <Text
              style={{
                fontFamily: "OpenSans-Regular",
                fontWeight: "400",
                color: "#3d3d3d",
                fontSize: 14
              }}
            >
              {item.length ? item.replace(/_/g, " ") : ""}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      )
    );
    return (
      <View style={styles.container}>
        {/*
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Do you have a moto?</Text>
        </View> 
        */}
        <View style={styles.mainContainer}>
          <View style={styles.answerContainer}>
            <View style={styles.answerBoxes}>
              <TouchableWithoutFeedback
                onPress={() => this.props.handleMotoOwningAnswer(0)}
              >
                <View style={styles.checkboxesContainer}>
                  <View
                    style={[
                      styles.checkboxes,
                      {
                        backgroundColor: this.props.checkboxColor
                      }
                    ]}
                  >
                    <LinearGradient
                      start={{ x: 0.0, y: 0.0 }}
                      end={{ x: 0.0, y: 1 }}
                      locations={[0, 1.0]}
                      colors={["#E82F73", "#F49658"]}
                      style={[
                        styles.checkboxes,
                        {
                          opacity: this.props.motoOwningAnswer == 0 ? 1 : 0
                        }
                      ]}
                    />
                  </View>
                  <Text style={styles.checkboxesText}>No</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
            <View style={styles.answerBoxes}>
              <TouchableWithoutFeedback
                onPress={() => this.props.handleMotoOwningAnswer(1)}
              >
                <View style={styles.checkboxesContainer}>
                  <View
                    style={[
                      styles.checkboxes,
                      {
                        backgroundColor: this.props.checkboxColor
                      }
                    ]}
                  >
                    <LinearGradient
                      start={{ x: 0.0, y: 0.0 }}
                      end={{ x: 0.0, y: 1 }}
                      locations={[0, 1.0]}
                      colors={["#E82F73", "#F49658"]}
                      style={[
                        styles.checkboxes,
                        {
                          opacity: this.props.motoOwningAnswer == 1 ? 1 : 0
                        }
                      ]}
                    />
                  </View>
                  <Text style={styles.checkboxesText}>Yes, I own it</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
            <View style={styles.answerBoxes}>
              <TouchableWithoutFeedback
                onPress={() => this.props.handleMotoOwningAnswer(2)}
              >
                <View style={styles.checkboxesContainer}>
                  <View
                    style={[
                      styles.checkboxes,
                      {
                        backgroundColor: this.props.checkboxColor
                      }
                    ]}
                  >
                    <LinearGradient
                      start={{ x: 0.0, y: 0.0 }}
                      end={{ x: 0.0, y: 1 }}
                      locations={[0, 1.0]}
                      colors={["#E82F73", "#F49658"]}
                      style={[
                        styles.checkboxes,
                        {
                          opacity: this.props.motoOwningAnswer == 2 ? 1 : 0
                        }
                      ]}
                    />
                  </View>
                  <Text style={styles.checkboxesText}>
                    Yes, it is at my disposal
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
          <View style={styles.yearContainer}>
            <Text style={styles.yearLabel}>Year:</Text>
            <TouchableWithoutFeedback
              onPress={() => {
                if (
                  this.state.showAutocomplete == false &&
                  this.props.motoOwningAnswer > 0
                ) {
                  // this.props.handleAnimateEngine();
                  // this.setState({ showAutocomplete: true });
                  this.setState({ modalVisible: true });
                }
              }}
            >
              <View
                style={[
                  styles.selectYearContainer,
                  { backgroundColor: this.props.checkboxColor }
                ]}
              >
                <Text style={styles.yearText}>
                  {this.props.selectedMotoYear
                    ? this.props.selectedMotoYear.replace(/_/g, " ")
                    : ""}
                </Text>
              </View>
            </TouchableWithoutFeedback>
            {this.renderScrollAutofocus(optionList)}
            {this.renderModal(modalOptionList)}
          </View>
        </View>
      </View>
    );
  }
}

export default MotoOwning;
