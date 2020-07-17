export const infoEvents = event => {
  switch (event) {
    case "Move once by walking or biking":
      return { counter: "", completedCounter: 1 };
      break;

    case "Do a trip of at least 400 points":
      return { counter: "", completedCounter: 1 };
      break;

    case "Do a trip during the weekend (Saturday or Sunday)":
      return { counter: "", completedCounter: 1 };
      break;

    case "Do a routinary trip":
      return { counter: "", completedCounter: 1 };
      break;

    case "Do at least two trips in a single day":
      return { counter: "RoutesInDay", completedCounter: 2, type: "day" };
      break;

    case "Do at least two trips in a single day":
      return { counter: "RoutesInDay", completedCounter: 2, type: "day" };
      break;

    case "MUV three days in a row":
      return { counter: "RoutesSeries", completedCounter: 3, type: "row" };
      break;

    case "Do a trip by night (after 21:00)":
      return { counter: "", completedCounter: 1 };
      break;

    case "Score at least 1.000 points in a single day":
      return { counter: "PointsInDay", completedCounter: 1000, type: "day" };
      break;

    case "Do a routinary trip three days in a row":
      return { counter: "RoutinarySeries", completedCounter: 3, type: "row" };
      break;

    case "Score at least 4.000 points per week":
      return { counter: "PointsInWeek", completedCounter: 4000, type: "week" };
      break;

    case "Do a trip in bad weather conditions":
      return { counter: "", completedCounter: 1 };
      break;

    case "MUV five days in a row":
      return { counter: "RoutesSeries", completedCounter: 5, type: "row" };
      break;

    case "Move once by public transport or carpooling":
      return { counter: "", completedCounter: 1 };
      break;

    case "Score at least 2000 points in a 48-hour timeframe":
      return { counter: "PointsIn48", completedCounter: 2000, type: "48H" };
      break;

    case "Do two trips during the weekend (one on Saturday and one on Sunday)":
      return {
        counter: "checkDoubleWeekend",
        completedCounter: 2,
        type: "weekend"
      };

      break;

    case "Do a routinary trip five days in a row":
      return { counter: "RoutinarySeries", completedCounter: 5, type: "row" };
      break;

    case "Do at least one routinary trip a day for three days in a row":
      return { counter: "RoutinarySeries", completedCounter: 3, type: "row" };
      break;

    case "Do two different routinary trips in a single day":
      return {
        counter: "RoutinaryDifferentInDay",
        completedCounter: 2,
        type: "day"
      };
      break;

    case "Do at least ten trips in a week":
      return { counter: "RoutesInWeek", completedCounter: 10, type: "week" };
      break;

    case "Complete three trips in bad weather conditions":
      return { counter: "WeatherCounter", completedCounter: 3 };
      break;

    case "MUV seven days in a row":
      return { counter: "RoutesSeries", completedCounter: 7, type: "row" };
      break;

    // case "MUV seven days in a row":
    //   return { counter:"", completedCounter: 1 }
    //   break;

    case "Do a trip in the early morning (from 06:00 to 07:30)":
      return { counter: "", completedCounter: 1 };
      break;

    case "Do two trips during peak hours":
      return { counter: "PeakHoursCounter", completedCounter: 2 };
      break;

    case "Do at least 10 walking trips in one week":
      return {
        counter: "WalkingTenRoutesInWeek",
        completedCounter: 10,
        type: "week"
      };
      break;

    case "Score at least 12.000 points in one month":
      return {
        counter: "PointsInMonth",
        completedCounter: 12000,
        type: "month"
      };
      break;

    case "Do 100 trips":
      return { counter: "RoutesCounter", completedCounter: 100 };
      break;

    case "MUV ten days in a row":
      return { counter: "RoutesSeries", completedCounter: 10, type: "row" };
      break;

    case "Do at least three trips in a week":
      return { counter: "RoutesInWeek", completedCounter: 3, type: "week" };
      break;

    case "Do a routinary trip twice in a day":
      return { counter: "RoutinaryInDay", completedCounter: 2, type: "day" };
      break;

    case "Move once by public transport or carpooling":
      return { counter: "", completedCounter: 1 };
      break;

    default:
      return { counter: "", completedCounter: 1 };
      break;
  }
};
