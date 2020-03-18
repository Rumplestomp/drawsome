export default class RegularPolygon {
  constructor({ sides = 3, radius = 10 } = {}) {
    this.layerType = 'RegularPolygon';
    this.sides = sides;
    this.radius = radius;
  }
}
