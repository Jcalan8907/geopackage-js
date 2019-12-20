import { CustomFeaturesTile } from './customFeaturesTile';
import concat from 'concat-stream';

/**
 * Draws a tile which is shaded to indicate too many features. By default a
 * tile border is drawn and the tile is filled with 6.25% transparent black. The
 * paint objects for each draw type can be modified to or set to null (except
 * for the text paint object).
 */
export class ShadedFeaturesTile extends CustomFeaturesTile {

  constructor() {
    super();
  }
  /**
   * Get the tile border stroke width
   * @return {Number} tile border stroke width
   */
  getTileBorderStrokeWidth() {
    return this.tileBorderStrokeWidth;
  }
  /**
   * Set the tile border stroke width
   *
   * @param {Number} tileBorderStrokeWidth tile border stroke width
   */
  setTileBorderStrokeWidth(tileBorderStrokeWidth) {
    this.tileBorderStrokeWidth = tileBorderStrokeWidth;
  }
  /**
   * Get the tile border color
   * @return {String} tile border color
   */
  getTileBorderColor() {
    return this.tileBorderColor;
  }
  /**
   * Set the tile border color
   * @param {String} tileBorderColor tile border color
   */
  setTileBorderColor(tileBorderColor) {
    this.tileBorderColor = tileBorderColor;
  }
  /**
   * Get the tile fill color
   * @return {String} tile fill color
   */
  getTileFillColor() {
    return this.tileFillColor;
  }
  /**
   * Set the tile fill color
   * @param {String} tileFillColor tile fill color
   */
  setTileFillColor(tileFillColor) {
    this.tileFillColor = tileFillColor;
  }
  /**
   * Is the draw unindexed tiles option enabled
   * @return {Boolean} true if drawing unindexed tiles
   */
  isDrawUnindexedTiles() {
    return this.drawUnindexedTiles;
  }
  /**
   * Set the draw unindexed tiles option
   * @param {Boolean} drawUnindexedTiles draw unindexed tiles flag
   */
  setDrawUnindexedTiles(drawUnindexedTiles) {
    this.drawUnindexedTiles = drawUnindexedTiles;
  }
  /**
   * Get the compression format
   * @return {String} the compression format (either png or jpeg)
   */
  getCompressFormat() {
    return this.compressFormat;
  }
  /**
   * Set the compression format
   * @param {String} compressFormat either 'png' or 'jpeg'
   */
  setCompressFormat(compressFormat) {
    this.compressFormat = compressFormat;
  }
  /**
   * Draw unindexed tile
   * @param tileWidth
   * @param tileHeight
   * @param canvas
   * @returns {Promise<String|Buffer>}
   */
  drawUnindexedTile(tileWidth: number, tileHeight: number, canvas = null): Promise<string | Buffer> {
    var image = null;
    if (this.drawUnindexedTiles) {
      // Draw a tile indicating we have no idea if there are features
      // inside.
      // The table is not indexed and more features exist than the max
      // feature count set.
      image = this.drawTile(tileWidth, tileHeight, "?", canvas);
    }
    return image;
  }
  /**
   * Draw a tile with the provided text label in the middle
   * @param {Number} tileWidth
   * @param {Number} tileHeight
   * @param {String} text
   * @param tileCanvas
   * @return {Promise<String|Buffer>}
   */
  // @ts-ignore
  drawTile(tileWidth: number, tileHeight: number, text: string, tileCanvas: null): Promise<string | Buffer> {
    // @ts-ignore
    return new Promise(function (resolve) {
      var canvas;
      if (tileCanvas !== undefined && tileCanvas !== null) {
        canvas = tileCanvas;
      }
      else {
        if (CustomFeaturesTile.useNodeCanvas) {
          var Canvas = require('canvas');
          canvas = Canvas.createCanvas(tileWidth, tileHeight);
        }
        else {
          canvas = document.createElement('canvas');
          canvas.width = tileWidth;
          canvas.height = tileHeight;
        }
      }
      var context = canvas.getContext('2d');
      context.clearRect(0, 0, tileWidth, tileHeight);
      // Draw the tile border
      if (this.tileFillColor !== null) {
        context.fillStyle = this.tileFillColor;
        context.fillRect(0, 0, tileWidth, tileHeight);
      }
      // Draw the tile border
      if (this.tileBorderColor !== null) {
        context.strokeStyle = this.tileBorderColor;
        context.lineWidth = this.tileBorderStrokeWidth;
        context.strokeRect(0, 0, tileWidth, tileHeight);
      }
      if (CustomFeaturesTile.useNodeCanvas) {
        var writeStream = concat(function (buffer) {
          resolve(buffer);
        });
        var stream = null;
        if (this.compressFormat === 'png') {
          stream = canvas.createPNGStream();
        }
        else {
          stream = canvas.createJPEGStream();
        }
        stream.pipe(writeStream);
      }
      else {
        resolve(canvas.toDataURL('image/' + this.compressFormat));
      }
    }.bind(this));
  }
}