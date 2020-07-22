import { strings } from "../config/i18n";

export const getStringValuesGarage = (val) => {
  switch (val) {
    case "less_50cm3":
      return strings("id_0_87");
      break;
    case "51_250cm3":
      return strings("id_0_88");
      break;
    case "51_750cm3":
      return strings("id_0_89");
      break;
    case "more_751cm3":
      return strings("id_0_90");
      break;
    case "more_51cm3":
      return strings("id_0_97");
      break;
    case "2_stroke":
      return strings("id_0_85");
      break;
    case "4_stroke":
      return strings("id_0_86");
      break;
    case "medium":
      return strings("id_0_79");
      break;
    case "large":
      return strings("id_0_80");
      break;
    case "mini":
      return strings("id_0_81");
      break;
    case "small":
      return strings("id_0_82");
      break;
    case "2017-2019":
      return strings("id_0_77");
      break;
    case "up_to_1992":
      return strings("id_0_70");
      break;
      case "up_to_1999":
        return strings("id_0_92");
        break;
    case "fuel":
      return strings("id_0_57");
      break;

    case "petrol":
      return strings("id_0_58");
      break;

    case "diesel":
      return strings("id_0_59");
      break;

    case "petrol_hybrids":
      return strings("id_0_60");
      break;

    case "LPG":
      return strings("id_0_61");
      break;

    case "CNG":
      return strings("id_0_62");
      break;

    case "electric":
      return strings("id_0_63");
      break;

    default:
      return val;
      break;
  }
};
