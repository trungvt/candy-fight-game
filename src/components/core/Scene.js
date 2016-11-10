import device;
import ui.ImageView as ImageView;

import ...utils.Screen as Screen;

// Base scene
exports = Class(ImageView, function(supr) {
  this.init = function(opts) {
    opts = merge(opts, {
      width: Screen.baseWidth,
      height: Screen.baseHeight,
      image: opts.image
    });
    supr(this, 'init', [opts]);
  };
});
