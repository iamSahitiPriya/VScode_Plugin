export default class Signal {
  name: string;
  description: string;
  document: string;

  constructor(name: string, description: string, document: string) {
    this.name = name;
    this.description = description;
    this.document = document;
  }
}
