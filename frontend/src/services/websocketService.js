class WebSocketService {
  constructor() {
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectTimeout = null;
    this.messageHandlers = new Map();
    this.connectionHandlers = [];
  }

  connect(ticketID) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(`ws://localhost:5001/chat/${ticketID}`);
        
        this.ws.onopen = () => {
          this.reconnectAttempts = 0;
          this.notifyConnectionHandlers(true);
          
          // Join ticket room
          this.send({
            type: 'join_ticket',
            ticketID: ticketID
          });
          
          resolve();
        };

        this.ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        };

        this.ws.onclose = () => {
          this.notifyConnectionHandlers(false);
          this.attemptReconnect(ticketID);
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };

      } catch (error) {
        reject(error);
      }
    });
  }

  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.notifyConnectionHandlers(false);
  }

  send(data) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
      return true;
    }
    return false;
  }

  attemptReconnect(ticketID) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 10000);
      
      this.reconnectTimeout = setTimeout(() => {
        this.connect(ticketID);
      }, delay);
    }
  }

  handleMessage(data) {
    const handlers = this.messageHandlers.get(data.type) || [];
    handlers.forEach(handler => handler(data));
  }

  onMessage(type, handler) {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, []);
    }
    this.messageHandlers.get(type).push(handler);
  }

  offMessage(type, handler) {
    const handlers = this.messageHandlers.get(type);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  onConnection(handler) {
    this.connectionHandlers.push(handler);
  }

  notifyConnectionHandlers(connected) {
    this.connectionHandlers.forEach(handler => handler(connected));
  }

  isConnected() {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  getConnectionStatus() {
    if (!this.ws) return 'disconnected';
    
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING: return 'connecting';
      case WebSocket.OPEN: return 'connected';
      case WebSocket.CLOSING: return 'closing';
      case WebSocket.CLOSED: return 'disconnected';
      default: return 'unknown';
    }
  }
}

// Create singleton instance
const websocketService = new WebSocketService();
export default websocketService;
