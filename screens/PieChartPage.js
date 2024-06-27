
import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Platform, Modal,SafeAreaView,StatusBar } from 'react-native';
import { PieChart } from 'react-native-svg-charts';
import DateTimePicker from '@react-native-community/datetimepicker';
import baseUrl from '../baseUrl/baseUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const PieChartPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [data, setData] = useState(null); // Initialize data as null
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalVisibleOtpSucess, setModalVisibleOtpSucess] = useState(false);
  const [odometer, setOdometer] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state
  const [message, setMessage] = useState('Select  Date Range to Get Expenses');

  const getExpenseColor = (type) => {
    switch (type) {
      case 'fuel':
        return 'blue';
      case 'insurance':
        return 'green';
      case 'repair':
        return 'orange';
      case 'miscellaneous':
        return 'red';
      default:
        return 'gray';
    }
  };
  let chartData = null;
  if (data) {
    chartData = Object.keys(data.percentage).map((key, index) => ({
      key: index.toString(),
      value: data.percentage[key], // Use percentage value for each expense type
      svg: {
        fill: getExpenseColor(key),
      },
      arc: { outerRadius: '100%', padAngle: 0.03 },
    }));
  }
  const handleDateChange = async (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setSelectedDate(selectedDate);
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const year = selectedDate.getFullYear();
      const formattedDate = `${day}-${month}-${year}`;

      try {
        setLoading(true);
        const storedPlateNo = await AsyncStorage.getItem('plateNo');
        const storedToken = await AsyncStorage.getItem('token');

        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;

        const response = await axios.post(`${baseUrl}/api/v1/pieChart`, {
          plateNo: storedPlateNo,
          startDate: formattedDate
        });
        setMessage(); // Change the message when expenses are fetched successfully

        setData(response.data.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        if (error.response) {
          setModalMessage(error.response.data.comment);
          setModalVisible(true);
        } else if (error.request) {
          setModalMessage('Network error. Please check your internet connection.');
          setModalVisible(true);
        } else {
          setModalMessage('An error occurred. Please try again later.');
          setModalVisible(true);
        }
      }
    }
  };


  const showDateTimePicker = () => {
    setShowDatePicker(true);
  };

  return (
    <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#1e1e1e" barStyle="light-content" />

      <Text style={styles.topicText}>Pie Chart</Text>

      <TouchableOpacity style={styles.datePickerButton} onPress={showDateTimePicker}>
        <Text style={styles.datePickerButtonText}>Select Date</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={selectedDate}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={handleDateChange}
        />
      )}
      {data && (
        <>
          <PieChart style={{ height: 300, width: 300 }} data={chartData} />
          <View style={styles.legendContainer}>
            <Text style={styles.legendText}>Total cost(date range): Rs {data.totalCost}</Text>
            {Object.keys(data.percentage).map((type, index) => (
              <View key={index} style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: getExpenseColor(type) }]} />
                <Text style={styles.legendText}>{`${type}: ${data.percentage[type]}%   Cost: Rs ${data[type]} `}</Text>
              </View>
            ))}
          </View>
        </>
      )}
            <Text style={styles.messageText}>{message}</Text>

      
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
        visible={modalVisibleOtpSucess}
        onRequestClose={() => {
          setModalVisibleOtpSucess(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={[styles.modalText, { color: 'black' }]}>{modalMessage}</Text>
            <TouchableOpacity onPress={() => setModalVisibleOtpSucess(false)} style={styles.customButtonSucess}>
              <Text style={[styles.buttonText, { textAlign: 'center' }]}>Close</Text>
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
    backgroundColor: '#1e1e1e',
  },
  datePickerButton: {
    backgroundColor: '#FFA500',
    paddingVertical: 12,
    borderRadius: 8,
    margin: 15,
    width: 200,
  },
  datePickerButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 20,
  },
  legendContainer: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    marginTop: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    marginBottom: 10,
  },
  legendColor: {
    width: 20,
    height: 20,
    marginRight: 5,
    borderRadius: 3,
  },
  legendText: {
    fontSize: 16,
    color: 'white',
  }, modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
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
  },topicText:{
    fontSize:35,
    color:'#FFA500'
  },messageText: {
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 20,
  },
});

export default PieChartPage;
