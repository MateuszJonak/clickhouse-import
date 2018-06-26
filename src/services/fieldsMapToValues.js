import { reduce, compose } from 'lodash/fp';

const reduceWithKey = reduce.convert({ cap: false });
const fieldsMapToArrayValues = reduceWithKey((result, value, key) => {
  result.push(`${key} ${value}`);

  return result;
}, []);
const joinWithComma = array => array.join(', ');

export default compose(
  joinWithComma,
  fieldsMapToArrayValues,
);
