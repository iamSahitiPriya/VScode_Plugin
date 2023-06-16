export default class Signal {
  name: string;
  description: string;
  document: string;
  fileTriggers: string[];
  codeTriggers: RegExp[];
  triggerFunction?: boolean;

  constructor(
    name: string,
    description: string,
    document: string,
    fileTriggers: string[],
    codeTriggers: RegExp[],
    triggerFunction?: boolean
  ) {
    this.name = name;
    this.description = description;
    this.document = document;
    this.codeTriggers = codeTriggers;
    this.fileTriggers = fileTriggers;
    this.triggerFunction = triggerFunction;
  }
}
