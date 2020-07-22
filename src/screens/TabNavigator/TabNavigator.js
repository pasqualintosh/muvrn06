import React from 'react';
import {
  Text,
  Button,
  View,
  Dimensions,
  Platform,
  findNodeHandle,
  Image,
  PixelRatio,
  Alert,
  StyleSheet,
} from 'react-native';
import {NetInfo} from '@react-native-community/netinfo';
import {
  setJSExceptionHandler,
  setNativeExceptionHandler,
} from 'react-native-exception-handler';
import BackgroundGeolocation from './../../helpers/geolocation';

import Icon from 'react-native-vector-icons/Ionicons';
import OwnIcon from '../../components/OwnIcon/OwnIcon';
import Aux from '../../helpers/Aux';

import {connect} from 'react-redux';

import {changeConnectionStatus} from './../../domains/connection/ActionCreators';
import {
  NavigationActions,
  StackActions,
  createBottomTabNavigator,
  createStackNavigator,
  createDrawerNavigator,
  createSwitchNavigator,
  createAppContainer,
} from 'react-navigation';
import {strings} from '../../config/i18n';

import MapScreenBlur from '../ScreenBlurNotification/MapScreenBlur';
import ProfileScreenBlur from '../ScreenBlurNotification/ProfileScreenBlur';

import StatisticsRoutesScreenBlur from '../ScreenBlurNotification/StatisticsRoutesScreenBlur';

import ChartsScreenBlur from '../ScreenBlurNotification/ChartsScreenBlur';

import TrackBlur from '../ScreenBlurNotification/TrackBlur';
import HomeBlur from '../ScreenBlurNotification/HomeBlur';
import PoolingRadarScreenBlur from '../ScreenBlurNotification/PoolingRadarScreenBlur';
import PoolingUsersScreenBlur from '../ScreenBlurNotification/PoolingUsersScreenBlur';

import MapRoutine from '../MapRoutine/MapRoutine';
import ResetPassword from '../ResetPassword/ResetPassword';

import PlayoffScrollScreen from '../PlayoffScrollScreen/PlayoffScrollScreen';

import SelectNewRoutineBlur from '../ScreenBlurNotification/SelectNewRoutineBlur';
import PersonalDataScreenBlur from '../ScreenBlurNotification/PersonalDataScreenBlur';
import StandingsScreenBlur from '../ScreenBlurNotification/StandingsScreenBlur';
import MapRoutineBlur from '../ScreenBlurNotification/MapRoutineBlur';
import MapMultiRouteFeedRecapScreenBlur from '../ScreenBlurNotification/MapMultiRouteFeedRecapScreenBlur';
import MapFeedRecapScreenBlur from '../ScreenBlurNotification/MapFeedRecapScreenBlur';
import FeedRecapScreenBlur from '../ScreenBlurNotification/FeedRecapScreenBlur';

import InviteScreenBlur from '../ScreenBlurNotification/InviteScreenBlur';
import FriendDetailScreenBlur from '../ScreenBlurNotification/FriendDetailScreenBlur';

import TrophiesRankingBlur from '../ScreenBlurNotification/TrophiesRankingBlur';
import FriendScreenBlur from '../ScreenBlurNotification/FriendScreenBlur';
import SearchFriendsScreenBlur from '../ScreenBlurNotification/SearchFriendsScreenBlur';

import PersonalMobilityDataScreenBlur from '../ScreenBlurNotification/PersonalMobilityDataScreenBlur';

import {BottomTabBar} from 'react-navigation-tabs';
import ButtonPlayOrStop from '../../components/ButtonPlayOrStop/ButtonPlayOrStop';

import IntroScreen from '../IntroScreen/IntroScreen';
import SurveyScreens from '../SurveyScreens/SurveyScreens';
import AvatarScreen from '../SurveyScreens/AvatarScreen';
import ModalSplitScreen from '../SurveyScreens/ModalSplitScreen';
import FrequentTripScreen from '../SurveyScreens/FrequentTripScreen';
import FrequentTripMapScreen from '../SurveyScreens/FrequentTripMapScreen';
import FrequentTripModalSplitScreen from '../SurveyScreens/FrequentTripModalSplitScreen';
import SelectTeamScrollScreen from '../SurveyScreens/SelectTeamScrollScreen';
import CarFuelScreen from '../SurveyScreens/CarFuelScreen';
import CarScreen from '../SurveyScreens/CarScreen';
import MotoScreen from '../SurveyScreens/MotoScreen';
import MotoCcScreen from '../SurveyScreens/MotoCcScreen';
import MotoSegmentScreen from '../SurveyScreens/MotoSegmentScreen';
import UserDataScreen from '../SurveyScreens/UserDataScreen';
import EndScreen from '../SurveyScreens/EndScreen';
import FrequentTripTypeScreen from '../SurveyScreens/FrequentTripTypeScreen';
import MoldalSplitChooseScreen from '../SurveyScreens/MoldalSplitChooseScreen';
import SelectCityScreen from '../SelectCityScreen/SelectCityScreen';
import LoginWithSocial from '../LoginWithSocial/LoginWithSocial';
import LoginWithEmail from '../LoginWithEmail/LoginWithEmail';

import WelcomeMUVToNewMUV from '../WelcomeMUVToNewMUV/WelcomeMUVToNewMUV';
import NewNicknameScreen from '../NewNicknameScreen/NewNicknameScreen';
import NewPasswordScreen from '../NewPasswordScreen/NewPasswordScreen';

import UserDataWithNicknameScreen from '../SurveyScreens/UserDataWithNicknameScreen';

import CheckEmail from '../CheckEmail/CheckEmail';
import DebugTrackScreen from '../DebugTrackScreen/DebugTrackScreen';
import DebugStateScreen from '../DebugStateScreen/DebugStateScreen';

import CameraScreen from '../CameraScreen/CameraScreen';

import ChangePasswordScreen from './../ChangePasswordScreen/ChangePasswordScreen';
import ChangeAvatarScreen from '../ChangeAvatarScreen/ChangeAvatarScreen';

import DetailChangeAvatarScreen from '../DetailChangeAvatarScreen/DetailChangeAvatarScreen';

