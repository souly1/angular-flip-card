describe('Card Flip Directive', function() {
    var $compile;
    var $rootScope;
    var $scope;
    var $timeout;
    // Load the myApp module, which contains the directive
    beforeEach(module('fmp-card'));

    // Store references to $rootScope and $compile
    // so they are available to all tests in this describe block
    beforeEach(inject(function(_$compile_, _$rootScope_, _$timeout_){
        jasmine.getStyleFixtures().fixturesPath = 'base';
        loadStyleFixtures('css/fmpCardDirective.css');

        // The injector unwraps the underscores (_) from around the parameter names when matching
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        $timeout = _$timeout_;
    }));

    afterEach(function() {

    });

    it('Should use height 100% of containing element for unflipped card if height not defined', function(){
        //Arrange
        var fixture = setFixtures('<div id="parent-div" style="height: 125px !important;">'+
        '<fmp-card suffix="1" image="card-front-icon.png" front-caption="Card front caption" small-card-width="120px">' +
        '<div id="card-back1">Card Back 1</div>' +
        '</fmp-card>' +
        '</div>');

        //Act
        $compile($("body"))($scope);
        $scope.$digest();
        var heightPercentage = ( 100 * parseFloat(angular.element('.fmp-card-small').height()) /
            parseFloat(angular.element('#parent-div').height()) ) + '%';

        //Assert
        expect(heightPercentage).toBe('100%');
    });

    it('Should use width 100% of containing element for unflipped card if width not defined', function(){
        //Arrange
        $scope = $rootScope.$new();
        var fixture = setFixtures('<div id="parent-div" style="width: 135px !important;">'+
        '<fmp-card suffix="1" image="card-front-icon.png" front-caption="Card front caption" small-card-height="120px">' +
        '<div id="card-back1">Card Back 1</div>' +
        '</fmp-card>' +
        '</div>');

        //Act
        $compile($("body"))($scope);
        $scope.$digest();
        var widthPercentage = ( 100 * parseFloat(angular.element('.fmp-card-small').outerWidth(true)) /
            parseFloat(angular.element('#parent-div').outerWidth(true))) + '%';

        //Assert
        expect(widthPercentage).toBe('100%');
    });

    it('Should generate id suffix automatically as int for card front and back if suffix not defined', function(){
        //Arrange
        spyOn(Math, 'random').and.returnValue(0.000221);
        var expectedIdSuffix = 222;
        $scope = $rootScope.$new();
        var fixture = setFixtures('<fmp-card image="card-front-icon.png" front-caption="Card front caption" small-card-width="120px" small-card-height="120px">' +
        '<div id="card-back1">Card Back 1</div>' +
        '</fmp-card>');

        //Act
        $compile($("body"))($scope);
        $scope.$digest();

        //Assert
        expect(angular.element('.fmp-card-small')[0]).toHaveId("fmp-card-small-" + expectedIdSuffix);
        expect(angular.element('.fmp-card-large')[0]).toHaveId("fmp-card-large-" + expectedIdSuffix);
    });

    it('Should work regularly if image is not defined', function(){
        //Arrange
        $scope = $rootScope.$new();
        var fixture = setFixtures('<fmp-card suffix="1" front-caption="Card front caption" small-card-width="120px" small-card-height="120px">' +
        '<div id="card-back1">Card Back 1</div>' +
        '</fmp-card>');

        //Act
        $compile($("body"))($scope);
        $scope.$digest();

        //Assert
        expect(angular.element('.fmp-card-small')[0]).toBeInDOM();
    });

    it('Should work regularly if caption is not defined', function(){
        //Arrange
        $scope = $rootScope.$new();
        var fixture = setFixtures('<fmp-card suffix="1" image="card-front-icon.png" small-card-width="120px" small-card-height="120px">' +
        '<div id="card-back1">Card Back 1</div>' +
        '</fmp-card>');

        //Act
        $compile($("body"))($scope);
        $scope.$digest();

        //Assert
        expect(angular.element('.fmp-card-small')[0]).toBeInDOM();
    });

    it('Should set small unflipped card width according to width param', function() {
        //Arrange
        $scope = $rootScope.$new();
        var fixture = setFixtures(
            '<fmp-card suffix="1" image="card-front-icon.png" front-caption="Card front caption" small-card-width="98px" small-card-height="120px">' +
            '<div id="card-back1">Card Back 1</div>' +
            '</fmp-card>');

        //Act
        $compile($("body"))($scope);
        $scope.$digest();

        //Assert
        expect(angular.element('.fmp-card-small').width()).toBe(98);
    });

    it('Should set set small unflipped card height according to width param', function() {
        //Arrange
        $scope = $rootScope.$new();
        var fixture = setFixtures(
            '<fmp-card suffix="1" image="card-front-icon.png" front-caption="Card front caption" small-card-width="98px" small-card-height="124px">' +
            '<div id="card-back1">Card Back 1</div>' +
            '</fmp-card>');

        //Act
        $compile($("body"))($scope);
        $scope.$digest();

        //Assert
        expect(angular.element('.fmp-card-small').height()).toBe(124);
    });

    it('Should set set small unflipped card suffix according to width param', function() {
        //Arrange
        var expectedIdSuffix = "mySuffix";
        $scope = $rootScope.$new();
        var fixture = setFixtures(
            '<fmp-card suffix="' + expectedIdSuffix + '" image="card-front-icon.png" front-caption="Card front caption" small-card-width="98px" small-card-height="124px">' +
            '<div id="card-back1">Card Back 1</div>' +
            '</fmp-card>');

        //Act
        $compile($("body"))($scope);
        $scope.$digest();

        //Assert
        expect(angular.element('.fmp-card-small')[0]).toHaveId("fmp-card-small-" + expectedIdSuffix);
        expect(angular.element('.fmp-card-large')[0]).toHaveId("fmp-card-large-" + expectedIdSuffix);
    });

    it('Should set small unflipped card background src according to width param', function() {
        //Arrange
        var expectedBackgroundSrc = "card-front-icon.png";
        $scope = $rootScope.$new();
        var fixture = setFixtures(
            '<fmp-card suffix="test" image="' + expectedBackgroundSrc + '" front-caption="Card front caption" small-card-width="98px" small-card-height="124px">' +
            '<div id="card-back1">Card Back 1</div>' +
            '</fmp-card>');

        //Act
        $compile($("body"))($scope);
        $scope.$digest();

        //Assert
        expect(angular.element('.fmp-card-small-image').css("background-image")).toContain(expectedBackgroundSrc);
    });

    it('Should set small unflipped card caption according to width param', function() {
        //Arrange
        var expectedCaption = "card caption";
        $scope = $rootScope.$new();
        var fixture = setFixtures(
            '<fmp-card suffix="test" image="card-front-icon.png" front-caption="' + expectedCaption + '" small-card-width="98px" small-card-height="124px">' +
            '<div id="card-back1">Card Back 1</div>' +
            '</fmp-card>');

        //Act
        $compile($("body"))($scope);
        $scope.$digest();

        //Assert
        expect(angular.element('.fmp-card-small').text()).toBe(expectedCaption);
    });

    it('Should display flipped large card once small card clicked', function(done) {
        //Arrange
        var expectedCaption = "card caption";
        $scope = $rootScope.$new();
        var fixture = setFixtures(
            '<fmp-card suffix="test" image="card-front-icon.png" front-caption="' + expectedCaption + '" small-card-width="98px" small-card-height="124px">' +
            '<div id="card-back1">Card Back 1</div>' +
            '</fmp-card>');
        $compile($("body"))($scope);
        $scope.$digest();
        var smallCard = angular.element('.fmp-card-small');
        var largeCard = angular.element('.fmp-card-large');

        //Act
        smallCard.click();
        $timeout.flush();
        $timeout.flush();

        window.setTimeout(function () {
            //Assert
            expect(smallCard[0].style.visibility).toBe('hidden');
            expect(largeCard[0].style.display).toBe('block');
            done();
        }, 1000);
    });

    it('Should close flipped large card once clicked', function(done) {
        //Arrange
        var expectedCaption = "card caption";
        $scope = $rootScope.$new();
        var fixture = setFixtures(
            '<fmp-card suffix="test" image="card-front-icon.png" front-caption="' + expectedCaption + '" small-card-width="98px" small-card-height="124px">' +
            '<div id="card-back1">Card Back 1</div>' +
            '</fmp-card>');
        $compile($("body"))($scope);
        $scope.$digest();
        var smallCard = angular.element('.fmp-card-small');
        var largeCard = angular.element('.fmp-card-large');

        //Act
        smallCard.click();
        //$scope.$digest();
        $timeout.flush();
        $timeout.flush();

        //Assert 1 - card flipped first time
        expect(smallCard[0].style.visibility).toBe('hidden'); //Verify small card has been flipped
        expect(largeCard[0].style.display).toBe('block'); //Verify small card has been flipped
        largeCard.click();
        $scope.$digest();

        window.setTimeout(function () {
            //Assert 2 - card flipped back
            expect(smallCard[0].style.visibility).toBe(''); //Verify large card has been flipped
            expect(largeCard[0].style.display).toBe('none'); //Verify large card has been flipped
            done();
        }, 500);
    });

    it('Should fire onCardOpen event when clicking on small card', function(done) {
        //Arrange
        var cardOpened = false;
        var expectedCaption = "card caption";
        $scope = $rootScope.$new();
        $scope.onCardOpen = function(){
            cardOpened = true;
        };
        var fixture = setFixtures(
            '<fmp-card suffix="test" image="card-front-icon.png" front-caption="' + expectedCaption + '" small-card-width="98px" small-card-height="124px" on-card-opened="onCardOpen()">' +
            '<div id="card-back1">Card Back 1</div>' +
            '</fmp-card>');
        $compile($("body"))($scope);
        $scope.$digest();
        var smallCard = angular.element('.fmp-card-small');
        var largeCard = angular.element('.fmp-card-large');

        //Act
        smallCard.click();
        $scope.$digest();

        //Assert
        expect(cardOpened).toBe(true);
        done();
    });

    it('Should fire onCardClose event when clicking on small card and cancel close if return value is false', function(done) {
        //Arrange
        var cardClosedCalled = false;
        var expectedCaption = "card caption";
        $scope = $rootScope.$new();
        $scope.onCardClose = function(){
            cardClosedCalled = true;
            return false;
        };
        var fixture = setFixtures(
            '<fmp-card suffix="test" image="card-front-icon.png" front-caption="' + expectedCaption + '" small-card-width="98px" small-card-height="124px" on-card-closed="onCardClose()">' +
            '<div id="card-back1">Card Back 1</div>' +
            '</fmp-card>');
        $compile($("body"))($scope);
        $scope.$digest();
        var smallCard = angular.element('.fmp-card-small');
        var largeCard = angular.element('.fmp-card-large');

        //Act
        smallCard.click();

        //Angular
        //$scope.$digest();
        $timeout.flush();
        $timeout.flush();

        //Assert 1 - verify card flipped first time
        expect(smallCard[0].style.visibility).toBe('hidden'); //Verify small card has been flipped
        expect(largeCard[0].style.display).toBe('block'); //Verify small card has been flipped
        largeCard.click();
        $scope.$digest();

        //Assert 2 - verify card not flipped back
        window.setTimeout(function () {
            //Assert 2 - card flipped back
            expect(smallCard[0].style.visibility).toBe('hidden'); //Verify large card has been flipped
            expect(largeCard[0].style.display).toBe('block'); //Verify large card has been flipped
            expect(cardClosedCalled).toBe(true);
            done();
        }, 500);
    });
});
