import React, { Component } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  StyleSheet,
  Text,
  ToastAndroid
} from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';

export default function ScanScreen({navigation}) {
  const onSuccess = async (e) => {
      token = await AsyncStorage.getItem('token');
      const response = await fetch('http://cd72075.tmweb.ru/api/getProduct',{
            method:"POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'connection': 'keep-alive',
                'token':token
            },
            body: JSON.stringify({
                article: e.data
                })
        });
      const json = await response.json();;
      if (json['article']){
        navigation.navigate('FullInfo',json);
      }else{
        ToastAndroid.show('Неверный qr', ToastAndroid.SHORT)
        navigation.reset({
            index: 0,
            routes: [{name: 'Main'}],
          });
        navigation.navigate('Main');
      }
      
    // Linking.openURL(e.data).catch(err =>
    //   console.error('An error occured', err)
    // );
  };
    return (
      <QRCodeScanner
        onRead={onSuccess}
        flashMode={RNCamera.Constants.FlashMode.auto}
        topContent={
          <Text style={styles.centerText}>
            Отсканируйте qr-код вашего товара, чтобы быстро перейти к нему
          </Text>
        }
        // bottomContent={
        //   <TouchableOpacity style={styles.buttonTouchable}>
        //     <Text style={styles.buttonText}>OK. Got it!</Text>
        //   </TouchableOpacity>
        // }
      />
    );
}

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777'
  },
  textBold: {
    fontWeight: '500',
    color: '#000'
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)'
  },
  buttonTouchable: {
    padding: 16
  }
});