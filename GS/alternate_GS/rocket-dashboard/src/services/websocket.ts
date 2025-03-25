export class WebSocketService {
    private url: string;
    private ws: WebSocket | null = null;
    private listeners: ((data: string) => void)[] = [];

    constructor(url: string) {
        this.url = url;
    }

    connect() {
        if (this.ws) {
            console.log("Already connected");
            return;
        }
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => console.log("WebSocket connected");
        this.ws.onmessage = (message) =>
            this.listeners.forEach((listener) => listener(message.data));
        this.ws.onclose = () => console.log("WebSocket closed");
        this.ws.onerror = (error) => console.error("WebSocket error", error);
    }

    addListener(listener: (data: string) => void) {
        this.listeners.push(listener);
    }

    close() {
        this.ws?.close();
        this.ws = null;
    }
}

// export default WebSocketService;