import ChangeFrequentTripTypeScreen from './../ChangeFrequentTripScreens/ChangeFrequentTripTypeScreen';
import ChangeFrequentTripScreen from './../ChangeFrequentTripScreens/ChangeFrequentTripScreen';
import ChangeFrequentTripMapScreen from './../ChangeFrequentTripScreens/ChangeFrequentTripMapScreen';
import ChangeFrequentTripModalSplitScreen from './../ChangeFrequentTripScreens/ChangeFrequentTripModalSplitScreen';
import ChangeFrequentTripFromRecapScreen from './../ChangeFrequentTripScreens/ChangeFrequentTripFromRecapScreen';
import ChangeFrequentTripTypeFromRecapScreen from './../ChangeFrequentTripScreens/ChangeFrequentTripTypeFromRecapScreen';
import ChangeFrequentTripModalSplitFromRecapScreen from './../ChangeFrequentTripScreens/ChangeFrequentTripModalSplitFromRecapScreen';

import ChangeFrequentTripModalSplitScreenWithScooter from './../ChangeFrequentTripScreens/ChangeFrequentTripModalSplitScreenWithScooter';

import TeamTournamentBlur from '../ScreenBlurNotification/TeamTournamentBlur';

import TripCompleted from './../../components/TripCompleted/TripCompleted';

import DailyRoutineMapDetailBlur from './../ScreenBlurNotification/DailyRoutineMapDetailBlur';

import PersonalAnagraficDataScreen from '../PersonalDataScreen/PersonalAnagraficDataScreen';
import PersonalMobilityDataScreen from '../PersonalDataScreen/PersonalMobilityDataScreen';
import PersonalGdprDataScreen from '../PersonalDataScreen/PersonalGdprDataScreen';
import PersonalNotificationDataScreen from '../PersonalDataScreen/PersonalNotificationDataScreen';

import PersonalCarScreen from '../PersonalDataScreen/PersonalCarScreen';
import PersonalCarFuelScreen from '../PersonalDataScreen/PersonalCarFuelScreen';
import PersonalMotoScreen from '../PersonalDataScreen/PersonalMotoScreen';
import PersonalMotoCcScreen from '../PersonalDataScreen/PersonalMotoCcScreen';

import ChangeCity from './../../components/ChangeCity/ChangeCity';

import LanguagesScreen from '../LanguagesScreen/LanguagesScreen';

import BikeScreen from './../MobilityHabitsScreens/BikeScreen';
import TplScreen from './../MobilityHabitsScreens/TplScreen';
import PoolingScreen from './../MobilityHabitsScreens/PoolingScreen';
import SharingScreen from './../MobilityHabitsScreens/SharingScreen';
import IntroMobilityScreen from './../MobilityHabitsScreens/IntroMobilityScreen';
import EndMobilityScreen from './../MobilityHabitsScreens/EndMobilityScreen';
import EditCarScreen from '../MobilityHabitsScreens/EditCarScreen';
import EditCarFuelScreen from '../MobilityHabitsScreens/EditCarFuelScreen';
import EditMotoScreen from '../MobilityHabitsScreens/EditMotoScreen';
import EditMotoSegmentScreen from '../MobilityHabitsScreens/EditMotoSegmentScreen';

import SurveyWebView from './../SurveyWebView/SurveyWebView';
import SoddFrust2WebView from './../SoddFrust2WebView/SoddFrust2WebView';
import FeedbackWebView from './../FeedbackWebView/FeedbackWebView';

import GenericWebViewScreen from './../GenericWebViewScreen/GenericWebViewScreen';

import GDPRScreen from '../../screens/GDPRScreen/GDPRScreen';
import GDPRVideoScreen from '../../screens/GDPRScreen/GDPRVideoScreen';
import CustomizedContentScreen from '../../screens/GDPRScreen/CustomizedContentScreen';
import SponsorshipScreen from '../../screens/GDPRScreen/SponsorshipScreen';
import CommerciallyScreen from '../../screens/GDPRScreen/CommerciallyScreen';
import MailingListScreen from '../../screens/GDPRScreen/MailingListScreen';
import GdprDataScreen from '../../screens/GDPRScreen/GdprDataScreen';
import TeamScreen from '../../screens/ScreenBlurNotification/TeamScreenBlur';
import WaitingUniversityScreenBlur from '../../screens/ScreenBlurNotification/WaitingUniversityScreenBlur';
import ChooseTeamScreenBlur from '../../screens/ScreenBlurNotification/ChooseTeamScreenBlur';

import AppPermissionsScreen from '../../screens/AppPermissionsScreen/AppPermissionsScreen';

import DetailTrainingScreenBlur from './../ScreenBlurNotification/DetailTrainingScreenBlur';
import DetailSpecialTrainingScreenBlur from './../ScreenBlurNotification/DetailSpecialTrainingScreenBlur';
import CityDetailScreenBlur from './../ScreenBlurNotification/CityDetailScreenBlur';
import EniDetailScreenBlur from './../ScreenBlurNotification/EniDetailScreenBlur';

import GameWeekTournamentBlur from './../ScreenBlurNotification/GameWeekTournamentBlur';
import CitiesStandingBlur from './../ScreenBlurNotification/CitiesStandingBlur';

import DetailTournamentScreenBlur from './../ScreenBlurNotification/DetailTournamentScreenBlur';
import TournamentsRulesScreenBlur from './../ScreenBlurNotification/TournamentsRulesScreenBlur';

import GroupScreenBlur from './../ScreenBlurNotification/GroupScreenBlur';
import FinalTournamentScreenBlur from './../ScreenBlurNotification/FinalTournamentScreenBlur';
import StandingsUniversityScreenBlur from '../ScreenBlurNotification/StandingsUniversityScreenBlur';

