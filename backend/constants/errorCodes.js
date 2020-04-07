module.exports.codes = {
  BAD_REQUEST: {
    code: 400,
    message: 'Bad request.'
  },
  NOT_ALLOWED: {
    code: 405,
    message: 'Not allowed.'
  },
  ALREADY_EXIST: {
    code: 409,
    message: 'Already exist.'

  },
  EMAIL_IS_REQUIRED: {
    code: 403,
    message: 'Email is required.'
  },
  PASSWORD_IS_REQUIRED: {
    code: 403,
    message: 'Password is required.'
  },
  NOT_FOUND: {
    code: 404,
    message: 'Not Found.'
  },
  INVALID_PASSWORD: {
    code: 403,
    message: 'Invalid password.'
  },
  MISSING_USER_ID: {
    code: 403,
    message: 'Missing user ID.'
  },
  BAD_ID_FORMAT: {
    code: 403,
    message: 'Invalid ID format.'
  },
  DATABASE_ERROR: {
    code: 500,
    message: 'Database error.'
  },
  PASSWORDS_DO_NOT_MATCH: {
    code: 403,
    message: 'Passwords do not match.'
  },
  NOT_AUTHORIZED: {
    code: 401,
    message: 'Not authorized'
  },
  ROLE_IS_REQUIRED: {
    code: 403,
    message: 'Role is required.'
  },
  PASSWORD_IS_TO_SHORT: {
    code: 403,
    message: 'Password must contains at least 6 characters.'
  },
  EMAIL_IS_NOT_VALID: {
    code: 403,
    message: 'Email address is not valid.'
  },
  ROLE_BAD_FORMAT: {
    code: 403,
    message: 'User role is not valid.'
  },
  EXPIRED: {
    code: 403,
    message: 'Your session has been expired.'
  }
}