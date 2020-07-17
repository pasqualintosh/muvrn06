import { strings } from "./../config/i18n";

const sponsors = [
  {
    rewardsType: 29,
    sponsor: true,
    name: "Moltivolti",

    website: "http://moltivolti.org/",

    lat: 38.1128543,
    lng: 13.359352,

    instagram: "moltivolti",
    facebook: "227756564088341",
    description: "coworking___res",
    rewards: "A lunch with starter, first course and drinks for two persons"
  },
  {
    rewardsType: 29,
    sponsor: true,
    name: "Spazio Cultura Edizioni",
    website: "https://www.facebook.com/spazioculturalibri/",
    lat: 38.138229,
    lng: 13.349484,
    facebook: "141706029248369",
    description: "_994_spazio_cultura_",
    rewards: "spazio_cultura_"
  },
  {
    rewardsType: 29,
    sponsor: true,
    name: "Spazio Cultura",
    website: "https://www.facebook.com/spazioculturalibri/",
    lat: 38.138229,
    lng: 13.349484,
    facebook: "141706029248369",
    description: "_994_spazio_cultura_",
    rewards: "spazio_cultura_"
  },
  {
    rewardsType: 29,
    sponsor: true,
    name: "Kalòs Edizioni",

    website: "https://www.edizionikalos.com/",

    lat: 38.144299,
    lng: 13.348016,

    instagram: "edizionikalos",
    facebook: "292963814056136",
    description: "publishing_hous",
    rewards: "_50__off_kalos_"
  },
  {
    rewardsType: 29,
    sponsor: true,
    name: "Kalòs",

    website: "https://www.edizionikalos.com/",

    lat: 38.144299,
    lng: 13.348016,

    instagram: "edizionikalos",
    facebook: "292963814056136",
    description: "publishing_hous",
    rewards: "_50__off_kalos_"
  },
  {
    rewardsType: 26,
    sponsor: true,
    name: "Buongiorno Notte",

    website: "https://www.buongiornonotte.com/",

    lat: 38.116461,
    lng: 13.366958,

    instagram: "buongiornonottepalermo",
    facebook: "175782843105197",
    description: "_996_guided_tours_of",
    rewards: "guided_walk_at_"
  },
  {
    rewardsType: 29,
    sponsor: true,
    name: "Idee Storte Paper",

    website: "https://ideestortepaper.com/",

    lat: 38.116854,
    lng: 13.365856,

    instagram: "ideestortepaper",
    facebook: "2031376663772842",
    description: "ideestortepaper",
    rewards: "_20__off_idee_st"
  },
  {
    rewardsType: 29,
    sponsor: true,
    name: "Edizioni Precarie",

    website: "https://www.edizioniprecarie.it/",

    lat: 38.116709,
    lng: 13.366018,

    instagram: "edizioniprecarie",
    facebook: "1383467095219004",
    description: "a_design_and_gr",
    rewards: "make_our_own_no"
  },
  {
    rewardsType: 29,
    sponsor: true,
    name: "Precarie",

    website: "https://www.edizioniprecarie.it/",

    lat: 38.116709,
    lng: 13.366018,

    instagram: "edizioniprecarie",
    facebook: "1383467095219004",
    description: "a_design_and_gr",
    rewards: "make_our_own_no"
  },
  {
    rewardsType: 26,
    sponsor: true,
    name: "Teatro Massimo",

    lat: 38.1201924,
    lng: 13.3550415,

    website: "http://www.teatromassimo.it/",
    email: "info@teatromassimo.it",

    twitter: "teatromassimo",
    instagram: "teatromassimo",
    facebook: "139166922808719",
    description: "_999_the_teatro_mass",
    rewards: "guided_tour_of_"
  }
];

export function getSponsor(name) {
  try {
    // console.log(st_id);
    s = sponsors.filter(e => {
      return e.name == name;
    })[0];
    return s
      ? s
      : {
          sponsor: false
        };
  } catch (error) {
    console.log(error);
    return {
      sponsor: false
    };
  }
}