import ScheduleGameBlur from './../ScreenBlurNotification/ScheduleGameBlur';
import BestPlayersScreenBlur from './../ScreenBlurNotification/BestPlayersScreenBlur';
import ChallengesTrainingScreenBlur from './../ScreenBlurNotification/ChallengesTrainingScreenBlur';
import DetailChallengesScreenBlur from './../ScreenBlurNotification/DetailChallengesScreenBlur';
import LeaderboardChallengeScreenBlur from './../ScreenBlurNotification/LeaderboardChallengeScreenBlur';
import ChallengeRulesScreenBlur from './../ScreenBlurNotification/ChallengeRulesScreenBlur';
import TournamentsRulesScreen from './../../screens/TournamentsRulesScreen/TournamentsRulesScreen';
import GameCompleteWeekTournamentScreenBlur from './../ScreenBlurNotification/GameCompleteWeekTournamentScreenBlur';
import GameWeekCityTournamentScreenBlur from './../ScreenBlurNotification/GameWeekCityTournamentScreenBlur';
import DetailSponsorTournamentScreenBlur from './../ScreenBlurNotification/DetailSponsorTournamentScreenBlur';

import TrophiesScreenBlur from './../ScreenBlurNotification/TrophiesScreenBlur';

import RewardDetailScreen from './../RewardDetailScreen/RewardDetailScreen';
import RewardDetailScreenBlur from './../ScreenBlurNotification/RewardDetailScreenBlur';
import RewardsScreenBlur from './../ScreenBlurNotification/RewardsScreenBlur';
import PersonalFrequentTripDataScreenBlur from './../ScreenBlurNotification/PersonalFrequentTripDataScreenBlur';

import DetailSponsorScreenBlur from './../ScreenBlurNotification/DetailSponsorScreenBlur';

import GlobalStandingsScreen from '../GlobalStandingsScreen/GlobalStandingsScreen';

import PrivacyAndSecurity from '../PersonalDataScreen/PrivacyAndSecurity';

import BranchView from './../../components/BranchTest/BranchView';

import SponsorMapScreen from './../SponsorMapScreen/SponsorMapScreen';

import YoutubeScreen from './../YoutubeScreen/YoutubeScreen';
import FAQScreen from './../FAQScreen/FAQScreen';

import FAQScreenBlur from './../ScreenBlurNotification/FAQScreenBlur';
import RulesScreenBlur from './../ScreenBlurNotification/RulesScreenBlur';

import OneplusScreen from './../OneplusScreen/OneplusScreen';

import ModalSplitScreenTest from '../SurveyScreens/ModalSplitScreenTest';

import {
  startApp,
  UpdateProfile,
  getProfileNew,
} from './../../domains/login/ActionCreators';
// import { Analytics, Hits as GAHits } from "react-native-google-analytics";
import Settings from './../../config/Settings';

import TrainingsScreenBlur from './../ScreenBlurNotification/TrainingsScreenBlur';
import CitiesTournamentBlur from '../ScreenBlurNotification/CitiesTournamentBlur';

import WebService from '../../config/WebService';
import {Client} from 'bugsnag-react-native';
const bugsnag = new Client(WebService.BugsnagAppId);
import {store} from './../../store';

import {switchLanguage} from './../../config/i18n';
import BasketBallScreenBlur from '../ScreenBlurNotification/BasketBallScreenBlur';
import ChartsWavesScreenBlur from '../ScreenBlurNotification/ChartsWavesScreenBlur';
import CommunityDetailScreenBlur from '../ScreenBlurNotification/CommunityDetailScreenBlur';

import WhoYouAreScreen from '../WhoYouAreScreen/WhoYouAreScreen';
import AllGarageScreen from '../SurveyScreens/AllGarageScreen';
import ChooseRandomOrNotSceeen from '../ChooseRandomOrNotSceeen/ChooseRandomOrNotSceeen';
import ChooseRandomAvatarScreen from '../ChooseRandomAvatarScreen/ChooseRandomAvatarScreen';

import SideMenu from './../../components/SideMenu/SideMenu';

import BackgroundTutorial from '../../screens/BackgroundTutorial/BackgroundTutorial';

import PrivacyPolicyScreen from '../PrivacyPolicyScreen/PrivacyPolicyScreen';
import TemsAndConditionsScreen from '../TemsAndConditionsScreen/TemsAndConditionsScreen';

import FeedbackScreen from '../FeedbackScreen/FeedbackScreen';

import {wsConnect} from '../../domains/connection/ActionCreators.js';

import OneSignal from 'react-native-onesignal';

import {
  getTutorialStartState,
  getUserState,
  getLanguageState,
  getDateState,
  getUserIdState,
  getUserIdOldState,
  getEmailState,
  frequentTripsHomeWork,
} from '../../domains/login/Selectors';

import BackgroundFetch from 'react-native-background-fetch';

import {updateActivitiesStep} from './../../domains/statistics/ActionCreators';

const reporter = (error) => {
  // Logic for reporting to devs
  // Example : Log issues to github issues using github apis.
  console.log(error); // sample
};

const errorHandler = (e, isFatal) => {
  if (isFatal) {
    reporter(e);

    // if (typeof e !== "Error") {
    //   msg = new Error(e);
    //   bugsnag.notify(msg, function (report) {
    //     report.metadata = { error: e };
    //   });
    // } else {
    //   bugsnag.notify(e, function (report) {
    //     report.metadata = { error: e };
    //   });
    // }

    // Error: ${isFatal ? "Fatal:" : ""} ${e.name} ${e.message}\n

    Alert.alert(
      'Unexpected error occurred',
      `It happens to the best of us!\nWe have reported this to our team and we’ll fix it in no time.\nMeanwhile please close the app and start again.`,
      [
        {
          text: 'Close',
          onPress: () => {},
        },
      ],
    );
  } else {
    console.log(e); // So that we can see it in the ADB logs in case of Android if needed
  }
};

setJSExceptionHandler(errorHandler);

setNativeExceptionHandler((errorString) => {
  //You can do something like call an api to report to dev team here
  //example
  // fetch('http://<YOUR API TO REPORT TO DEV TEAM>?error='+errorString);
  //
  if (typeof errorString !== 'Error') {
    msg = new Error(errorString);

    bugsnag.notify(msg, function (report) {
      report.metadata = {error: errorString};
    });
  } else {
    bugsnag.notify(errorString, function (report) {
      report.metadata = {error: errorString};
    });
  }
});

