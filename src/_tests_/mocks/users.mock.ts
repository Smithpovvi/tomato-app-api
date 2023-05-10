import { TokenPayload } from "google-auth-library/build/src/auth/loginticket";

export const testUser = {
  email: "asfa@wwsfsfs.wr",
  password: "122141q",
  login: "John",
};

export const testSocialUser = {
  email: "asfa@wwsfsfs.wr",
  password: "122141q",
  login: "John",
  googleUserId: "121241251251235",
  facebookUserId: "1245476865979",
};

export const testUsersArray = [
  {
    email: "asfwa@wwsfsfs.wr",
    password: "122141q",
    login: "John1",
  },
  {
    email: "asafa@wwsfsfs.wr",
    password: "122141q",
    login: "John2",
  },
  {
    email: "asfaf@wwsfsfs.wr",
    password: "122141q",
    login: "John3",
  },
  {
    email: "asfa@wwssfsfs.wr",
    password: "122141q",
    login: "John4",
  },
  {
    email: "asfa@wwsfssfs.wr",
    password: "122141q",
    login: "John5",
  },
];

export const activationCode = "qwr2qa";

export const mockId = 234753;

export const mockToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6IkpvaG4iLCJpZCI6IjIzNDc1MyIsImlhdCI6MTUxNjIzOTAyMn0.V5MGFs_-mhq4IC288U6hQN8pVAhY7eeRrinQqgTdr-A";

export const mockGoogleAuthTokenPayload: TokenPayload = {
  email: testSocialUser.email,
  sub: testSocialUser.googleUserId,
  aud: "",
  azp: "",
  exp: 1,
  iat: 1,
  iss: "",
};

export const testSeason = {
  seasonName: "Test season",
  startDate: "10/10/2000",
  endDate: "15/10/2000",
};
