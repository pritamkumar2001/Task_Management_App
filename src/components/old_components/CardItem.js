import React from "react";
import { View, Text, Image, TouchableOpacity, Alert, StyleSheet, Dimensions } from "react-native";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { MaterialIcons } from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { colors } from "../../Styles/appStyle";
import * as Linking from 'expo-linking';
import ToastMsg from "./ToastMsg";
const { width: screenWidth } = Dimensions.get("window");

const CardItem = ({
  data,
  navigation,
  screen,
  handleIconPress,
  icon,
  buttonTittle,
  colour,
  isAmtApplicable,
  handleDisplayPress,
  iconName1,
  handleIconName1Press,
  iconName2,
  iconScreen2,pilength,ProductInLength
}) => {
  // console.log(cname,"gghh")
  const sub_title = data.customer ? data.customer.name : data.gstn_number ? `GSTN ${data.gstn_number}` : data.address_line_1;
  const cardColour = colour ? colour : colors.primary;

  const handleNavigation = () => {
    // console.log('Screen name', screen);
    if (screen == 'CustomerTasks') {
      navigation.navigate('CustomerTasks', { customer_id: data.id, name: data.name, lead_id: '', call_mode: 'C' });
    } else if (screen == 'LeadTasks') {
      navigation.navigate('CustomerTasks', { customer_id: '', name: data.name, lead_id: data.id, call_mode: 'L' });
    } else if (screen == 'ProductInterest' || screen == 'TaskInterest') {
      navigation.navigate(screen, {
        task_id: data.id,
        screen: screen,
        name: data.customer ? data.customer.name : data.lead ? data.lead.name : '',
        task_name: data.name,
        call_mode: data.customer ? 'C' : data.lead ? 'L' : ''
      });
    } else {
      navigation.navigate(screen, { data });
    }
  };
const productInterest = () => {
  // console.log(data&&data.customer&&data.customer.name,"data.id")
  navigation.navigate('ProductInterest', {
    task_id: '',
    customer_id:data.id,
    screen: 'ProductInterest',
    name: data.name,
    task_name: '',
    call_mode: 'C'
  });
}
  const handleIconNavigation2 = () => {
    // console.log('Icon Screen name', iconScreen2, data);
    if (iconScreen2 == 'ViewInterest') {
      navigation.navigate(iconScreen2, { data: data, call_mode: callMode, delete_mode: 'Y' });
    } else if (iconScreen2 == 'InvoiceSendMail') {
      Alert.alert('Not Enabled');
    } else {
      navigation.navigate(buttonScreen, { data });
    }
  };

  const openWhatsApp = (Mobile) => {
    if (Mobile){
         Linking.openURL(`https://wa.me/${Mobile}`);
    }
    else{
      ToastMsg('Please add Mobile Number in lead details');
    }
   
    };

    const openEmail = (emails) => {
      if(emails){
         Linking.openURL(`mailto:${emails}`);
      }
      else{
        ToastMsg('Please add Email Address in lead details');
      }
     
    };

    const openPhone = (Mobile) => {
      if(Mobile){
          Linking.openURL(`tel:${Mobile}`);
      }
      else{
        ToastMsg('Please add Mobile Number in lead details');
      }
    
    };

  return (
    <View style={styles.cardContainer}>
       <View style={styles.cardContainers}>
      <View style={styles.profileIconContainer}>
        <Image
          source={{ uri: data.customer ? data.customer.image : data.image }}
          style={styles.logoImage}
        />
      </View>
      <Text style={styles.cardTitle}>{data.name}</Text>
      {sub_title && <Text style={styles.cardSubText}>{sub_title}</Text>}
      {data.task_date && <Text style={styles.cardSubText}>Planned on: {data.task_date}</Text>}
      {data.mobile_number&& <Text style={styles.cardSubTexts}>Mobile No: {data.mobile_number}</Text>}
      {isAmtApplicable && data.outstanding_amt ? (
        <TouchableOpacity
          style={styles.actionButton2}
          onPress={() => handleDisplayPress({ data })}
        >
          <FontAwesome name="rupee" size={20} color="red" />
          <Text style={[styles.amountDue, { color: 'red' }]}>{data.outstanding_amt} - DUE AMT</Text>
        </TouchableOpacity>
      ) : isAmtApplicable && (
        <Text style={styles.noOutstanding}>NO OUTSTANDING</Text>
      )}
      <View style={styles.actionButtonsContainer}>
        {iconName1 && (
          <TouchableOpacity style={styles.actionButton} onPress={() => handleIconName1Press(data)}>
            <FontAwesome5 name="eye" size={16} color="gray" />
            <Text style={styles.actionButtonText}>Task</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={[styles.actionButton, { width: buttonTittle == 'Task list' ? '48%' : 'auto' }]}  onPress={handleNavigation}>
          <FontAwesome5 name="th-list" size={16} color="#aaa" />
          <Text style={styles.actionButtonText}>{buttonTittle}</Text>
          {pilength&&<View style={styles.badgeContainer}>
                  <Text style={styles.badgeText}>{pilength}</Text>
                  </View>}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.assignTaskButton, { backgroundColor: buttonTittle !== 'Product Interest' ? '#007bff' : 'red' ,width: buttonTittle != 'Product Interest' ? '48%' : 'auto' }] }
          onPress={() => handleIconPress(data)}
        >
          <Text style={styles.assignTaskText}>
            {buttonTittle !== 'Product Interest' ? 'Add Task' : 'Assign Task'}
          </Text>
        </TouchableOpacity>
      </View>
      </View>
     { buttonTittle !== 'Product Interest' &&<View style={[styles.cardConta,{width:"100%"}]}>
      <TouchableOpacity style={[styles.actionButton ,{width:"100%"}]} onPress={() => productInterest()}>
      <FontAwesome5 name="th-list" size={16} color="#aaa" />
            <Text style={styles.actionButtonText}>Product Interest</Text>
            {ProductInLength&&<View style={styles.badgeContainer}>
                  <Text style={styles.badgeText}>{ProductInLength}</Text>
                  </View>}
          </TouchableOpacity>
          </View>}
      {screen=="CustomerTasks"&& <View style={styles.topIconsContainer}>
          <TouchableOpacity onPress={() => openWhatsApp(data.mobile_number)} style={styles.iconButton}>
            <FontAwesome5 name="whatsapp" size={24} color="#25D366" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openEmail(data.email_id)} style={styles.iconButton}>
            <MaterialIcons name="email" size={24} color="#D44638" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openPhone(data.mobile_number)} style={styles.iconButton}>
            <FontAwesome5 name="phone" size={24} color="#34B7F1" />
          </TouchableOpacity>
        </View>}
 
    </View>
  );
};