// stack profile
const StandingsStack = createStackNavigator(
  {
    StandingsScreen: {
      screen: StandingsScreenBlur,
    },
    FriendDetailFromStanding: {
      screen: FriendDetailScreenBlur,
    },
    CityDetailScreenBlurFromStanding: {
      screen: CityDetailScreenBlur,
    },
    DetailSponsorScreenBlurFromStanding: {
      screen: DetailSponsorScreenBlur,
    },
    Track: {
      screen: TrackBlur,
    },
    Mappa: {
      screen: MapScreenBlur,
    },
    PoolingRadarScreen: {
      screen: PoolingRadarScreenBlur,
    },
    PoolingUsersScreen: {
      screen: PoolingUsersScreenBlur,
    },
    BasketBallScreen: {
      screen: BasketBallScreenBlur,
    },
    Debug: {
      screen: DebugTrackScreen,
    },
  },
  {
    initialRouteName: 'StandingsScreen',
  },
);

// stack profile
const ProfileStack = createStackNavigator(
  {
    Info: {
      screen: ProfileScreenBlur,
    },
    StatisticsRoutesScreen: {
      screen: StatisticsRoutesScreenBlur,
    },
    Track: {
      screen: TrackBlur,
    },
    Mappa: {
      screen: MapScreenBlur,
    },
    PoolingRadarScreen: {
      screen: PoolingRadarScreenBlur,
    },
    PoolingUsersScreen: {
      screen: PoolingUsersScreenBlur,
    },
    BasketBallScreen: {
      screen: BasketBallScreenBlur,
    },
    Debug: {
      screen: DebugTrackScreen,
    },
  },

  {
    initialRouteName: 'Info',
  },
);

// import CitiesTournamentBlur from "./../ScreenBlurNotification/CitiesTournamentBlur";
// import GameTournamentBlur from "./../ScreenBlurNotification/GameTournamentBlur";
// import CitiesStandingBlur from "./../ScreenBlurNotification/CitiesStandingBlur";
// import ScheduleGameBlur from "./../ScreenBlurNotification/ScheduleGameBlur";
// stack home con feed attivita
const HomeStack = createStackNavigator({
  HomeTab: {
    screen: HomeBlur,
  },

  MapFeedRecapScreen: {
    screen: MapFeedRecapScreenBlur,
  },
  MapMultiRouteFeedRecapScreen: {
    screen: MapMultiRouteFeedRecapScreenBlur,
  },
  FeedRecapScreen: {
    screen: FeedRecapScreenBlur,
  },
  Altro: {
    screen: TrackBlur,
  },
  Track: {
    screen: TrackBlur,
  },
  Mappa: {
    screen: MapScreenBlur,
  },
  PoolingRadarScreen: {
    screen: PoolingRadarScreenBlur,
  },
  PoolingUsersScreen: {
    screen: PoolingUsersScreenBlur,
  },
  EniDetailScreenBlur: {
    screen: EniDetailScreenBlur,
  },
  Debug: {
    screen: DebugTrackScreen,
  },
  DebugState: {
    screen: DebugStateScreen,
  },
  BasketBallScreen: {
    screen: BasketBallScreenBlur,
  },
});

const CityTournamentStack = createStackNavigator(
  {
    Tournament: {
      screen: CitiesTournamentBlur,
    },
    DetailTournamentScreen: {
      screen: DetailTournamentScreenBlur,
    },
    TournamentsRulesScreen: {
      screen: TournamentsRulesScreenBlur,
    },
    GroupScreen: {
      screen: GroupScreenBlur,
    },
    FinalTournamentScreen: {
      screen: FinalTournamentScreenBlur,
    },
    StandingsUniversityScreen: {
      screen: StandingsUniversityScreenBlur,
    },

    TeamScreen: {
      screen: TeamScreen,
    },
    WaitingUniversityScreen: {
      screen: WaitingUniversityScreenBlur,
    },
    ChooseTeamScreen: {
      screen: ChooseTeamScreenBlur,
    },
    InviteScreenFromTournament: {
      screen: InviteScreenBlur,
    },
    TeamTournamentBlur: {
      screen: TeamTournamentBlur,
    },
    CitiesStandingBlur: {
      screen: CitiesStandingBlur,
    },
    GameWeekTournamentBlur: {
      screen: GameWeekTournamentBlur,
    },
    ScheduleGameBlur: {
      screen: ScheduleGameBlur,
    },
    CitiesTournamentBlur: {
      screen: CitiesTournamentBlur,
    },
    BestPlayersScreenBlur: {
      screen: BestPlayersScreenBlur,
    },
    GameCompleteWeekTournamentScreenBlur: {
      screen: GameCompleteWeekTournamentScreenBlur,
    },
    GameWeekCityTournamentScreenBlur: {
      screen: GameWeekCityTournamentScreenBlur,
    },
    DetailSponsorTournamentScreenBlur: {
      screen: DetailSponsorTournamentScreenBlur,
    },
    CommunityDetailScreenBlur: {
      screen: CommunityDetailScreenBlur,
    },
  },
  {
    initialRouteName: 'Tournament',
  },
);

const TrophiesStack = createStackNavigator(
  {
    TrophiesScreen: {
      screen: TrophiesScreenBlur,
    },
    RankingTrophies: {
      screen: TrophiesRankingBlur,
    },
  },

  {
    initialRouteName: 'TrophiesScreen',
  },
);

const RewardsStack = createStackNavigator(
  {
    RewardsScreen: {
      screen: RewardsScreenBlur,
    },
    RewardDetailScreen: {
      screen: RewardDetailScreenBlur,
    },
  },

  {
    initialRouteName: 'RewardsScreen',
  },
);

const TrainingsStack = createStackNavigator(
  {
    TrainingsScreen: {
      screen: TrainingsScreenBlur,
    },
    DetailTrainingScreen: {
      screen: DetailTrainingScreenBlur,
    },
    DetailSpecialTrainingScreen: {
      screen: DetailSpecialTrainingScreenBlur,
    },
  },
  {
    initialRouteName: 'TrainingsScreen',
  },
);

const ChallengesTrainingStack = createStackNavigator(
  {
    TrainingsScreen: {
      screen: ChallengesTrainingScreenBlur,
    },
    DetailChallengeScreen: {
      screen: DetailChallengesScreenBlur,
    },
    LeaderboardChallengeScreen: {
      screen: LeaderboardChallengeScreenBlur,
    },
    ChallengeRulesScreen: {
      screen: ChallengeRulesScreenBlur,
    },
    // DetailSpecialTrainingScreen: {
    //   screen: DetailSpecialTrainingScreenBlur
    // }
  },
  {
    initialRouteName: 'TrainingsScreen',
  },
);

