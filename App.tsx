import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TextInput, Button, Alert, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { CameraView, useCameraPermissions } from "expo-camera";

import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();

  const [scannerVisible, setScannerVisible] = useState(false);

  const [nombre, setNombre] = useState("");
  const [marca, setMarca] = useState("");
  const [proveedor, setProveedor] = useState("");
  const [precioCompra, setPrecioCompra] = useState("");
  const [precioVenta, setPrecioVenta] = useState("");
  const [fechaCompra, setFechaCompra] = useState("");
  const [fechaCaducidad, setFechaCaducidad] = useState("");
  const [codigo, setCodigo] = useState("");

  useEffect(() => {
    requestPermission();
  }, []);

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    setCodigo(data);
    setScannerVisible(false); 
  };

  const guardarProducto = async () => {
    if (!nombre || !marca) {
      Alert.alert("Error", "Nombre y marca son obligatorios.");
      return;
    }

    try {
      await addDoc(collection(db, "productos"), {
        nombre,
        marca,
        proveedor,
        precioCompra,
        precioVenta,
        fechaCompra,
        fechaCaducidad,
        codigo,
        fechaCreacion: new Date(),
      });

      Alert.alert("Éxito", "Producto guardado correctamente 🎉");

      setNombre("");
      setMarca("");
      setProveedor("");
      setPrecioCompra("");
      setPrecioVenta("");
      setFechaCompra("");
      setFechaCaducidad("");
      setCodigo("");

    } catch (error) {
      Alert.alert("Error", "No se pudo guardar: " + error);
      console.log(error);
    }
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
      
        <View style={{ flex: 1, width: "100%" }}>
          <CameraView
            style={{ flex: 1 }}
            facing="back"
            onBarcodeScanned={handleBarcodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ["qr", "ean13", "ean8", "code128"],
            }}
          />

      
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setScannerVisible(false)}
          >
            <Text style={styles.closeButtonText}>Cerrar Cámara</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <Text style={styles.title}>Scanner App</Text>

          <View>
            <TextInput
              style={styles.Input}
              placeholder="Nombre del Producto"
              value={nombre}
              onChangeText={setNombre}
            />

            <TextInput
              style={styles.Input}
              placeholder="Marca"
              value={marca}
              onChangeText={setMarca}
            />

            <TextInput
              style={styles.Input}
              placeholder="Proveedor"
              value={proveedor}
              onChangeText={setProveedor}
            />

            <TextInput
              style={styles.Input}
              placeholder="Precio de Compra"
              keyboardType="numeric"
              value={precioCompra}
              onChangeText={setPrecioCompra}
            />

            <TextInput
              style={styles.Input}
              placeholder="Precio de Venta"
              keyboardType="numeric"
              value={precioVenta}
              onChangeText={setPrecioVenta}
            />

            <TextInput
              style={styles.Input}
              placeholder="Fecha de Compra"
              value={fechaCompra}
              onChangeText={setFechaCompra}
            />

            <TextInput
              style={styles.Input}
              placeholder="Fecha de Caducidad"
              value={fechaCaducidad}
              onChangeText={setFechaCaducidad}
            />

            <TextInput
              style={styles.Input}
              placeholder="Código de Barras"
              value={codigo}
              editable={false}
            />
          </View>

          <View style={{ marginTop: 10 }}>
            <Button title="Guardar" color="#ff714dff" onPress={guardarProducto} />

            <View style={{ marginTop: 8 }}>
              <Button
                title="Lector de Barras"
                color="#081dffff"
                onPress={() => setScannerVisible(true)}
              />
            </View>
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
    marginVertical: 4,
    backgroundColor: "#fff",
    width: 260,
  },

  closeButton: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "red",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
