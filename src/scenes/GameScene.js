import device;
import ui.View as View;
import ui.ImageView as ImageView;
import animate;

import ..utils.Screen as Screen;
import ..components.core.Scene as Scene;
import ..components.view.GemGridView as GemGridView;
import ..components.view.ProgressBar as ProgressBar;
import ..models.Map as Map;
import ..constants.Config as Config;
import ..utils.SoundController as SoundController;

// Show the view ground and allow user take the actions
exports = Class(Scene, function(supr) {
  this.init = function(opts) {
    opts = merge(opts, {
      image: 'resources/images/bg.png'
    });
    supr(this, 'init', [opts]);

    this.build();
  };

  this.build = function() {
    this.gemGrid = new GemGridView({
      superview: this,
      x: 0,
      y: (Screen.baseHeight - Screen.baseWidth) / 2,
      width: Screen.baseWidth,
      height: Screen.baseWidth,
      cols: 8,
      rows: 8
    });
    this.map = new Map({
      cols: this.gemGrid._opts.cols,
      rows: this.gemGrid._opts.rows
    });

    this.scoreBar = new ProgressBar({
      superview: this,
      x: 0,
      y: Screen.baseHeight * 0.85
    });
    this.timeBar = new ProgressBar({
      superview: this,
      x: 0,
      y: Screen.baseHeight * 0.05,
      width: Screen.baseWidth,
      isReverse: true
    });
    this.currentScore = 0;
    this.elaspedTime = 0;

    this.on('gamescene:start', gameStart.bind(this));

    this.on('gamescene:gemSwap', gemSwap.bind(this));

    this.on('gamescene:rearrangeGems', rearrangeGems.bind(this));

    this.on('gamescene:fallFillGems', fallFillGems.bind(this));

    this.on('gamescene:recheckHit', recheckHit.bind(this));
  };

  // Start the game
  function gameStart(level) {
    this.level = level;
    this.currentScore = 0;
    this.elaspedTime = 0;
    this.scoreBar.updateProgress(`${this.currentScore}/${level.point}`, 0);
    this.map.generate();
    this.gemGrid.fillGems(this.map.gemMap);
    this.map.checkUsedGems(); // make all gem status be old
    this.gemGrid.setPlayable(true);
    SoundController.getSound().play('fxTingTing');
    this.countdown();
  };

  // Swap two adjacent gems
  function gemSwap(swapGems) {
    this.map.swapGems(swapGems.from, swapGems.to);
    var hitGems = this.map.checkHit();
    if (hitGems && hitGems.length > 0) {
      var that = this;
      this.gemGrid.swapGemsAnimation(true, function() {
        that.gemGrid.hitGemsAnimation(hitGems);
        that.updateScore(hitGems);
      });
    } else {
      this.map.rollbackSwap(swapGems.from, swapGems.to);
      this.gemGrid.swapGemsAnimation(false);
    }
  };

  // After hit some gems, the grid will re-arrange all gems
  function rearrangeGems() {
    this.map.rearrangeGems();
    this.gemGrid.rearrangeGems(this.map.gemMap);
  };

  // New gems will falls down to fill up the empty cells
  function fallFillGems() {
    this.map.fallFillGems();
    this.gemGrid.fallFillGems(this.map);
    this.map.checkUsedGems(); // make all gem status be old
  };

  // After each moving of user, we should check the next stage of grid in which can be take another hits or not
  function recheckHit() {
    var hitGems = this.map.checkHit();
    if (hitGems && hitGems.length > 0) {
      this.gemGrid.hitGemsAnimation(hitGems);
      this.updateScore(hitGems);
    } else {
      this.gemGrid.setPlayable(true);
    }
  };

  // Update the current score to UI
  this.updateScore = function(hitGems) {
    var bonus = hitGems.length >= 5 ? Config.bonus50 : (hitGems.length >= 4 ? Config.bonus40 : 0);
    this.currentScore += hitGems.length * Config.singlePoint + bonus;
    if (this.currentScore >= this.level.point) {
      this.currentScore = this.level.point;
      this.scoreBar.updateProgress(`${this.currentScore}/${this.level.point}`, this.currentScore / this.level.point);
      this.gemGrid.releaseView();
      this.emit('gamescene:win', this.currentScore, this.level);
      clearInterval(this.counting);
      return;
    }
    this.scoreBar.updateProgress(`${this.currentScore}/${this.level.point}`, this.currentScore / this.level.point);
  };

  // Counting down the game time
  this.countdown = function() {
    var that = this;
    this.counting = setInterval(function() {
      that.elaspedTime += 1;
      var remainingTime = that.level.time - that.elaspedTime;
      that.timeBar.updateProgress(`${remainingTime}s`, remainingTime / that.level.time);
      if (remainingTime <= 0 && that.currentScore < that.level.point) {
        that.gemGrid.releaseView();
        clearInterval(that.counting);
        that.emit('gamescene:fail');
      }
    }, 1000);
  };
});
