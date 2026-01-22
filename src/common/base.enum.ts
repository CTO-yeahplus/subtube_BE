export enum AccountType {
  NORMAL = 'NORMAL',
  ADMIN = 'ADMIN',
}

export enum LoginType {
  GOOGLE = 'GOOGLE',
  FACEBOOK = 'FACEBOOK',
  ACCOUNT = 'ACCOUNT',
}

export enum USERSORTFIELD {
  id = 'id',
  createdAt = 'createdAt',
  updatedAt = 'updatedAt',
}

export enum OTPTYPE {
  REGISTER = 'REGISTER',
  FORGOT_USERNAME = 'FORGOT_USERNAME',
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
  RESET_PASSWORD = 'RESET_PASSWORD',
  VERIFY_USER = 'VERIFY_USER',
}

export enum AGERANGE {
  U20 = '<20',
  F20T30 = '21-30',
  F31T40 = '31-40',
  F41T50 = '41-50',
  O51 = '>51',
}

export enum PAYMENT_STATUS {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
}

export enum ACTIVESTATUS {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum DISCOUNTTYPE {
  FREESHIP = 'freeship',
  PERCENT = 'percent',
  CASH = 'cash',
}

export enum UPPERCASESORTBY {
  DESC = 'DESC',
  ASC = 'ASC',
}

export enum SORTBY {
  desc = 'desc',
  asc = 'asc',
  DESC = 'DESC',
  ASC = 'ASC',
}

export enum COLLECTIONSTATUS {
  PUBLISH = 'publish',
  UNPUBLISH = 'unpublish',
}

export enum LANGUAGE {
  ENGLISH = 'en',
  KOREAN = 'ko',
}

export enum LEVEL_USER {
  BRONZE = 'Bronze',
  SILVER = 'Silver',
  GOLD = 'Gold',
}

export enum METHOD_VERIFY_USER {
  EMAIL = 'Email',
  PHONE_NUMBER = 'Phone',
}

export enum TYPE_TRANSLATE {
  VIDEO = 'Video',
  CAPTION = 'Caption',
};

export enum STATUS_TO_TRANSLATE {
  NEW = 'New',
  RETRANSLATE = 'Retranslate',
};

export enum PAYMENT_INTENT {
  CANCELED = 'canceled',
  PROCESSING = 'processing',
  REQUIRES_CAPTURE = 'requires_capture',
  REQUIRES_CONFIRMATION = 'requires_confirmation',
  REQUIRES_ACTION = 'requires_action',
  REQUIRES_PAYMENT_METHOD = 'requires_payment_method',
  SUCCEEDED = 'succeeded',
  CREATED = 'CREATED',
  SAVED = 'SAVED',
  APPROVED = 'APPROVED',
  VOIDED = 'VOIDED',
  COMPLETED = 'COMPLETED',
  PAYER_ACTION_REQUIRED = 'PAYER_ACTION_REQUIRED',
  DECLINED = 'DECLINED',
  PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED',
  PENDING = 'PENDING', 
  REFUNDED = 'REFUNDED',
  FAILED = 'FAILED'
}