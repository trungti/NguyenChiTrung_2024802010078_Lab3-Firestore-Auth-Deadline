import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
//import Router from "../routers/Router";
//import { TransitionPresets } from "@react-navigation/stack";
import RouterService from "../routers/RouterService";
import Transaction from "./Transaction";
import Setting from "./Setting";
import RouterServiceCustomer from "../routers/RouterServiceCustomer";


const Tab=createMaterialBottomTabNavigator()
const Customers=()=>{
    return(
        <Tab.Navigator>
        <Tab.Screen name="RouterService" component={RouterServiceCustomer}
    
        options={{
            title:"Home",
            
            tabBarIcon:"home"

        }}
        />
        <Tab.Screen name="Transaction" component={Transaction}
        options={{
            tabBarIcon:"cash"
        }}
        />
        <Tab.Screen name="Setting" component={Setting}
        options={{
            tabBarIcon:"cog"
        }}
        />
        </Tab.Navigator>
    )
}
export default Customers