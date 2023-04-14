export default class Signal {
  name: String;
  description: String;
  document: String;

  constructor(name: String, description: String, document: String) {
    this.name = name;
    this.description = description;
    this.document = document;
  }
}
