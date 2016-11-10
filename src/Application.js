// core
import device;
import ui.StackView as StackView;

// user-defined
import .utils.Screen as Screen;
import .scenes.TitleScene as TitleScene;
import .scenes.LevelScene as LevelScene;
import .scenes.GameScene as GameScene;
import .scenes.ResultScene as ResultScene;
import .constants.Config as Config;
import .utils.SoundController as SoundController;

exports = Class(GC.Application, function () {

  this.initUI = function () {
    // set scale
    this.view.style.scale = Screen.scale;

    // sound
    this.soundController = SoundController.getSound();
    this.soundController.play('bgmMain');

    var titleScene = new TitleScene(), gameScene = new GameScene(), levelScene = new LevelScene(), resultScene = new ResultScene();
    this.rootView = new StackView({
      superview: this,
      width: Screen.baseWidth,
      height: Screen.baseHeight,
      clip: false
    });
    this.rootView.push(titleScene);

    var that = this;
    // Setup Level scene
    levelScene.on('levelscene:selectEasy', function() {
      that.startGame(gameScene, Config.levels[0]);
    });
    levelScene.on('levelscene:selectMedium', function() {
      that.startGame(gameScene, Config.levels[1]);
    });
    levelScene.on('levelscene:selectDanger', function() {
      that.startGame(gameScene, Config.levels[2]);
    });
    levelScene.on('levelscene:back', function() {
      that.soundController.play('fxClick');
      that.rootView.pop();
    });
    // Setup Title scene
    titleScene.on('titlescene:start', function() {
      that.soundController.play('fxClick');
      that.rootView.push(levelScene);
    });
    // Setup Game scene
    gameScene.on('gamescene:win', function(score, level) {
      that.soundController.play('fxTingTing');
      that.rootView.push(resultScene);
      resultScene.updateResult('win');
    });
    gameScene.on('gamescene:fail', function(score, level) {
      that.rootView.push(resultScene);
      resultScene.updateResult('fail');
    });
    // Setup Result scene
    resultScene.on('resultscene:back', function() {
      that.soundController.stop('bgmGame');
      that.soundController.play('bgmMain');
      that.rootView.pop();
      that.rootView.pop();
    });
  };

  // Trigger the game to be started
  this.startGame = function(gameScene, level) {
    this.soundController.play('fxClick');
    this.soundController.stop('bgmMain');
    this.rootView.push(gameScene);
    gameScene.emit('gamescene:start', level);
    this.soundController.play('bgmGame');
  };

});
