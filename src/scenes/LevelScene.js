import device;
import ui.View as View;
import ui.ImageView as ImageView;
import ui.widget.ButtonView as ButtonView;

import ..utils.Screen as Screen;
import ..components.core.Scene as Scene;

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
    var that = this;
    var buttonWidth = Screen.baseWidth * 0.6, buttonHeight = Screen.baseHeight * 0.15;
    new ButtonView({
      superview: this,
      width: buttonWidth * 0.2,
      height: buttonWidth * 0.2,
      x: Screen.baseWidth * 0.05,
      y: Screen.baseHeight * 0.05,
      images: {
        down: 'resources/images/btn_back.png',
        up: 'resources/images/btn_back.png'
      },
      on: {
        up: function () {
          that.emit('levelscene:back');
        }
      },
    });

    new ButtonView({
      superview: this,
      width: buttonWidth,
      height: buttonHeight,
      x: (Screen.baseWidth - buttonWidth) / 2,
      y: Screen.baseHeight * 0.2,
      images: {
        down: 'resources/images/btn_easy_press.png',
        up: 'resources/images/btn_easy.png'
      },
      on: {
        up: function () {
          that.emit('levelscene:selectEasy');
        }
      },
      text: {
        fontFamily: 'EaudeToilet',
  			text: 'EASY',
  			size: 60,
  			wrap: true,
        color: '#827f7f'
      }
    });

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
          that.emit('levelscene:selectMedium');
        }
      },
      text: {
        fontFamily: 'EaudeToilet',
  			text: 'MEDIUM',
  			size: 60,
  			wrap: true,
        color: '#877752'
      }
    });

    new ButtonView({
      superview: this,
      width: buttonWidth,
      height: buttonHeight,
      x: (Screen.baseWidth - buttonWidth) / 2,
      y: Screen.baseHeight * 0.6,
      images: {
        down: 'resources/images/btn_danger_press.png',
        up: 'resources/images/btn_danger.png'
      },
      on: {
        up: function () {
          that.emit('levelscene:selectDanger');
        }
      },
      text: {
        fontFamily: 'EaudeToilet',
  			text: 'DANGER',
  			size: 60,
  			wrap: true,
        color: '#64482a'
      }
    });
  };
});
