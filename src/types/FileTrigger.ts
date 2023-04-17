import Signal from "./Signal";

export default class FileTrigger {
  name: string;
  filePattern: string;
  signals: Signal[];

  constructor(name: string, fileName: string, signal: Signal[]) {
    this.name = name;
    this.signals = signal;
    this.filePattern = fileName;
  }
}
