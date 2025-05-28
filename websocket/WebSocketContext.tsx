// import React, { createContext, useContext } from 'react';
// // import webSocketInstance from './WebSocketInstance';
// import WebSocketClient from './WebSocketService';

// const webSocketInstance = new WebSocketClient('wss://djh0fnzlrc.execute-api.us-east-1.amazonaws.com/prod/');
// const WebSocketContext = createContext(webSocketInstance);

// export const useWebSocket = () => useContext(WebSocketContext);

// export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
//   <WebSocketContext.Provider value={ webSocketInstance }>
//     {children}
//   </WebSocketContext.Provider>
// );
