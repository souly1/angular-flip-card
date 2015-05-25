angular.module('fmp-card', [])
    .directive("fmpCard", function($timeout, $window) {
        var getCssVendorPrefix = function (operation){
            var retval = "";

            var userAgent = $window.navigator.userAgent.toLowerCase();
            if (operation == "transform"){
                if (userAgent.indexOf('chrome') > -1){
                    retval = "";
                } else if (userAgent.indexOf('safari') > -1){
                    retval = "-webkit-";
                } else if (userAgent.indexOf('msie') > -1){
                    retval = "";
                } else if (userAgent.indexOf('opera') > -1){
                    retval = "";
                } else if (userAgent.indexOf('firefox') > -1){
                    retval = "";
                } else{
                    retval = "-webkit-";
                }
            } else if (operation == "transition"){
                if (userAgent.indexOf('chrome') > -1){
                    retval = "";
                } else if (userAgent.indexOf('safari') > -1){
                    retval = "-webkit-";
                } else if (userAgent.indexOf('msie') > -1){
                    retval = "";
                } else if (userAgent.indexOf('opera') > -1){
                    retval = "";
                } else if (userAgent.indexOf('firefox') > -1){
                    retval = "";
                } else{
                    retval = "-webkit-";
                }
            }
            return retval;
        };

        var getFlipCardTransitionStartPointStyle = function (smallCard, largeCard){
            //transition flip from small card to large card
            var flipCardLeftInitialTransition =  smallCard.offsetLeft - (largeCard.largeCardLeft + (largeCard.largeCardWidthSize - (largeCard.largeCardWidthSize / (largeCard.largeCardWidthSize/smallCard.clientWidth))) / 2);
            var flipCardTopInitialTransition = smallCard.offsetTop - (largeCard.largeCardTop + (largeCard.largeCardHeightSize - (largeCard.largeCardHeightSize / (largeCard.largeCardHeightSize/smallCard.clientHeight))) / 2) + 2;
            var flipCardInitialWidthScale = smallCard.clientWidth / largeCard.largeCardWidthSize;
            var flipCardInitialHeightScale = smallCard.clientHeight / largeCard.largeCardHeightSize;
            return "-webkit-transform: translate(" + flipCardLeftInitialTransition + "px, " +
                flipCardTopInitialTransition + "px) " +
                "scale(" + flipCardInitialWidthScale + "," + flipCardInitialHeightScale + ");";
        };

        var animateCardMovingIn = function(smallCard, largeCard, flipCard, transitionSpeed) {
            //Set the large card in center of view-port
            largeCard.largeCardWidthSize = smallCard.clientWidth * 2;
            largeCard.largeCardHeightSize = smallCard.clientHeight * 2;
            largeCard.largeCardLeft = $window.innerWidth/2 - largeCard.largeCardWidthSize/2;
            largeCard.largeCardTop = $window.innerHeight/2 - largeCard.largeCardHeightSize/2;

            var startFlipCardStyle = getFlipCardTransitionStartPointStyle(smallCard, largeCard);

            var cssVendorPrefix = getCssVendorPrefix("transform");

            var endFlipCardStyle = cssVendorPrefix + "transform: translate(0px, 0px) scale(1) rotateY(180deg);";
            angular.element(flipCard).attr("style", startFlipCardStyle);

            $timeout(function() {
                angular.element(flipCard).attr("style", startFlipCardStyle + 'z-index:700;');

                //Place large card in display
                var newLargeCardStyle =
                    "left:" + largeCard.largeCardLeft + "px;" +
                    "top:" + largeCard.largeCardTop + "px;" +
                    "width:" + largeCard.largeCardWidthSize + "px;" +
                    "height:" + largeCard.largeCardHeightSize + "px;" +
                    "display:block;";
                angular.element(largeCard).attr('style', newLargeCardStyle);

                //After first preparation for animate do animation changes
                $timeout(function () {
                    //Hide small card
                    var oldSmallCardStyle = angular.element(smallCard).attr("style");
                    angular.element(smallCard).attr("style",oldSmallCardStyle + "visibility: hidden;");

                    angular.element(largeCard).addClass('unflip');
                    var transitionStyleAddition = '';
                    if (transitionSpeed !== null && transitionSpeed !== undefined && transitionSpeed !== ""){
                        transitionStyleAddition = getCssVendorPrefix('transition') + 'transition:' + transitionSpeed + "s;";
                    }
                    angular.element(flipCard).attr("style", endFlipCardStyle + 'z-index:700;' + transitionStyleAddition);
                }, 100);//Not 0 since sometimes animation not happening in browser
            },100);
        };

        var animateCardMovingOutStrategy = function(smallCard, largeCard){
            //Make small Card reappear
            var oldSmallCardStyle = angular.element(smallCard).attr("style");
            if (oldSmallCardStyle) {
                var newSmallCardStyle = oldSmallCardStyle.replace("visibility: hidden;", "");
                angular.element(smallCard).attr('style', newSmallCardStyle);
            }

            //Hide Large card after it shrank
            var largeCardOldStyle = angular.element(largeCard).attr('style');
            if (largeCardOldStyle) {
                var newLargeCardStyle = largeCardOldStyle.replace("display:block", "display:none");
                angular.element(largeCard).attr('style', newLargeCardStyle);
            }
        };

        var animateCardMovingOut = function(smallCard, largeCard, flipCard, transitionSpeed) {
            var transitions = "transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd";

            angular.element(flipCard).one(transitions, function(){
                angular.element(largeCard).removeClass('unflip');
                angular.element(flipCard).unbind(transitions);
                animateCardMovingOutStrategy(smallCard, largeCard);
            });

            var endFlipCardStyle = getFlipCardTransitionStartPointStyle(smallCard, largeCard);
            if (transitionSpeed !== null && transitionSpeed !== undefined && transitions !== "") { //Change animation speed
                endFlipCardStyle = endFlipCardStyle + getCssVendorPrefix('transition') + 'transition:' + transitionSpeed + "s;";
                //angular.element(largeCard).removeClass('unflip');
                if (transitionSpeed === 0) { //Immediate flip
                    angular.element(largeCard).removeClass('unflip');
                    angular.element(flipCard).unbind(transitions);
                    animateCardMovingOutStrategy(smallCard, largeCard);
                }
            }

            angular.element(flipCard).attr("style", endFlipCardStyle);
        };

        return {
            restrict: 'E',
            transclude: true,
            scope: {
                smallCardWidth: "@",
                smallCardHeight: "@",
                image: "@",
                frontCaption: "@",
                suffix: "@",
                onCardOpened: "&",
                onCardClosed: "&",
                cardControl: '='
            },
            link: function (scope, element) {
                //Get all existing small cards to check if clicking outside of this card not clicking
                //on another card. is so don't open it
                scope.allSmallCardDOMElements = null;

                //Small card representation
                scope.smallCardDOMElement = element[0].querySelector('.fmp-card-small');

                //Large card final point representation
                scope.largeCardDOMElement = element[0].querySelector('.fmp-card-large');

                //flipping card representation
                scope.flipperCardDOMElement = element[0].querySelector('.fmp-flipper');

                //Initialize card states to animate card moving back out final state
                animateCardMovingOutStrategy(scope.smallCardDOMElement, scope.largeCardDOMElement);

                ////Set initial large card position and hide it
                angular.element(scope.largeCardDOMElement).attr('style',"display:none;");

                //Event when clicking outside current card which is opened
                var onLargeCardSelected = function(e, transitionSpeed) {
                    var isClosingCard = false;
                    if (scope.onCardClosed){
                        isClosingCard = scope.onCardClosed();
                    }

                    if (isClosingCard !== false) { //During tests this received 'undefined'
                        animateCardMovingOut(scope.smallCardDOMElement, scope.largeCardDOMElement, scope.flipperCardDOMElement, transitionSpeed);
                        //scope.$digest();
                    }
                };

                //Event when clicking on a closed small card
                var onSmallCardSelected = function(e, transitionSpeed){
                    var isCardAlreadyOpen = false;// if we have a different card already open then don't open another
                    if (!scope.allSmallCardDOMElements){
                        scope.allSmallCardDOMElements = angular.element(document.getElementsByClassName('fmp-card-small'));
                    }
                    //Check if we got another card already open
                    for (var i = 0; i < scope.allSmallCardDOMElements.length; i++) {
                        isCardAlreadyOpen = (scope.allSmallCardDOMElements[i].style.visibility == "hidden");
                        if (isCardAlreadyOpen) {
                            break;
                        }
                    }
                    if (!isCardAlreadyOpen) { //We don't have a different card already open
                        animateCardMovingIn(scope.smallCardDOMElement, scope.largeCardDOMElement, scope.flipperCardDOMElement, transitionSpeed);
                        if (scope.onCardOpened){
                            scope.onCardOpened();
                        }
                        if (e) {
                            e.stopPropagation();
                        }
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
                //noinspection JSUnresolvedVariable
                if (typeof ionic !== 'undefined' && !isTesting) { //Might need to comment this out if fails build on angular only machine
                    scope.clickEvent = 'touch';
                }
                if (scope.cardControl) {
                    scope.cardControl.flipToLarge = function (transitionSpeed) {
                        onSmallCardSelected(null, transitionSpeed);
                    };

                    scope.cardControl.flipToSmall = function (transitionSpeed) {
                        onLargeCardSelected(null, transitionSpeed);
                    };
                }
            },
            template:
            '<!--suppress ALL --><div class="fmp-card-small" id="fmp-card-small-{{directiveSuffix}}" ng-click="onSmallCardClicked($event)" on-touch="onSmallCardTouched($event)">' +
                '<div class="fmp-card fmp-card-small-image" ng-style="{\'background-image\':\'url(\'+ image +\')\'}">' +
                    '<div class="card-caption"><div ng-bind="frontCaption"></div></div>' +
                '</div>' +
            '</div>' +
            '<!--suppress ALL --><div class="fmp-card-large" id="fmp-card-large-{{directiveSuffix}}" ng-click="onLargeCardClicked($event)" on-touch="onLargeCardTouched($event)">' +
                '<div class="fmp-card fmp-flipper">' +
                    '<div class="fmp-card-front-large fmp-paper" ng-style="{\'background-image\':\'url(\'+ image +\')\'}">' +
                        //'<div ng-bind="frontCaption"></div>' +
                    '</div>' +
                    '<div class="fmp-card-back" ng-transclude></div>' +
                    '</div>' +
            '</div>'
        };
    });