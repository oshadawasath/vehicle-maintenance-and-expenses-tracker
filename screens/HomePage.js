import React, { useState, useEffect } from "react";
import { TouchableOpacity, Image, StyleSheet, Text, View, Alert,StatusBar } from "react-native";
import { useNavigation,useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import baseUrl from '../baseUrl/baseUrl';


function CustomButton({ title, onPress }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

function NotificationButton({ onPress, hasUnreadNotifications }) {
  return (
    <TouchableOpacity
      style={[
        styles.notificationButton,
        hasUnreadNotifications ? styles.notificationButtonUnread : null // Apply styles conditionally
      ]}
      onPress={onPress}
    >
      <Text style={styles.notificationButtonText}>Notification</Text>
    </TouchableOpacity>
  );
}

function HomePage() {
  const navigation = useNavigation();
  const [unreadNotifications, setUnreadNotifications] = useState(true);
  const [storedToken, setStoredToken] = useState(null);
  const [storedEmail, setStoredEmail] = useState(null);
  const [storedPlateNo, setStoredPlateNo] = useState(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    const retrieveData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const email = await AsyncStorage.getItem('email');
        const plateNo = await AsyncStorage.getItem('plateNo');

        const response = await axios.post(`${baseUrl}/api/v1/notification/notificationIdentifiy`, {
          plateNo: plateNo // Using vehicleNumber in the request
        });

        if (token && email && plateNo) {
          setStoredToken(token);
          setStoredEmail(email);
          setStoredPlateNo(plateNo);

          // Assuming response.data.data is a boolean value indicating unread notifications
          setUnreadNotifications(response.data.data);
        } else {
          // Handle case where data is not available
          console.log('Token, email, or plateNo is missing.');
        }
      } catch (error) {
        console.error('Error retrieving data:', error);
        // Handle error appropriately, e.g., show an error message
        Alert.alert('Error', 'Failed to retrieve data. Please try again later.');
      }
    };

    if (isFocused) {
      retrieveData();
    }
  }, [isFocused]);

  const handleAddExpenses = () => {
    navigation.navigate('AddExpensesPage');
  };

  const handleAddMaintenances = () => {
    navigation.navigate('AddMaintainceDetails');
  };

  const handleViewMaintenances = () => {
    navigation.navigate('ViewMaintainceDetails');
  };

  const handleViewExpences = () => {
    navigation.navigate('PieChartPage');
  };
  const handleDashboard =()=>{
    navigation.navigate('ViewScanner');

  }

  const handleNotification = () => {
    // Implement notification functionality here
    // For example, mark notifications as read
    // setUnreadNotifications(false);
    
    navigation.navigate('ViewNotifications');
  };

  const handleChangeProfile = () => {
    // Implement notification functionality here
    // For example, mark notifications as read
    // setUnreadNotifications(false);
    
    navigation.navigate('ChangeProfile');
  };
  const vehicleNumber = storedPlateNo; // Corrected here

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      <Image
        source={require('../assets/assets/homebackground.png')}
        style={styles.backgroundImage}
      />
      <Image
        source={require('../assets/assets/drivelankalogo.png')}
        style={styles.logo}
      />
      
      <Text style={styles.text}>DRIVE  LANKA</Text>

      <View style={styles.vehicleNumberContainer}>
        <Text style={styles.vehicleNumberText}>Plate No: {vehicleNumber}</Text>
        <NotificationButton
          onPress={handleNotification}
          hasUnreadNotifications={unreadNotifications}
        />
      </View>
      {/* New Profile button */}
      <View style={styles.buttonContainer2}>
      <CustomButton title="Change Profile" style={styles.profileButton}     onPress={handleChangeProfile}/>
      </View>

      <View style={styles.buttonContainer}>
        <View style={styles.buttonWrapper}>
          <View style={styles.buttonBox}>
            <CustomButton title="Add Expenses" onPress={handleAddExpenses} />
          </View>
        </View>
        <View style={styles.buttonWrapper}>
          <View style={styles.buttonBox}>
            <CustomButton title="Add Maintenances" onPress={handleAddMaintenances} />
          </View>
        </View>
      </View>
      

      <View style={styles.additionalButtonContainer}>
        <CustomButton title="Get Dashboard Indicator Info" onPress={handleDashboard} />
      </View>
      

      <View style={styles.bottomButtonContainer}>
        <View style={styles.whiteSquare}>
          <CustomButton title="View Expenses" onPress={handleViewExpences} />
        </View>
        <View style={styles.whiteSquare}>
          <CustomButton title="Maintenance Record" onPress={handleViewMaintenances} />
        </View>
        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      position: 'relative',
    },
    logo: {
      position: 'absolute',
      top: 0,
      left: 10,
      width: 150,
      height: 120,
      zIndex: 1,
    },
    backgroundImage: {
      flex: 1,
      width: '100%',
      height: '100%',
    },
    text: {
      position: 'absolute',
      textAlign: 'center',
      top: 12,
      right: 5,
      color: '#FAA500',
      fontSize: 25,
      padding: 10,
      zIndex: 1,
      fontStyle: 'italic',
      textAlign: 'center',
    },
    buttonContainer: {
      position: 'absolute',
      top: '25%',
      left: '12%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      transform: [{ translateX: -50 }, { translateY: -50 }],
      zIndex: 2,
    },
    buttonContainer2: {
      position: 'absolute',
      top: 90,
      right: 0,
      transform: [{ translateX: -20 }],
    },
    buttonBox: {
      backgroundColor: 'rgba(250, 165, 0, 0.5)',
      padding: 10,
      borderRadius: 20,
      height: 130,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonWrapper: {
      flex: 1,
      marginVertical: 50,
      marginHorizontal: 10,
    },
    button: {
      backgroundColor: '#FFA500',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 10,
      width: '100%',
    },
    buttonText: {
      color: 'black',
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    vehicleNumberContainer: {
      position: 'absolute',
      top: 90,
      left: 10,
      padding: 10,
      backgroundColor: 'rgba(250, 165, 0, 0.5)',
      borderRadius: 10,
      zIndex: 2,
      flexDirection: 'row',
      alignItems: 'center',
    },
    vehicleNumberText: {
      color:'white',
      fontSize: 14,
      fontWeight: 'bold',
      marginRight: 10,
    },
    notificationButton: {
      backgroundColor: '#FFA500',
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 10,
    },
    notificationButtonText: {
      color: 'black',
      fontSize: 12,
      fontWeight: 'bold',
    },
    notificationButtonUnread: {
      backgroundColor: 'red',
    },
    additionalButtonContainer: {
      position: 'absolute',
      top: '57%',
      left: '10%',
      right: '10%',
      alignItems: 'center',
      zIndex: 2,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    bottomButtonContainer: {
      position: 'absolute',
      bottom: 20,
      left: 0,
      right: 0,
    },
    whiteSquare: {
      backgroundColor: '#525252',
      alignItems: 'center',
      padding: 20,
      borderRadius: 20,
      marginVertical: 10,
      marginHorizontal: 25,
    },
    vehicleNumberText: {
      color: 'black',
      fontSize: 18,
      padding: 3,
    },
    CustomButton: {},
    profileButton: {
      
    },
});


export default HomePage;