import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import { useState, useEffect } from "react";
import { CameraView, useCameraPermissions } from "expo-camera";

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannerVisible, setScannerVisible] = useState(false);
  const [codigo, setCodigo] = useState("");

  useEffect(() => {
    requestPermission();
  }, []);

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    setCodigo(data);
    setScannerVisible(false);
  };

  if (!permission) return <Text>Cargando permisos...</Text>;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>No hay permiso para la cámara</Text>
        <Button title="Dar permisos" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {scannerVisible ? (
        <CameraView
          style={{ flex: 1, width: "100%" }}
          facing="back"
          onBarcodeScanned={handleBarcodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr", "ean13", "ean8", "code128"],
          }}
        />
      ) : (
        <>
          <Text style={styles.title}>Scanner App</Text>

          <View>
            <TextInput style={styles.Input} placeholder="Nombre del Producto" />
            <TextInput style={styles.Input} placeholder="Marca" />
            <TextInput style={styles.Input} placeholder="Proveedor" />
            <TextInput style={styles.Input} placeholder="Precio de Compra" />
            <TextInput style={styles.Input} placeholder="Precio de Venta" />
            <TextInput style={styles.Input} placeholder="Fecha de Compra" />
            <TextInput style={styles.Input} placeholder="Fecha de Caducidad" />

            <TextInput
              style={styles.Input}
              placeholder="Código de Barras"
              value={codigo}
              editable={false}
            />
          </View>
          <View>
            <Button title="Guardar" color="#ff714dff" />
            <Button
              title="Lector de Barras"
              color="#081dffff"
              onPress={() => setScannerVisible(true)}
            />
          </View>

          <StatusBar style="auto" />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "black",
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  Input: {
    height: 40,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    padding: 10,
    fontSize: 16,
    color: "black",
    margin: 4,
    backgroundColor: "#ffffffff",
    width: 260,
  },
});
 