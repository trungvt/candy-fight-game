import ui.View as View;
import ui.ImageView as ImageView;
import ui.TextView as TextView;

import ...utils.Screen as Screen;

// Progress bar component
exports = Class(View, function(supr) {
  this.init = function(opts) {
    opts = merge(opts, {
      width: opts.width || Screen.baseWidth,
      height: Screen.baseHeight * 0.1,
      backgroundColor: '#754c24',
      isReverse: opts.isReverse
    });
    supr(this, 'init', [opts]);

    this.build();
  };

  this.build = function() {
    new View({
      superview: this,
      width: this._opts.width,
      height: this._opts.height * 0.6,
      x: 0,
      y: this._opts.height * 0.2,
      backgroundColor: '#452f19'
    });

    this.bar = new ImageView({
      superview: this,
      width: 0,
      height: this._opts.height * 0.6,
      x: 0,
      y: this._opts.height * 0.2,
      image: this._opts.isReverse ? 'resources/images/bar_red.png' : 'resources/images/bar_blue.png'
    });

    this.text = new TextView({
      superview: this,
      x: 0,
      y: this._opts.height * 0.25,
      width: Screen.baseWidth,
      height: this._opts.height * 0.5,
      text: '0',
      size: 60,
      color: '#FFFFFF'
    });
  };

  this.updateProgress = function(text, percentage) {
    this.bar.updateOpts({ width: Screen.baseWidth * percentage });
    this.text.updateOpts({ text: text });
  };
});
