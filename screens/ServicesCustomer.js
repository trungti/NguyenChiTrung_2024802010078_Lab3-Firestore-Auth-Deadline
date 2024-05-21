import firestore from '@react-native-firebase/firestore';

import { useState,useEffect } from "react";
import { FlatList, Image,StyleSheet,View} from "react-native"
import { Appbar, IconButton,Text } from "react-native-paper"
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useMyContextController } from '../store';
const ServicesCustomer=({navigation})=>{

const [controller,dispatch]=useMyContextController()
const{userLogin}=controller




    const [service, setService] = useState(true);
    const ref = firestore().collection('data-lab5');
    useEffect(() => {
      ref.onSnapshot(
        response=>{
          var arr=[]
          response.forEach(doc=>arr.push(doc.data()))
          setService(arr)
        }
      )
    },[])
      



    const renderItem=({item})=>{
      const{Name,price}=item
      //navigation.navigate('ServiceDetail', { item:services });
      return(
        <TouchableOpacity style={{
          flexDirection:"row",
          borderWidth:1,
          height:60,
          borderRadius:10,
          margin:5,
          justifyContent:"space-between",
          alignItems:"center",
          padding:10
        }}
        
        onPress={() => navigation.navigate("Appointment", { item: item })}
        >
          <Text
          style={{
            fontSize:25,
            fontWeight:"bold",
          
          }}
          >{Name}</Text>
          <Text>{price}VND</Text>
        </TouchableOpacity>
        
      )
      
    }





    return(
      
<View style={{flex:1}}>
<Appbar style={{ backgroundColor: "pink" }}>
                  <Appbar.Content title={<Text style={{ color: 'white', textAlign: "center",fontSize:20,textAlign:"left" }}>HUYỀN TRINH</Text>} />
                  <IconButton icon="account" backgroundColor="white"/> 

        </Appbar>
    <Image source={require("../asset/logo.png")
    }
    style={{
        alignSelf:"center",
        marginVertical:50
    }}
    />
    <View style={{
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-between"
    }}>
    <Text style={{
        fontSize:40,
        fontWeight:"bold"
    }}>Danh sach dich vu</Text>

    <IconButton icon={"plus-circle"} iconColor="red"
    size={40}
    />
  


</View>
<FlatList
        style={{ flex: 1 }}
        data={service}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        
      />





</View>
    )
}
export default ServicesCustomer



const styles = StyleSheet.create({
    todoItem: {
      flexDirection: 'row',
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
  });
  