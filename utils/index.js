require("dotenv").config();
const moment = require("moment-timezone");

const customMoment = (date = new Date()) => {
  return moment.tz(date, process.env.TIMEZONE);
};

module.exports = {
  moment: customMoment,
};
