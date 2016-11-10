// Define the gem information
exports = Class('Gem', function() {
  this.init = function(opts) {
    opts = merge(opts, {});
    this.type = opts.type || 'violet';
    this.isNew = true; // flag used for rendering action
    this.row = opts.row || 0;
    this.col = opts.col || 0;
    this.leftAdjacent = opts.leftAdjacent;
    this.rightAdjacent = opts.rightAdjacent;
    this.topAdjacent = opts.topAdjacent;
    this.bottomAdjacent = opts.bottomAdjacent;
    this.isDead = opts.isDead; // flag for the hit gem cell
  };

  this.update = function(opts) {
    if (opts.type) this.type = opts.type;
    if (opts.row) this.row = opts.row;
    if (opts.col) this.col = opts.col;
    if (opts.leftAdjacent) this.leftAdjacent = opts.leftAdjacent;
    if (opts.rightAdjacent) this.rightAdjacent = opts.rightAdjacent;
    if (opts.topAdjacent) this.topAdjacent = opts.topAdjacent;
    if (opts.bottomAdjacent) this.bottomAdjacent = opts.bottomAdjacent;
    if (opts.fallCount >= 0) this.fallCount = opts.fallCount;
    if (opts.isDead !== undefined) this.isDead = opts.isDead;
  };

  this.setStatus = function(status) {
    this.isNew = status;
  };
});
