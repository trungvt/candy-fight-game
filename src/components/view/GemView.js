import ui.View as View;
import ui.ImageView as ImageView;
import animate;

var WIDTH = 25, HEIGHT = 25;

// Define the view component of each gem cell
exports = Class(View, function(supr) {
  this.init = function(opts) {
    opts = merge(opts, {
      width: opts.width || WIDTH,
      height: opts.height || HEIGHT,
      canHandleEvents: false,
      blockEvents: true
    });

    supr(this, 'init', [opts]);
    this.build();
  };

  this.build = function() {
    this.backgroundImage = new ImageView({
      superview: this,
      image: 'resources/images/gem_01.png', // default gem
      width: this._opts.width * 0.8,
      height: this._opts.height * 0.8,
      x: this._opts.width * 0.1,
      y: this._opts.height * 0.1
    });
  };

  this.setBackgroundImage = function(type) {
    if (!type) return;
    var imageUrl = 'resources/images/gem_01.png';
    switch (type) {
      case 'violet':
        imageUrl = 'resources/images/gem_01.png';
        break;
      case 'orange':
        imageUrl = 'resources/images/gem_02.png';
        break;
      case 'blue':
        imageUrl = 'resources/images/gem_03.png';
        break;
      case 'red':
        imageUrl = 'resources/images/gem_04.png';
        break;
      case 'green':
        imageUrl = 'resources/images/gem_05.png';
        break;
    }
    this.backgroundImage.setImage(imageUrl);
  };
});
