import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useState, useEffect } from "react";
import { CameraView, useCameraPermissions } from "expo-camera";
import Entypo from "@expo/vector-icons/Entypo";

const Registrar = ({ setShowbuttons }: any) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannerVisible, setScannerVisible] = useState(false);
  const [codigo, setCodigo] = useState("");

  useEffect(() => {
    requestPermission();
  }, []);

  const handleopencamer = () => {
    setScannerVisible(true);
    setShowbuttons(false);
  };

  const handleclosecamer = () => {
    setScannerVisible(false)
    setShowbuttons(true)
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
    <View style={styles.container}>
      {scannerVisible ? (
        <View style={{ flex: 1 }}>
          <CameraView
            style={{ flex: 1, width: "100%" }}
            facing="back"
            onBarcodeScanned={handleBarcodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ["qr", "ean13", "ean8", "code128"],
            }}/>
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
          <Text style={styles.title}>Inventario</Text>

          <View style={styles.content}>
            <Text style={styles.label}>Datos generales</Text>
            <TextInput style={styles.Input} placeholder="Nombre del Producto" />
            <TextInput style={styles.Input} placeholder="Marca" />
            <TextInput style={styles.Input} placeholder="Proveedor" />

            <Text style={styles.label}>Precios</Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <TextInput style={styles.minput} placeholder="Precio de Compra" />
              <TextInput style={styles.minput} placeholder="Precio de Venta" />
            </View>

            <Text style={styles.label}>Fechas</Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View style={{ display: "flex", width: "49%", gap: 5 }}>
                <Text style={{ fontSize: 12, color: "#696969ff" }}>
                  Fecha Compra
                </Text>
                <TextInput style={styles.minminput} placeholder="dd/mm/aaaa" />
              </View>

              <View style={{ display: "flex", width: "49%", gap: 5 }}>
                <Text style={{ fontSize: 12, color: "#696969ff" }}>
                  Fecha Caducidad
                </Text>
                <TextInput style={styles.minminput} placeholder="dd/mm/aaaa" />
              </View>
            </View>

            <Text style={styles.label}>Inventario</Text>
            <View style={{ flexDirection: "row" }}>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderRadius: 5,
                  width: "80%",
                  fontSize: 16,
                  marginBottom: 10,
                }}
                placeholder="Código de Barras"
                value={codigo}
                editable={false}
              />
              <TouchableOpacity
                onPress={() => handleopencamer()}
                style={{
                  marginLeft: 10,
                  justifyContent: "flex-start",
                  alignItems: "center",
                  width: "20%",
                }}
              >
                <Entypo name="camera" size={42} color="black" />
              </TouchableOpacity>
            </View>
            <Text
              style={{
                borderWidth: 1,
                borderRadius: 5,
                fontSize: 16,
                paddingVertical: 10,
                marginBottom: 10,
                paddingLeft: 5,
              }}
            >
              Cantidad en stock:{" "}
            </Text>
            <TouchableOpacity
              style={{
                borderColor: "#0a3b6c",
                borderWidth: 1,
                padding: 10,
                borderRadius: 5,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  textAlign: "center",
                  fontWeight: 900,
                  color: "#0a3b6c",
                }}
              >
                Guardar Producto
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 40,
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 900,
    textAlign: "center",
    paddingTop: 50,
    paddingBottom: 10,
    color: "#fff",
    backgroundColor: "#0a3b6c",
  },
  label: {
    marginBottom: 10,
    fontWeight: 700,
    color: "#0a3b6c",
    fontSize: 18,
  },
  Input: {
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    fontSize: 16,
  },
  minput: {
    width: "49%",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    fontSize: 16,
  },
  minminput: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    fontSize: 16,
  },
  btn: {},
});

export default Registrar;
