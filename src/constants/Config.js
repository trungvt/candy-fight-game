exports.boundsWidth  = 576; // the base width dimension for scaling/viewing
exports.boundsHeight = 1024; // the base height dimension for scaling/viewing

// Game level system
exports.levels = [
  {
    id: 'easy',
    time: 60,
    point: 200
  },
  {
    id: 'medium',
    time: 45,
    point: 500
  },
  {
    id: 'danger',
    time: 30,
    point: 1000
  }
];

// Point & bonus point rules
exports.singlePoint = 10;
exports.bonus40 = 20;
exports.bonus50 = 30;
