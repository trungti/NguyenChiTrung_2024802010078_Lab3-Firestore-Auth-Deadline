import { createStackNavigator } from "@react-navigation/stack";
import { useMyContextController } from "../store";

//import { Colors } from "react-native/Libraries/NewAppScreen";
import { IconButton } from "react-native-paper";
import Services from"../screens/Services";
import AddNewService from"../screens/AddNewService"
import ServiceDetail from "../screens/ServiceDetail";
import Appointment from "../screens/Appointment";
import { useEffect } from "react";
import ServicesCustomer from "../screens/ServicesCustomer";
const Stack=createStackNavigator();
export default RouterServiceCustomer=()=>{
    const[controller,dispatch]=useMyContextController();
    const{userLogin}=controller;
    return(
        <Stack.Navigator initialRouteName="Services"
        screenOptions={{
            title:(userLogin!=null)&&(userLogin.name),
            headerTitleAlign:"center",
            headerShown:false,
            headerStyle:{
                backgroundColor:"pink"
            },
            headerRight:(props)=><IconButton icon={"account"}/>
        }}
        
        >

            <Stack.Screen name="ServicesCustomer" component={ServicesCustomer}

            />
             <Stack.Screen name="Appointment" component={Appointment}

/>
       </Stack.Navigator>
    )
}