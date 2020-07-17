export const prefixesList = [
  {
    code: "+355",
    name: "Albania"
  },
  {
    code: "+213",
    name: "Algeria"
  },
  {
    code: "+374",
    name: "Armenia"
  },
  {
    code: "+43",
    name: "Austria"
  },
  {
    code: "+375",
    name: "Belarus"
  },
  {
    code: "+32",
    name: "Belgium"
  },
  {
    code: "+501",
    name: "Belize"
  },
  {
    code: "+229",
    name: "Benin"
  },
  {
    code: "+1441",
    name: "Bermuda"
  },
  {
    code: "+387",
    name: "Bosnia and Herzegovina"
  },
  {
    code: "+359",
    name: "Bulgaria"
  },
  {
    code: "+385",
    name: "Croatia"
  },
  {
    code: "+537",
    name: "Cyprus"
  },
  {
    code: "+420",
    name: "Czech Republic"
  },
  {
    code: "+45",
    name: "Denmark"
  },
  {
    code: "+372",
    name: "Estonia"
  },
  {
    code: "+251",
    name: "Ethiopia"
  },
  {
    code: "+298",
    name: "Faroe Islands"
  },
  {
    code: "+358",
    name: "Finland"
  },
  {
    code: "+33",
    name: "France"
  },
  {
    code: "+995",
    name: "Georgia"
  },
  {
    code: "+49",
    name: "Germany"
  },
  {
    code: "+350",
    name: "Gibraltar"
  },
  {
    code: "+30",
    name: "Greece"
  },
  {
    code: "+299",
    name: "Greenland"
  },
  {
    code: "+1473",
    name: "Grenada"
  },
  {
    code: "+36",
    name: "Hungary"
  },
  {
    code: "+354",
    name: "Iceland"
  },
  {
    code: "+353",
    name: "Ireland"
  },
  {
    code: "+972",
    name: "Israel"
  },
  {
    code: "+39",
    name: "Italy"
  },
  {
    code: "+962",
    name: "Jordan"
  },
  {
    code: "+423",
    name: "Liechtenstein"
  },
  {
    code: "+370",
    name: "Lithuania"
  },
  {
    code: "+352",
    name: "Luxembourg"
  },
  {
    code: "+389",
    name: "Macedonia"
  },
  {
    code: "+356",
    name: "Malta"
  },
  {
    code: "+373",
    name: "Moldova"
  },
  {
    code: "+377",
    name: "Monaco"
  },
  {
    code: "+976",
    name: "Mongolia"
  },
  {
    code: "+382",
    name: "Montenegro"
  },
  {
    code: "+1664",
    name: "Montserrat"
  },
  {
    code: "+31",
    name: "Netherlands"
  },
  {
    code: "+47",
    name: "Norway"
  },
  {
    code: "+48",
    name: "Poland"
  },
  {
    code: "+351",
    name: "Portugal"
  },
  {
    code: "+40",
    name: "Romania"
  },
  {
    code: "+7",
    name: "Russia"
  },
  {
    code: "+378",
    name: "San Marino"
  },
  {
    code: "+381",
    name: "Serbia"
  },
  {
    code: "+65",
    name: "Singapore"
  },
  {
    code: "+421",
    name: "Slovakia"
  },
  {
    code: "+386",
    name: "Slovenia"
  },
  {
    code: "+34",
    name: "Spain"
  },
  {
    code: "+46",
    name: "Sweden"
  },
  {
    code: "+41",
    name: "Switzerland"
  },
  {
    code: "+90",
    name: "Turkey"
  },
  {
    code: "+380",
    name: "Ukraine"
  },
  {
    code: "+44",
    name: "United Kingdom"
  },
  {
    code: "+84",
    name: "Vietnam"
  },
  {
    code: "+55",
    name: "Brazil"
  }
];
export const prefixes = () => {
  let p = [];
  prefixesList.forEach(item => {
    p.push(item.code);
  });
  return p;
};