const FriendStack = createStackNavigator(
  {
    FriendScreen: {
      screen: FriendScreenBlur,
    },
    SearchFriendsScreen: {
      screen: SearchFriendsScreenBlur,
    },
    InviteScreen: {
      screen: InviteScreenBlur,
    },
    FriendDetail: {
      screen: FriendDetailScreenBlur,
    },
    CityDetailScreenBlurFromFriends: {
      screen: CityDetailScreenBlur,
    },
  },

  {
    initialRouteName: 'FriendScreen',
  },
);

const SettingsStack = createStackNavigator({
  PersonalDataScreenBlur: {
    screen: PersonalDataScreenBlur,
  },
  initialRouteName: 'PersonalDataScreenBlur',
});

const FrequentTripsStack = createStackNavigator({
  PersonalFrequentTripDataScreenBlur: {
    screen: PersonalFrequentTripDataScreenBlur,
  },
  FrequentRoutineMapDetail: {
    screen: DailyRoutineMapDetailBlur,
  },
  PersonalMobilityDataScreen: {
    screen: PersonalMobilityDataScreenBlur,
  },
  initialRouteName: 'PersonalFrequentTripDataScreenBlur',
});

/* const PersonalMobilityDataStack = createStackNavigator({
  FrequentRoutineMapDetail: {
    screen: DailyRoutineMapDetailBlur
  },
  PersonalMobilityDataScreen: {
    screen: PersonalMobilityDataScreenBlur
  },

  initialRouteName: "FrequentRoutineMapDetail"
}); */

// stack attivita utente

const ChartsStack = createStackNavigator({
  // ChartsScreen: {
  //   screen: ChartsScreenBlur
  // },
  ChartsWavesScreenBlur: {
    screen: ChartsWavesScreenBlur,
  },
  initialRouteName: 'ChartsWavesScreenBlur',
});

const FAQStack = createStackNavigator({
  FAQScreenBlur: {
    screen: FAQScreenBlur,
  },
  initialRouteName: 'FAQScreenBlur',
});

const RulesStack = createStackNavigator({
  RulesScreenBlur: {
    screen: RulesScreenBlur,
  },
  initialRouteName: 'RulesScreenBlur',
});

// comprende tutti gli altri stack che si possono aprire con il menu drawer, nascosto nello screen centrale nel menu tab
const OtherStack = createSwitchNavigator(
  {
    Trophies: {
      screen: TrophiesStack,
      navigationOptions: {
        header: null,
      },
    },
    RewardsStack: {
      screen: RewardsStack,
      navigationOptions: {
        header: null,
      },
    },
    FriendStack: {
      screen: FriendStack,
      navigationOptions: {
        header: null,
      },
    },
    ProfileStack: {
      screen: ProfileStack,
      navigationOptions: {
        header: null,
      },
    },
    SettingsStack: {
      screen: SettingsStack,
      navigationOptions: {
        header: null,
      },
    },
    PersonalFrequentTripDataScreen: {
      screen: FrequentTripsStack,
      navigationOptions: {
        header: null,
      },
    },
    // PersonalMobilityDataScreen: {
    //   screen: PersonalMobilityDataStack,
    //   navigationOptions: {
    //     header: null
    //   }
    // },
    ChartsStack: {
      screen: ChartsStack,
      navigationOptions: {
        header: null,
      },
    },
    FAQStack: {
      screen: FAQStack,
      navigationOptions: {
        header: null,
      },
    },
    RulesStack: {
      screen: RulesStack,
      navigationOptions: {
        header: null,
      },
    },
  },
  {
    initialRouteName: 'RewardsStack',
  },
);

// tab di prova
const TabHome = createBottomTabNavigator(
  {
    Home: {screen: HomeStack},
    Challenges: {screen: StandingsStack},
    Pulsante: {screen: OtherStack},
    // Trainings: { screen: TrainingsStack },
    Trainings: {screen: ChallengesTrainingStack},
    CityTournament: {screen: CityTournamentStack},
  },
  {
    navigationOptions: ({navigation}) => ({
      tabBarIcon: ({focused, tintColor}) => {
        // prendo dove mi trovo in questo momento
        const {routeName} = navigation.state;
        let iconName;

        // se corrisponde a Home, setto il nome dell'icona che devo ritornare, se il tab è selezionanto ovvero focused, non metto -outline
        if (routeName === 'Home') {
          if (tintColor === '#ED6B6F') {
            iconName = 'feed_icn_active';
          } else {
            iconName = 'feed_icn';
          }
        } else if (routeName === 'Trainings') {
          if (tintColor === '#ED6B6F') {
            iconName = 'challenges_icn_active';
          } else {
            iconName = 'challenges_icn';
          }
        } else if (routeName === 'Challenges') {
          if (tintColor === '#ED6B6F') {
            iconName = 'weekly_icn_active';
          } else {
            iconName = 'weekly_icn';
          }
        } else if (routeName === 'CityTournament') {
          if (tintColor === '#ED6B6F') {
            iconName = 'sct_icn_active';
          } else {
            iconName = 'sct_icn';
          }
        }

        // You can return any component that you like here! We usually use an
        // icon component from react-native-vector-icons
        return <OwnIcon name={iconName} size={27} color={tintColor} />;
        // return <Ionicons name={iconName} size={25} color={tintColor} />;
      },
      tabBarOnPress: ({navigation}) => {
        console.log(navigation);
        const {routes, index, key} = navigation.state;
        if (key === 'Pulsante') {
          // se premo il pulsante centrale, non devo fare nulla
          // ovvero non cambio scene

          // posso gestire tutta la parte relativa al pulsante
          console.log('click');
        } else {
          if (navigation.isFocused()) {
            if (routes.length > 1) {
              const {routeName, key} = routes[1];
              navigation.dispatch(NavigationActions.back({key}));
            }
          } else {
            navigation.dispatch(NavigationActions.back({index}));

            navigation.navigate(key);
          }
        }
      },
    }),
    tabBarOptions: {
      activeTintColor: '#ED6B6F',
      inactiveTintColor: '#9D9B9C',
      showLabel: false,
      showIcon: true,
      style: {
        backgroundColor: '#F8F9FA',
      },
    },
    tabBarComponent: (props) => {
      console.log('props del tab');
      console.log(props);

      return (
        <View>
          <BottomTabBar {...props} />

          {renderAnimatedTabButton(props.navigation)}
        </View>
      );
    },
    tabBarPosition: 'bottom',
    animationEnabled: true,
    swipeEnabled: false,
    lazy: true,
  },
);

