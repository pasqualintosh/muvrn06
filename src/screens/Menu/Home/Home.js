import React from "react";
import { View, Text, Platform, Dimensions, findNodeHandle } from "react-native";
import { createStackNavigator } from "react-navigation";
import HomeScreen from "../../HomeScreen/HomeScreen";
import MapScreen from "../../MapScreen/MapScreen";
import OwnIcon from "../../../components/OwnIcon/OwnIcon";
import Icon from "react-native-vector-icons/Ionicons";
import Aux from "../../../helpers/Aux";
import NotificationPoint from "./../../../components/NotificationPoint/NotificationPoint";
import DailyRoutineMap from "../../../components/DailyRoutineMap/DailyRoutineMap";
import Blur from "../../../components/Blur/Blur";

const HomeStack = createStackNavigator(
  {
    Home: {
      screen: HomeScreen
    },
    Info: {
      screen: DailyRoutineMap
    }
  },
  {
    navigationOptions: ({ navigation }) => ({
      headerTitle: (
        <View
          style={{
            left:
              Platform.OS == "android"
                ? Dimensions.get("window").width / 2 - 20
                : 0
          }}
        >
          <OwnIcon name="MUV_logo" size={40} color="black" />
        </View>
      ),
      headerLeft: null
    })
  }
);

// metto la notifica se ho i punti e il blur se clicco sul tasto play

class Home extends React.PureComponent {
  // questa struttura si deve ripete per ogni tab della tabBar altrimenti il blur e la notifica non sono presenti
  constructor(props) {
    super(props);
    this.state = { viewRef: null };
  }

  componentDidMount() {
    // quando ho caricato il componente, posso dire a blur che è possibile fare il blur usando questa variabile
    this.setState({ viewRef: findNodeHandle(this.view) });
  }
  render() {
    return (
      <Aux>
        <NotificationPoint navigation={this.props.navigation} />

        <HomeStack
          ref={view => {
            this.view = view;
          }}
        />
        <Blur viewRef={this.state.viewRef} />
      </Aux>
    );
  }
}

export default Home;
