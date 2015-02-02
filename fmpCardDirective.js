angular.module('fmp-card', [])
    .directive("fmpCard", function($animate) {
        var animateCardMovingIn = function(smallCard, largeCard) {
            //Hide small card
            var oldSmallCardStyle = angular.element(smallCard).attr("style");
            angular.element(smallCard).attr("style",oldSmallCardStyle + "visibility: hidden;");

            //Set the large card on small card location and display it
            var newlargeCardStyle = "left:" + smallCard.offsetLeft + "px;" +
                "top:" + smallCard.offsetTop + "px;" +
                "width:" + smallCard.offsetWidth + "px;" +
                "height:" + smallCard.offsetHeight + "px;" +
                "display:block;" + "margin:0;";
            angular.element(largeCard).attr('style', newlargeCardStyle);
            $animate.addClass(largeCard, 'unflip');
        };

        var animateCardMovingOut = function(smallCard, largeCard) {
            $animate.removeClass(largeCard, 'unflip').then(function() {

                //Hide Large card after it shrank
                var largeCardOldStyle = angular.element(largeCard).attr('style');
                if (largeCardOldStyle) {
                    var newLargeCardStyle = largeCardOldStyle.replace("display:block", "display:none");
                    angular.element(largeCard).attr('style', newLargeCardStyle);
                }

                //Make small Card reappear
                var oldSmallCardStyle = angular.element(smallCard).attr("style");
                if (oldSmallCardStyle) {
                    var newSmallCardStyle = oldSmallCardStyle.replace("visibility: hidden;", "");
                    angular.element(smallCard).attr('style', newSmallCardStyle);
                }
            });
        };

        return {
            restrict: 'E',
            transclude: true,
            scope: {
                smallCardWidth: "@",
                smallCardHeight: "@",
                image: "@",
                frontCaption: "@",
                suffix: "@"
            },
            link: function (scope, element) {
                //Get all existing small cards to check if clicking outside of this card not clicking
                //on another card. is so don't open it
                scope.allSmallCardDOMElements = angular.element(document.getElementsByClassName('fmp-card-small'));

                //Small card representation
                scope.smallCardDOMElement = element[0].querySelector('.fmp-card-small');

                //Large card representation
                scope.largeCardDOMElement = element[0].querySelector('.fmp-card-large');

                //HTML element to identify clicks outside cards
                scope.htmlElement = angular.element(document.getElementsByTagName('html'));

                //Initialize card states to animate card moving back out final state
                animateCardMovingOut(scope.smallCardDOMElement, scope.largeCardDOMElement);

                //Set initial large card position and hide it
                angular.element(scope.largeCardDOMElement).attr('style',"margin:0;display:none;");

                //Event when clicking outside current card which is opened
                scope.htmlClickEventHandler = function() {
                    scope.htmlElement.unbind(scope.clickEvent, scope.htmlClickEventHandler);
                    animateCardMovingOut(scope.smallCardDOMElement, scope.largeCardDOMElement);
                    scope.$digest();
                };

                //Event when clicking on a closed small card
                var onSmallCardSelected = function(e){
                    var isCardAlreadyOpen = false;// if we have a different card already open then don't open another
                    //Check if we got another card already open
                    for (var i = 0; i< scope.allSmallCardDOMElements.length ; i++){
                        isCardAlreadyOpen = (scope.allSmallCardDOMElements[i].style.visibility == "hidden");
                        if (isCardAlreadyOpen){
                            break;
                        }
                    }
                    if (!isCardAlreadyOpen) { //We don't have a different card already open
                        animateCardMovingIn(scope.smallCardDOMElement, scope.largeCardDOMElement);
                        //Binding only in event so we don't create for each meal binds to html body for identifying clicks outside
                        scope.htmlElement.bind(scope.clickEvent, scope.htmlClickEventHandler);
                        e.stopPropagation();
                    }
                };

                scope.onSmallCardClicked = function(e){
                    //if Angular only
                    if (scope.clickEvent == 'click'){
                        onSmallCardSelected(e);
                    }
                };

                scope.onSmallCardTouched = function(e){
                    //if Ionic
                    if (scope.clickEvent == 'touch'){
                        onSmallCardSelected(e);
                    }
                };

                //Event When clicking on open card stop event propagation so it wont close the card
                var onLargeCardSelected = function(e){
                    e.stopPropagation();
                };

                scope.onLargeCardClicked = function(e){
                    //if Angular only
                    if (scope.clickEvent == 'click'){
                        onLargeCardSelected(e);
                    }
                };

                scope.onLargeCardTouched = function(e){
                    //if Ionic
                    if (scope.clickEvent == 'touch'){
                        onLargeCardSelected(e);
                    }
                };

                var getRandomNumberForId = function(){
                    return parseInt((Math.random() * (1000000 - 1 + 1)), 10) + 1;
                };

                //If suffix input not given use a random number
                scope.directiveSuffix = (scope.suffix)? scope.suffix : getRandomNumberForId();

                var newSmallCardStyle = angular.element(scope.smallCardDOMElement).attr("style");

                if (!newSmallCardStyle){
                    newSmallCardStyle = "";
                }

                //Set small card width if have input
                if (scope.smallCardWidth){
                    newSmallCardStyle = newSmallCardStyle + "width: " + scope.smallCardWidth + ";";
                }

                //Set small card height if have input
                if (scope.smallCardHeight){
                    newSmallCardStyle = newSmallCardStyle + "height: " + scope.smallCardHeight + ";";
                }

                angular.element(scope.smallCardDOMElement).attr("style", newSmallCardStyle);

                //Check if ionic is installed and if so modify events to use on-touch instead of ng-click. faster
                scope.clickEvent = 'click';
                if (typeof ionic !== 'undefined') {
                    scope.clickEvent = 'touch';
                }
            },
            template:
                '<div class="fmp-card fmp-card-small" id="fmp-card-small-{{directiveSuffix}}" ng-style="{\'background-image\':\'url(\'+ image +\')\'}" ng-click="onSmallCardClicked($event)" on-touch="onSmallCardTouched($event)">' +
                    '<div ng-bind="frontCaption"></div>' +
                '</div>' +
                '<div class="fmp-card fmp-card-large" id="fmp-card-large-{{directiveSuffix}}" ng-click="onSmallCardClicked($event)" on-touch="onLargeCardTouched($event)">' +
                    '<div class="fmp-flipper">' +
                        '<div class="fmp-card-front-large" ng-style="{\'background-image\':\'url(\'+ image +\')\'}">' +
                            '<div ng-bind="frontCaption"></div>' +
                        '</div>' +
                        '<div class="fmp-card-back" ng-transclude></div>' +
                    '</div>' +
                '</div>'
        }
    });