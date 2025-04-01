import React, { useState, useEffect, useCallback } from 'react';
import { Send } from 'lucide-react';


function App() {
  const [content, setContent] = useState('');
  const [content2, setContent2]= useState('');
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);

  // Preset values
  const username = "JohnDoe";
  const topic = "General Discussion";

  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;
  
    const connectWebSocket = () => {
      ws = new WebSocket('ws://localhost:8081/ws');
  
      ws.onopen = () => {
        console.log('Connected to WebSocket');
        setConnected(true);
        setSocket(ws);
        reconnectAttempts = 0; // Reset attempts on successful connection
      };
  
      ws.onclose = () => {
        console.log('Disconnected from WebSocket');
        setConnected(false);
  
        if (reconnectAttempts < maxReconnectAttempts) {
          const timeout = Math.min(200 * 2 ** reconnectAttempts, 3000); // Exponential backoff with a max delay of 30 seconds
          reconnectAttempts++;
          console.log(`Reconnecting in ${timeout / 1000} seconds...`);
          setTimeout(connectWebSocket, timeout);
        } else {
          console.error('Max reconnect attempts reached. Giving up.');
        }
      };
  
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    };
  
    connectWebSocket();
  
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  const sendMessage = useCallback((text: string) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const message = {
        username,
        topic,
        content: text
      };
      socket.send(JSON.stringify(message));
    }
  }, [socket]);
  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        setContent2(message.content)
        console.log('Received message:',message.content);
      };
    }
  }, [socket]);
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    sendMessage(newContent);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Real-time Message</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-500">Username:</span>
                <span className="ml-2 text-sm font-semibold text-gray-700">{username}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-500">Topic:</span>
                <span className="ml-2 text-sm font-semibold text-gray-700">{topic}</span>
              </div>
              <div className="flex-grow"></div>
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm text-gray-600">{connected ? 'Connected' : 'Disconnected'}</span>
              </div>
            </div>
          </div>

          {/* Message Input */}
          <div className="relative">
            <textarea
              value={content}
              onChange={handleContentChange}
              placeholder="Type your message..."
              className="w-full min-h-[120px] p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
            />
            <div className="absolute bottom-4 right-4">
              <Send className="w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Character count */}
          <div className="mt-2 text-right">
            <span className="text-sm text-gray-500">{content.length} characters</span>
          </div>

          <div className="relative">
            <textarea
              value={content2}

              placeholder="Type your message..."
              className="w-full min-h-[120px] p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
            />
          </div>

          {/* Character count */}
          <div className="mt-2 text-right">
            <span className="text-sm text-gray-500">{content.length} characters</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;