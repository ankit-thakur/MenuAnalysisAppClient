import { useEffect, useRef } from "react";

class WebSocketClient {
    private messageHandler?: (message: string) => void;
    // private webSocket: WebSocket;
    private webSocket = useRef<WebSocket | null>(null);
    private isConnected: boolean = false;
    private messageQueue: Array<{ action: string, message: string, connectionKey: string }> = [];
  
    constructor(url: string) {

        useEffect(() => {

            const ws = new WebSocket(url);
            this.webSocket.current = ws;

            // Connection opened
            ws.onopen = (event: Event) => {
                console.log("WebSocket connection opened");
                this.isConnected = true;

                // Send any queued messages
                while (this.messageQueue.length > 0) {
                    const { action, message, connectionKey } = this.messageQueue.shift()!;
                    this.sendMessage(action, message, connectionKey);
                }
            };

            // Listen for messages
            ws.onmessage = (event: MessageEvent) => {
                console.log("** onmessage event: ", event);
                const messageData = event.data;
                console.log("Received message from backend:", messageData);
                
                // You can parse the message and handle it as needed
                const parsedData = JSON.parse(messageData);  // Assuming the backend sends JSON

                // Process the message based on its content
                const processedData = this.handleBackendMessage(parsedData);

                if (this.messageHandler) {
                    console.log("* message handler");
                    this.messageHandler(processedData); // Invoke the registered handler
                }
            };
        
            // Connection closed
            ws.onclose = (event: CloseEvent) => {
                // this.sendMessage("CloseConnection", message, connectionKey);
                console.log("WebSocket connection closed");
                this.isConnected = false;
            };

        }, []);

        
    }

    // Queue messages if the connection is not ready yet
    public sendMessage(action: string, message: string, connectionKey: string): void {
        const payload = JSON.stringify({ action, message, connectionKey });
        if (this.webSocket.current && this.webSocket.current.readyState === WebSocket.OPEN && this.isConnected) {
            console.log("WebSocket connected, sending message to backend.");
            this.webSocket.current.send(payload);
        } else {
            console.log("WebSocket not connected yet, queuing message.");
            this.messageQueue.push({ action, message, connectionKey });
        }
    }

    // // Close the WebSocket connection
    // public closeConnection(): void {
    //   if (this.isConnected) {
    //     this.webSocket.close();
    //     this.isConnected = false;
    //   }
    // }

     // Register a message handler
    registerMessageHandler(handler: (message: any) => void) {
        this.messageHandler = handler;
    }

    public handleBackendMessage(data: any) {
        switch (data.action) {
            case 'establishConnection':
            // Handle status updates
            console.log("Status update received:", data.status);
            break;
        
            case 'finalMenuOutputAction':
                // Handle new data received from the backend
                console.log("Action: finalMenuOutputAction");
                return [data.action, data.message];

            case 'menuAlreadyProcessed':
                console.log("Action: menuAlreadyProcessed");
                return [data.action, data.message];

            case 'menuNotProcessed':
                console.log("Action: menuNotProcessed");
                return [data.action, data.message];

    
        default:
            console.warn("Unknown message type:", data);
        }
    }
}

export default WebSocketClient;
