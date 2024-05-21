import { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, StyleSheet, ToastAndroid } from "react-native";
import { Appbar, Button, IconButton, TextInput } from "react-native-paper";
import firestore from "@react-native-firebase/firestore";
import DatePicker from "react-native-date-picker";
import { useMyContextController } from "../store";

const Appointment = ({ navigation, route }) => {
    const { id } = route.params.item;
    const [service, setService] = useState({});
    const [dateTime, setDateTime] = useState(new Date());
    const [open, setOpen] = useState(false);
    const SERVICES = firestore().collection("data-lab5");
    const APPOINTMENTS = firestore().collection("APPOINTMENTS-lab5");
    const [controller, dispatch] = useMyContextController();
    const { userLogin } = controller;

    useEffect(() => {
        const unsubscribe = SERVICES.doc(id).onSnapshot(response => {
            setService(response.data());
        });
        return () => unsubscribe();
    }, [id]);

    const AddNewAppointment = () => {
        APPOINTMENTS.add({
            customerID: userLogin.email,
            serviceID: id,
            datetime: dateTime,
            state: "new"
        })
        .then(docRef => {
            docRef.update({ id: docRef.id });
            // Hiển thị thông báo
            ToastAndroid.show("Cuộc hẹn đã được cập nhật thành công!", ToastAndroid.SHORT);
        })
        .catch(error => {
            console.error("Error adding document: ", error);
            // Hiển thị thông báo lỗi nếu có
            ToastAndroid.show("Đã xảy ra lỗi khi cập nhật cuộc hẹn.", ToastAndroid.SHORT);
        });
    };
    

    return (
        service != null &&
        <View style={styles.container}>
             <Appbar style={{ backgroundColor: "pink" }}>
                    <IconButton icon="arrow-left" backgroundColor="white" onPress={() => navigation.navigate("ServicesCustomer")} />
                    <Appbar.Content title={<Text style={{ color: 'white', textAlign: "center", fontSize: 20 }}>Service Detail</Text>} />
                    </Appbar>
                    
            <ScrollView>
                {service.image !== "" &&
                    <Image
                        source={{ uri: service.image }}
                        style={styles.image}
                        resizeMode="contain"
                    />
                }
                <Text style={styles.label}>Service Name:</Text>
                <Text style={styles.value}>{service.Name}</Text>
                
                <Text style={styles.label}>Price:</Text>
                <Text style={styles.value}>{service.price}</Text>
                <View style={styles.dateTimeContainer}>
                    <TextInput
                        style={styles.dateTimeInput}
                        value={dateTime.toDateString()}
                        onChangeText={text => setDateTime(new Date(text))}
                    />
                    <Button
                        mode="contained"
                        style={styles.dateButton}
                        onPress={() => setOpen(true)}
                    >
                        Chọn ngày
                    </Button>
                </View>
                <DatePicker
                    modal
                    open={open}
                    date={dateTime}
                    onConfirm={(date) => {
                        setOpen(false);
                        setDateTime(date);
                    }}
                    onCancel={() => {
                        setOpen(false);
                    }}
                />

                <Button
                    mode="contained"
                    onPress={AddNewAppointment}
                >
                    Update Service
                </Button>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    image: {
        width: 300,
        height: 400,
        alignSelf: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
    },
    value: {
        fontSize: 16,
        marginBottom: 10,
    },
    dateTimeContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 10,
    },
    dateTimeInput: {
        width: 250,
        marginLeft: 10,
    },
    dateButton: {
        marginLeft: 10,
        backgroundColor: "#6200ee", // Adjust color as needed
    },
});

export default Appointment;
