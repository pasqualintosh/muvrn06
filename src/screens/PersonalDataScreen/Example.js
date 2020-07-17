import React, { Component } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  StyleSheet
} from "react-native";
import Modal from "react-native-modal";

class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleModal: null
    };
  }

  _renderButton = (text, onPress) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.button}>
        <Text>{text}</Text>
      </View>
    </TouchableOpacity>
  );

  _renderModalContent = () => (
    <View style={styles.modalContent}>
      <Text>Hello!</Text>
      {this._renderButton("Close", () => this.setState({ visibleModal: null }))}
    </View>
  );

  _handleOnScroll = event => {
    this.setState({
      scrollOffset: event.nativeEvent.contentOffset.y
    });
  };

  _handleScrollTo = p => {
    if (this.scrollViewRef) {
      this.scrollViewRef.scrollTo(p);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        {this._renderButton("Default modal", () =>
          this.setState({ visibleModal: 1 })
        )}
        {this._renderButton("Sliding from the sides", () =>
          this.setState({ visibleModal: 2 })
        )}
        {this._renderButton("A slower modal", () =>
          this.setState({ visibleModal: 3 })
        )}
        {this._renderButton("Fancy modal!", () =>
          this.setState({ visibleModal: 4 })
        )}
        {this._renderButton("Bottom half modal", () =>
          this.setState({ visibleModal: 5 })
        )}
        {this._renderButton("Modal that can be closed on backdrop press", () =>
          this.setState({ visibleModal: 6 })
        )}
        {this._renderButton("Swipeable modal", () =>
          this.setState({ visibleModal: 7 })
        )}
        {this._renderButton("Scrollable modal", () =>
          this.setState({ visibleModal: 8 })
        )}
        <Modal isVisible={this.state.visibleModal === 1}>
          {this._renderModalContent()}
        </Modal>
        <Modal
          isVisible={this.state.visibleModal === 2}
          animationIn="slideInLeft"
          animationOut="slideOutRight"
        >
          {this._renderModalContent()}
        </Modal>
        <Modal
          isVisible={this.state.visibleModal === 3}
          animationInTiming={2000}
          animationOutTiming={2000}
          backdropTransitionInTiming={2000}
          backdropTransitionOutTiming={2000}
        >
          {this._renderModalContent()}
        </Modal>
        <Modal
          isVisible={this.state.visibleModal === 4}
          backdropColor={"red"}
          backdropOpacity={1}
          animationIn="zoomInDown"
          animationOut="zoomOutUp"
          animationInTiming={1000}
          animationOutTiming={1000}
          backdropTransitionInTiming={1000}
          backdropTransitionOutTiming={1000}
        >
          {this._renderModalContent()}
        </Modal>
        <Modal
          isVisible={this.state.visibleModal === 5}
          style={styles.bottomModal}
        >
          {this._renderModalContent()}
        </Modal>
        <Modal
          isVisible={this.state.visibleModal === 6}
          onBackdropPress={() => this.setState({ visibleModal: null })}
        >
          {this._renderModalContent()}
        </Modal>
        <Modal
          isVisible={this.state.visibleModal === 7}
          onSwipe={() => this.setState({ visibleModal: null })}
          swipeDirection="left"
        >
          {this._renderModalContent()}
        </Modal>
        <Modal
          isVisible={this.state.visibleModal === 8}
          onSwipe={() => this.setState({ visibleModal: null })}
          swipeDirection="down"
          scrollTo={this._handleScrollTo}
          scrollOffset={this.state.scrollOffset}
          scrollOffsetMax={400 - 300} // content height - ScrollView height
          style={styles.bottomModal}
        >
          <View style={styles.scrollableModal}>
            <ScrollView
              ref={ref => (this.scrollViewRef = ref)}
              onScroll={this._handleOnScroll}
              scrollEventThrottle={16}
            >
              <View style={styles.scrollableModalContent1}>
                <Text>Scroll me up</Text>
              </View>
              <View style={styles.scrollableModalContent1}>
                <Text>Scroll me up</Text>
              </View>
            </ScrollView>
          </View>
        </Modal>
        <View style={styles.first}>
          <Text style={styles.Left}> Name </Text>
          <View style={styles.Right}>
            <Text style={styles.RightText}> Giuseppe Baudo</Text>
          </View>
        </View>
        <View style={styles.other}>
          <Text style={styles.Left}> Age </Text>
          <View style={styles.Right}>
            <Text style={styles.RightText}> 28</Text>
          </View>
        </View>
        <View style={styles.other}>
          <Text style={styles.Left}> Sex </Text>
          <View style={styles.Right}>
            <Text style={styles.RightText}> M</Text>
          </View>
        </View>
        <View style={styles.other}>
          <Text style={styles.Left}> Height </Text>
          <View style={styles.Right}>
            <Text style={styles.RightText}> 175 cm</Text>
          </View>
        </View>
        <View style={styles.other}>
          <Text style={styles.Left}> Weight </Text>
          <View style={styles.Right}>
            <Text style={styles.RightText}> 74 Kg</Text>
          </View>
        </View>
        <View style={styles.other}>
          <Text style={styles.Left}> Car </Text>
          <View style={styles.Right}>
            <Switch
              onTintColor="#E83475"
              value={this.state.Car}
              onValueChange={() => this.changeSwitch(1)}
            />
          </View>
        </View>
        <View style={styles.other}>
          <Text style={styles.Left}> Bike Sharing Service </Text>
          <TouchableOpacity
            onPress={this._toggleModal}
            style={{
              alignSelf: "center"
            }}
          >
            <Text style={styles.Right}> {this.state.BikeSharingChoose}</Text>
          </TouchableOpacity>
          <Modal
            isVisible={this.state.isModalVisible}
            onBackdropPress={() => this.setState({ isModalVisible: false })}
          >
            {this._renderModalContent()}
          </Modal>
        </View>

        <View style={styles.other}>
          <Text style={styles.Left}> Car model </Text>
          <View style={styles.Right}>
            <Text style={styles.RightText}> Fiat Panda 1100cc</Text>
          </View>
        </View>
        <View style={styles.other}>
          <Text style={styles.Left}> Bus pass </Text>
          <View style={styles.Right}>
            <Switch
              onTintColor="#E83475"
              value={this.state.BusPass}
              onValueChange={() => this.changeSwitch(2)}
            />
          </View>
        </View>
        <View style={styles.other}>
          <Text style={styles.Left}> Car sharing </Text>
          <View style={styles.Right}>
            <Switch
              onTintColor="#E83475"
              value={this.state.CarSharing}
              onValueChange={() => this.changeSwitch(3)}
            />
          </View>
        </View>
        <View style={styles.other}>
          <Text style={styles.Left}> Bike sharing </Text>
          <View style={styles.Right}>
            <Switch
              onTintColor="#E83475"
              value={this.state.Bikesharing}
              onValueChange={() => this.changeSwitch(4)}
            />
          </View>
        </View>
        <View style={styles.last}>
          <Text style={styles.Left}> Your frequent routes</Text>
        </View>

        <View
          style={{
            height: 75,
            // backgroundColor: "#ABD3DE",
            flexDirection: "row",
            borderRadius: 4,
            marginTop: 7,
            justifyContent: "space-around",
            alignItems: "center",
            left: 10,
            borderRadius: 5,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.5
          }}
        >
          <MapView
            ref={ref => {
              this.mapRef = ref;
            }}
            style={{
              width: Dimensions.get("window").width * 0.6,
              height: 65,
              // justifyContent: "flex-end",
              // alignItems: "flex-end"
              borderRadius: 5,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.5
            }}
            onLayout={() =>
              this.mapRef.fitToCoordinates(
                [
                  { latitude: 37.78825, longitude: -122.4324 },
                  { latitude: 37.8, longitude: -122.46 }
                ],
                {
                  edgePadding: { top: 20, right: 20, bottom: 20, left: 20 },
                  animated: false
                }
              )
            }
            cacheEnabled
            loadingEnabled
          />
          <View
            style={{
              left: -60,
              top: 20
            }}
          >
            <Text style={styles.mfrText}>Home</Text>
          </View>
          <View
            style={{
              width: 36,
              height: 36,
              backgroundColor: "#F7F8F9",
              justifyContent: "center",
              alignItems: "center",
              right: 20,
              borderRadius: 5,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.5
            }}
          >
            <Text style={styles.iconText}>-</Text>
          </View>
        </View>
      </View>
    );
  }
}
export default Example;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
    backgroundColor: "lightblue",
    padding: 12,
    margin: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  bottomModal: {
    justifyContent: "flex-end",
    margin: 0
  },
  scrollableModal: {
    height: 300
  },
  scrollableModalContent1: {
    height: 200,
    backgroundColor: "orange",
    alignItems: "center",
    justifyContent: "center"
  },
  scrollableModalContent2: {
    height: 200,
    backgroundColor: "lightgreen",
    alignItems: "center",
    justifyContent: "center"
  }
});
