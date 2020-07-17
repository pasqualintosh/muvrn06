import React from "react";
import { View, Text, Dimensions, ListView } from "react-native";
import LinearGradient from "react-native-linear-gradient";


import { styles, negativeData, positiveData, cities } from "./Style";
import WavyArea from "./../../components/WavyArea/WavyArea";
import CityItem from "./../../components/CityItem/CityItem";

class CitiesStandings extends React.Component {
  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.state = {
      dataSource: ds.cloneWithRows(cities)
    };
  }
  render() {
    return (
      <View style={styles.mainContainer}>
        <LinearGradient
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 0.0, y: 1.0 }}
          locations={[0, 1.0]}
          colors={["#C8DBAE", "#ACDBE5"]}
          style={styles.header}
        />
        <ListView
          removeClippedSubviews={false}
          dataSource={this.state.dataSource}
          renderRow={(city, sectionID, rowID) => (
            <CityItem
              stylesCityItem={styles.cityItem}
              key={city.position}
              city={city}
              rowID={rowID}
            />
          )}
        />
        <WavyArea
          data={positiveData}
          color={"#fff"}
          style={[
            styles.overlayWave,
            { top: Dimensions.get("window").height * 0.12 - 20 }
          ]}
        />
        <View style={styles.tableHeader}>
          <View style={[styles.cityColumn, styles.cityColumnPosition]} />
          <View style={[styles.cityColumn, styles.cityColumnName]}>
            <Text style={styles.headerText}>TEAM</Text>
          </View>
          <View style={[styles.cityColumn, styles.cityColumnWon]}>
            <Text style={styles.headerText}>WON</Text>
          </View>
          <View style={[styles.cityColumn, styles.cityColumnLost]}>
            <Text style={styles.headerText}>LOST</Text>
          </View>
          <View style={[styles.cityColumn, styles.cityColumnPercentage]}>
            <Text style={styles.headerText}>WIN %</Text>
          </View>
        </View>
      </View>
    );
  }
}

export default CitiesStandings;
