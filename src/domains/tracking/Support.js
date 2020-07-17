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



  
