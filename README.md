[![Build Status](https://travis-ci.org/souly1/angular-flip-card.svg?branch=master)](https://travis-ci.org/souly1/angular-flip-card)

# angular-flip-card

The Card is one of the most lovable and fashionable UX element out at the moment. It is great and intuitive as it brings physical objects we are familiar with into the digital world. As a card, one of the basic abilities is to flip it as can be seen in [Google now cards](http://www.google.com/landing/now/#cards).

Since We required such and ability for our [Fitness Meal Planner](http://www.fitnessmealplanner.com) webApp with multiple cards on screen and needs to be responsive UI, I created this Angular directive which is an implementation to resemble that behaviour.

# Demo
[Demo can be seen here](http://plnkr.co/edit/sTqc9fk4EPjEoEpkCCBX?p=preview)

## Requirements

- AngularJS
- Angular-animate (don't forget to load module 'ng-animate' to the application!)
- No need for JQuery as JQLite is used

## Notes

This directive has been originally developed for the [Ionic Framework](http://ionicframework.com), so it supports both angular and ionic apps.

## Installation

* **Bower**: `bower install angular-flip-card`

## Usage

Load the script files in your application:

```html
<script type="text/javascript" src="wherever-you-put-it/fmpCardDirective.js"></script>
```
Add dependencies on the `fmp-card` AngularJS module:

```javascript
angular.module('myModule', ['fmp-card']);
```
You can now use the directive, just add the element to your HTML:
```html
<fmp-card>
  ...
</fmp-card>
```
Where you can replace any HTML code as you like instead of the three dotes as this uses the Angular transclude ability. This represents the cards back side

## Usage Example

```html
<fmp-card suffix="1" image="card-front-icon.png" front-caption="Hello card front" small-card-height="100px" small-card-width="200px">
    This is the back of the card!
</fmp-card>
```

## Directive Options

- 'small-card-width' (optional) - the width of the small card. Can be defined with percentage. Card turned will be twice this size. Defaults auto
- 'small-card-height' (optional) - the height of the small card. Can be defined with percentage. Card turned will be twice this size. Defaults to 100%
- `suffix` (optional) - a suffix to be added to id's for the small card and large card representations. Prefix is 'fmp-card-small-'/'fmp-card-large-' representatively. If none supplied random number issued
- `image` (optional) - image to be used as cards front face background
- `front-caption` (optional) - The caption to show for the front cards face

## Testing

Karma with Jasmine, run on Travis CI

## Known Issues

The animation in safari needs better tuning

## License

As AngularJS itself, this module is released under the permissive [MIT license](http://revolunet.mit-license.org). Your contributions are always welcome.
