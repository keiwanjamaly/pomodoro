self.onmessage = (e) => {
    if (e.data === 'start') {
        self.timerId = setInterval(() => {
            self.postMessage('tick');
        }, 1000);
    } else if (e.data === 'stop') {
        clearInterval(self.timerId);
    }
};
