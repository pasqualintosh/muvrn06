import React from "react";
import {
  View,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  ImageBackground,
  ListView
} from "react-native";

import { styles, negativeData } from "./Style";
import UserItem from "./../../components/UserItem/UserItem";
import Aux from "./../../helpers/Aux";
import WebService from "../../config/WebService";

class TrophiesRanking extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      refreshing: false
    };
  }

  onRefresh() {
    this.setState({ refreshing: true });
    this.props.refreshTrophies();

    setTimeout(() => {
      this.setState({ refreshing: false });
    }, 1500);
  }

  renderPage() {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    const dataListTrophies = ds.cloneWithRows(this.props.trophies);

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
          dataSource={dataListTrophies}
          renderRow={(item, sectionID, rowID) => {
            const row = parseInt(rowID) + 1;
            if (row === 1) {
              return (
                <Aux key={rowID}>
                  <View
                    key={0}
                    style={{
                      height: 30,
                      backgroundColor: "#F7F8F9"
                    }}
                  />
                  <UserItem
                    user={{
                      username: item.user.username,

                      avatar: item.user.avatar,
                      id: 1,

                      points: item.points,
                      position: item.position,
                      referred_route__user__city_id: item.user.city
                    }}
                    rowID={rowID}
                    level={"N"}
                    modalType={0}
                    activeSelectable={"global"}
                    blockRanking={true}
                    imageEnd={WebService.url + item.trophy.img_small}
                  />
                  {
                    // aggiungo delo spazio in piu cosi posso scrollare tutta la lista anche se c'e l'onda e la notifica
                  }
                </Aux>
              );
            } else if (this.props.trophies.length === row) {
              return (
                <Aux key={rowID}>
                  <UserItem
                    user={{
                      username: item.user.username,

                      avatar: item.user.avatar,
                      id: 1,

                      points: item.points,
                      position: item.position,
                      referred_route__user__city_id: item.user.city
                    }}
                    rowID={rowID}
                    level={"N"}
                    modalType={0}
                    activeSelectable={"global"}
                    blockRanking={true}
                    imageEnd={WebService.url + item.trophy.img_small}
                  />
                  {
                    // aggiungo delo spazio in piu cosi posso scrollare tutta la lista anche se c'e l'onda e la notifica
                    <View
                      key={0}
                      style={{
                        paddingTop: Dimensions.get("window").height * 0.23
                      }}
                    />
                  }
                </Aux>
              );
            } else {
              console.log(item.city);
              return (
                <UserItem
                  user={{
                    username: item.user.username,

                    avatar: item.user.avatar,
                    id: 1,

                    points: item.points,
                    position: item.position,
                    referred_route__user__city_id: item.user.city
                  }}
                  rowID={rowID}
                  level={"N"}
                  modalType={0}
                  activeSelectable={"global"}
                  blockRanking={true}
                  imageEnd={WebService.url + item.trophy.img_small}
                />
              );
            }
          }}
        />
      </View>
    );
  }
  renderBody() {
    if (!this.props.trophies.length) {
      return (
        <View style={{ top: 150 }}>
          <ActivityIndicator size="large" color="#3D3D3D" />
          <View style={styles.challengesList} />
        </View>
      );
    } else {
      console.log(this.props.trophies);
      return this.renderPage();
    }
  }

  render() {
    return (
      <View
        // style={styles.mainContainer}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh.bind(this)}
          />
        }
      >
        {this.renderBody()}

        <ImageBackground
          source={trophiesView[this.props.trophy.position]}
          style={styles.backgroundImage}
        >
          <View style={[styles.userContainer, styles.firstUser]}>
            <View style={{ flexDirection: "column", alignContent: "center" }}>
              <View>
                <UserItem
                  user={{
                    username: this.props.trophy.user.username,

                    avatar: this.props.trophy.user.avatar,
                    id: 1,

                    points: this.props.trophy.points,
                    position: this.props.trophy.position,
                    referred_route__user__city_id: this.props.trophy.user.city
                  }}
                  // lo faccio piu piccolo dato che sopra metto il selettore per il periodo
                  fontColor={
                    this.props.trophy.position === 3 ||
                    this.props.trophy.position === 6
                      ? true
                      : false
                  }
                  style={{ height: 75 }}
                  modalType={
                    //  this.props.trophy.user.role
                    0
                  }
                  level={
                    //  this.props.trophy.user.level_of_experience
                    "N"
                  }
                />
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

// togliere dal 3 in poi
const trophiesView = {
  1: require("../../assets/images/bg-rank_gold.png"),
  2: require("../../assets/images/bg-rank_silver.png"),
  3: require("../../assets/images/bg-rank_bronze.png"),
  4: require("../../assets/images/bg-rank_gold.png"),
  5: require("../../assets/images/bg-rank_silver.png"),
  6: require("../../assets/images/bg-rank_bronze.png")
};

// mediaglie piccole per il torneo

export const medalSmallGlobalView = {
  1: require("../../assets/images/trophies/gold_medal_icn.png"),
  2: require("../../assets/images/trophies/silver_medal_icn.png"),
  3: require("../../assets/images/trophies/bronze_medal_icn.png")
};

export const medalGlobalView = {
  1: require("../../assets/images/trophies/global_medal_first.png"),
  2: require("../../assets/images/trophies/global_medal_second.png"),
  3: require("../../assets/images/trophies/global_medal_third.png")
};

export default TrophiesRanking;

// export default StandingsScreen;
