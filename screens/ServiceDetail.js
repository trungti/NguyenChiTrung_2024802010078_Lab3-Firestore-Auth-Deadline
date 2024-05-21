import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, Alert } from "react-native";
import { Appbar, Button, HelperText, IconButton, TextInput, Dialog, Portal, Paragraph } from "react-native-paper";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import ImagePicker from "react-native-image-crop-picker";
import { MenuProvider, Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';

const ServiceDetail = ({ navigation, route }) => {
    const { id } = route.params.item;
    const [service, setService] = useState({ Name: '', image: '', price: 0 });
    const [visible, setVisible] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [previousImageUrl, setPreviousImageUrl] = useState('');

    const hasErrorServiceName = () => service.serviceName === "";
    const hasErrorPrice = () => service.price <= 0;

    const SERVICES = firestore().collection("data-lab5");
    const deleteService = () => {
        SERVICES.doc(id)
            .delete()
            .then(() => {
                setVisible(false);
                navigation.navigate("Services");
            });
    };
    useEffect(() => {
        const unsubscribe = SERVICES.doc(id).onSnapshot(response => {
            const data = response.data();
            if (data && data.image) {
                setService(data);
                setPreviousImageUrl(data.image);
            }
        });
        return () => unsubscribe();
    }, [id]);
    

    useEffect(() => {
        if (updateSuccess) {
            Alert.alert("Success", "Service updated successfully", [
                { text: "OK", onPress: () => navigation.navigate("Services") }
            ]);
            setUpdateSuccess(false);
        }
    }, [updateSuccess]);


    const showDialog = () => setVisible(true);
    const hideDialog = () => setVisible(false);

    const uploadImage = () => {
        ImagePicker.openPicker({
            mediaType: "photo",
            width: 400,
            height: 300,
        }).then(image => setService({ ...service, image: image.path }));
    };

    const updateService = () => {
        if (service.image === '' && previousImageUrl === '') {
            Alert.alert("Error", "Please upload an image before updating the service.");
            return; // Dừng lại nếu người dùng chưa chọn ảnh mới
        }

        if (service.image === '' && previousImageUrl !== '') {
            SERVICES.doc(id)
                .update({ ...service, image: previousImageUrl })
                .then(() => setUpdateSuccess(true))
                .catch(e => console.log(e.message));
        } else {
            const refImage = storage().ref("/Services/" + id + ".png");
            refImage.putFile(service.image)
                .then(() => {
                    refImage.getDownloadURL()
                        .then(link =>
                            SERVICES.doc(id)
                                .update({ ...service, image: link })
                                .then(() => setUpdateSuccess(true))
                                .catch(e => console.log(e.message))
                        );
                })
                .catch(e => console.log(e.message));
        }
    };

    return (
        (service != null) &&
        <MenuProvider>
            <View style={{ flex: 1, padding: 10 }}>
                <Appbar style={{ backgroundColor: "pink" }}>
                    <IconButton icon="arrow-left" backgroundColor="white" onPress={() => navigation.navigate("Services")} />
                    <Appbar.Content title={<Text style={{ color: 'white', textAlign: "center", fontSize: 20 }}>Service Detail</Text>} />
                    <Menu>
                        <MenuTrigger>
                            <IconButton icon="dots-vertical" />
                        </MenuTrigger>
                        <MenuOptions>
                            <MenuOption onSelect={showDialog} text="Delete" />
                        </MenuOptions>
                    </Menu>
                </Appbar>
                <ScrollView>
                    <Button onPress={uploadImage} style={{ backgroundColor: 'blue', marginTop: 10, padding: 10, borderRadius: 5 }}>
                        <Text style={{ color: 'white', textAlign: 'center' }}>Upload Image</Text>
                    </Button>
                    {(service.image != "") &&
                        <Image source={{ uri: service.image }}
                            style={{ width: 300, height: 400 }}
                            resizeMode={"contain"} />
                    }
                    <TextInput
                        label={"Service Name"}
                        value={service.Name}
                        onChangeText={(text) => setService({ ...service, serviceName: text })}
                    />
                    <HelperText type="error" visible={hasErrorServiceName()}>
                        Service Name cannot be empty
                    </HelperText>
                    <TextInput
                        keyboardType="numeric"
                        label={"Price"}
                        value={service.price.toString()}
                        onChangeText={(text) => setService({ ...service, price: parseInt(text) })}
                    />
                    <HelperText type="error" visible={hasErrorPrice()}>
                        Price must be greater than 0
                    </HelperText>
                    <Button onPress={updateService} style={{ backgroundColor: 'green', marginTop: 10, padding: 10, borderRadius: 5 }}>
                        <Text style={{ color: 'white', textAlign: 'center' }}>Update Service</Text>
                    </Button>
                </ScrollView>
                <Portal>
                    <Dialog visible={visible} onDismiss={hideDialog}>
                        <Dialog.Title>Confirm</Dialog.Title>
                        <Dialog.Content>
                            <Paragraph>HÃY XÓA DỊCH VỤ NÀY</Paragraph>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={hideDialog}>Cancel</Button>
                            <Button onPress={deleteService}>Delete</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </View>
        </MenuProvider>
    );
};

export default ServiceDetail;
