export default class Timer {
  divTimer!: HTMLElement;

  interval!: any;
  async start(playerIndex: number, finishTime: number): Promise<void> {
    return new Promise(resolve => {
      if (this.interval !== undefined)
        this.stop();

      this.divTimer = document.getElementById(`${playerIndex}-player-time`) as HTMLElement;

      this.interval = setInterval(() => {
        this.updateDisplay(finishTime - Date.now(), resolve);
      }, 1000);
    })
  }

  updateDisplay(time: number, resolve: Function): void {
    let secondsElapsed = Math.floor(time / 1000);
    if (secondsElapsed <= 0) {
      resolve();
      clearInterval(this.interval);
      this.divTimer.innerHTML = '0';
    } else {
      this.divTimer.innerHTML = secondsElapsed.toString();
    }
  }

  stop(): void {
    this.divTimer.innerHTML = '';
    clearInterval(this.interval);
    this.interval = undefined;
  }
}
