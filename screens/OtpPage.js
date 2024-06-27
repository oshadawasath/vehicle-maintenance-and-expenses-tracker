import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, SafeAreaView, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import baseUrl from '../baseUrl/baseUrl';

const OtpPage = () => {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [plateNo, setPlateNo] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalVisibleOtpSucess, setModalVisibleOtpSucess] = useState(false); // Added this state variable
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [isLoading, setIsLoading] = useState(false); // State variable for loading indicator

  const navigation = useNavigation();

  useEffect(() => {
    getDataFromAsyncStorage();
  }, []);

  const getDataFromAsyncStorage = async () => {
    try {
      const storedEmail = await AsyncStorage.getItem('inputEmail');
      const storedPlateNo = await AsyncStorage.getItem('inputPlateNo');
      const obscuredEmail = obscureEmail(storedEmail);
      setEmail(obscuredEmail);
      setPlateNo(storedPlateNo);
    } catch (error) {
      console.error('Error retrieving data from AsyncStorage:', error);
    }
  };

  const obscureEmail = (email) => {
    const parts = email.split('@');
    if (parts.length === 2) {
      const username = parts[0];
      const domain = parts[1];
      const obscuredUsername = username.substring(0, 5) + '#######';
      return obscuredUsername + '@' + domain;
    }
    return email;
  };

  const handleVerifyOtp = async () => {

    try {
      const storedPlateNo = await AsyncStorage.getItem('inputPlateNo');
      const storedEmail = await AsyncStorage.getItem('inputEmail');
      const storedTokenOtp = await AsyncStorage.getItem('tokenOtp');

      axios.defaults.headers.common['Authorization'] = `Bearer ${storedTokenOtp}`;


      const response = await axios.post(`${baseUrl}/api/v1/otp/otpCheck`, {
        email: storedEmail,
        plateNo: storedPlateNo,
        otpValue: otp
      });
      
      navigation.navigate('NewPassword');
    } catch (error) {
      if (error.response) {
        setModalMessage(error.response.data.comment);
        setModalVisible(true);
      }
    }
  };

  const handleSendOtp = async () => {
    try {
      setLoading(true); // Show loading indicator
  
      const storedPlateNo = await AsyncStorage.getItem('inputPlateNo');
      const storedEmail = await AsyncStorage.getItem('inputEmail');
  
      const response = await axios.post(`${baseUrl}/api/v1/otp/otpSend`, {
        email: storedEmail,
        plateNo: storedPlateNo,
        otpValue: otp
      });
  
      const tokenOtp = response.data.data;
      
      // Store the OTP 
      await AsyncStorage.setItem('tokenOtp', tokenOtp);
  
      setLoading(false); 
  
      setModalMessage('OTP send successfully');
      setModalVisibleOtpSucess(true); 
    } catch (error) {
      setLoading(false); 
  
      console.error('Error sending OTP:', error);
      if (error.response) {
        setModalMessage(error.response.data.comment);
        setModalVisible(true); // Corrected this line
      } else if (error.request) {
        // Network error occurred
        console.error('Network error:', error.request);
        // Set error message or take necessary action for network error
        // For example, display a message to the user indicating network issue
        setModalMessage('Network error. Please check your internet connection.');
        setModalVisible(true);
      } else {
        // Something else went wrong
        console.error('Error:', error.message);
        // Set error message or take necessary action for other types of errors
        setModalMessage('An error occurred. Please try again later.');
        setModalVisible(true);
      }
    }
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="black" barStyle="light-content" />
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Enter OTP</Text>
      </View>
      <Text style={styles.emailText}>Plate NO: {plateNo}</Text>
      <Text style={styles.emailText}>Logged in as {email}</Text>

      <TextInput
        style={styles.input}
        onChangeText={(text) => setOtp(text)}
        value={otp}
        placeholder="Enter OTP"
        keyboardType="numeric"
        secureTextEntry={true}
        placeholderTextColor="black"
      />
      <TouchableOpacity style={styles.buttonOtp} onPress={handleSendOtp}>
        <Text style={styles.buttonText}>Send OTP</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
        <Text style={styles.buttonText}>Verify OTP</Text>
      </TouchableOpacity>
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
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFA500" />
          <Text style={styles.loadingText}>Sending OTP...</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  titleContainer: {
    paddingVertical: 15,
    marginBottom: 20,
  },
  title: {
    fontSize: 35,
    color: '#FFA500',
    textAlign: 'center',
  },
  emailText: {
    fontSize: 18,
    color: 'white',
    margin: 10,
  },
  input: {
    width: 250,
    height: 40,
    borderWidth: 1,
    marginBottom: 20,
    textAlign: 'center',
    backgroundColor: 'white',
    opacity: 1,
    borderRadius: 5,
    color: 'black',
  },
  button: {
    backgroundColor: '#FFA500',
    margin: 10,
    padding: 10,
    borderRadius: 5,
    width: 200,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  buttonOtp: {
    backgroundColor: '#FFA500',
    margin: 10,
    padding: 10,
    borderRadius: 5,
    width: 120,
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

export default OtpPage;
