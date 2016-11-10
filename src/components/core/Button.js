import ui.ImageView as ImageView;
import ui.View as View;

exports = Class(ImageView, function(supr) {
  this.init = function(opts) {
    var width = opts.width || 50, height = opts.height || 25;
    opts = merge(opts, {
      width: width,
      height: height,
      x: (opts.x || 0) + (width / 2),
      y: (opts.y || 0) + (height / 2),
      offsetX: -(width / 2),
      offsetY: -(height / 2),
      image: opts.image || 'resources/images/header.png'
    });
    supr(this, 'init', [opts]);

    var clickComponent = new View({
      superview: this,
      x: 0,
      y: 0,
      width: this._opts.width,
      height: this._opts.height
    });
    clickComponent.on('InputSelect', bind(this, function() {
      if (this._opts.onClick) {
        this._opts.onClick();
      }
    }));
  };
});