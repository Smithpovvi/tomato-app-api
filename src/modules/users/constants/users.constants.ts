export enum loginUserMessages {
  INCORRECT_CREDENTIALS = "Incorrect credentials",
}

export enum creatUserMessages {
  USER_EXIST = "User exists with this login or an email",
  ACTIVATION_CODE_INCORRECT = "Incorrect activation code",
  TRY_LATER = "Something wrong, pls try after 90 seconds",
  TRY_AGAIN = "Something wrong, pls try again",
  NEED_ACTIVATE = "Activation code was send",
  AUTH_METHOD_UNAVAILABLE = "User exists with this an email, but this auth method unavailable",
}

export enum UserModelDescriptions {
  ID = "Number, uniq value with auto-incrementation",
  EMAIL = "Email address, format should be as: asf@asf.re",
  PASSWORD = "String, length of password should be between 6 and 15 symbols",
  LOGIN = "String, uniq name of user, minimal length is 4 symbols",
}
