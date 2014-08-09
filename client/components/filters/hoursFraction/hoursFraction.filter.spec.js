'use strict';

describe('Filter: hoursFraction', function () {

  // load the filter's module
  beforeEach(module('invoicerApp'));

  // initialize a new instance of the filter before each test
  var hoursFraction;
  beforeEach(inject(function ($filter) {
    hoursFraction = $filter('HoursFraction');
  }));

  it('should filter the fraction: 0.5 to 0:30hs"', function () {
    var fraction = 0.5;
    expect(hoursFraction(fraction)).toBe('0:30 hs.');
  });

  it('should filter the fraction: 1 to 1:00hs"', function () {
    var fraction = 1;
    expect(hoursFraction(fraction)).toBe('1:00 hs.');
  });

  it('should filter the fraction: 5.25 to 5:15hs"', function () {
    var fraction = 5.25;
    expect(hoursFraction(fraction)).toBe('5:15 hs.');
  });

  it('should filter the fraction: 5.25 to 5:15hs"', function () {
    var fraction = 2.2;
    expect(hoursFraction(fraction)).toBe('2:12 hs.');
  });

});
