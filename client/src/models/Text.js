export default class Text {
  constructor({ text = 'insert text here' } = {}) {
    this.layerType = 'Text';
    this.text = text;
  }
}
