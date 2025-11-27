import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { useState, useEffect } from "react";
import { useCameraPermissions, CameraView } from "expo-camera";
import React from "react";
import Entypo from "@expo/vector-icons/Entypo";

const Buscar = ({ setShowbuttons }: any) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannerVisible, setScannerVisible] = useState(false);
  const [codigo, setCodigo] = useState("");

  //! Falta agregar validaciones para cuando un producto sea escaneado se muestre la información en la pantalla o de lo contrario un mensaje que indique sin información.
  const [ scanned, setSacanned ] = useState(false)

  useEffect(() => {
    requestPermission();
  }, []);

  const handleopencamer = () => {
    setScannerVisible(true);
    setShowbuttons(false);
  };

  const handleclosecamer = () => {
    setScannerVisible(false);
    setShowbuttons(true);
  };

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    setCodigo(data);
    setScannerVisible(false);
  };

  if (!permission) return <Text>Cargando permisos...</Text>;
  if (!permission.granted) {
    return (
      <View>
        <Text>No hay permiso para la cámara</Text>
        <Pressable onPress={requestPermission}>
          <Text>Dar permisos</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{flex:1}}>
      {scannerVisible ? (
        <View style={{ flex: 1}}>
          <CameraView
            style={{ flex: 1, width: "100%" }}
            facing="back"
            onBarcodeScanned={handleBarcodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ["qr", "ean13", "ean8", "code128"],
            }}
          />
          <TouchableOpacity
            style={{
              position: "absolute",
              bottom: 50,
              left: "35%",
              backgroundColor: "#f00",
              borderRadius: 10,
              width: "30%",
              padding: 20,
            }}
            onPress={() => handleclosecamer()}
          >
            <Text
              style={{ fontSize: 18, fontWeight: 900, textAlign: "center" }}
            >
              CLOSE
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <Text style={styles.title}>Buscar productos</Text>

          <View style={{ padding: 30 }}>
            <TouchableOpacity style={{ backgroundColor: "#0a3b6c", padding: 10, borderRadius: 10, marginBottom: 10,}}>
              <Text style={{ fontSize: 20, textAlign: "center", fontWeight: 900, color:"#fff"}}>Buscar</Text>
            </TouchableOpacity>

            <View style={{ flexDirection: "row" }}>
            <TextInput
                style={{
                  borderWidth: 1,
                  borderRadius: 5,
                  width: "80%",
                  fontSize: 16,
                  marginRight: 20,
                  marginBottom: 10,
                }}
                placeholder="Código de Barras"
                value={codigo}
                editable={false}
              />
              <TouchableOpacity onPress={()=>handleopencamer()}>
              <Entypo name="camera" size={42} color={"black"}></Entypo>
              </TouchableOpacity>
            </View>

            <View
              style={{
                width: "100%",
                elevation: 2,
                borderColor: "#000",
                shadowColor: "#000",
                height: 500,
              }}
            ></View>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 900,
    textAlign: "center",
    paddingTop: 50,
    paddingBottom: 10,
    color: "#fff",
    backgroundColor: "#0a3b6c",
  },
});

export default Buscar;
