import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity ,StatusBar} from 'react-native';

const ProfilePage = ({ navigation }) => {
  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="black" barStyle="light-content" />

      <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      <View style={styles.content}>
        <Text style={styles.title}>Profile</Text>
        <Image
          source={{ uri: 'https://via.placeholder.com/150' }} // Placeholder image URL
          style={styles.profileImage}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.username}>Vehicle number: 12345</Text>
          <Text style={styles.email}>Gmail: Vishmi@gmail.com</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    paddingTop: 20,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    backgroundColor: "#FFA500",
    width: 70,
    height: 35,
    borderRadius: 7,
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    left: -80, // Adjusted to align with the left edge
    
    
  },
  backButtonText: {
    fontSize: 18,
    color: 'white',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFA500', // Text color for the title
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  profileInfo: {
    alignItems: 'center',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'white', // Text color for username
  },
  email: {
    fontSize: 18,
    marginBottom: 5,
    color: 'white', // Text color for email
  },
});

export default ProfilePage;
