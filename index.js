
var Combinatorics = require('js-combinatorics');
var _ = require('lodash');

/*
 * Find out which combinations of specified
 * property values do not exist in `data`
 *
 * props is array of property definitions which are
 * expected to exist. Each object in the array has
 * the following attributes:
 *
 *    key        -- data object attribute name
 *    valueRange -- range of values expected for key
 */
function missingCombinations(data, props) {

  if (!Array.isArray(data)) {
    throw new TypeError('data should be an array');
  }

  var params = props.map(item => item.valueRange);
  var expectedCombinations = Combinatorics.cartesianProduct.apply(null, params).toArray();

  var presentCombinations = _.uniq(data, item => props.reduce(
    (prev, curr) => prev + '-' + item[curr.key] ), '').map(item => {
      return props.reduce((p, c) => {
        p.push(item[c.key]);
        return p;
      }, []);
    }
  );
  return _.differenceBy(expectedCombinations, presentCombinations, arr => {
    return arr.reduce((prev, curr) => prev + '-' + curr, '');
  });
}


/*
 * Make sure data array has entries for all
 * combinations of specified properties
 *
 * props is array of property definitions which are
 * expected to exist. Each object in the array has
 * the following attributes:
 *
 *    key        -- data object attribute name
 *    valueRange -- range of values expected for key
 */
function fillForProperties(data, props, valueAttr, missingValue, filter) {

  if (!Array.isArray(data)) {
    throw new TypeError('data should be an array');
  }

  var d = data.slice();
  var missing = missingCombinations(d, props);
  missing.forEach(item => {
    var obj = {};
    var index = 0;
    item.forEach(item => {
      obj[props[index].key] = item;
      index++;
      obj[valueAttr] = missingValue;
    });
    d.push(obj);
    return true;
  });

  if (filter) {
    return d.filter(item => {
      var dontInclude = false;
      props.forEach(prop => {
        if (prop.valueRange.indexOf(item[prop.key]) == -1) {
          dontInclude = true;
        }
      });
      return !dontInclude;
    });
  }
  return d;
}



module.exports.fillForProperties = fillForProperties;
module.exports.missingCombinations = missingCombinations;

