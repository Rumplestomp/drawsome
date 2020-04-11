import RegularPolygon from './RegularPolygon';
import Text from './Text';

export default class CanvasLayer {
  constructor({ fill = 'black', x = 0, y = 0, z = 0, rotation = 0, opacity = 1, scale = 1 } = {}) {
  /** WEBRTC DATA */
    // localChange: bool    REQUIRED A boolean flag stating whether or nor the latest change to this layer was from a webRTC Peer, or locally
    this.localChange = true;
    /** GENERAL DATA */
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

    // layerObject: object  The object that contains the specific data relating to the particular type of layer
    this.layerObject = null;
    // layerType: str       The type of layer (set when layerObject is set)
    this.layerType = null;
  }
  // TODO: ADD VALIDATION? OK.
  /** Function for adding polygon data to the layerObject */
  createRegularPolygon(data) {
    const shape = new RegularPolygon(data);
    this.layerObject = shape;
    this.layerType = shape.layerType;
  }
  /** Function for adding polygon data to the layerObject */
  createText(data) {
    const shape = new Text(data);
    this.layerObject = shape;
    this.layerType = shape.layerType;
  }
  setZ(layerNum) {
    this.z = layerNum;
  }
}
