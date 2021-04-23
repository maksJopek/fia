export default class Timer {
    divTimer!: HTMLElement;

    interval!: any;
    async start(playerIndex: number, finishTime: number): Promise<void> {
        return new Promise(resolve => {
            let divTimer = document.getElementById(`${playerIndex}-player-time`);
            if (divTimer === null)
                throw new Error("divTimer doesn't Exist");
            else
                this.divTimer = divTimer;

            this.interval = setInterval(() => {
                this.updateDisplay(finishTime - Date.now(), resolve);
            }, 1000);
        })
    }

    updateDisplay(time: number, resolve: Function): void {
        let secondsElapsed = Math.floor(time / 1000);
        this.divTimer.innerHTML = secondsElapsed.toString();
        if (secondsElapsed === 0) {
            resolve();
            clearInterval(this.interval);
        }
    }
    stop(): void {
        clearInterval(this.interval);
    }
}