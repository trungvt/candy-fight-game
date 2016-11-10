import ...modules.underscore.underscore as _;
import .Gem as Gem;

// The map of candy cells (using two-dimension array and set all adjacents to each gem cell)
exports = Class('Map', function() {
  var gemTypes = ['violet', 'orange', 'blue', 'red', 'green'];

  this.init = function(opts) {
    opts = merge(opts, {});
    this.cols = opts.cols || 6;
    this.rows = opts.rows || 6;
    this.gemMap = [[]];
  };

  // Generate the new grid of candy cells for a new game
  this.generate = function() {
    for (var i = 0; i < this.rows; i++) {
      for (var j = 0; j < this.cols; j++) {
        if (this.gemMap[i] && this.gemMap[i][j] && !this.gemMap[i][j].isDead) continue;
        var adjacents = this.getAdjacents(i, j);
        var excludeGems = [];
        if (adjacents.leftAdjacent && adjacents.leftAdjacent.type === adjacents.leftAdjacent.leftAdjacent) {
          excludeGems.push(adjacents.leftAdjacent.type);
        }
        if (adjacents.rightAdjacent && adjacents.rightAdjacent.type === adjacents.rightAdjacent.rightAdjacent) {
          excludeGems.push(adjacents.rightAdjacent.type);
        }
        if (adjacents.topAdjacent && adjacents.topAdjacent.type === adjacents.topAdjacent.topAdjacent) {
          excludeGems.push(adjacents.topAdjacent.type);
        }
        if (adjacents.bottomAdjacent && adjacents.bottomAdjacent.type === adjacents.bottomAdjacent.bottomAdjacent) {
          excludeGems.push(adjacents.bottomAdjacent.type);
        }
        excludeGems = _.uniq(excludeGems);
        var candidateGems = _.reject(gemTypes, (obj) => {
          return _.contains(excludeGems, obj);
        });
        var gemType = null;
        if (candidateGems.length === 1) {
          gemType = candidateGems[0];
        } else {
          gemType = candidateGems[Math.floor((Math.random() * candidateGems.length))];
        }
        if (adjacents.leftAdjacent) {
          this.gemMap[adjacents.leftAdjacent.row][adjacents.leftAdjacent.col].update({ rightAdjacent: gemType });
        }
        if (adjacents.rightAdjacent) {
          this.gemMap[adjacents.rightAdjacent.row][adjacents.rightAdjacent.col].update({ leftAdjacent: gemType });
        }
        if (adjacents.topAdjacent) {
          this.gemMap[adjacents.topAdjacent.row][adjacents.topAdjacent.col].update({ bottomAdjacent: gemType });
        }
        if (adjacents.bottomAdjacent) {
          this.gemMap[adjacents.bottomAdjacent.row][adjacents.bottomAdjacent.col].update({ topAdjacent: gemType });
        }
        var gem = new Gem({
          type: gemType,
          row: i,
          col: j,
          leftAdjacent: adjacents.leftAdjacent && adjacents.leftAdjacent.type,
          rightAdjacent: adjacents.rightAdjacent && adjacents.rightAdjacent.type,
          topAdjacent: adjacents.topAdjacent && adjacents.topAdjacent.type,
          bottomAdjacent: adjacents.bottomAdjacent && adjacents.bottomAdjacent.type,
          isDead: false
        });
        if (!this.gemMap[i]) this.gemMap[i] = [];
        this.gemMap[i][j] = gem;
      }
    }
  };

  // Get all adjacents of each cell
  this.getAdjacents = function(row, col) {
    var left = ((col >= 0 && this.gemMap[row]) ? this.gemMap[row] : undefined) ? this.gemMap[row][col - 1] : undefined;
    var right = ((col < (this.cols - 1) && this.gemMap[row]) ? this.gemMap[row] : undefined) ? this.gemMap[row][col + 1] : undefined;
    var top = ((row >= 0 && this.gemMap[row - 1] && col >= 0) ? this.gemMap[row - 1] : undefined) ? this.gemMap[row - 1][col] : undefined;
    var bottom = ((row < (this.rows - 1) && this.gemMap[row + 1] && col >= 0) ? this.gemMap[row + 1] : undefined) ? this.gemMap[row + 1][col] : undefined;
    return {
      leftAdjacent: left,
      rightAdjacent: right,
      topAdjacent: top,
      bottomAdjacent: bottom
    };
  };

  // After initiate all gem to the grid, we should mark them as the old ones
  this.checkUsedGems = function() {
    for (var i = 0; i < this.rows; i++) {
      for (var j = 0; j < this.cols; j++) {
        if (!this.gemMap[i] && !this.gemMap[i][j]) continue;
        this.gemMap[i][j].setStatus(false);
      }
    }
  };

  // Swap two gems
  this.swapGems = function(fromGem, toGem) {
    if (!fromGem || !toGem) return;
    var newFromGemType = this.gemMap[toGem.row][toGem.col].type;
    var newToGemType = this.gemMap[fromGem.row][fromGem.col].type;
    this.gemMap[fromGem.row][fromGem.col].update({ type: newFromGemType });
    this.gemMap[toGem.row][toGem.col].update({ type: newToGemType });
    this.recheckAdjacents();
  };

  // Check if we can hit any thing for scoring
  this.checkHit = function() {
    var hitGems = [];
    for (var i = 0; i < this.rows; i++) {
      for (var j = 0; j < this.cols; j++) {
        if (!this.gemMap[i] && !this.gemMap[i][j]) continue;
        var adjacents = this.getAdjacents(i, j);
        var thisGemType = this.gemMap[i][j].type;
        // check horizontal hit
        var leftAdjacentType = adjacents.leftAdjacent && adjacents.leftAdjacent.type;
        var leftLeftAdjacentType = adjacents.leftAdjacent && adjacents.leftAdjacent.leftAdjacent;
        var rightAdjacentType = adjacents.rightAdjacent && adjacents.rightAdjacent.type;
        var rightRightAdjacentType = adjacents.rightAdjacent && adjacents.rightAdjacent.rightAdjacent;
        if (leftLeftAdjacentType === leftAdjacentType && leftAdjacentType === thisGemType) {
          if (!_.find(hitGems, (obj) => { return obj.row === i && obj.col === (j - 2); })) {
            hitGems.push({ row: i, col: j - 2 });
            this.gemMap[i][j - 2].update({ isDead: true });
          }
          if (!_.find(hitGems, (obj) => { return obj.row === i && obj.col === (j - 1); })) {
            hitGems.push({ row: i, col: j - 1 });
            this.gemMap[i][j - 1].update({ isDead: true });
          }
          if (!_.find(hitGems, (obj) => { return obj.row === i && obj.col === j; })) {
            hitGems.push({ row: i, col: j });
            this.gemMap[i][j].update({ isDead: true });
          }
        }
        if (leftAdjacentType === thisGemType && thisGemType === rightAdjacentType) {
          if (!_.find(hitGems, (obj) => { return obj.row === i && obj.col === (j - 1); })) {
            hitGems.push({ row: i, col: j - 1 });
            this.gemMap[i][j - 1].update({ isDead: true });
          }
          if (!_.find(hitGems, (obj) => { return obj.row === i && obj.col === j; })) {
            hitGems.push({ row: i, col: j });
            this.gemMap[i][j].update({ isDead: true });
          }
          if (!_.find(hitGems, (obj) => { return obj.row === i && obj.col === (j + 1); })) {
            hitGems.push({ row: i, col: j + 1 });
            this.gemMap[i][j + 1].update({ isDead: true });
          }
        }
        if (thisGemType === rightAdjacentType && rightAdjacentType === rightRightAdjacentType) {
          if (!_.find(hitGems, (obj) => { return obj.row === i && obj.col === j; })) {
            hitGems.push({ row: i, col: j });
            this.gemMap[i][j].update({ isDead: true });
          }
          if (!_.find(hitGems, (obj) => { return obj.row === i && obj.col === (j + 1); })) {
            hitGems.push({ row: i, col: j + 1 });
            this.gemMap[i][j + 1].update({ isDead: true });
          }
          if (!_.find(hitGems, (obj) => { return obj.row === i && obj.col === (j + 2); })) {
            hitGems.push({ row: i, col: j + 2 });
            this.gemMap[i][j + 2].update({ isDead: true });
          }
        }
        // check vertical hit
        var topAdjacentType = adjacents.topAdjacent && adjacents.topAdjacent.type;
        var topTopAdjacentType = adjacents.topAdjacent && adjacents.topAdjacent.topAdjacent;
        var bottomAdjacentType = adjacents.bottomAdjacent && adjacents.bottomAdjacent.type;
        var bottomBottomAdjacentType = adjacents.bottomAdjacent && adjacents.bottomAdjacent.bottomAdjacent;
        if (topTopAdjacentType === topAdjacentType && topAdjacentType === thisGemType) {
          if (!_.find(hitGems, (obj) => { return obj.row === (i - 2) && obj.col === j; })) {
            hitGems.push({ row: i - 2, col: j });
            this.gemMap[i - 2][j].update({ isDead: true });
          }
          if (!_.find(hitGems, (obj) => { return obj.row === (i - 1) && obj.col === j; })) {
            hitGems.push({ row: i - 1, col: j });
            this.gemMap[i - 1][j].update({ isDead: true });
          }
          if (!_.find(hitGems, (obj) => { return obj.row === i && obj.col === j; })) {
            hitGems.push({ row: i, col: j });
            this.gemMap[i][j].update({ isDead: true });
          }
        }
        if (topAdjacentType === thisGemType && thisGemType === bottomAdjacentType) {
          if (!_.find(hitGems, (obj) => { return obj.row === (i - 1) && obj.col === j; })) {
            hitGems.push({ row: i - 1, col: j });
            this.gemMap[i - 1][j].update({ isDead: true });
          }
          if (!_.find(hitGems, (obj) => { return obj.row === i && obj.col === j; })) {
            hitGems.push({ row: i, col: j });
            this.gemMap[i][j].update({ isDead: true });
          }
          if (!_.find(hitGems, (obj) => { return obj.row === (i + 1) && obj.col === j; })) {
            hitGems.push({ row: i + 1, col: j });
            this.gemMap[i + 1][j].update({ isDead: true });
          }
        }
        if (thisGemType === bottomAdjacentType && bottomAdjacentType === bottomBottomAdjacentType) {
          if (!_.find(hitGems, (obj) => { return obj.row === i && obj.col === j; })) {
            hitGems.push({ row: i, col: j });
            this.gemMap[i][j].update({ isDead: true });
          }
          if (!_.find(hitGems, (obj) => { return obj.row === (i + 1) && obj.col === j; })) {
            hitGems.push({ row: i + 1, col: j });
            this.gemMap[i + 1][j].update({ isDead: true });
          }
          if (!_.find(hitGems, (obj) => { return obj.row === (i + 2) && obj.col === j; })) {
            hitGems.push({ row: i + 2, col: j });
            this.gemMap[i + 2][j].update({ isDead: true });
          }
        }
      }
    }
    return hitGems;
  };

  // In case we cannot take any hits
  this.rollbackSwap = function(fromGem, toGem) {
    this.swapGems(toGem, fromGem);
  };

  // Re-arrange the grid after taking a hit
  this.rearrangeGems = function() {
    for (var j = 0; j < this.cols; j++) {
      var fallCount = 0;
      for (var i = this.rows - 1; i >= 0; i--) {
        if (!this.gemMap[i] && !this.gemMap[i][j]) continue;
        if (this.gemMap[i][j].isDead) {
          fallCount += 1;
        } else {
          this.gemMap[i][j].update({ fallCount: fallCount });
        }
      }
    }
  };

  // Fill up the empty cells
  this.fallFillGems = function() {
    for (var j = 0; j < this.cols; j++) {
      var deadGem = 0;
      for (var i = this.rows - 1; i >= 0; i--) {
        if (!this.gemMap[i] && !this.gemMap[i][j]) continue;
        if (this.gemMap[i][j].isDead) {
          deadGem += 1;
          this.gemMap[i][j].update({ isDead: false });
        }
        var gemFallCount = this.gemMap[i][j].fallCount;
        if (gemFallCount > 0) {
          this.gemMap[i + gemFallCount][j].update({ type: this.gemMap[i][j].type });
          this.gemMap[i][j].update({ fallCount: 0 });
        }
      }
      for (var k = 0; k < deadGem; k++) {
        var newGemType = gemTypes[Math.floor((Math.random() * gemTypes.length))];
        this.gemMap[k][j].update({
          type: newGemType,
          fallCount: 0
        });
        this.gemMap[k][j].setStatus(true);
      }
    }
    this.recheckAdjacents();
  };

  this.recheckAdjacents = function() {
    for (var i = 0; i < this.rows; i++) {
      for (var j = 0; j < this.cols; j++) {
        if (!this.gemMap[i] && !this.gemMap[i][j]) continue;
        var adjacents = this.getAdjacents(i, j);
        var gemType = this.gemMap[i][j].type;
        if (adjacents.leftAdjacent) {
          this.gemMap[adjacents.leftAdjacent.row][adjacents.leftAdjacent.col].update({ rightAdjacent: gemType });
        }
        if (adjacents.rightAdjacent) {
          this.gemMap[adjacents.rightAdjacent.row][adjacents.rightAdjacent.col].update({ leftAdjacent: gemType });
        }
        if (adjacents.topAdjacent) {
          this.gemMap[adjacents.topAdjacent.row][adjacents.topAdjacent.col].update({ bottomAdjacent: gemType });
        }
        if (adjacents.bottomAdjacent) {
          this.gemMap[adjacents.bottomAdjacent.row][adjacents.bottomAdjacent.col].update({ topAdjacent: gemType });
        }
        this.gemMap[i][j].update({
          leftAdjacent: adjacents.leftAdjacent && adjacents.leftAdjacent.type,
          rightAdjacent: adjacents.rightAdjacent && adjacents.rightAdjacent.type,
          topAdjacent: adjacents.topAdjacent && adjacents.topAdjacent.type,
          bottomAdjacent: adjacents.bottomAdjacent && adjacents.bottomAdjacent.type
        });
      }
    }
  };
});
