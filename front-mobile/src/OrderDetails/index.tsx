import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Alert, Linking, StyleSheet, Text, View } from 'react-native';
import { RectButton, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Header from '../Header';
import { Order } from '../types';
import OrderCard from '../OrderCard';
import { confirmDelivery } from '../api';

type Props = {
  route:{
    params: {
      order: Order;
    }
  }
}

function OrderDetails({route}: Props) {

  const {order} = route.params;
  const navigation = useNavigation();

  const headleOnCancel = () => {
    navigation.navigate('Orders');
  }

  const headleConfirmDelivery = () => {
    confirmDelivery(order.id)
      .then(() => {
        Alert.alert(`Pedido ${order.id} confirmado com sucesso!`);
        navigation.navigate('Orders');
      })
      .catch(() => {
        Alert.alert(`Hove um erro ao confirmar o pedido ${order.id}`);
      })
  }

  const handleStarNavigation = () => {
    Linking.openURL(`https://www.google.com/maps/dir/?api=1&travelmode=driving&dir_action=navigate&destination=${order.latitude},${order.longitude}`);
  }

  

  return (
    <>
      <Header />
      <View style={styles.container}>
        <Text>Detalhes do Pedido {order.id}</Text>
        <OrderCard order={order} />
          <RectButton style={styles.button} onPress={handleStarNavigation}>
            <Text style={styles.buttonText}>INICIAR NAVEGAÇÃO</Text>
          </RectButton>

          <RectButton style={styles.button} onPress={headleConfirmDelivery}>
            <Text style={styles.buttonText}>CONFIRMAR ENTREGA</Text>
          </RectButton>

          <RectButton style={styles.button} onPress={headleOnCancel}>
            <Text style={styles.buttonText}>CANCELAR</Text>
          </RectButton>
      </View>
    </>

  );
}

const styles = StyleSheet.create(
  {
    container: {
      paddingRight: '5%',
      paddingLeft: '5%'
    },
    button: {
      backgroundColor: '#DA5C5C',
      flexDirection: 'row',
      borderRadius: 10,
      marginTop: 40,
      alignItems: 'center',
      justifyContent: 'center'
    },
    buttonText: {
      paddingTop: 15,
      paddingBottom: 15,
      paddingLeft: 50,
      paddingRight: 50,
      fontWeight: 'bold',
      fontSize: 18,
      color: '#FFF',
      letterSpacing: -0.24,
      fontFamily: 'OpenSans_700Bold'
    }
  }
);

export default OrderDetails;
OrderDetails