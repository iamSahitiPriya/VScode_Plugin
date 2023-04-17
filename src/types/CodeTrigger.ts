import Signal from "./Signal";

export default class Trigger {
  name: string;
  regex: RegExp;
  signals: Signal[];

  constructor(name: string, regex: RegExp, signal: Signal[]) {
    this.name = name;
    this.signals = signal;
    this.regex = regex;
  }
}
