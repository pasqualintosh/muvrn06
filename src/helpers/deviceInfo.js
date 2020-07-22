import DeviceInfo from "react-native-device-info";


export async function getDevice() {
    try {
        const systemName = DeviceInfo.getSystemName();
        const systemVersion = DeviceInfo.getSystemVersion();
        const model = DeviceInfo.getModel();
        const deviceId = DeviceInfo.getDeviceId();
    
        const manufacturer = await DeviceInfo.getManufacturer()
            const device =
            manufacturer +
            " " +
            deviceId +
            " " +
            model +
            " " +
            systemVersion +
            " " +
            systemName;
      
        return device;
    } catch (error){
        return("")
    }
  }
  