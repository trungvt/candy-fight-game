import device;

import ..constants.Config as Config;

// Scaling to any device screen
exports.scale = device.screen.width / Config.boundsWidth;
exports.baseWidth = Config.boundsWidth;
exports.baseHeight = device.screen.height * (Config.boundsWidth / device.screen.width);
