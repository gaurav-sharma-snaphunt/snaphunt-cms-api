const jwToken = require("jsonwebtoken");

const authenticate = async reqHeaderAuthorization => {
  if (!reqHeaderAuthorization) {
    throw new Error("Please log in");
  }
  let token = reqHeaderAuthorization.split(" ")[1];
  try {
    let decodedToken;
    jwToken.verify(token, "a-secret-key", (err, decoded) => {
      decodedToken = decoded;
    });

    return decodedToken;
  } catch (err) {
    throw new Error("Session expired");
  }
};

module.exports = authenticate;
