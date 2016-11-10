// core
import ui.View as View;
import ui.widget.GridView as GridView;
import ui.ViewPool as ViewPool;
import ui.GestureView as GestureView;
import animate;

// user-defined
import ....modules.underscore.underscore as _;
import .GemView as GemView;

var WIDTH = 320, HEIGHT = 320,
    COLS = 5, ROWS = 5;

// Define the grid view of all candy cells
exports = Class(View, function(supr) {
  this.init = function(opts) {
    opts = merge(opts, {
      width: opts.width || WIDTH,
      height: opts.height || HEIGHT,
      cols: opts.cols || COLS,
      rows: opts.rows || ROWS
    });
    supr(this, 'init', [opts]);
    this.build();
  };

  this.build = function() {
    var that = this;
    this.playable = false;
    var gestureView = new GestureView({
      superview: this,
      layout: 'box',
      swipeMagnitude: 50
    });

    this.gridView = new GridView({
      superview: gestureView,
      width: this._opts.width,
      height: this._opts.height,
      cols: this._opts.cols,
      rows: this._opts.rows,
      blockEvents: true,
      canHandleEvents: false,
      backgroundColor: '#754c24'
    });

    this.gemPool = new ViewPool({
      ctor: GemView,
      initCount: this._opts.cols * this._opts.rows,
      initOpts: {
        superview: this.gridView,
        width: this.gridView._opts.width / this.gridView._opts.cols,
        height: this.gridView._opts.height / this.gridView._opts.rows,
        col: 0,
        row: 0
      }
    });

    this.gemViewContainer = [];

    // Gem swapping process
    this.swapGems = { from: undefined, to: undefined };
    gestureView.on('Swipe', function(angle, direction, numberOfFingers) {
      if (numberOfFingers > 1 || !that.playable) { // not allow multi-finger trick
        that.swapGems = { from: undefined, to: undefined };
        return;
      }
      if (that.canSwap(that.swapGems.from, direction)) {
        that.swapGems.to = {
          row: direction === 'up' ? that.swapGems.from.row - 1 : (direction === 'down' ? that.swapGems.from.row + 1 : that.swapGems.from.row) ,
          col: direction === 'left' ? that.swapGems.from.col - 1 : (direction === 'right' ? that.swapGems.from.col + 1 : that.swapGems.from.col)
        };
        that.playable = false;
        that.__parent.emit('gamescene:gemSwap', that.swapGems);
      }
    });
    gestureView.on('InputStart', function(event, pointer) {
      that.swapGems = { from: undefined, to: undefined };
      if (!that.playable) return;
      var col = Math.floor(pointer.x / (that._opts.width / that._opts.rows));
      var row = Math.floor(pointer.y / (that._opts.height / that._opts.cols));
      that.swapGems.from = { row: row, col: col };
    });
  };

  this.canSwap = function(swapFrom, direction) {
    if (!swapFrom || !direction) return false;
    if ((swapFrom.col === 0 && direction === 'left') ||
        (swapFrom.col === (this._opts.cols - 1) && direction === 'right') ||
        (swapFrom.row === 0 && direction === 'up') ||
        (swapFrom.row === (this._opts.rows - 1) && direction === 'down')) {
      return false;
    }
    return true;
  };

  this.fillGems = function(gemMap) {
    for (var i = 0; i < gemMap.length; i++) {
      var currentRow = gemMap[i];
      if (!currentRow) continue;
      for (var j = 0; j < currentRow.length; j++) {
        var currentGem = currentRow[j];
        if (!currentGem) continue;
        var gemView = this.gemPool.obtainView();
        var gemWidth = gemView._opts.width, gemHeight = gemView._opts.height;
        gemView.updateOpts({
          superview: this.gridView,
          visible: true,
          x: currentGem.col * gemWidth,
          y: currentGem.row * gemHeight,
          col: currentGem.col,
          row: currentGem.row,
          type: currentGem.type
        });
        gemView.setBackgroundImage(currentGem.type);
        this.gemViewContainer.push(gemView);
      }
    }
    this.playable = true;
  };

  this.swapGemsAnimation = function(hit, callback) {
    var that = this;
    var fromGemView = _.find(this.gemViewContainer, (obj) => {
      return obj._opts.row === that.swapGems.from.row && obj._opts.col === that.swapGems.from.col;
    });
    var toGemView = _.find(this.gemViewContainer, (obj) => {
      return obj._opts.row === that.swapGems.to.row && obj._opts.col === that.swapGems.to.col;
    });
    var fromX = fromGemView._opts.x, fromY = fromGemView._opts.y, toX = toGemView._opts.x, toY = toGemView._opts.y;
    if (hit) {
      animate(fromGemView).now({ x: toX, y: toY }, 200);
      animate(toGemView).now({ x: fromX, y: fromY }, 200);
      var oldFromRow = fromGemView._opts.row, oldFromCol = fromGemView._opts.col;
      setTimeout(function() {
        fromGemView.updateOpts({
          row: toGemView._opts.row,
          col: toGemView._opts.col
        });
        toGemView.updateOpts({
          row: oldFromRow,
          col: oldFromCol
        });
        if (callback) callback();
      }, 400);
    } else {
      animate(fromGemView).now({ x: toX, y: toY }, 200).then({ x: fromX, y: fromY }, 200);
      animate(toGemView).now({ x: fromX, y: fromY }, 200).then({ x: toX, y: toY }, 200);
      setTimeout(function() {
        that.playable = true;
        if (callback) callback();
      }, 400);
    }
  };

  this.hitGemsAnimation = function(hitGems) {
    if (!hitGems || !_.isArray(hitGems) || hitGems.length <= 0) return;
    var that = this;
    _.each(this.gemViewContainer, (obj) => {
      if (_.find(hitGems, (hitGem) => { return obj._opts.row === hitGem.row && obj._opts.col === hitGem.col; })) {
        animate(obj).now({ opacity: 0 }, 400).then(function() {
          obj.updateOpts({ visible: false });
        });
      }
    });

    setTimeout(function() {
      that.__parent.emit('gamescene:rearrangeGems');
    }, 600);
  };

  this.rearrangeGems = function(gemMap) {
    var that = this;
    _.each(this.gemViewContainer, (obj) => {
      if (gemMap[obj._opts.row] && gemMap[obj._opts.row][obj._opts.col] && gemMap[obj._opts.row][obj._opts.col].fallCount > 0) {
        obj._opts.row = obj._opts.row + gemMap[obj._opts.row][obj._opts.col].fallCount;
        animate(obj).now({ y: obj._opts.row * obj._opts.height }, 600, animate.LINEAR);
      }
    });
    setTimeout(function() {
      that.__parent.emit('gamescene:fallFillGems');
    }, 1000);
  };

  this.fallFillGems = function(map) {
    var that = this;
    var gemMap = map.gemMap;
    for (var i = 0; i < map.rows; i++) {
      for (var j = 0; j < map.cols; j++) {
        if (!gemMap[i] && !gemMap[i][j]) continue;
        var currentGem = gemMap[i][j];
        if (!currentGem.isNew) continue;
        var gemView = _.find(that.gemViewContainer, (gv) => { return !gv._opts.visible; });
        var gemWidth = gemView._opts.width, gemHeight = gemView._opts.height;
        gemView.updateOpts({
          superview: that.gridView,
          visible: true,
          x: currentGem.col * gemWidth,
          y: 0,
          col: currentGem.col,
          row: currentGem.row,
          opacity: 1,
          type: currentGem.type
        });
        gemView.setBackgroundImage(currentGem.type);
        animate(gemView).now({ y: currentGem.row * gemHeight }, 200);
      }
    }
    setTimeout(function() {
      that.__parent.emit('gamescene:recheckHit');
    }, 400);
  };

  this.setPlayable = function(canPlay) {
    this.playable = canPlay;
  };

  this.releaseView = function() {
    this.gemPool.releaseAllViews();
    this.gemPool = new ViewPool({
      ctor: GemView,
      initCount: this._opts.cols * this._opts.rows,
      initOpts: {
        superview: this.gridView,
        width: this.gridView._opts.width / this.gridView._opts.cols,
        height: this.gridView._opts.height / this.gridView._opts.rows,
        col: 0,
        row: 0
      }
    });
    this.gemViewContainer.splice(0, this.gemViewContainer.length);
  };
});
