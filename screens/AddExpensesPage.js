import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput, StatusBar, TouchableOpacity, Modal, ActivityIndicator,SafeAreaView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RadioButton } from 'react-native-paper';
import baseUrl from '../baseUrl/baseUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';



const AddExpensesPage = () => {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedExpenseType, setSelectedExpenseType] = useState('fuel');
  const [note, setNote] = useState('');
  const [totalCost, setTotalCost] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalVisibleOtpSucess, setModalVisibleOtpSucess] = useState(false);
  const [odometer, setOdometer] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);

    // Format the date to dd-mm-yyyy
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const year = currentDate.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;

    console.log(formattedDate);
  };

  const handleSubmit = async () => {
    if (!note.trim() || !totalCost.trim()) {
      alert('Note or Total Cost are required!');
      return; // Prevent submission
    }

    setLoading(true); // Set loading to true when submission starts

    try {
      const storedPlateNo = await AsyncStorage.getItem('plateNo');
      const storedEmail = await AsyncStorage.getItem('email');
      const storedToken = await AsyncStorage.getItem('token');


      const formattedDate =
        date.getDate().toString().padStart(2, '0') + '-' +
        (date.getMonth() + 1).toString().padStart(2, '0') + '-' +
        date.getFullYear().toString();

        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
  

      const response = await axios.post(`${baseUrl}/api/v1/expenses`, {
        plateNo: storedPlateNo,
        date: formattedDate,
        odometer: odometer,
        totalCost: parseFloat(totalCost),
        selectedExpenseType: selectedExpenseType,
        note: note
      });

      console.log(response.data.comment)
      setModalMessage('successfully added');
      setModalVisibleOtpSucess(true);
    } catch (error) {
      console.error('Error sending :', error.message);
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
    } finally {
      setLoading(false); // Set loading to false after submission completes
    }
  };

  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#1e1e1e" barStyle="light-content" />

      <Text style={styles.heading}>Add Expenses</Text>
      <View style={styles.datePickerContainer}>
        <Button title="Select Date" color="#FFA500" onPress={() => setShowDatePicker(true)} />
        {showDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={handleDateChange}
          />
        )}
        <Text style={styles.textValue}>Selected date: {date.toDateString()}</Text>

        <Text style={[styles.textValue, styles.marginBottom]}>Odometer</Text>
        <TextInput
  style={[styles.input, styles.marginBottom]}
  placeholder="Enter mileage (KM)"
  keyboardType="numeric"
  placeholderTextColor="black"
  value={odometer}  // Set the value prop to display the current value of odometer
  onChangeText={setOdometer}  // Assign setOdometer function to onChangeText to update the odometer state
/>

        <Text style={[styles.textValue, styles.marginBottom]}>Note</Text>
        <TextInput
          style={[styles.input, styles.marginBottom]}
          placeholder="Enter note"
          multiline={true}
          placeholderTextColor="black"
          value={note}
          onChangeText={setNote}
        />
        <Text style={[styles.textValue, styles.marginBottom]}>Total cost</Text>
        <TextInput
          style={[styles.input, styles.marginBottom]}
          placeholder="Enter cost"
          keyboardType="numeric"
          placeholderTextColor="black"
          value={totalCost}
          onChangeText={setTotalCost}
        />

        <View style={styles.radioContainer}>
          <Text style={styles.textValue}>Expenses Type:</Text>
          <View style={styles.radioButtons}>
            <View style={styles.radioButton}>
              <RadioButton
                value="fuel"
                status={selectedExpenseType === 'fuel' ? 'checked' : 'unchecked'}
                onPress={() => setSelectedExpenseType('fuel')}
                color="#FFA500" // Change the color of the checked radio button
              />
              <Text style={styles.radioText}>Fuel</Text>
            </View>
            <View style={[styles.radioButton, styles.insuranceButton]}>
              <RadioButton
                value="insurance"
                status={selectedExpenseType === 'insurance' ? 'checked' : 'unchecked'}
                onPress={() => setSelectedExpenseType('insurance')}
                color="#FFA500" // Change the color of the checked radio button
              />
              <Text style={styles.radioText}>Insurance</Text>
            </View>
          </View>
          <View style={styles.radioButtons}>
            <View style={styles.radioButton}>
              <RadioButton
                value="repair"
                status={selectedExpenseType === 'repair' ? 'checked' : 'unchecked'}
                onPress={() => setSelectedExpenseType('repair')}
                color="#FFA500" // Change the color of the checked radio button
              />
              <Text style={styles.radioText}>Repair</Text>
            </View>
            <View style={styles.radioButton}>
              <RadioButton
                value="miscellaneous"
                status={selectedExpenseType === 'miscellaneous' ? 'checked' : 'unchecked'}
                onPress={() => setSelectedExpenseType('miscellaneous')}
                color="#FFA500" // Change the color of the checked radio button
              />
              <Text style={styles.radioText}>Miscellaneous</Text>
            </View>
          </View>
          <View style={styles.radioButtons}>
            <View style={styles.radioButton}>
              <RadioButton
                value="other"
                status={selectedExpenseType === 'other' ? 'checked' : 'unchecked'}
                onPress={() => setSelectedExpenseType('other')}
                color="#FFA500" // Change the color of the checked radio button
              />
              <Text style={styles.radioText}>Other</Text>
            </View>
          </View>
        </View>

        <View style={styles.submitBtnContainer}>
          <Button title="Submit" onPress={handleSubmit} color="#FFA500" />
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFA500',
    marginTop: 10,
    marginBottom: 20,
  },
  datePickerContainer: {
    marginVertical: 10,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 8,
    paddingHorizontal: 10,
    color: 'black',
    width: 250,
    marginVertical: 5,
  },
  textValue: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 10,
  },
  radioContainer: {
    marginVertical: 10,
  },
  radioButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  radioText: {
    color: '#FFFFFF',
    marginLeft: 10,
  },
  marginBottom: {
    marginBottom: 10,
  },
  submitBtnContainer: {
    marginTop: 15,
    width: 150, // Set width 
    backgroundColor: '#FFA500',
    borderRadius: 10,
    paddingVertical: 5,
    marginBottom: 10,
    alignSelf: 'center', // Center the container horizontally
  },insuranceButton: {
    marginLeft: 12, // Adjust the margin 
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
  modalText: {
    marginBottom: 20,
    fontSize: 18,
    textAlign: 'center',
    
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
  },
  
});

export default AddExpensesPage;
