const { validationResult } = require("express-validator");

exports.result_validator = (req, res, next) => {
  const result = validationResult(req);
  const hasErrors = !result.isEmpty();

  if (hasErrors) {
    const errorList = result.array()?.map((obj) => {
      return obj.msg;
    });
    req.status = 400;
    next(JSON.stringify(errorList));
  } else {
    next();
  }
};