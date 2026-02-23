export type LoginFormInputs = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export type ForgotPasswordInput = {
  email: string;
};

export type AuthMeResponse = {
  id: string;
  email: string;
  displayName: string;
  roles: string[];
  nameIdentifier: string;
  country: string;
  city: string;
  street: string;
  createdAt: string;
  emailConfirmed: boolean;
  phoneNumber: string;
  phoneNumberConfirmed: boolean;
  timezone: string;
  language: string;
  timeFormat: string;
  dateFormat: string;
  formattedCurrentTime: string;
};

export type UpdateAuthMeRequest = {
  displayName: string;
  phoneNumber: string;
  email: string;
  country: string;
  city: string;
  street: string;
  timezone: string;
  language: string;
  timeFormat: string;
  dateFormat: string;
};
