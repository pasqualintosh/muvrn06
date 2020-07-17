import React from "react";
import {
  View,
  Text as TextReact,
  StyleSheet,
  Dimensions,
  Image
} from "react-native";


import {
  imagesBanners
} from "../../components/FriendItem/FriendItem";

class CityScreenCardsFooter extends React.Component {
  render() {
    return (
      <View style={[styles.footerMainContainer, this.props.style]}>
        <View style={styles.three}>
          <View style={styles.columnView}>
            <View style={styles.rowView}>
              <TextReact style={styles.overall}>{this.props.activeUser}</TextReact>
              {/* <TextReact style={styles.overall}>/</TextReact>
              <TextReact style={styles.overall}>{this.props.user}</TextReact> */}
            </View>
            <View style={styles.rowView}>
              <TextReact style={styles.title}>Active users</TextReact>
            </View>
          </View>
        </View>
        <View style={styles.three}>
          <View style={styles.columnView}>
            <View style={styles.rowView}>
              <Image
                style={{ width: 40, height: 40 }}
                // source={require("../../assets/images/avatars/0Biker1xhdpi.png")}
                source={imagesBanners[this.props.idCity]}
              />
            </View>
          </View>
        </View>
        <View style={styles.three}>
          <View style={styles.columnView}>
            <View style={styles.rowView}>
              <TextReact style={styles.overall}>{this.props.overall}</TextReact>

            </View>
            <View style={styles.rowView}>
              <TextReact style={styles.title}>City Performance</TextReact>
            </View>
          </View>
        </View>



        {/* <View style={styles.leftTextContainer}>
          <View style={styles.textContainer}>
            <TextReact style={styles.modalSplitText}>Footslogger</TextReact>
            <TextReact style={styles.modalSplitResponse}>
              {this.props.walk}
            </TextReact>
          </View>
          <View style={styles.textContainer}>
            <TextReact style={styles.modalSplitText}>Urban cyclist</TextReact>
            <TextReact style={styles.modalSplitResponse}>
              {this.props.bike}
            </TextReact>
          </View>
        </View>
        <View
          style={{
            width: 60,
            height: 40,
            alignSelf: "center"
          }}
        >
              <TextReact style={styles.overall}>{this.props.overall}</TextReact>
            </View>
          
        </View>

        <View style={styles.rightTextContainer}>
          <View style={styles.textContainer}>
            <TextReact style={styles.modalSplitResponse}>
              {this.props.publicTrasport}
            </TextReact>
            <TextReact style={styles.modalSplitText}>Bus lover</TextReact>
          </View>
          <View style={styles.textContainer}>
            <TextReact style={styles.modalSplitResponseWhite}>
              {this.props.walk}
            </TextReact>
            <TextReact style={styles.modalSplitTextWhite}>Bus lover</TextReact>
          </View>

         
        </View> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  footerMainContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "transparent",
    width: Dimensions.get("window").width * 0.9,
    height: Dimensions.get("window").height * 0.1,

    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4
  },
  rowView: {
    justifyContent: "center",
    flexDirection: "row"
  },

  columnView: {
    justifyContent: "center",
    flexDirection: "column"
  },
  three: {
    width: Dimensions.get("window").width * 0.3
  },
  leftTextContainer: {
    width: 120,
    flexDirection: "column",
    justifyContent: "space-around"
  },
  textContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center"
  },
  modalSplitText: {
    color: "#3D3D3D",
    fontSize: 10,
    marginRight: 10,
    textAlignVertical: "center",
    fontFamily: "OpenSans-Regular"
  },
  modalSplitResponse: {
    color: "#3D3D3D",
    fontSize: 13,
    fontWeight: "700",
    textAlignVertical: "center",
    fontFamily: "OpenSans-Regular"
  },
  overall: {
    color: "#3D3D3D",
    fontSize: 15,
    textAlignVertical: "center",
    fontFamily: "Montserrat-ExtraBold"
  },
  title: {
    color: "#3D3D3D",
    fontSize: 10,
    textAlignVertical: "center",
    fontFamily: "OpenSans-Regular"
  },
  modalSplitTextWhite: {
    color: "#ffffff",
    fontSize: 10,
    marginRight: 10,
    textAlignVertical: "center",
    fontFamily: "OpenSans-Regular"
  },
  modalSplitResponseWhite: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "700",
    textAlignVertical: "center",
    fontFamily: "OpenSans-Regular"
  },
  centerText: {
    color: "#3D3D3D",
    fontSize: 47,
    textAlign: "center",
    fontWeight: "800",
    fontFamily: "OpenSans-Regular"
  },
  rightTextContainer: {
    width: 120,
    flexDirection: "column",
    justifyContent: "space-around"
  }
});

export default CityScreenCardsFooter;
