import '@testing-library/jest-dom';

class Worker {
    constructor(stringUrl) {
        this.url = stringUrl;
        this.onmessage = () => { };
    }

    postMessage(msg) {
        if (msg === 'start') {
            this.intervalId = setInterval(() => {
                if (this.onmessage) {
                    this.onmessage({ data: 'tick' });
                }
            }, 1000);
        } else if (msg === 'stop') {
            clearInterval(this.intervalId);
        }
    }

    terminate() {
        clearInterval(this.intervalId);
    }
}

global.Worker = Worker;
