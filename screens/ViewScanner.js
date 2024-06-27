import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert, StatusBar, TextInput } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import descriptions from '../MLDescription/mlDescription';

const GarageUser = () => {
    const [state, setState] = useState({
        photo: '',
        responseText: '', // Added state for response text
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
        launchCamera(option, handleImageSelection);
    }

    const openGallery = () => {
        launchImageLibrary(option, handleImageSelection);
    }

    const handleImageSelection = (res) => {
        if (res.didCancel) {
            toast('Operation canceled');
        } else if (res.errorCode) {
            toast('Error occurred', res.errorCode);
        } else {
            const photoUri = res.uri ? res.uri : res.assets[0].uri;
            setState({ ...state, photo: photoUri, responseText: '' }); // Clear responseText state
        }
    }

    const handleSubmit = () => {
        if (!state.photo) {
            toast('Please select an image');
            return;
        }
    
        const formData = new FormData();
        formData.append('image', {
            uri: state.photo,
            type: 'image/jpeg',
            name: 'maintenance_image.jpg',
        });
    
        axios.post(`http://18.191.195.183:5000/predict`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .then(response => {
            console.log(response.data);
            const className = response.data.class;

            // Find the description value for the className
            const descriptionObj = descriptions.find(item => item.key === className);
            if (descriptionObj) {
                setState({ ...state, responseText: descriptionObj.value });
            } else {
                setState({ ...state, responseText: 'Description not found' });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Alert.alert('Error', error.message || 'Failed to submit');
        });
    }
    
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="black" barStyle="light-content" />
            <Text style={styles.heading}> Get Dashboard Info</Text>
            {state.photo ? (
                <Image source={{ uri: state.photo }} style={styles.image} />
            ) : (
                <Text style={styles.textTopic}>Add photo here</Text>
            )}
           
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
            {state.responseText ? (
                <View style={styles.textInputContainer}>
                    <TextInput
                        style={styles.descriptionInput}
                        value={state.responseText}
                        placeholder="Response text"
                        editable={false}
                        multiline={true}
                    />
                </View>
            ) : null}
        </View>
    );
};

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
    textTopic: {
        fontSize: 20,
        color: 'white',
        margin: 10,
    },
    heading: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFA500',
        marginTop: 10,
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30,
    },
    button: {
        backgroundColor: '#FFA500',
        paddingVertical: 7,
        width: '38%',
        borderRadius: 10,
        alignItems: 'center',
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
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 20,
        borderRadius: 10,
    },
    textInputContainer: {
        backgroundColor: '#FFF',
        padding: 10,
        borderRadius: 10,
        marginTop: 20,
        width: '80%',
        height: 150,
    },
    descriptionInput: {
        flex: 1,
        textAlignVertical: 'top',
        fontSize:18,
        color:'black'
    },
});

export default GarageUser;
