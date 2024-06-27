import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, StatusBar, ScrollView, TouchableOpacity, Alert,Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import baseUrl from '../baseUrl/baseUrl'; // Import the baseUrl function

const ViewMaintenanceDetails = () => {
  const navigation = useNavigation();
  const [maintenanceData, setMaintenanceData] = useState([]);
  const [refresh, setRefresh] = useState(false); // State variable to trigger re-render
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalVisibleOtpSucess, setModalVisibleOtpSucess] = useState(false);
  const [loading, setLoading] = useState(false); // Add loading state

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear().toString().slice(2); // Extract last two digits of the year
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month starts from 0, so add 1 and pad with 0 if needed
    const day = date.getDate().toString().padStart(2, '0'); // Pad day with 0 if needed
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const retrieveData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const storedEmail = await AsyncStorage.getItem('email');
        const storedPlateNo = await AsyncStorage.getItem('plateNo'); // Corrected typo

        // Set token as default header for all axios requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;

        const response = await axios.post(`${baseUrl}/api/v1/notification/displayAll`, {
          plateNo: storedPlateNo
        });

        setMaintenanceData(response.data.data); // Update state with response data
      } catch (error) {
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

    retrieveData();
  }, [refresh]); // Include refresh in the dependency array

  const handleAccept = async (_id) => {
    try {
      const updatedData = maintenanceData.filter(item => item._id !== _id);
      const storedPlateNo = await AsyncStorage.getItem('plateNo');
      const storedToken = await AsyncStorage.getItem('token');

      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;

      await axios.post(`${baseUrl}/api/v1/notification/accept`, {
        _id: _id,
        plateNo: storedPlateNo
      });
      setModalMessage('Successfully Accept');
      setModalVisibleOtpSucess(true);
      setMaintenanceData(updatedData);
      setRefresh(prev => !prev); // Toggle refresh state to trigger re-render
    } catch (error) {
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

  const handleDecline = async (_id) => {
    try {
      const updatedData = maintenanceData.filter(item => item._id !== _id);
      const storedPlateNo = await AsyncStorage.getItem('plateNo');
      const storedToken = await AsyncStorage.getItem('token');

      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;

      await axios.post(`${baseUrl}/api/v1/notification/deleteOne`, {
        _id: _id,
        plateNo: storedPlateNo
      });
      setModalMessage('Successfully Delete');
      setModalVisibleOtpSucess(true);
      setMaintenanceData(updatedData);
      setRefresh(prev => !prev); // Toggle refresh state to trigger re-render
    } catch (error) {
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

  const handleView = async (_id) => {
    try {
      const updatedData = maintenanceData.filter(item => item._id !== _id);
      const storedPlateNo = await AsyncStorage.getItem('plateNo');
      const storedToken = await AsyncStorage.getItem('token');

      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;

      await axios.post(`${baseUrl}/api/v1/notification/viewOne`, {
        _id: _id,

        plateNo: storedPlateNo
      });
  
      setMaintenanceData(updatedData);
      setRefresh(prev => !prev); // Toggle refresh state to trigger re-render
    } catch (error) {
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
    <View style={styles.container}>
      <StatusBar backgroundColor="#1e1e1e" barStyle="light-content" />
      <Text style={styles.title}>Notifcation</Text>
      <ScrollView style={styles.scrollView}>
        <View style={styles.subContainer}>
          {maintenanceData.map((item) => (
            <View key={item._id} style={[styles.itemContainer, { backgroundColor: item.notificationFlag ? '#a9a9a9' : '#EEA818' }]}>
<Text style={[styles.text, { color: item.viewFlag ? 'white' : 'black' }]}>Date: {formatDate(item.date)}</Text>
              <Text style={[styles.text, { color: item.viewFlag ? 'white' : 'black' }]}>Note: {item.note}</Text>
              <Text style={[styles.text, { color: item.viewFlag ? 'white' : 'black' }]}>Tag by: {item.userName}</Text>
              <Text style={[styles.text, { color: item.viewFlag ? 'white' : 'black' }]}>Tag email: {item.userEmail}</Text>

              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => handleAccept(item._id)} style={[styles.button, styles.acceptButton]}>
                  <Text style={styles.buttonText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDecline(item._id)} style={[styles.button, styles.declineButton]}>
                  <Text style={styles.buttonText}>Decline</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleView(item._id)} style={[styles.button, styles.viewButton]}>
                  <Text style={styles.buttonText}>View</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222222',
  },
  title: {
    color: '#FFA500',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  subContainer: {
    paddingHorizontal: 20,
  },
  itemContainer: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 15,
    backgroundColor: '#EEA818',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingTop: 5,
    paddingBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
    marginRight: 5,
  },
  declineButton: {
    backgroundColor: '#F44336',
    marginRight: 5,
  },
  viewButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
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
    width:'80%',
    maxWidth:400,
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
  }, modalText: {
    marginBottom: 10,
    fontSize: 18,
    textAlign: 'center',
    
  }
  
});

export default ViewMaintenanceDetails;
