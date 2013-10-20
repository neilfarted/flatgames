'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('PrepaidMobile', function() {

  beforeEach(function() {
    browser().navigateTo('../../app/index.html');
  });


  it('should automatically redirect to /start when location hash/fragment is empty', function() {
    expect(browser().location().url()).toBe("/start");
  });


    /*describe('home', function() {

    beforeEach(function() {
      browser().navigateTo('#/home');
    });


    it('should render home when user navigates to /home', function() {
      expect(element('[ng-view] p:first').text()).
        toMatch(/partial for home view /);
    });

  });


  describe('view2', function() {

    beforeEach(function() {
      browser().navigateTo('#/view2');
    });


    it('should render view2 when user navigates to /view2', function() {
      expect(element('[ng-view] p:first').text()).
        toMatch(/partial for view 2/);
    });

  });*/
});
