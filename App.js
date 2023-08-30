import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, TextInput, Button, Text, FlatList, Dimensions } from 'react-native';
import io from 'socket.io-client';

const headerImage = require("./assets/images/logo-러브키퍼.png");
const backArrow = require("./assets/images/ic-back.png");
const searchIcon = require("./assets/images/ic-search.png");
const blurOne = require("./assets/images/bg-블러원.png");
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.head}>
        <Image source={backArrow} style={{ width: 24, height: 24, marginRight: 90 }} />
        <Image source={headerImage} style={{ width: 129.68, height: 40 }} />
        <Image source={searchIcon} style={{ width: 24, height: 24, marginLeft: 90 }} />
      </View>
      <View style={styles.body}>
        <Image source={blurOne} style={styles.backBlur} />
        <ChatScreen />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  head: {
    flex: 1,
    marginTop: -45,
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', 
  },
  body: {
    flex: 3,
    alignItems: 'center',
  },
  backBlur: {
    marginTop: SCREEN_HEIGHT * 0.05,
    width: SCREEN_WIDTH + 30,
    height: SCREEN_HEIGHT * 0.5,
  },
  chatContainer: {
    flex: 1,
    padding: 10,
  },
  messageContainer: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 5,
  },
  userMessage: {
    backgroundColor: '#cce6ff',
    alignSelf: 'flex-end',
  },
  responseMessage: {
    backgroundColor: '#f0f0f0',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  textInput: {
    flex: 1,
    marginRight: 10,
    padding: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});


function ChatScreen() {
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Connect to the socket.io server (replace with your server's address)
    const socketIo = io("http://your_server_address_here");
    setSocket(socketIo);

    // Set up event listener for 'message' event from server
    socketIo.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, { text: message.text, isUser: message.isUser }]);
    });

    // Cleanup function to disconnect from socket when component unmounts
    return () => {
      socketIo.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (chatInput.trim() === '') return;

    const userMessage = { text: chatInput, isUser: true };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    socket.emit('message', userMessage);

    setChatInput('');
  };

  return (
    <View style={styles.chatContainer}>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <View style={[styles.messageContainer, item.isUser ? styles.userMessage : styles.responseMessage]}>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Type your message..."
          value={chatInput}
          onChangeText={(text) => setChatInput(text)}
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </View>
  );
}



// import React, { useState } from 'react';
// import { StatusBar, View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';

// export default function App() {
//   const [chatInput, setChatInput] = useState('');
//   const [messages, setMessages] = useState([]);

//   const sendMessage = () => {
//     if (chatInput.trim() === '') return;

//     setMessages((prevMessages) => [...prevMessages, { text: chatInput, isUser: true }]);
//     setChatInput('');
//     setTimeout(() => {

// 가짜 응답 메시지 .... .
//       const fakeResponse = `You said: ${chatInput}`;
//       setMessages((prevMessages) => [...prevMessages, { text: fakeResponse, isUser: false }]);
//     }, 1000);
//   };

//   return (
//     <View style={styles.container}>
//       <StatusBar style="auto" />
//       <View style={styles.chatContainer}>
//         <FlatList
//           data={messages}
//           renderItem={({ item }) => (
//             <View style={[styles.messageContainer, item.isUser ? styles.userMessage : styles.responseMessage]}>
//               <Text style={styles.messageText}>{item.text}</Text>
//             </View>
//           )}
//           keyExtractor={(item, index) => index.toString()}
//         />
//       </View>
//       <View style={styles.inputContainer}>
//         <TextInput
//           style={styles.textInput}
//           placeholder="Type your message..."
//           value={chatInput}
//           onChangeText={(text) => setChatInput(text)}
//         />
//         <Button title="Send" onPress={sendMessage} />
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   chatContainer: {
//     flex: 1,
//     padding: 10,
//   },
//   messageContainer: {
//     padding: 10,
//     borderRadius: 10,
//     marginBottom: 5,
//   },
//   userMessage: {
//     backgroundColor: '#cce6ff',
//     alignSelf: 'flex-end',
//   },
//   responseMessage: {
//     backgroundColor: '#f0f0f0',
//     alignSelf: 'flex-start',
//   },
//   messageText: {
//     fontSize: 16,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 10,
//     borderTopWidth: 1,
//     borderTopColor: '#ccc',
//   },
//   textInput: {
//     flex: 1,
//     marginRight: 10,
//     padding: 5,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 5,
//   },
// });
