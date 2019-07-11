const jwToken = require("jsonwebtoken");

const authenticate = async reqHeaderAuthorization => {
  let decodedToken;
  let result = reqHeaderAuthorization.split(" ")[1];
  if (result === "null") {
    throw new Error("Not logged in");
  }
  try {
    decodedToken = await jwToken.verify(result, "a-secret-key");
    return decodedToken;
  } catch (err) {
    throw new Error("Session expired");
  }
};

module.exports = authenticate;