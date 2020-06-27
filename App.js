const IPAD_ID = 'D1CDEB87-1273-6E86-FCB1-8C5DF9826477'
const BOARDCAT_SERVICE_DEVICE_ID = '19B10000-E8F2-537E-4F6C-D104768A1214'
const BOARDCAT_CHARACTERISTIC_ID = '19B10001-E8F2-537E-4F6C-D104768A1214'

import React, { useEffect, useState } from 'react';
import {
  View,
  Button,
  Text,
} from 'react-native';

import { BleManager } from 'react-native-ble-plx';

export default function App() {
  const [scanning, setScanning] = useState(false)
  const manager = new BleManager()

  function stopScan() {
    manager.stopDeviceScan()
    setScanning(false)
  }

  function scan() {
    if (scanning) return;
    setScanning(true)
    console.log('scanning')
    setTimeout(stopScan, 5000)

    manager.startDeviceScan(null, { allowDuplicates: true }, (error, device) => {
      if (error) {
        console.log('error', error)
        return
      }

      console.log('device found in scan', device)

      if (device.id === BOARDCAT_SERVICE_DEVICE_ID) {
        stopScan()

        device.connect().then((device) => {
          console.log('calling discover')
          return device.discoverAllServicesAndCharacteristics()
        }).then((device) => {
          console.log('we now have device')
          console.log(device)
          return bleManager.connectToDevice({deviceIdentifier: device.id})
        }).then((device) => {
          console.log('we are connected, writing...')

          device.writeCharacteristicWithoutResponseForService({
            serviceUUID: BOARDCAT_SERVICE_DEVICE_ID,
            characteristicUUID: BOARDCAT_CHARACTERISTIC_ID,
            valueBase64: 'uyhhhh',
          })
        }).catch((error) => {
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
