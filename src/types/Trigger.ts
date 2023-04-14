import Signal from "./Signal";

export default class Trigger {
  name: String;
  regex: RegExp;
  signals: Signal[];

  constructor(name: String, regex: RegExp, signal: Signal[]) {
    this.name = name;
    this.signals = signal;
    this.regex = regex;
  }
}
