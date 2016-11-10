import device;
import ui.View as View;
import ui.ImageView as ImageView;

import ..utils.Screen as Screen;
import ..components.core.Scene as Scene;
import ..components.core.Button as Button;

exports = Class(Scene, function(supr) {
  this.init = function(opts) {
    opts = merge(opts, {
      image: 'resources/images/bg.png'
    });
    supr(this, 'init', [opts]);

    this._time = 0;
    this.build();
  };

  this.build = function() {
    var me = this;

    var centerBgWidth = Screen.baseWidth;
    this.centerBg = new ImageView({
			superview: this,
			image: 'resources/images/flower.png',
      x: (Screen.baseWidth - centerBgWidth) / 2,
      y: Screen.baseHeight * 0.1,
      width: centerBgWidth,
      height: centerBgWidth,
			anchorX: centerBgWidth / 2,
			anchorY: centerBgWidth / 2
		});

    new ImageView({
      superview: this,
      image: 'resources/images/logo.png',
      x: (Screen.baseWidth - centerBgWidth) / 2,
      y: Screen.baseHeight * 0.25,
      width: centerBgWidth,
      height: centerBgWidth / 2
    });

    new Button({
      superview: this,
      x: Screen.baseWidth / 2,
      y: Screen.baseHeight * 0.8,
      width: Screen.baseWidth * 0.6,
      height: Screen.baseHeight * 0.125,
      image: 'resources/images/btn_start.png',
      onClick: function() {
        me.emit('titlescene:start');
      }
    });
  };

  this.tick = function (dt) {
		this._time += dt;
		this.centerBg.style.r = this._time / 5000;
	};
});
