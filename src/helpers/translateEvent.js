import { strings } from "../config/i18n";

export const translateEvent = event => {
  switch (event) {
    case "Move once by walking or biking":
      return strings("move_once_by_wa");
      break;

    case "Do a trip of at least 400 points":
      return strings("do_a_trip_of_at");
      break;

    case "Do a trip during the weekend (Saturday or Sunday)":
      return strings("do_a_trip_durin");
      break;

    case "Do a routinary trip":
      return strings("do_a_routinary_");
      break;

    case "Do at least two trips in a single day":
      return strings("do_at_least_two");
      break;

    case "Do at least two trips in a single day":
      return strings("_229_do_a_routinary_");
      break;

    case "MUV three days in a row":
      return strings("muv_three_days_");
      break;

    case "Do a trip by night (after 21:00)":
      return strings("do_a_trip_by_ni");
      break;

    case "Score at least 1.000 points in a single day":
      return strings("score_at_least_");
      break;

    case "Do a routinary trip three days in a row":
      return strings("_234_do_a_routinary_");
      break;

    case "Score at least 4.000 points per week":
      return strings("_235_score_at_least_");
      break;

    case "Do a trip in bad weather conditions":
      return strings("do_a_trip_in_ba");
      break;

    case "MUV five days in a row":
      return strings("muv_five_days_i");
      break;

    case "Move once by public transport or carpooling":
      return strings("move_once_by_pu");
      break;

    case "Score at least 2000 points in a 48-hour timeframe":
      return strings("_240_score_at_least_");
      break;

    case "Do two trips during the weekend (one on Saturday and one on Sunday)":
      return strings("do_two_trips_du");
      break;

    case "Do a routinary trip five days in a row":
      return strings("_243_do_a_routinary_");
      break;

    case "Do at least one routinary trip a day for three days in a row":
      return strings("_234_do_a_routinary_");
      break;

    case "Do two different routinary trips in a single day":
      return strings("do_two_differen");
      break;

    case "Do at least ten trips in a week":
      return strings("do_at_least_ten");
      break;

    case "Complete three trips in bad weather conditions":
      return strings("complete_three_");
      break;

    case "MUV seven days in a row":
      return strings("muv_seven_days_");
      break;

    // case "MUV seven days in a row":
    //   return strings("complete_three_");
    //   break;

    case "Do a trip in the early morning (from 06:00 to 07:30)":
      return strings("do_a_trip_in_th");
      break;

    case "Do two trips during peak hours":
      return strings("_250_do_two_trips_du");
      break;

    case "Do at least 10 walking trips in one week":
      return strings("do_at_least_10_");
      break;

    case "Score at least 12.000 points in one month":
      return strings("_253_score_at_least_");
      break;

    case "Do 100 trips":
      return strings("do_100_trips");
      break;

    case "MUV ten days in a row":
      return strings("muv_ten_days_in");
      break;

    case "Do at least three trips in a week":
      return strings("do_at_least_thr");
      break;

    case "Do a routinary trip twice in a day":
      return strings("_229_do_a_routinary_");
      break;

    case "Move once by public transport or carpooling":
      return strings("move_once_by_pu");
      break;

    default:
      return event;
      break;
  }
};
