export default class Signal {
  name: string;
  description: string;
  document: string;
  fileTriggers: string[];
  codeTriggers: RegExp[];

  constructor(
    name: string,
    description: string,
    document: string,
    fileTriggers: string[],
    codeTriggers: RegExp[]
  ) {
    this.name = name;
    this.description = description;
    this.document = document;
    this.codeTriggers = codeTriggers;
    this.fileTriggers = fileTriggers;
  }
}
