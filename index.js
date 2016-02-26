
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
 * combinations of specified property values,
 * filling the array with new entries if necessary.
 *
 * @param {Array} props - array of property definitions which are
 * expected to exist. Each object in the array has
 * the following attributes:
 *
 *   key - data object attribute name
 *   valueRange - range of values expected for key
 *
 * @param {Object} objTemplate - template for new entries
 *
 * @param {bool} filter - set to true to filter out any entries
 *
 */
function fillForProperties(data, props, objTemplate, filter) {

  if (!Array.isArray(data)) {
    throw new TypeError('data should be an array');
  }

  var d = data.slice();
  var missing = missingCombinations(d, props);
  missing.forEach(item => {
    var obj = _.cloneDeep(objTemplate);
    var index = 0;
    item.forEach(item => {
      obj[props[index].key] = item;
      index++;
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

function maxValue(arr, accessor) {
  return accessor(_.maxBy(arr, accessor));
}

function minValue(arr, accessor) {
  return accessor(_.minBy(arr, accessor));
}

function span(arr, accessor) {
  return [minValue(arr, accessor), maxValue(arr, accessor)];
}

function uniqValues(arr, accessor) {
  return _.uniqBy(arr, accessor).map(accessor);
}

module.exports.uniqValues = uniqValues;
module.exports.span = span;
module.exports.maxValue = maxValue;
module.exports.minValue = minValue;
module.exports.fillForProperties = fillForProperties;
module.exports.missingCombinations = missingCombinations;

