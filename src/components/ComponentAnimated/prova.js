import React from "react";
import {
  Button,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  TouchableHighlight
} from "react-native";
import {
  createNavigator,
  createNavigationContainer,
  TabRouter,
  addNavigationHelpers,
  StackNavigator
} from "react-navigation"; // 1.5.0
import LinearGradient from "react-native-linear-gradient"; // 2.4.0
import ComponentAnimated3 from "./ComponentAnimated3";

const MyNavScreen = ({ navigation, banner }) => (
  <ScrollView>
    <Text>{banner}</Text>
    <Button
      onPress={() => {
        navigation.goBack(null);
      }}
      title="Go back"
    />
  </ScrollView>
);

const NestedMyNavScreen = ({ navigation, banner }) => (
  <ScrollView>
    <Text>{banner}</Text>
    <Button
      onPress={() => navigation.navigate("Profile", { name: "Jane" })}
      title="Go to a profile screen"
    />
    <Button
      onPress={() => navigation.navigate("Photos", { name: "Jane" })}
      title="Go to a photos screen"
    />
  </ScrollView>
);

const MyNotificationsScreen = ({ navigation }) => (
  <MyNavScreen banner="Notifications Screen" navigation={navigation} />
);

const MySettingsScreen = ({ navigation }) => (
  <MyNavScreen banner="Settings Screen" navigation={navigation} />
);

const MyPhotosScreen = ({ navigation }) => {
  let params = navigation.state.routes[navigation.state.index].params;
  // let params = navigation.state.params;
  return (
    <MyNavScreen banner={`${params.name}'s Photos`} navigation={navigation} />
  );
};
MyPhotosScreen.navigationOptions = {
  title: "Photos"
};

const MyProfileScreen = ({ navigation }) => {
  let params = navigation.state.routes[navigation.state.index].params;
  // let params = navigation.state.params;
  return (
    <MyNavScreen
      banner={`${params.mode === "edit" ? "Now Editing " : ""}${
        params.name
      }'s Profile`}
      navigation={navigation}
    />
  );
};

const CustomTabBar = ({ navigation }) => {
  const { routes } = navigation.state;
  return (
    <View style={styles.tabContainer}>
      {routes.map(route => (
        <TouchableOpacity
          onPress={() => navigation.navigate(route.routeName)}
          style={styles.tab}
          key={route.routeName}
        >
          <Text>{route.routeName}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const SimpleStack = StackNavigator({
  NestedHome: {
    screen: NestedMyNavScreen
  },
  Profile: {
    path: "people/:name",
    screen: MyProfileScreen
  },
  Photos: {
    path: "photos/:name",
    screen: MyPhotosScreen
  }
});

const CustomTabView = ({ router, navigation }) => {
  const { routes, index } = navigation.state;
  const ActiveScreen = router.getComponentForState(navigation.state);
  return (
    <View style={styles.container}>
      <ActiveScreen
        navigation={addNavigationHelpers({
          ...navigation,
          state: routes[index]
        })}
      />
      <CustomTabBar navigation={navigation} />
    </View>
  );
};

const CustomTabRouter = TabRouter(
  {
    Home: {
      screen: SimpleStack,
      path: ""
    },
    Notifications: {
      screen: MyNotificationsScreen,
      path: "notifications"
    },
    Settings: {
      screen: MySettingsScreen,
      path: "settings"
    },
    Prova: {
      screen: ComponentAnimated3,
      path: "prova"
    }
  },
  {
    // Change this to start on a different tab
    initialRouteName: "Home"
  }
);

export default class Tab extends React.Element {
  render() {
    CustomTabs = createNavigationContainer(
      createNavigator(CustomTabRouter)(CustomTabView)
    );
    return CustomTabs;
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === "ios" ? 20 : 0,
    flexDirection: "column",
    justifyContent: "space-between",
    flex: 1
  },
  tabContainer: {
    flexDirection: "row",
    height: 48
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: 4,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4
  }
});
