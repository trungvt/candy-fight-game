import AudioManager;

exports.sound = null;

// Singleton implementation
exports.getSound = function () {
  if (!exports.sound) {
    exports.sound = new AudioManager({
      path: 'resources/sounds',
      files: {
        bgmMain: {
          background: true
        },
        bgmGame: {
          loop: true
        },
        fxClick: { },
        fxTingTing: { }
      }
    });
  }
  return exports.sound;
};
