import { Env } from "./enviroment";

export const NUMBER_PAGE = {
  PAGE_SIZE: 10,
  PAGE: 1,
};

export const CURRENCY = {
  JAPAN: 'JPY',
  VIETNAM: 'VND',
  ENGLISH: 'USD',
};

export enum LANGUAGE {
  ENGLISH = 'en',
  KOREAN = 'ko',
};

export const KEY_OBJECT = {
  PRODUCT: 'product',
};

export const VALIDATE_IMAGE = {
  IMAGE_SIZE: 2 * 1024 * 1024,
  IMAGE_TAIL: '.(png|jpeg|jpg)',
};

export const NUMBER_CONVERT_BIG_AMOUNT = 100
export const LIMIT_SECONDARY_IMAGE = 12;
export const ONE_HOUR = 60 * 60 * 1000; /* ms */
export const TWO_DAY = 48 * 60 * 60 * 1000; /* ms */
export const NUMBER_PAYMENT_ERROR = 4
export const NUMBER_ZERO = 0
export const DAYS_IN_YEAR = 365
export const INTENT_PAYMENT = "CAPTURE"
export const PAYPAL_CLIENT_KEY=Env.PAYPAL_CLIENT_KEY
export const PAYPAL_SECRET_KEY=Env.PAYPAL_SECRET_KEY
export const DOWN_RANK="DOWN"
export const RENEW_RANK="RENEW"
export const UP_RANK="UP"
export const AUTHENTICATION_RESULT = {
  ENROLLMENT_STATUS_Y: "Y",
  ENROLLMENT_STATUS_U: "U",
  AUTHENTICATION_STATUS_N: "N",
  AUTHENTICATION_STATUS_R: "R",
  AUTHENTICATION_STATUS_U: "U",
  AUTHENTICATION_STATUS_C: "C",
  LIABILITY_SHIFT_NO: "NO",
  LIABILITY_SHIFT_UNKNOWN: "UNKNOWN",
}

export const statusFile = {
  FAILED: 'Failed',
  PROCESSING: 'Processing',
  SUCCESS: 'Success',
};

export const statusJobImport = {
  PROCESSING: 'Processing',
  DONE: 'Done',
};

export const ERROR_RES = {
  INTERNAL_ERROR: {
    name: 'INTERNAL_ERROR',
    statusCode: 500,
  },
  NOT_FOUND_ERROR: {
    name: 'NOT_FOUND_ERROR',
    statusCode: 404,
  },
  CONFLICT_ERROR: {
    name: 'CONFLICT_ERROR',
    statusCode: 409,
  },
  EXPIRE_TOKEN_ERROR: {
    name: 'EXPIRE_TOKEN_ERROR',
    statusCode: 401,
  },
  VALIDATION_ERROR: {
    name: 'VALIDATION_ERROR',
    statusCode: 422,
  },
};
export const ERROR_TYPE = {
  VALIDATION: 'validation',
};
export const ERROR_INFO = {
  SUCCESS: 'SUCCESS',
  FAIL: 'FAIL',
};

export const STATUS_TRANSLATE = {
  DONE: 'DONE',
  PROCESSING: 'PROCESSING',
};

export const RULE_LEVEL_USER = [
  {
    level: 'Bronze',
    account: 1,
    lang: 12,
  },
  {
    level: 'Silver',
    account: 5,
    lang: 40,
  },
  {
    level: 'Gold',
    account: null,
    lang: null,
  }
];

export const CREDENTIALS_GG = {
  "type": Env.TYPE,
  "project_id": Env.PROJECT_ID,
  "private_key_id": Env.PRIVATE_KEY_ID,
  "private_key": Env.PRIVATE_KEY,
  "client_email": Env.CLIENT_EMAIL,
  "client_id": Env.CLIENT_ID,
  "auth_uri": Env.AUTH_URI,
  "token_uri": Env.TOKEN_URI,
  "auth_provider_x509_cert_url": Env.AUTH_PROVIDER_X509_CERT_URL,
  "client_x509_cert_url": Env.CLIENT_X509_CERT_URL,
  "universe_domain": Env.UNIVERSE_DOMAIN
}

export const CASH_RANK = {
  CASH_BRONZE: +Env.CASH_RANK_BRONZE,
  CASH_SILVER: +Env.CASH_RANK_SILVER,
  CASH_GOLD: +Env.CASH_RANK_GOLD,
}