
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../screens/Login";
import Admin from "../screens/Admin";
import Customers from "../screens/Customers";
import Register from "../screens/Register";
const Stack=createStackNavigator();
const Router=()=>{

    return(
        <Stack.Navigator initialRouteName='Login'
        screenOptions={{
            headerShown:false
        }}
        >
            <Stack.Screen name="Register" component={Register}/>
            <Stack.Screen name="Admin" component={Admin}/>
            <Stack.Screen name="Customers" component={Customers}/>
            <Stack.Screen name="Login" component={Login}/>
        </Stack.Navigator>
    )
}
export default Router