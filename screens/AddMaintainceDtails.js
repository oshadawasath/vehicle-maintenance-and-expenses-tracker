import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ToastAndroid, TextInput, StatusBar, Alert,Modal ,SafeAreaView,} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios'; // Import axios for making HTTP requests
import baseUrl from '../baseUrl/baseUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';


const AddMaintainceDetails = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalVisibleOtpSucess, setModalVisibleOtpSucess] = useState(false);
    const [odometer, setOdometer] = useState('');
    const [loading, setLoading] = useState(false); // Add loading state

    const [state, setState] = useState({
        photo: '',
        note: '',
        cost: '',
        vehicleNumber: '', // Added state for vehicle number
    });

    const option = {
        mediaType: 'photo',
        quality: 1,
        saveToPhotos: true,
    }

    const toast = (msg) => {
        ToastAndroid.show(msg, ToastAndroid.SHORT)
    }

    const openCamera = () => {
        launchCamera(option, (res) => {
            if (res.didCancel) {
                toast('Take a picture canceled')
            } else if (res.errorCode) {
                toast('Error while taking an image', res.errorCode)
            } else {
                const photoUri = res.uri ? res.uri : res.assets[0].uri; // Handle both cases for image URI
                setState({ ...state, photo: photoUri });
            }
        });
    }

    const openGallery = () => {
        launchImageLibrary(option, (res) => {
            if (res.didCancel) {
                toast('Gallery open canceled')
            } else if (res.errorCode) {
                toast('Error while selecting an image', res.errorCode)
            } else {
                const photoUri = res.uri ? res.uri : res.assets[0].uri; // Handle both cases for image URI
                setState({ ...state, photo: photoUri });
            }
        });
    }

    const handleNoteChange = (text) => {
        setState({ ...state, note: text }); // Update the note value in state
    }

    const handleCostChange = (text) => {
        setState({ ...state, cost: text }); // Update the cost value in state
    }

    const handleSubmit = async () => {
        setLoading(true); // Set loading to true when submitting

        try {
            // Retrieve token, email, and plateNo from AsyncStorage
            const token = await AsyncStorage.getItem('token');
            const email = await AsyncStorage.getItem('email');
            const plateNo = await AsyncStorage.getItem('plateNo');
    
            // Check if note, cost, photo, or plateNo is empty or undefined
            if (!state.note || !state.cost || !state.photo || !plateNo) {
                toast('Please fill in all fields and select an image');
                setLoading(false); // Set loading to false after displaying the toast
                return; // Return early if any field is empty or undefined
            }
    
            const dataObject = {
                plateNo: plateNo,
                note: state.note,
                cost: state.cost,
            };
    
            const dataString = JSON.stringify(dataObject);
    
            const formData = new FormData();
            formData.append('data', dataString);
            formData.append('image', {
                uri: state.photo,
                type: 'image/jpeg',
                name: 'maintenance_image.jpg',
            });
    
            // Make POST request to submit maintenance details
            const response = await axios.post(`${baseUrl}/api/v1/maintaince/addMiantainceDetails`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`, // Include token in request header
                },
            });
    
            console.log(response.data.status);
            setModalMessage('successfully added');
            setModalVisibleOtpSucess(true);
            
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
            setLoading(false); // Set loading to false after submission is completed or failed
        }
    }
    return (
        <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#1e1e1e" barStyle="light-content" />

            <Text style={styles.heading}>Maintenance Details</Text>
            <Text style={styles.normalText}>Enter note about maintenance</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter note"
                placeholderTextColor="black"
                onChangeText={handleNoteChange} // Call handleNoteChange when the note text changes
                value={state.note} // Set the value of the note input field
            />
            <Text style={styles.normalText}>Enter cost </Text>
            <TextInput
                style={styles.input}
                placeholder="Enter cost"
                placeholderTextColor="black"
                onChangeText={handleCostChange} // Call handleCostChange when the cost text changes
                value={state.cost} // Set the value of the cost input field
                keyboardType="numeric" // Set keyboardType to 'numeric'
            />
            <View style={styles.imageContainer}>
                {state.photo ? (
                    <Image source={{ uri: state.photo }} style={styles.image} />
                ) : (
                    <Text>No image</Text>
                )}
            </View>
            <View style={styles.wrapBtn}>
                <TouchableOpacity onPress={openCamera}>
                    <Text style={styles.buttonText}>Open Camera</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={openGallery}>
                    <Text style={styles.buttonText}>Open Gallery</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.buttonSubmit} onPress={handleSubmit}>
                <Text style={styles.buttonTextSubmit}>Submit</Text>
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

export default AddMaintainceDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1e1e1e',
    },
    wrapBtn: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: 200,
        marginTop: 30,
        backgroundColor: "black",
        height: 45,
        alignItems: 'center',
        padding: 5,
        borderRadius: 7,
    },
    buttonText: {
        fontSize: 16,
        color: 'white',
    },
    imageContainer: {
        width: 190,
        height: 190,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        backgroundColor: '#FFA500',
        borderRadius: 10,
    },
    image: {
        width: 180,
        height: 180,
        resizeMode: 'cover',
        borderRadius: 10,
    },
    textTopic: {
        fontSize: 20,
        color: 'white',
        margin: 10,
    },
    heading: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#FFA500',
        marginTop: 1,
        marginBottom: 10,
    },
    input: {
        marginBottom: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 8,
        paddingHorizontal: 10,
        color: 'black',
        width: 250, // Added width to input fields
    },
    normalText: {
        fontSize: 16,
        color: 'white',
        marginTop: 5,
        marginBottom: 5,
    },
    buttonSubmit: {
        backgroundColor: '#FFA500',
        paddingVertical: 12,
        borderRadius: 40,
        margin: 10,
        width: 200,
    },
    buttonTextSubmit: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    },  modalContainer: {
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
