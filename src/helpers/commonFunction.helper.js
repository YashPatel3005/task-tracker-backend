/**
 * Remove specific keys from an object
 * @function
 * @param {Object} data - user object from which we want to remove specified keys
 */
export const removeKeyFromObject = async (data) => {
  data.password = undefined;
  data.__v = undefined;
  data.token = undefined;
};
