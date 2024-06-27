import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, Modal, Button, SafeAreaView,Dimensions  } from 'react-native'; // Import necessary components
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import baseUrl from '../baseUrl/baseUrl'; // Import the baseUrl function

const SignUpPage = () => {
  const [focusedInput, setFocusedInput] = useState(null);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [reEnterPassword, setReEnterPassword] = useState('');
  const [reEnterPasswordError, setReEnterPasswordError] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState(''); // State for vehicle number

  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalVisibleOtpSucess, setModalVisibleOtpSucess] = useState(false);

  const navigation = useNavigation(); // Get the navigation object

  // Function to validate email
  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Invalid email address');
    } else {
      setEmailError('');
    }
  };

  const navigateToSignIn = () => {
    navigation.navigate('SignInPage'); // Navigate to the SignInPage
  };

  
  const handleSubmit = async () => {
    // Check if any field is empty
    if (!email || !password || !reEnterPassword || !vehicleNumber) {
      setModalMessage('Please fill in all fields');
      setModalVisible(true);
      return;
    }
  
    // Validate email
    validateEmail();
  
    // Check if passwords match
    if (password !== reEnterPassword) {
      setReEnterPasswordError('Passwords do not match');
      return; // Stop submission if passwords don't match
    }
  
    // Check if there are any email errors
    if (emailError) {
      return; // Stop submission if there are email errors
    }
  
    try {
      const response = await axios.post(`${baseUrl}/api/v1/user/register`, {
        email: email,
        password: password,
        plateNo: vehicleNumber // Using vehicleNumber in the request
      });
  
      console.log('Response from backend:', response.data); // Access response data using response.data
  
      // Show success modal
  
      // Reset form fields
      setEmail('');
      setPassword('');
      setReEnterPassword('');
      setVehicleNumber('');
      setEmailError('');
      setReEnterPasswordError('');
      // setTimeout(() => {
      //   navigation.navigate('SignInPage');
      // }, 1500);
      setModalMessage('Successfully login');
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
  

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="black" barStyle="light-content" />

      <View style={styles.innerContainer}>
      <Text style={styles.title}>Sign UP</Text>

        <View>
          <Text style={styles.subtitle}>Create your account</Text>

          <Text style={styles.textValue}>Vehicle Number</Text>
          <TextInput
            placeholder="Vehicle Number (AB0123)"
            placeholderTextColor="black"
            style={[styles.input, { width: 250 }, focusedInput === 'vehicleNumber' && styles.focusedInput]}
            onFocus={() => setFocusedInput('vehicleNumber')}
            onBlur={() => setFocusedInput(null)}
            onChangeText={(text) => setVehicleNumber(text)} // Update vehicleNumber state
          />

          <Text style={styles.textValue}>Email Address</Text>
          <TextInput
            placeholder="user@gmail.com"
            placeholderTextColor="black"
            style={[styles.input, { width: 250 }, focusedInput === 'email' && styles.focusedInput, emailError && styles.errorInput]}
            onFocus={() => setFocusedInput('email')}
            onBlur={() => {
              setFocusedInput(null);
              validateEmail(); // Validate email onBlur
            }}
            onChangeText={(text) => {
              setEmail(text);
              setEmailError('');
            }}
            keyboardType="email-address"
          />
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

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
              if (reEnterPassword !== password) {
                setReEnterPasswordError('Passwords do not match');
              } else {
                setReEnterPasswordError('');
              }
            }}
            onChangeText={(text) => {
              setReEnterPassword(text);
              setReEnterPasswordError('');
            }}
          />
          {reEnterPasswordError ? <Text style={styles.errorText}>{reEnterPasswordError}</Text> : null}
        </View>

        <View style={styles.bottomContainer}>
          <TouchableOpacity style={[styles.button, { alignSelf: 'center' }]} onPress={handleSubmit}>
            <Text style={[styles.buttonText, styles.buttonTextBold]}>Sign Up</Text>
          </TouchableOpacity>


          

          <View style={styles.loginContainer}>
            <Text style={styles.normalText}>Already have an account? </Text>
            <TouchableOpacity onPress={navigateToSignIn}>
              <Text style={styles.linkText}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Modal to display when registration fails */}
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
            <TouchableOpacity onPress={() => { setModalVisibleOtpSucess(false); navigation.navigate('SignInPage'); }} style={styles.customButtonSucess}>
  <Text style={[styles.buttonText, {textAlign: 'center'}]}>Close</Text>
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
    backgroundColor: '#000', // Black background
  },
  innerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 50,
  },
  bottomContainer: {
    marginTop: 20,
    alignItems: 'center', // Center the items horizontally
  },
  title: {
    fontSize: 40,
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
    color: '#FFA500', // Change text color to yellow
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
  errorInput: {
    borderColor: 'red',
    borderWidth: 1,
  },
  errorText: {
    color: 'red',
    marginBottom: 5,
  },
  focusedInput: {
    borderColor: '#FFA500', // Yellow border color
    borderWidth: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
  },
 
  modalText: {
    marginBottom: 20,
    fontSize: 18,
    textAlign: 'center',
  },
  customButton: {
    backgroundColor: 'red', // Set the background color of the button to red
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
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

export default SignUpPage;
