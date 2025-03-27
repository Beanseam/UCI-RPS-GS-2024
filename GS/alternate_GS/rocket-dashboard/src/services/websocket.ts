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

    sendMessage(message: string) {
        // Add detailed connection status logging
        console.log("Current WebSocket state:", {
            websocket: this.ws,
            readyState: this.ws?.readyState,
            OPEN: WebSocket.OPEN
        });

        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(message);
            console.log("Sent message:", message);
        } else {
            // Attempt to reconnect if not connected
            console.warn("WebSocket is not connected. Attempting to reconnect...");
            this.connect(); // Try to re-establish connection
            
            // Optional: Retry sending message after a short delay
            setTimeout(() => {
                if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                    this.ws.send(message);
                    console.log("Sent message after reconnection:", message);
                } else {
                    console.error("Still unable to send message. WebSocket not connected.");
                }
            }, 1000);
        }
    }

    close() {
        this.ws?.close();
        this.ws = null;
    }

    isConnected(): boolean {
        return !!this.ws && this.ws.readyState === WebSocket.OPEN;
    }
}