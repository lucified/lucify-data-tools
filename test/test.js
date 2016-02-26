
var expect = require('chai').expect;
var _ = require('lodash');
var deepcopy = require('deepcopy');

var tools = require('../index.js');


var properties = [
  {
    key: 'key1',
    valueRange: ['A', 'B']
  },
  {
    key: 'key2',
    valueRange: [1, 2]
  },
  {
    key: 'key3',
    valueRange: ['X', 'Y']
  }
];

var data = [
  {
    key1: 'A',
    key2: 1,
    key3: 'X',
    count: 4
  },
  {
    key1: 'A',
    key2: 1,
    key3: 'Y',
    count: 6
  },
  {
    key1: 'A',
    key2: 2,
    key3: 'X',
    count: 12
  },
  {
    key1: 'A',
    key2: 2,
    key3: 'Y',
    count: 3
  },
  {
    key1: 'B',
    key2: 1,
    key3: 'X',
    count: 15
  },
  {
    key1: 'B',
    key2: 1,
    key3: 'Y',
    count: 22
  },
  {
    key1: 'C', // different than in one of the expected ones
    key2: 2,
    key3: 'X',
    count: 4
  },
  {
    key1: 'C', // different than one in the expected ones
    key2: 2,
    key3: 'Y',
    count: 30
  }
];


describe('missingCombinations', () => {

  it('works for simple input array', () => {
    var d = deepcopy(data);
    var missing = tools.missingCombinations(d, properties);
    expect(missing).to.have.length(2);

    // should include these
    expect(_.find(missing, item => item[0] == 'B' && item[1] == '2' && item[2] == 'X')).to.not.be.undefined;
    expect(_.find(missing, item => item[0] == 'B' && item[1] == '2' && item[2] == 'Y')).to.not.be.undefined;

    // should not include anything else
    expect(_.find(missing, item => item[0] == 'C' && item[1] == '2' && item[2] == 'X')).to.be.undefined;
    expect(_.find(missing, item => item[0] == 'C' && item[1] == '2' && item[2] == 'Y')).to.be.undefined;
  });

});



describe('fillForProperties', () => {
  it('works when not filtering', () => {

    var d = deepcopy(data);
    var ret = tools.fillForProperties(d, properties, {'count': 0});

    expect(ret).to.have.length(10);

    // should include these among others
    expect(_.find(ret, item => item.key1 == 'B' && item.key2 == '2' && item.key3 == 'X' && item.count === 0)).to.not.be.undefined;
    expect(_.find(ret, item => item.key1 == 'B' && item.key2 == '2' && item.key3 == 'Y' && item.count === 0)).to.not.be.undefined;
    expect(_.find(ret, item => item.key1 == 'C' && item.key2 == '2' && item.key3 == 'X' && item.count === 4)).to.not.be.undefined;
    expect(_.find(ret, item => item.key1 == 'C' && item.key2 == '2' && item.key3 == 'Y' && item.count === 30)).to.not.be.undefined;
  });


  it('works when filtering', () => {

    var d = deepcopy(data);
    var ret = tools.fillForProperties(d, properties, {'count': 0}, true);

    expect(ret).to.have.length(8);

    // should include these among others
    expect(_.find(ret, item => item.key1 == 'B' && item.key2 == '2' && item.key3 == 'X' && item.count == 0), 1).to.not.be.undefined;
    expect(_.find(ret, item => item.key1 == 'B' && item.key2 == '2' && item.key3 == 'Y' && item.count == 0), 2).to.not.be.undefined;

    // these should be filtered
    expect(_.find(ret, item => item.key1 == 'C' && item.key2 == '2' && item.key3 == 'X'), 3).to.be.undefined;
    expect(_.find(ret, item => item.key1 == 'C' && item.key2 == '2' && item.key3 == 'Y'), 4).to.be.undefined;
  });

});

describe('minValue', () => {
  it('works', () => {
    var arr = [{a: 5, b: 6}, {a: 2, b: 7}, {a: 7, b: 8}];
    expect(tools.minValue(arr, item => item.a)).to.equal(2);
    expect(tools.minValue(arr, item => item.b)).to.equal(6);
  });
});


describe('maxValue', () => {
  it('works', () => {
    var arr = [{a: 5, b: 6}, {a: 2, b: 7}, {a: 7, b: 8}];
    expect(tools.maxValue(arr, item => item.a)).to.equal(7);
    expect(tools.maxValue(arr, item => item.b)).to.equal(8);
  });
});


describe('span', () => {
  it('works', () => {
    var arr = [{a: 5, b: 6}, {a: 2, b: 7}, {a: 7, b: 8}];
    expect(tools.span(arr, item => item.a)[0]).to.equal(2);
    expect(tools.span(arr, item => item.a)[1]).to.equal(7);
    expect(tools.span(arr, item => item.b)[0]).to.equal(6);
    expect(tools.span(arr, item => item.b)[1]).to.equal(8);
  });
});