const Tab = createDrawerNavigator(
  {
    TabHome: TabHome,
  },
  {
    contentComponent: SideMenu,
    // drawerWidth: 220,
    drawerPosition: 'right',
    drawerType: 'push-screen',
    useNativeAnimations: true,
    // hideStatusBar: "true",
    drawerLockMode: 'locked-closed',
  },
);

// stack iniziale dell'app

const routes = {
  Login: {
    screen: LoginWithEmail,
  },
  Welcome: {
    screen: LoginWithSocial,
  },
  WelcomeMUVToNewMUV: {
    screen: WelcomeMUVToNewMUV,
  },
  NewNicknameScreen: {
    screen: NewNicknameScreen,
  },
  NewPasswordScreen: {
    screen: NewPasswordScreen,
  },
  PrivacyPolicy: {
    screen: PrivacyPolicyScreen,
  },
  TemsAndConditions: {
    screen: TemsAndConditionsScreen,
  },
  Tutorial: {
    screen: BackgroundTutorial,
  },
  ResetPassword: {
    screen: ResetPassword,
  },
  CheckEmail: {
    screen: CheckEmail,
  },
  Survey: {
    screen: SurveyScreens,
  },
  SurveyAvatar: {
    screen: AvatarScreen,
  },
  SurveyModalSplit: {
    screen: ModalSplitScreen,
  },
  ModalSplitScreenTest: {
    screen: ModalSplitScreenTest,
  },
  SurveyFrequentTripType: {
    screen: FrequentTripTypeScreen,
  },
  SurveyFrequentTrip: {
    screen: FrequentTripScreen,
  },
  SurveyFrequentTripMap: {
    screen: FrequentTripMapScreen,
  },
  SurveyFrequentTripModalSplit: {
    screen: FrequentTripModalSplitScreen,
  },
  SurveyCar: {
    screen: CarScreen,
  },
  SurveyCarFuel: {
    screen: CarFuelScreen,
  },
  AllGarageScreen: {
    screen: AllGarageScreen,
  },
  SurveyMoto: {
    screen: MotoScreen,
  },
  SurveyMotoSegment: {
    screen: MotoSegmentScreen,
  },
  SurveyMotoCc: {
    screen: MotoCcScreen,
  },
  SurveyUserData: {
    screen: UserDataWithNicknameScreen,
  },
  SurveySelectTeam: {
    screen: SelectTeamScrollScreen,
  },
  SurveyModal: {
    screen: MoldalSplitChooseScreen,
  },
  AppPermissionsScreen: {
    screen: AppPermissionsScreen,
  },
  GDPRVideoScreen: {
    screen: GDPRVideoScreen,
  },
  GDPRScreen: {
    screen: GDPRScreen,
  },
  GdprDataScreen: {
    screen: GdprDataScreen,
  },
  CommerciallyScreen: {
    screen: CommerciallyScreen,
  },
  CustomizedContentScreen: {
    screen: CustomizedContentScreen,
  },
  MailingListScreen: {
    screen: MailingListScreen,
  },
  SponsorshipScreen: {
    screen: SponsorshipScreen,
  },
  SurveyEnd: {
    screen: EndScreen,
  },
  Home: {
    screen: Tab,
    navigationOptions: {
      header: null,
    },
  },
  SelectCity: {
    screen: SelectCityScreen,
  },
  SelectMostFrequentRoutePoint: {
    screen: MapRoutine,
  },
  Routine: {
    screen: SelectNewRoutineBlur,
  },
  Mappa: {
    screen: MapScreenBlur,
  },
  PoolingRadarScreen: {
    screen: PoolingRadarScreenBlur,
  },
  PoolingUsersScreen: {
    screen: PoolingUsersScreenBlur,
  },
  ChangeAvatarScreen: {
    screen: DetailChangeAvatarScreen,
  },

  ChangePasswordScreen: {
    screen: ChangePasswordScreen,
  },
  PersonalAnagraficDataScreen: {
    screen: PersonalAnagraficDataScreen,
  },
  PersonalMobilityDataScreen: {
    screen: PersonalMobilityDataScreen,
  },
  PersonalGdprDataScreen: {
    screen: PersonalGdprDataScreen,
  },
  PersonalNotificationDataScreen: {
    screen: PersonalNotificationDataScreen,
  },
  PrivacyAndSecurity: {
    screen: PrivacyAndSecurity,
  },
  PersonalCarScreen: {
    screen: PersonalCarScreen,
  },
  PersonalCarFuelScreen: {
    screen: PersonalCarFuelScreen,
  },
  PersonalMotoScreen: {
    screen: PersonalMotoScreen,
  },
  PersonalMotoCcScreen: {
    screen: PersonalMotoCcScreen,
  },
  ChangeCityScreen: {
    screen: ChangeCity,
  },
  ChangeFrequentTripTypeScreen: {
    screen: ChangeFrequentTripTypeScreen,
  },
  ChangeFrequentTripScreen: {
    screen: ChangeFrequentTripScreen,
  },
  ChangeFrequentTripMapScreen: {
    screen: ChangeFrequentTripMapScreen,
  },
  ChooseRandomOrNotSceeen: {
    screen: ChooseRandomOrNotSceeen,
  },
  WhoYouAreScreen: {
    screen: WhoYouAreScreen,
  },
  ChangeFrequentTripModalSplitScreenWithScooter: {
    screen: ChangeFrequentTripModalSplitScreenWithScooter,
  },
  ChooseRandomAvatarScreen: {
    screen: ChooseRandomAvatarScreen,
  },
  ChangeFrequentTripModalSplitScreen: {
    screen: ChangeFrequentTripModalSplitScreen,
  },
  ChangeFrequentTripFromRecapScreen: {
    screen: ChangeFrequentTripFromRecapScreen,
  },
  ChangeFrequentTripTypeFromRecapScreen: {
    screen: ChangeFrequentTripTypeFromRecapScreen,
  },
  ChangeFrequentTripModalSplitFromRecapScreen: {
    screen: ChangeFrequentTripModalSplitFromRecapScreen,
  },
  BranchView: {
    screen: BranchView,
  },
  BikeScreen: {
    screen: BikeScreen,
  },
  TplScreen: {
    screen: TplScreen,
  },
  PoolingScreen: {
    screen: PoolingScreen,
  },
  SharingScreen: {
    screen: SharingScreen,
  },
  EditCarScreen: {
    screen: EditCarScreen,
  },
  EditCarFuelScreen: {
    screen: EditCarFuelScreen,
  },
  EditMotoScreen: {
    screen: EditMotoScreen,
  },
  EditMotoSegmentScreen: {
    screen: EditMotoSegmentScreen,
  },
  SurveyWebView: {
    screen: SurveyWebView,
  },
  GenericWebViewScreen: {
    screen: GenericWebViewScreen,
  },
  SoddFrust2WebView: {
    screen: SoddFrust2WebView,
  },
  FeedbackWebView: {
    screen: FeedbackWebView,
  },
  CameraScreen: {
    screen: CameraScreen,
  },
  IntroMobilityScreen: {
    screen: IntroMobilityScreen,
  },
  EndMobilityScreen: {
    screen: EndMobilityScreen,
  },
  GlobalStandingsScreen: {
    screen: GlobalStandingsScreen,
  },
  FriendDetailFromGlobal: {
    screen: FriendDetailScreenBlur,
  },
  CityDetailScreenBlurFromGlobal: {
    screen: CityDetailScreenBlur,
  },
  LanguagesScreen: {
    screen: LanguagesScreen,
  },
  SponsorMapScreen: {
    screen: SponsorMapScreen,
  },
  YoutubeScreen: {
    screen: YoutubeScreen,
  },
  FAQScreen: {
    screen: FAQScreen,
  },
  FeedbackScreen: {
    screen: FeedbackScreen,
  },

  OneplusScreen: {
    screen: OneplusScreen,
  },
};

