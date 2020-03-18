import RegularPolygon from './RegularPolygon';
import Text from './Text';

export default class CanvasLayer {
  constructor({ fill = 'black', x = 0, y = 0, z = 0, rotation = 0, opacity = 1, scale = 1 } = {}) {
    /** GENERAL DATA */
    this.layerType = null;
    // isBackground: bool   REQUIRED A boolean saying whether or not this is the background layer
    this.isBackground = false;
    // fill: str            The color of the of layer object (Shapes and text)
    this.fill = fill;
    // x: int               The x position of the layer within the canvas
    this.x = x;
    // y: int               The y position of the layer within the canvas
    this.y = y;
    // z: int               REQUIRED The z position of the layer within the canvas (Layer ordering term)
    this.z = z;
    // rotation: int        The rotation factor (in degrees) of the layer
    this.rotation = rotation;
    // opacity: float       The opcaity of the layer. 0 <= opcaity <= 1
    this.opacity = opacity;
    // scale: float         The scale (size) of the shape relative to its original size
    this.scale = scale;

    this.layerObject = null;
  }
  // TODO: ADD VALIDATION? OK.
  /** Function for adding polygon data to the layer */
  createRegularPolygon(data) {
    const shape = new RegularPolygon(data);
    this.layerObject = shape;
    this.layerType = shape.layerType;
  }
  createText(data) {
    const shape = new Text(data);
    this.layerObject = shape;
    this.layerType = shape.layerType;
  }
}
