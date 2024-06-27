import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar,Modal} from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import the useNavigation hook
import baseUrl from '../baseUrl/baseUrl'; // Import the baseUrl function
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const NewPasswordPage = () => {
  const navigation = useNavigation(); // Initialize navigation using useNavigation
  const [focusedInput, setFocusedInput] = useState(null);
  const [password, setPassword] = useState('');
  const [reEnterPassword, setReEnterPassword] = useState('');
  const [reEnterPasswordError, setReEnterPasswordError] = useState('');
  const [modalVisible, setModalVisible] = useState(false); // State to control modal visibility
  const [modalMessage, setModalMessage] = useState(''); // State to hold modal message
  const [modalVisibleOtpSucess, setModalVisibleOtpSucess] = useState(false); // Added this state variable

  const validatePasswords = () => {
    if (reEnterPassword !== password) {
      setReEnterPasswordError('Passwords do not match');
    } else {
      setReEnterPasswordError('');
    }
  };

  const submitPassword = async () => {
    validatePasswords();

    try {
        const storedPlateNo = await AsyncStorage.getItem('plateNo');
        const storedEmail = await AsyncStorage.getItem('email');
        const storedTokenOtp = await AsyncStorage.getItem('tokenOtp');

        console.log(storedPlateNo, storedEmail);
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedTokenOtp}`;

        const response = await axios.post(`${baseUrl}/api/v1/user/changePassword`, {
            email: storedEmail,
            plateNo: storedPlateNo,
            password: password
        });

        console.log('Response from backend:', response.data);

        setModalMessage('Success');
        setModalVisibleOtpSucess(true);

        setTimeout(() => {
            navigation.navigate('SignInPage'); 
        }, 3000); 

    } catch (error) {
        console.log(error);
        if (error.response) {
            setModalMessage(error.response.data.comment);
            setModalVisible(true);
        } else if (error.request) {
            // Network error occurred
            console.error('Network error:', error.request);
            setModalMessage('Network error. Please check your internet connection.');
            setModalVisible(true);
        } else {
            // Something else went wrong
            console.error('Error:', error.message);
            setModalMessage('An error occurred. Please try again later.');
            setModalVisible(true);
        }
    }
};


  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="black" barStyle="light-content" />
      <Text style={styles.title}>Change Password</Text>

      <View style={styles.innerContainer}>
        <View>
          <Text style={styles.textValue}>Password</Text>
          <TextInput
            placeholder="Password"
            secureTextEntry={true}
            placeholderTextColor="black"
            style={[styles.input, { width: 250 }, focusedInput === 'password' && styles.focusedInput]}
            onFocus={() => setFocusedInput('password')}
            onBlur={() => setFocusedInput(null)}
            onChangeText={(text) => setPassword(text)}
          />

          <Text style={styles.textValue}>Re-enter Password</Text>
          <TextInput
            placeholder="Re-enter Password"
            secureTextEntry={true}
            placeholderTextColor="black"
            style={[styles.input, { width: 250 }, focusedInput === 'reEnterPassword' && styles.focusedInput, reEnterPasswordError && styles.errorInput]}
            onFocus={() => setFocusedInput('reEnterPassword')}
            onBlur={() => {
              setFocusedInput(null);
              validatePasswords();
            }}
            onChangeText={(text) => {
              setReEnterPassword(text);
              setReEnterPasswordError('');
            }}
          />
          {reEnterPasswordError ? <Text style={styles.errorText}>{reEnterPasswordError}</Text> : null}
        </View>
        <View style={styles.bottomContainer}>
          <TouchableOpacity style={[styles.button, { alignSelf: 'center' }]} onPress={submitPassword}>
            <Text style={[styles.buttonText, styles.buttonTextBold]}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={[styles.modalText, { color: 'red' }]}>{modalMessage}</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.customButton}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>


      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisibleOtpSucess} // Changed this line
        onRequestClose={() => {
          setModalVisibleOtpSucess(false); // Changed this line
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={[styles.modalText, { color: 'black' }]}>{modalMessage}</Text>
            <TouchableOpacity onPress={() => setModalVisibleOtpSucess(false)} style={styles.customButtonSucess}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  innerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 50,
  },
  bottomContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    marginTop: 20,
    marginBottom: 20,
    color: 'white',
  },
  textValue: {
    fontSize: 16,
    marginBottom: 10,
    color: 'white',
  },
  input: {
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 8,
    paddingHorizontal: 10,
    color: 'black',
  },
  focusedInput: {
    borderColor: '#FFA500',
    borderWidth: 2,
  },
  errorInput: {
    borderColor: 'red',
    borderWidth: 1,
  },
  errorText: {
    color: 'red',
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#FFA500',
    paddingVertical: 12,
    borderRadius: 40,
    marginBottom: 10,
    width: 200,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 20,
  },
  buttonTextBold: {
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%', // Set the width to 80% of the screen width
    maxWidth: 400, // Maximum width of the modal content
  },
  customButton: {
    backgroundColor: 'red',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    width:100,
    marginTop:10,
  },
  customButtonSucess:{
    backgroundColor: '#FFA500',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    width:100,
    marginTop:10,
  },buttonText:{
    textAlign:'center',
    color:'white',
    fontSize:18,
  }, loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#FFA500',
  },modalText:{
    fontSize:18
  },loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#FFA500',
  },
});

export default NewPasswordPage;
