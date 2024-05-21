import React, { useEffect, useState } from "react";
import { Alert, View } from "react-native";
import { Button, HelperText, Text, TextInput } from "react-native-paper";
import { login, useMyContextController } from "../store";

const Login = ({ navigation }) => {
    const [controller, dispatch] = useMyContextController();
    const { userLogin } = controller;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState("");
    const hasErrorEmail = () => !email.includes("@");
    const hasErrorPassword = () => password.length < 6;

    const handleLogin = () => {
        if (!email || !password) {
            Alert.alert("Lỗi", "Tên đăng nhập và mật khẩu không được để trống");
        } else {
            login(dispatch, email, password);
        }
    };

    useEffect(() => {
        console.log(userLogin);
        if (userLogin !== null) {
            if (userLogin.role === "customers") {
                navigation.navigate("Customers");
                Alert.alert("Thành công", "Đăng nhập thành công!");
            } else if (userLogin.role === "admin") {
                navigation.navigate("Admin");
                Alert.alert("Thành công", "Đăng nhập thành công!");
            }
        }
    }, [userLogin, navigation]);

    return (
        <View style={{ flex: 1, padding: 10, justifyContent: "center" }}>
            <Text style={{
                fontSize: 40,
                fontWeight: "bold",
                alignSelf: "center",
                color: "pink",
                marginTop: 50,
                marginBottm: 10
            }}>Login</Text>
            <TextInput
                label={"Email"}
                value={email}
                onChangeText={setEmail}
            />
            <HelperText type="error" visible={hasErrorEmail()}>
                Sai địa chỉ email
            </HelperText>
            <TextInput
                label={"Password"}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
            />
            <HelperText type="error" visible={hasErrorPassword()}>
                Password ít nhất 6 kí tự
            </HelperText>
            <Button mode="contained" buttonColor="blue"
                onPress={handleLogin}
            >
                Login
            </Button>
            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                <Text>Bạn chưa có tài khoản?</Text>
                <Button onPress={() => navigation.navigate("Register")}>
                    Tạo tài khoản mới
                </Button>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>

                <Button onPress={() => navigation.navigate("ForgotPassword")}>
                    Quên mật khẩu
                </Button>
            </View>
        </View>
    )

}
export default Login;
