import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, Image, Alert } from "react-native";
import { Appbar, Button, IconButton, TextInput } from "react-native-paper";
import { useEffect } from "react";
import firestore from '@react-native-firebase/firestore';
import { white } from "react-native-paper/lib/typescript/styles/themes/v2/colors";
import storage from "@react-native-firebase/storage";
import ImageCropPicker from "react-native-image-crop-picker";
import {login,useMyContextController} from "../store";

const AddNewService = ({ navigation }) => {
  const [Name, setName] = useState('');
  const [price, setPrice] = useState('');
  const ref = firestore().collection('data-lab5');
  const [image, setImage] = useState("");
  const [patchImage, setPatchImage] = useState("");
  const[controller,dispatch]=useMyContextController()
  const{userLogin}= controller
  const handledAddStorage = async () => {
    try {
      if (!Name || !price || !patchImage) {
        Alert.alert("Please fill in all required fields.");
        return;
      }
  
      const response = await ref.add({
        Name,
        price,
        createBy: userLogin.role,
        image,
      });
  
      const imageRef = storage().ref(`/Services/${response.id}.png`);
      await imageRef.putFile(patchImage);
      const imageUrl = await imageRef.getDownloadURL();
      await ref.doc(response.id).update({ id: response.id, image: imageUrl });
  
      Alert.alert("Success!");
      navigation.navigate("Services");
    } catch (error) {
      Alert.alert("Failed!");
    }
  };
  

  const add = async () => {
    if (!Name || !price) {
      Alert.alert("Please enter service name and price before adding.");
      return;
    } else {
      Alert.alert("Success!");
    }

    const snapshot = await ref.get();
    const todoCount = snapshot.size;
    const newId = todoCount.toString();
    await ref.add({
      id: newId,
      price: price,
      name: Name,
      complete: false,
    });
    setPrice('');
    setName('');
  };

  const uploadImages = () => {
    ImageCropPicker.openPicker({
      cropping: true,
      width: 100,
      height: 100,
      mediaType: "photo"
    })
      .then(image => setPatchImage(image.path))
      .catch(e => console.log(e.message));
  };

  return (
    <View style={{ flex: 1 }}>
      <Appbar style={{ backgroundColor: "pink" }}>
        <IconButton icon="arrow-left" backgroundColor="white" onPress={() => navigation.navigate("Services")} />
        <Appbar.Content title={<Text style={{ color: 'white', textAlign: "center", fontSize: 20, textAlign: "left" }}>Service</Text>} />
      </Appbar>
      <ScrollView style={styles.scrollView} keyboardShouldPersistTaps='handled'>
        <View style={styles.inputContainer}>
          {patchImage !== "" &&
            <Image source={{ uri: patchImage }}
              resizeMode="contain"
              style={{ height: 100, width: 100 }}
            />
          }
          <Text></Text>
          <Text>Service name *</Text>
          <TextInput
            style={styles.input}
            placeholder={`Input a service name`}
            value={Name}
            onChangeText={(text) => setName(text)}
          />
          <Text></Text>
          <Text>Price *</Text>
          <TextInput
            style={styles.input}
            placeholder={`0`}
            value={price}
            onChangeText={(text) => setPrice(text)}
          />
          <Text></Text>
          <Button onPress={handledAddStorage} style={styles.addButton}>Add</Button>
<Button onPress={uploadImages} style={styles.uploadButton}>Upload</Button>

        </View>
      </ScrollView>
    </View>
  );
};

export default AddNewService;

const styles = StyleSheet.create({
  imageContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  scrollView: {
    flex: 1,
  },
  centerContent: {
    alignItems: 'center',
    backgroundColor: "lightgray",
    paddingVertical: 20,
  },
  inputContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'white',
  },
  addButton: {
    backgroundColor: "pink",
    marginBottom: 10, // Để tạo khoảng cách giữa nút "Add" và "Upload"
  },

  uploadButton: {
    backgroundColor: "lightblue", // Bạn có thể thay đổi màu sắc theo sở thích của mình
  },
});