const styles = StyleSheet.create({
  topIconsContainer: {
    width:'100%',
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
  },
  iconButton: {
    padding: 8,
    backgroundColor: '#FFF',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContainers:{
    padding: 15,
  },
  cardConta:{
    paddingLeft: 15,
    paddingRight: 15,
    // padding: 5,
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 10,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    position: 'relative',
  },
  profileIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 20,
    right: 18,
  },
  logoImage: {
    width: 50,
    height: 50,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    maxWidth:280,
  },
  cardSubText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    maxWidth:295,
  },
  cardSubTexts: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    maxWidth:280,
    fontWeight: 'bold',
  },
  actionButtonsContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    justifyContent: 'space-between',
    gap:5,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#00bcd4',
    borderRadius: 20,
    paddingVertical: 9,
    paddingHorizontal: 8,
    // marginRight: 10,
    backgroundColor: '#fff',
  },
  actionButton2: {
    flexDirection: 'row',
    // alignItems: 'center',
    fontWeight: '500',
    padding: 2,
    marginTop: 10,
    marginRight: 50,
    // justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    color: 'black',
    marginLeft: 5,
    fontWeight: '500',
  },
  amountDue: {
    marginLeft: 5,
    fontSize: 14,
  },
  noOutstanding: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 5,
    color: 'green',
  },
  assignTaskButton: {
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  assignTaskText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  badgeContainer: {
    position: 'absolute',
    top: -5, // Adjust as needed to position it at the top right
    right: -5, // Adjust as needed
    backgroundColor: '#5fadd4',
    borderRadius: 10,
    height: 20,
    width: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  
});

export default CardItem;