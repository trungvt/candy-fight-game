import device;
import ui.TextView as TextView;
import ui.widget.ButtonView as ButtonView;

import ..utils.Screen as Screen;
import ..components.core.Scene as Scene;

// Show the game result
exports = Class(Scene, function(supr) {
  this.init = function(opts) {
    opts = merge(opts, {
      image: 'resources/images/bg.png'
    });
    supr(this, 'init', [opts]);
  };

  this.updateResult = function(result) {
    new TextView({
      superview: this,
      x: 0,
      y: Screen.baseHeight * 0.15,
      width: Screen.baseWidth,
      height: Screen.baseWidth * 0.5,
      text: result === 'win' ? 'You win!' : 'You loose...',
      size: 100,
      fontFamily: 'EaudeToilet',
      color: result === 'win' ? '#ff005a' : '#9000ff'
    });
    var that = this;
    var buttonWidth = Screen.baseWidth * 0.6, buttonHeight = Screen.baseHeight * 0.15;
    new ButtonView({
      superview: this,
      width: buttonWidth,
      height: buttonHeight,
      x: (Screen.baseWidth - buttonWidth) / 2,
      y: Screen.baseHeight * 0.4,
      images: {
        down: 'resources/images/btn_medium_press.png',
        up: 'resources/images/btn_medium.png'
      },
      on: {
        up: function () {
          that.emit('resultscene:back');
        }
      },
      text: {
        fontFamily: 'EaudeToilet',
  			text: 'BACK',
  			size: 60,
  			wrap: true,
        color: '#877752'
      }
    });

  };
});
