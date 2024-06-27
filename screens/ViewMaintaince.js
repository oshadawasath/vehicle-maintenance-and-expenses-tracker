import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, StatusBar, Image, ScrollView, TouchableOpacity, Alert, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import axios from 'axios'; // Import axios for making HTTP requests
import baseUrl from '../baseUrl/baseUrl'; // Import the baseUrl function

const ViewMaintainceDetails = () => {
  const [data, setData] = useState([]); // State to hold maintenance data
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalVisibleOtpSuccess, setModalVisibleOtpSuccess] = useState(false);
  const [odometer, setOdometer] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state

  useEffect(() => {
    const retrieveData = async () => {
      setLoading(true); // Set loading to true when request starts

      try {
        const storedToken = await AsyncStorage.getItem('token');
        const storedEmail = await AsyncStorage.getItem('email');
        const storedPlateNo = await AsyncStorage.getItem('plateNo');

        // Set token as default header for all axios requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;

        const response = await axios.post(`${baseUrl}/api/v1/maintaince/viewMaintaince`, {
          plateNo: storedPlateNo
        });

        setData(response.data.data); // Update state with response data
        console.log(response.data);
      } catch (error) {
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
      } finally {
        setLoading(false); // Set loading to false after request completes
      }
    };

    retrieveData();
  }, []); // Empty dependency array to run effect only once

  const handleDelete = async (id) => {
    setLoading(true); // Set loading to true when delete operation starts

    try {
      const storedToken = await AsyncStorage.getItem('token');
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;

      // Make a POST request to delete the maintenance item with the given id
      await axios.post(`${baseUrl}/api/v1/maintaince/deleteMaintaince`, {
        _id: id, // Use the passed id parameter

      });

      // If deletion is successful, update the data state or do any necessary operations
      // For example, if data is an array of maintenance items, you can filter out the deleted item
      const updatedData = data.filter(item => item._id !== id);
      setData(updatedData);
      setModalMessage('successfully delete');
      setModalVisibleOtpSuccess(true);
    } catch (error) {
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
    } finally {
      setLoading(false); // Set loading to false after delete operation completes
    }
  };

  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#222222" />
      <Text style={styles.title}>View Maintenance Details</Text>
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollView}>
          <View style={styles.subContainer}>
            {/* Render both time, photo, and delete button for each object */}
            {data.map((item) => (
              <View key={item._id} style={styles.itemContainer}>
                <Text style={styles.text}>Date: {formatDate(item.updatedAt)}</Text>
                <Text style={styles.text}>Note: {item.note}</Text>
                <Text style={styles.text}>Cost :Rs {item.cost}</Text>
                <Text style={styles.text}>Tag by: {item.userName}</Text>
                <Text style={styles.text}>Tag email: {item.userEmail}</Text>

                
                <Image source={{ uri: item.imageUrl }} style={styles.photo} />
                <TouchableOpacity onPress={() => handleDelete(item._id)} style={styles.deleteButton}>
                  <Text style={styles.deleteButtonText}>Delete this Record</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
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
        visible={modalVisibleOtpSuccess}
        onRequestClose={() => {
          setModalVisibleOtpSuccess(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={[styles.modalText, { color: 'black' }]}>{modalMessage}</Text>
            <TouchableOpacity onPress={() => setModalVisibleOtpSuccess(false)} style={styles.customButtonSuccess}>
              <Text style={[styles.buttonText, { textAlign: 'center' }]}>Close</Text>
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
    backgroundColor: '#222222', // Black background
  },
  title: {
    color: '#EEA818',
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
    backgroundColor: '#EEA818', //  background for each item
    marginBottom: 20,
    padding: 10,
    borderRadius: 15,
  },
  text: {
    color: '#fff', // White text color
    fontSize: 16, // Font size
    fontWeight: 'bold', // Bold font weight
    paddingTop: 5,
    paddingBottom: 5,
  },
  photo: {
    width: '100%', // Make the image take up full width
    aspectRatio: 16 / 9, // Example aspect ratio (adjust as needed)
    borderRadius: 10,
  },
  
  deleteButton: {
    backgroundColor: '#3B3B3B', // Dark gray button color
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
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
  customButtonSuccess:{
    backgroundColor: '#EEA818',
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

export default ViewMaintainceDetails;
