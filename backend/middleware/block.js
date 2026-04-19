const User = require('../model/userschema');

/**
 * For /login: only block requests when the user exists and is blocked.
 * Unknown usernames must reach the login handler so it can return a generic invalid-credentials response.
 */
const blockMiddleware = async (req, res, next) => {
  const { username } = req.body;

  try {
    if (!username || String(username).trim() === '') {
      return res.status(400).json({
        success: false,
        code: 'VALIDATION_ERROR',
        message: 'Email or username is required.',
      });
    }

    const id = String(username).trim();
    const userInfo = await User.findOne({
      $or: [{ username: id }, { email: id.toLowerCase() }],
    });

    if (!userInfo) {
      return next();
    }

    const blocked =
      userInfo.status === 'blocked' || userInfo.status === 'block';
    if (blocked) {
      return res.status(403).json({
        success: false,
        code: 'ACCOUNT_BLOCKED',
        message: 'Your account is blocked. Please contact support.',
      });
    }

    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      code: 'SERVER_ERROR',
      message: 'An error occurred while checking your account.',
    });
  }
};

module.exports = { blockMiddleware};

  
