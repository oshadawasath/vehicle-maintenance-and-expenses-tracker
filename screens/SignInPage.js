import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, Modal, SafeAreaView ,Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import baseUrl from '../baseUrl/baseUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignInPage = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isInputFilled, setIsInputFilled] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalVisibleOtpSucess, setModalVisibleOtpSucess] = useState(false);
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const handleForgotPassword = () => {
    navigation.navigate('OtpPage');
  };

  const handleCreateAccount = () => {
    navigation.navigate('SignUpPage');
  };

  const handleGrageUser = () => {
    navigation.navigate('GrageUserLogin');

    // navigation.navigate('GrageUser');
  };

  
  const handleHomePage = async () => {
    console.log('Response');
    
    // Validate email
    validateEmail();
    
    // Check if there are any email errors
    if (emailError) {
      return; // Stop submission if there are email errors
    }
    
    // Check if any of the required fields are empty
    if (!email || !password || !vehicleNumber) {
      setModalMessage('Please fill in all the fields.');
      setModalVisible(true);
      return; // Stop submission if any field is empty
    }
  
    try {
      const response = await axios.post(`${baseUrl}/api/v1/user/login`, {
        email: email,
        password: password,
        plateNo: vehicleNumber // Using vehicleNumber in the request
      });
  
      console.log('Response from backend:', response.data); // Access response data using response.data
  
      // Store token in AsyncStorage
      await AsyncStorage.setItem('token', response.data.token); // Assuming token is returned from backend
      await AsyncStorage.setItem('email', response.data.data.email);
      await AsyncStorage.setItem('plateNo', response.data.data.plateNo);
  
      // Print the token that has been set
      const storedToken = await AsyncStorage.getItem('token');
      console.log('Stored Token:', storedToken);
  
      // Navigate to Home Page
      setModalMessage("Successfully login");
      setModalVisibleOtpSucess(true);
    } catch (error) {
      if (error.response) {
        // If login fails, set modalMessage and modalVisible to true to display the modal
        console.log(error.response.data.comment);
        setModalMessage(error.response.data.comment);
        setModalVisible(true);
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
  

  
  
  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Invalid email address');
    } else {
      setEmailError('');
    }
  };

  const handleInputChange = (text) => {
    setEmail(text);
    if (text.trim() !== '') {
      setIsInputFilled(true);
    } else {
      setIsInputFilled(false);
    }
    // Save email to AsyncStorage with a unique key
    AsyncStorage.setItem('inputEmail', text);
  };
  

  const handlePasswordChange = (text) => {
    setPassword(text);
  };

  const handleVehicleNumberChange = (text) => {
    setVehicleNumber(text);
    AsyncStorage.setItem('inputPlateNo', text);

  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="black" barStyle="light-content" />

      <View style={styles.innerContainer}>
      <Text style={styles.title}>SIGN IN</Text>

        <View>
          <Text style={styles.subtitle}>Welcome Back!</Text>
          <Text style={styles.textValue}>Email</Text>
          <TextInput
            placeholder="Email Address"
            placeholderTextColor="black"
            style={[styles.input, emailError && styles.errorInput, focusedInput === 'email' && styles.focusedInput]}
            onChangeText={handleInputChange}
            onBlur={validateEmail}
            onFocus={() => setFocusedInput('email')}
          />
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

          <Text style={styles.textValue}>Password</Text>
          <TextInput
            placeholder="Password"
            secureTextEntry={true}
            placeholderTextColor="black"
            style={[styles.input, focusedInput === 'password' && styles.focusedInput]}
            onChangeText={handlePasswordChange}
            onFocus={() => setFocusedInput('password')}
          />
          
          <Text style={styles.textValue}>Vehicle Number</Text>
          <TextInput
            placeholder="Vehicle Number"
            placeholderTextColor="black"
            style={[styles.input, focusedInput === 'vehicleNumber' && styles.focusedInput]}
            onChangeText={handleVehicleNumberChange}
            onFocus={() => setFocusedInput('vehicleNumber')}
          />
          
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.forgotPassword}>Forget password?</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.button} onPress={handleHomePage}>
            <Text style={[styles.buttonText, styles.buttonTextBold]}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.googleButton]} onPress={handleGrageUser}>
            <Text style={[styles.buttonText, styles.buttonTextBold, styles.googleButtonText]}>Grage User</Text>
          </TouchableOpacity>
          <View style={styles.loginContainer}>
            <Text style={styles.normalText}>Don't have an account? </Text>
            <TouchableOpacity onPress={handleCreateAccount}>
              <Text style={styles.linkText}>Create account</Text>
            </TouchableOpacity>
          </View>

          <Modal
            animationType="slide"
            transparent={true}
            visible={successModalVisible}
            onRequestClose={() => {
              setSuccessModalVisible(false);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Login Successful!</Text>
                {/* Add your text message here */}
                <Text style={styles.modalText}>Welcome to the Drive Lanka app.</Text>
              </View>
            </View>
          </Modal>
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
            <TouchableOpacity onPress={() => { setModalVisibleOtpSucess(false); navigation.navigate('HomePage'); }} style={styles.customButtonSucess}>
  <Text style={[styles.buttonText, {textAlign: 'center'}]}>OK</Text>
</TouchableOpacity>

          </View>
        </View>
      </Modal>

    </SafeAreaView>
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
    fontSize: 32,
    marginBottom: 20,
    color: 'white',
  },
  subtitle: {
    fontSize: 22,
    marginBottom: 10,
    color: '#FFA500',
  },
  textValue: {
    fontSize: 15,
    marginBottom: 10,
    color: 'white',
  },
  input: {
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 8,
    paddingHorizontal: 10,
    color: 'black',
    width: 250,
  },
  button: {
    backgroundColor: '#FFA500',
    paddingVertical: 12,
    borderRadius: 40,
    marginBottom: 10,
    width: 200,
  },
  googleButton: {
    backgroundColor: 'transparent',
    borderColor: '#FFA500',
    borderWidth: 2,
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
  googleButtonText: {
    color: '#FFA500',
    textAlign: 'center',
    fontSize: 20,
  },
  orText: {
    fontSize: 15,
    margin: 10,
    textAlign: 'center',
    color: 'white',
  },
  normalText: {
    fontSize: 15,
    color: 'white',
  },
  linkText: {
    fontSize: 15,
    color: '#FFA500',
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  forgotPassword: {
    fontSize: 15,
    color: '#FFA500',
    textDecorationLine: 'underline',
    marginTop: 10,
  },
  errorInput: {
    borderColor: 'red',
    borderWidth: 1,
  },
  errorText: {
    color: 'red',
    marginBottom: 5,
  },
  focusedInput: {
    borderColor: '#FFA500',
    borderWidth: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22
  }, modalContainer: {
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
    width:150,
  },
  customButtonSucess:{
    backgroundColor: '#FFA500',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    width:150,
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
  },modalText: {
    marginBottom: 10,
    fontSize: 18,
    textAlign: 'center',
    color: 'black',
    padding: 3, // Add padding here
  },
});

export default SignInPage;
