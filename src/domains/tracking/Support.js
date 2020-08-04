import { strings } from "../../config/i18n";

// calcolo delle calorie con peso, tempo e tipo di esercizio
export function getCalories(pounds, minutes, exercise) {
  let coef = 0.0383;

  if (exercise == "Biking") {
    coef = 0.1333;
  } else if (exercise == "Walking") {
    coef = 0.055;
  } else if (exercise == "Public") {
    coef = 0.0383;
  }

  let aux_calories = pounds * minutes * coef;

  aux_calories = Math.round(aux_calories * 10) / 10;

  if (aux_calories < 0) {
    // se negativo lo faccio diventare positivo
    aux_calories = Math.abs(aux_calories);
  }

  return aux_calories;
}

// metodo che calcolo l'id legato alla modalita scelta dall'utente
// e utile per mandare il dato al db

//
export function getIdModalType(modal_type, coef) {
  switch (modal_type) {
    case "Walking":
      {
        return 1;
      }
      break;
    case "Biking":
      {
        return 2;
      }
      break;
    case "Public":
      {
        if (coef === 800) {
          return 5;
        } else if (coef === 400) {
          return 6;
        } else if (coef === 1200) {
          return 7;
        }
        return 3;
      }
      break;
    case "Pooling":
      {
        return 4;
      }
      break;
    case "Bus":
      {
        return 5;
      }
      break;
    case "Train":
      {
        return 6;
      }
      break;
    case "Metro":
      {
        return 7;
      }
      break;
    default:
      {
        return 0;
      }
      break;
  }
}

export function getIdModalTypeNew(modal_type = "Walking", coef = 800) {
  switch (modal_type) {
    case "Walking":
      {
        return 1;
      }
      break;
    case "Biking":
      {
        return 2;
      }
      break;
    case "Public":
      {
        // Walking
        // Biking
        // Bus
        // Metro
        // Train
        // Carpooling
        if (coef === 800) {
          return 3;
        } else if (coef === 1200) {
          return 4;
        } else if (coef === 400) {
          return 5;
        }
        return 3;
      }
      break;
    case "Carpooling":
      {
        return 6;
      }
      break;
      case "Car":
      {
        return 7; // tratte in auto ma da soli
      }
      break;
    case "Bus":
      {
        return 5;
      }
      break;
    case "Train":
      {
        return 6;
      }
      break;
    case "Metro":
      {
        return 7;
      }
      break;
    default:
      {
        return 1;
      }
      break;
  }
}

export function getImageUrl (label) {
  switch (label) {
    case "Walking":
      return require("../../assets/images/walk_icn_recap.png");
    case "Biking":
      return require("../../assets/images/bike_icn_recap.png");
    case "Public":
    case "Bus":
      return require("../../assets/images/bus_icn.png");
      
    case "Train":
      return require("../../assets/images/train_icn.png");
    case "Metro":
      return require("../../assets/images/metro_icn.png");

    case "Carpooling":
      return require("../../assets/images/carpooling_icn.png");
      
    case "Multiple":
      return require("../../assets/images/multitrack_icn_recap.png");
     
    default:
      return require("../../assets/images/walk_icn_recap.png");
  }
};

// image per gli slider per modal split 
export function  getImageModalSplitPath (label)  {
  switch (label) {
    case "walk":
      return require("../../assets/images/onboardingImage/walk_icn_onboarding.png");
    case "bike":
      return require("../../assets/images/onboardingImage/bike_icn_onboarding.png");
    case "bus":
      return require("../../assets/images/onboardingImage/bus_icn_onboarding.png");
    case "car":
      return require("../../assets/images/onboardingImage/car_icn_onboarding.png");
    case "motorbike":
      return require("../../assets/images/onboardingImage/moto_icn_onboarding.png");
    case "train":
      return require("../../assets/images/onboardingImage/trai_icn_onboarding.png");
    case "scooter": // car_pooling dal 15/02/2019 diventa train
      return require("../../assets/images/onboardingImage/scooter_icn_onboarding.png");
    default:
      return require("../../assets/images/onboardingImage/walk_icn_onboarding.png");
  }
};

export function getRenderModalSplitLabel  (label) {
  switch (label) {
    case "walk":
      return strings("id_0_151");
    case "bike":
      return strings("id_0_152");
    case "bus":
      return strings("id_0_153");
      case "train":
        return strings("id_0_154");
    case "car":
      return strings("id_0_155");
    case "motorbike":
      return strings("id_0_156");
    case "car_pooling":
      return strings("id_0_155");
      case "scooter":
        return strings("id_0_157");
        
      
    default:
      return strings("id_0_151");
  }
};

export function getIdModalTypeFromBackend(modal_type = "Walking") {
  switch (modal_type) {
    // Multiple esiste anche nei recap, non so se deve gestire anche questo caso 
    case "Walking":
      {
        return 1;
      }
      break;
    case "Biking":
      {
        return 2;
      }
      break;
      case "Bus":
      {
        return 3;
      }
      break;
    case "Metro":
      {
        return 4;
      }
      break;
    case "Train":
      {
        return 5;
      }
      break;
    case "Carpooling":
      {
        return 6;
      }
      break;
      case "Car":
      {
        return 7; // tratte in auto ma da soli
      }
      break;
    
    default:
      {
        return 1;
      }
      break;
  }
}

export function getDefaultSpeed(exercise) {
  // devo fare un check sulla velocita dato che puo avere il valore -1 ovvero non è disponibile
  // do un valore di velocità a seconda dell'attività scelta
  let speed = 1.39;

  if (exercise == "Biking") {
    speed = 5.56;
  } else if (exercise == "Walking") {
    speed = 1.39;
  } else if (exercise == "Public") {
    // se cammina molto lentamente
    speed = 0.83;
    // oppure uso un valore intermedio tra guardare la tv e camminare lentamente
  }
  return speed;
}

// convertire il metro in un numero

export function getIdWeatherType(weather) {
  switch (weather) {
    case "Clear":
      {
        return 0;
      }
      break;
    case "Clouds":
      {
        return 1;
      }
      break;
    case "Drizzle":
      {
        return 2;
      }
      break;
    case "Haze":
      {
        return 3;
      }
      break;
    case "Mist":
      {
        return 4;
      }
      break;
    case "Rain":
      {
        return 5;
      }
      break;
    case "Snow":
      {
        return 6;
      }
      break;
    case "Thunderstorm":
      {
        return 7;
      }
      break;
    default:
      {
        return 0;
      }
      break;
  }
}
