const bcrypt = require('bcryptjs');

const initialize = () => {
  console.log('Authentication is ready ');
};

const registerUser = async (userData) => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  return { ...userData, password: hashedPassword };
};

const checkUser = async (userData, storedHashedPassword) => {
  const isPasswordValid = await bcrypt.compare(userData.password, storedHashedPassword);
  return isPasswordValid;
};

module.exports = { initialize, registerUser, checkUser };
