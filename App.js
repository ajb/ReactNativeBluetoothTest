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

export default function App() {
  const [scanning, setScanning] = useState(false)

  function stopScan() {
    manager.stopDeviceScan()
    setScanning(false)
  }

  function scan() {
    if (scanning) return;
    setScanning(true)
    setTimeout(stopScan, 5000)

    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log('error', error)
        return
      }

      console.log('device found in scan', device)

      if (device.serviceUUIDs && device.serviceUUIDs[0] === BOARDCAT_SERVICE_ID) {
        stopScan()

        device.connect().then((device) => {
          console.log('calling discover')
          return device.discoverAllServicesAndCharacteristics()
        }).then((device) => {
          console.log('we are connected, writing...')
          console.log('the device is', device)

          device.writeCharacteristicWithoutResponseForService(
            BOARDCAT_SERVICE_ID,
            BOARDCAT_CHARACTERISTIC_ID,
            btoa('001g')
          )


        }).catch((error) => {
          console.log('error', error)
          // Handle errors
        });
      }
    })
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
      }}>
      {
        scanning ?
          <Text>Scanning...</Text> :
          <Button onPress={scan} title='Connect and light' />
      }
    </View>
  );
}
