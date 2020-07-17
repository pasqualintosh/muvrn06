export const Tester = [
  "pasqsac@yahoo.it",
  "p.sacco@wepush.org",
  "Invyctus89@gmail.com",
  "invyctus97@gmail.com",
  "invyctus70@gmail.com",
  "r.filippi@wepush.org",
  "d.schillaci@wepush.org",
  "f.massa@wepush.org",
  "s.didio@wepush.org",
  "t.didio@wepush.org",
  "a.torre@wepush.org",
  "g.spataro@wepush.org",
  "m.filippi@wepush.org"
];

export const hardcodedTypeformUser = [
  // { email: "pasqsac@yahoo.it" },
  // { email: "p.sacco@wepush.org" }
  // { email: "Invyctus89@gmail.com" },
  // { email: "invyctus97@gmail.com" },
  // { email: "invyctus70@gmail.com" },
  // { email: "r.filippi@wepush.org" },
  // { email: "d.schillaci@wepush.org" },
  // { email: "f.massa@wepush.org" },
  // { email: "s.didio@wepush.org" },
  // { email: "a.torre@wepush.org" },
  // { email: "g.spataro@wepush.org" },
  // { email: "m.filippi@wepush.org" }
];

export async function emailPresentTypeformUserList(email) {
  const promiseResult = new Promise((resolve, reject) => {
    setTimeout(() => {
      let bool = false;
      hardcodedTypeformUser.forEach(item => {
        if (item.email == email) bool = true;
      });
      resolve(bool);
    }, 500);
  });
  return await promiseResult;
}