renderAnimatedTabButton = (navigation) => {
  // Dimensions.get("window").width / 2 - 30
  // ovvero centro - 30 poiche il bottone è 60 di dimensioni
  // prendo altezza e larghezza dello schermo

  const {height, width} = Dimensions.get('window');
  // eventuale extra per sollevare l'onda sopra se si sta usando un dispositivo con tacca
  let extra = 0;
  // onda piu grande su plus o su altri device
  let heightPlus = 0;
  let style = {
    bottom: 15,
    left: width / 2 - 30,
  };

  // stile per creare il layer sotto ai pulsanti cosi se si clicca fuori i pulsanti, si avvia la chiusura dei mezzi
  const LayerButton = {
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    left: -(width / 2) + 30,
    opacity: 0,
  };
  /* if (Platform.OS === "android") {
    style = {
      bottom: 18,
      left: width / 2 - 30
    };
    extra = -20;
  } */

  // iphone plus per mettere il pulsante un po sopra, avendo l'onda piu grande
  if (Platform.OS === 'ios' && PixelRatio.get() === 3) {
    style = {
      bottom: 26,
      left: width / 2 - 30,
    };
  }

  // android, metto l'onda un po piu sopra
  if (Platform.OS !== 'ios') {
    extra = 2;
  }

  // iphone x, x max
  if (
    Platform.OS === 'ios' &&
    (height === 812 || width === 812 || height === 896 || width === 896)
  ) {
    extra = 35;
    style = {
      bottom: 18 + extra,
      left: width / 2 - 30,
    };
  }

  return (
    <Aux>
      {/* <Image
          style={{
            width: width,
            height: 55,
            position: "absolute",
            bottom: 34.5
          }}
          source={require("./../../assets/images/tab/drawable-xhdpi/tab-bar.png")}
        /> */}
      <Image
        style={{
          width: width * 0.37694704,
          height: width * 0.37694704 * 0.24827586,

          position: 'absolute',
          bottom: 34.5 + extra,
        }}
        source={require('./../../assets/images/tabbar-left.png')}
      />
      <Image
        style={{
          width: width * 0.24610592,

          height: width * 0.24610592 * 0.38135593,
          left: width * 0.37694704,
          position: 'absolute',
          bottom: 34.5 + extra,
        }}
        source={require('./../../assets/images/tabbar-bottom.png')}
      />
      <Image
        style={{
          width: width * 0.24610592,

          height: width * 0.24610592 * 0.27754237,
          left: width * 0.37694704,
          position: 'absolute',
          bottom: 34.5 + extra + width * 0.24610592 * 0.3801,
        }}
        source={require('./../../assets/images/tabbar-top.png')}
      />
      <Image
        style={{
          width: width * 0.37694704,
          height: width * 0.37694704 * 0.24827586,
          left: width * (0.37694704 + 0.24610592),
          position: 'absolute',
          bottom: 34.5 + extra,
        }}
        source={require('./../../assets/images/tabbar-right.png')}
      />
      <ButtonPlayOrStop
        navigation={navigation}
        style={style}
        styleView={[
          LayerButton,
          {
            bottom: -18 - extra,
          },
        ]}
      />
    </Aux>
  );
};

