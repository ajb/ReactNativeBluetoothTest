// const IPAD_ID = 'D1CDEB87-1273-6E86-FCB1-8C5DF9826477'
const BOARDCAT_SERVICE_ID = '19b10000-e8f2-537e-4f6c-d104768a1214'
const BOARDCAT_CHARACTERISTIC_ID = '19b10001-e8f2-537e-4f6c-d104768a1214'

import React, { useEffect, useState } from 'react';
import {
  View,
  Button,
  Text,
} from 'react-native';

import { BleManager } from 'react-native-ble-plx';

const manager = new BleManager()

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

export default function App() {
  const [connected, setConnected] = useState(false)
  const [ledIdx, setLedIdx] = useState(0)
  const [scanning, setScanning] = useState(false)
  const [connectedDevice, setConnectedDevice] = useState(null)

  function stopScanning() {
    setScanning(false)
    manager.stopDeviceScan()
  }

  function disconnect() {
    if (!connected) return;
    connectedDevice.cancelConnection()
    setConnected(false)
    setConnectedDevice(null)
  }

  function connect() {
    if (connected) return;
    setScanning(true)
    setTimeout(stopScanning, 5000)

    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log('Error: ', error);
        return
      }

      if (device.name === 'BoardCat LED') {
        stopScanning()

        device.connect().then((device) => {
          return device.discoverAllServicesAndCharacteristics()
        }).then((device) => {
          setConnected(true)
          setConnectedDevice(device)

          device.onDisconnected(() => {
            setConnected(false)
            setConnectedDevice(null)
          })
        }).catch((error) => {
          console.log('Error: ', error.message)
        })
       }
    });
  }

  function send() {
    connectedDevice.writeCharacteristicWithResponseForService(
      BOARDCAT_SERVICE_ID,
      BOARDCAT_CHARACTERISTIC_ID,
      btoa(pad(ledIdx, 3) + 'r')
    )
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
      }}>
        <Text>Connection status: {connected ? 'connected' : 'disconnected'}</Text>
        <Text>Controlling LED index: {ledIdx}</Text>

        <Button onPress={connect} title='Connect' />
        <Button onPress={disconnect} title='Disconnect' />
        <Button onPress={send} title='Make it red' />
        <Button onPress={() => setLedIdx(ledIdx + 1)} title='Increment ledIdx' />
        <Button onPress={() => setLedIdx(ledIdx - 1)} title='Decrement ledIdx' />
    </View>
  );
}
