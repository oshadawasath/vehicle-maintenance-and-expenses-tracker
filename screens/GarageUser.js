import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ToastAndroid, TextInput, StatusBar ,Modal, ActivityIndicator } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import baseUrl from '../baseUrl/baseUrl';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GarageUser = () => {
    const [isLoading, setIsLoading] = useState(false); // State to track loading status
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalVisibleOtpSucess, setModalVisibleOtpSucess] = useState(false);
    const [state, setState] = useState({
        photo: '',
        note: '',
        cost: '',
        vehicleNumber: '',
    });

    const option = {
        mediaType: 'photo',
        quality: 1,
        saveToPhotos: true,
    }

    const toast = (msg) => {
        Alert.alert('Info', msg);
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
        setState({ ...state, note: text });
    }

    const handleCostChange = (text) => {
        setState({ ...state, cost: text });
    }

    const handleVehicleNumberChange = (text) => {
        setState({ ...state, vehicleNumber: text });
    }

    const handleSubmit = async () => {
        const storedUserEmail = await AsyncStorage.getItem('UserEmail');
        const storedToken = await AsyncStorage.getItem('token');
        const userName = await AsyncStorage.getItem('UserName');


        // Log the retrieved email to verify
        console.log('Stored User Email:', storedUserEmail);

        if (!state.note.trim() || !state.cost.trim() || !state.photo || !state.vehicleNumber.trim()) {
            toast('Please fill in all fields and select an image');
            return;
        }
        

        setIsLoading(true);

        const dataObject = {
            userEmail:storedUserEmail,
            plateNo: state.vehicleNumber, 
            note: state.note,
            cost: state.cost,
            userName:userName
        };

        const dataString = JSON.stringify(dataObject);

        const formData = new FormData();
        formData.append('data', dataString);
        formData.append('image', {
            uri: state.photo,
            type: 'image/jpeg',
            name: 'maintenance_image.jpg',
        });

        try {
            const response = await axios.post(`${baseUrl}/api/v1/tag/grageUserTag`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${storedToken}`, // Include token in request header

                },
            });
            setModalMessage("sucessfully added");

            setModalVisibleOtpSucess(true); // Set modalVisibleOtpSucess to true
        } catch (error) {
            console.log(error)
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
            setIsLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="black" barStyle="light-content" />

            <Text style={styles.heading}> Garage User</Text>
            <Text style={styles.textTopic}>Real time updates</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter vehicle number"
                placeholderTextColor="black"
                onChangeText={handleVehicleNumberChange}
                value={state.vehicleNumber}
            />
            <Text style={styles.normalText}>Enter note about maintenance</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter note"
                placeholderTextColor="black"
                onChangeText={handleNoteChange}
                value={state.note}
            />
            <Text style={styles.normalText}>Enter cost </Text>
            <TextInput
                style={styles.input}
                placeholder="Enter cost"
                placeholderTextColor="black"
                onChangeText={handleCostChange}
                value={state.cost}
                keyboardType="numeric"
            />
            <View style={styles.imageContainer}>
                {state.photo ? (
                    <Image source={{ uri: state.photo }} style={styles.image} />
                ) : (
                    <Text>No image</Text>
                )}
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={openCamera}>
                    <Text style={styles.buttonText}>Open Camera</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={openGallery}>
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

            {isLoading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#FFA500" />
                    <Text style={styles.loadingText}>Submitting...</Text>
                </View>
            )}
        </View>
    );
};
export default GarageUser;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#222222',
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
        marginTop: 10,
        marginBottom: 1,
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
        fontSize: 15,
        color: 'white',
        marginTop: 5,
        marginBottom: 5,
    },
    buttonContainer: {
        flexDirection: 'row', // Arrange buttons horizontally
        justifyContent: 'space-between', // Evenly distribute space between the buttons
        marginTop: 30,
    },
    button: {
        backgroundColor: '#FFA500',
        paddingVertical: 7,
        width: '38%', // Adjust the width of each button, ensuring there's some space between them
        borderRadius: 10,
        alignItems: 'center', // Center the text vertically
        margin: 5,
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
    },modalContainer: {
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
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#FFA500',
  },modalContainer: {
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
