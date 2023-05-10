export interface ITransitionUser {
  login: string;
  email: string;
  password: string;
  activationCode: string;
  timer: ReturnType<typeof setTimeout>;
}
