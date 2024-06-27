import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Modal, Pressable } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseUrl from '../baseUrl/baseUrl';

const ChangeProfile = () => {
  const [currentEmail, setCurrentEmail] = useState('');
  const [currentVehicleNumber, setCurrentVehicleNumber] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [focusedInput, setFocusedInput] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalVisibleOtpSucess, setModalVisibleOtpSucess] = useState(false);

  const handleFocus = (inputName) => {
    setFocusedInput(inputName);
  };

  const handleBlur = () => {
    setFocusedInput(null);
  };

  const handleUpdate = async () => {
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(currentEmail)) {
      setEmailError('Invalid email address');
      return;
    } else {
      setEmailError('');
    }

    try {
      const storedToken = await AsyncStorage.getItem('token');

      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      const response = await axios.post(`${baseUrl}/api/v1/user/changeAccount`, {
        plateNo: currentVehicleNumber,
        email: currentEmail,
        password: currentPassword,
        newEmail: newEmail,
        newPassword: newPassword
      });

      console.log('Response from backend:', response.data);
      setModalMessage('Successfully Update');
      setModalVisibleOtpSucess(true);
    } catch (error) {
      console.error('Error updating account details:', error);
      if (error.response) {
        console.log(error.response.data.comment);
        setModalMessage(error.response.data.comment);
        setModalVisible(true);
      } else if (error.request) {
        console.error('Network error:', error.request);
        setModalMessage('Network error. Please check your internet connection.');
        setModalVisible(true);
      } else {
        console.error('Error:', error.message);
        setModalMessage('An error occurred. Please try again later.');
        setModalVisible(true);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Change Profile</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Current Vehicle Number:</Text>
        <TextInput
          style={[styles.input, focusedInput === 'currentVehicleNumber' ? { borderColor: 'yellow' } : null]}
          value={currentVehicleNumber}
          onChangeText={setCurrentVehicleNumber}
          onFocus={() => handleFocus('currentVehicleNumber')}
          onBlur={handleBlur}
          placeholder="Enter current vehicle number"
          placeholderTextColor="black"
          autoCapitalize="characters"
          selectionColor="black"
          color="black"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Current Email:</Text>
        <TextInput
          style={[styles.input, focusedInput === 'currentEmail' ? { borderColor: 'yellow' } : null]}
          value={currentEmail}
          onChangeText={setCurrentEmail}
          onFocus={() => handleFocus('currentEmail')}
          onBlur={handleBlur}
          placeholder="Enter current email"
          placeholderTextColor="black"
          keyboardType="email-address"
          autoCapitalize="none"
          selectionColor="black"
          color="black"
        />
        {emailError ? <Text style={styles.error}>{emailError}</Text> : null}
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Current Password:</Text>
        <TextInput
          style={[styles.input, focusedInput === 'currentPassword' ? { borderColor: 'yellow' } : null]}
          value={currentPassword}
          onChangeText={setCurrentPassword}
          onFocus={() => handleFocus('currentPassword')}
          onBlur={handleBlur}
          placeholder="Enter current password"
          placeholderTextColor="black"
          secureTextEntry={true}
          autoCapitalize="none"
          selectionColor="black"
          color="black"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>New Email:</Text>
        <TextInput
          style={[styles.input, focusedInput === 'newEmail' ? { borderColor: 'yellow' } : null]}
          value={newEmail}
          onChangeText={setNewEmail}
          onFocus={() => handleFocus('newEmail')}
          onBlur={handleBlur}
          placeholder="Enter new email"
          placeholderTextColor="black"
          keyboardType="email-address"
          autoCapitalize="none"
          selectionColor="black"
          color="black"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>New Password:</Text>
        <TextInput
          style={[styles.input, focusedInput === 'newPassword' ? { borderColor: 'yellow' } : null]}
          value={newPassword}
          onChangeText={setNewPassword}
          onFocus={() => handleFocus('newPassword')}
          onBlur={handleBlur}
          placeholder="Enter new password"
          placeholderTextColor="black"
          secureTextEntry={true}
          autoCapitalize="none"
          selectionColor="black"
          color="black"
        />

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
  <Text style={[styles.buttonText, {textAlign: 'center'}]}>Close</Text>
</TouchableOpacity>

          </View>
        </View>
      </Modal>


      </View>
      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Update</Text>
      </TouchableOpacity>

      {/* Modal for showing messages */}
    
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e1e1e',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFA500',
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
    color: 'white',
  },
  inputContainer: {
    marginBottom: 20,
    width: '80%',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#FFA500',
    paddingVertical: 10,
    paddingHorizontal: 45,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  error: {
    color: 'red',
    fontSize: 14,
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

export default ChangeProfile;
