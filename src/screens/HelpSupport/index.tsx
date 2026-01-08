import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { IMAGES } from "../../images";
import Icon from 'react-native-vector-icons/Ionicons';
import AppHeader from '../../@ui/app-header/AppHeader';
import { useNavigation } from '@react-navigation/native';
import { TProfileStackNavigator } from '../../navigators/tab-navigator/sub-stack-navigator/ProfileStackNavigator';
import { COLORS } from '../../colors';
import { TImages } from '../../images/images';
import AutoHeightImage from '../../@ui/auto-height-image/AutoHeightImage';
interface IHelpsupport {

  onClick: () => void;
  Icon: TImages;
 
}
const HelpSupportScreen = (props:IHelpsupport) => {
    const {  Icon  } = props;
    const navigation = useNavigation<TProfileStackNavigator>();
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState<string[]>([]);

  const handleSendMessage = () => {
    if (message.trim() === '') return;
    setChat((prevChat) => [...prevChat, `You: ${message}`]);
    setTimeout(() => {
      setChat((prevChat) => [
        ...prevChat,
        `Bot: Thank you for reaching out! How can I assist you?`,
      ]);
    }, 1000);
    setMessage('');
  };

  return (

    <View style={styles.container}>
       <AppHeader
        title="Help & Support"
        showDrawer={false}
        handleBackClick={() => navigation.navigate("Profile")}
      />
     <ScrollView style={styles.chatContainer} contentContainerStyle={{ flexGrow: 1 }}>
  <Text style={styles.greeting}>Hello, 👋 there!</Text>
  <Text style={styles.subHeading}>How Can We Help You?</Text>
  
  {/* Conditionally render the image */}
  {chat.length === 0 ? (
    <View style={styles.centeredContainer}>
      <Image
        source={IMAGES.helpandsupportimage}
        style={styles.illustration}
        resizeMode="contain"
      />
    </View>
  ) : (
    chat.map((msg, index) => (
      <Text key={index} style={styles.chatMessage}>
        {msg}
      </Text>
    ))
  )}
</ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message........"
          placeholderTextColor={'#ccc'}
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
        <AutoHeightImage source={IMAGES.send} styles={{tintColor:'white'}} width={24}/>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: '#fff',
  },
 
  chatContainer: {
    height: '70%',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20,
    
    
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 20,
  },
  subHeading: {
    fontSize: 16,
    color:'black',
    marginVertical: 10,
  },
  illustration: {
    width: '100%',
    height: 150,
   
  },
  chatMessage: {
    fontSize: 14,
    color: '#333',
    marginVertical:10,
    
  },
  inputContainer: {
   marginBottom: '30%',
    flexDirection: 'row',
    paddingHorizontal: 30,
    paddingVertical: 10,
    backgroundColor: '#fff',
    justifyContent: 'space-between',

  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 30,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    padding: 10,
    justifyContent: 'center',
    alignItems : 'center',
    width: 45,
  },
});

export default HelpSupportScreen;