MyStack = createStackNavigator(
  {
    Login: {
      screen: LoginWithEmail,
    },
    Welcome: {
      screen: LoginWithSocial,
    },
    WelcomeMUVToNewMUV: {
      screen: WelcomeMUVToNewMUV,
    },
  },
  {
    initialRouteName: 'Login',
  },
);

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    // la prima volta all'avvio dell'app

    this.state = {
      page: 'Welcome',
      login: false,
      completeTutorial: false,
    };

    // NetInfo.getConnectionInfo()
    //   .then()
    //   .done(() => {
    //     NetInfo.getConnectionInfo().then(connectionInfo => {
    //       NetInfo.isConnected.fetch().then(() => {
    //         NetInfo.isConnected.fetch().then(isConnected => {
    //           this.props.dispatch(
    //             changeConnectionStatus({ ...connectionInfo, isConnected })
    //           );
    //         });
    //       });
    //     });
    //   });
  }

  // static router = {
  //   ...Stack.router,
  //   getStateForAction: (action, lastState) => {
  //     return Stack.router.getStateForAction(action, lastState);
  //   },
  // };

  static navigationOptions = {
    headerTitle: (
      <View
        style={{
          left:
            Platform.OS == 'android'
              ? Dimensions.get('window').width / 2 - 20
              : 0,
        }}>
        <OwnIcon name="MUV_logo" size={40} color="#111110" />
      </View>
    ),
    headerLeft: null,
    headerRight: <Icon name="md-more" size={30} color="#9D9B9C" />,
  };

  // aggiorno lo stato con la nuova connessione
  handleChange(isConnected) {
    this.props.dispatch(changeConnectionStatus(isConnected));
    // stop il gps se è la prima volta che avvio l'app o se l'app crash
    // this.props.dispatch(stop());
  }

  handleFirstConnectivityChange = (isConnected) => {
    console.log('Then, is ' + (isConnected ? 'online' : 'offline'));
    // NetInfo.isConnected.fetch().then(() => {
    //   NetInfo.isConnected.fetch().then(isConnected => {
    //     NetInfo.getConnectionInfo()
    //       .then()
    //       .done(() => {
    //         NetInfo.getConnectionInfo().then(connectionInfo => {
    //           this.props.dispatch(
    //             changeConnectionStatus({ ...connectionInfo, isConnected })
    //           );
    //         });
    //       });
    //   });
    // });
  };

  componentDidMount(lastProps) {
    if (this.props.email && !this.props.user_id_old && this.props.date) {
      // Configure it.
      BackgroundFetch.configure(
        {
          minimumFetchInterval: 15, // <-- minutes (15 is minimum allowed)
          // Android options
          forceAlarmManager: false, // <-- Set true to bypass JobScheduler.
          stopOnTerminate: false,
          startOnBoot: true,
          requiredNetworkType: BackgroundFetch.NETWORK_TYPE_NONE, // Default
          requiresCharging: false, // Default
          requiresDeviceIdle: false, // Default
          requiresBatteryNotLow: false, // Default
          requiresStorageNotLow: false, // Default
        },
        () => {
          console.log('[js] Received background-fetch event');
          const perm = store.getState().statistics.permActivities;
          console.log(perm);
          if (perm) {
            this.props.dispatch(updateActivitiesStep({notification: true}));
          }

          // Required: Signal completion of your task to native code
          // If you fail to do this, the OS can terminate your app
          // or assign battery-blame for consuming too much background-time
          BackgroundFetch.finish(BackgroundFetch.FETCH_RESULT_NEW_DATA);
        },
        (error) => {
          console.log('[js] RNBackgroundFetch failed to start');
        },
      );

      // Optional: Query the authorization status.
      BackgroundFetch.status((status) => {
        switch (status) {
          case BackgroundFetch.STATUS_RESTRICTED:
            console.log('BackgroundFetch restricted');
            break;
          case BackgroundFetch.STATUS_DENIED:
            console.log('BackgroundFetch denied');
            break;
          case BackgroundFetch.STATUS_AVAILABLE:
            console.log('BackgroundFetch is enabled');
            break;
        }
      });
    }
  }

  componentWillMount() {
    // gestore eventi se cambia la connessione chiamo la funzione che manda un azione per cambiare lo stato su redux
    // NetInfo.addEventListener("connectionChange", this.handleChange);
    // se si avvia l'app si effettua il refresh token se sono presenti username e password messe
    // altrimenti si fa il login

    // NetInfo.isConnected.addEventListener(
    //   "connectionChange",
    //   this.handleFirstConnectivityChange
    // );

    if (this.props.language.length) {
      switchLanguage(this.props.language);
    }

    // se sono nella home, faccio tutte le chiamate
    // ovvero ho username settato

    if (this.props.email && !this.props.user_id_old && this.props.date) {
      //this.props.dispatch(wsConnect());

      // prendo i dati di inizio app come level e route ecc

      // se sono loggato attivo le notifiche push

      OneSignal.init(WebService.OneSignalAppId);
      // OneSignal.configure(); 	// triggers the ids event
      // OneSignal.setRequiresUserPrivacyConsent(true);

      // OneSignal.sendTag("userId", this.props.user_id.toString());
      // OneSignal.setExternalUserId(this.props.user_id.toString(), () => {});
      OneSignal.sendTag('userID', this.props.user_id.toString());
      // OneSignal.sendTags({userID: this.props.user_id.toString()});
      // posso sapere l'id dell'utente che ha avuto un problema e lo posso contattare per avvisare che esiste una nuova versione fix
      bugsnag.setUser(this.props.user_id.toString());

      this.props.dispatch(startApp());
    }
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.email && this.props.user_id !== nextProps.user_id) {
      return false;
    }
    // } else if (this.props.user_id_old !== nextProps.user_id_old) {
    //   return false;
    // }
    return true;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.email && this.props.email !== nextProps.email) {
      // this.props.dispatch(wsConnect());
    }
  }

  createDynamicRoutes = (initialRoute) => {
    return createAppContainer(
      createStackNavigator(routes, {initialRouteName: initialRoute}),
    );
  };

  render() {
    console.log(this.props.language);
    // const {navigation} = this.props;
    const initialRouteName = this.props.user_id_old
      ? 'WelcomeMUVToNewMUV'
      : this.props.email
      ? this.props.tutorialStart
        ? 'Home'
        : 'Tutorial'
      : 'Welcome';

    const AppContainer = this.createDynamicRoutes(initialRouteName);
    // con user_id_old capisco se l'utente è del vecchio muv
    return <AppContainer />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  instructions2: {
    // fontFamily: "Moon-Flower",
    textAlign: 'center',
    color: 'white',
    marginBottom: 5,
    fontSize: 32,
  },
});

const connection = connect((state) => {
  // uso date per sapere se si è mai loggato o no
  // quindi se si è registrato
  return {
    email: getEmailState(state),
    date: getDateState(state),
    language: getLanguageState(state),
    user_id: getUserIdState(state),
    user_id_old: getUserIdOldState(state),
    tutorialStart: getTutorialStartState(state),
  };
});

export default connection(Menu);
