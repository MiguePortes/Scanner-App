import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Alert,
} from "react-native";
import React from "react";
import { useState, useEffect } from "react";
import { CameraView, useCameraPermissions } from "expo-camera";
import Entypo from "@expo/vector-icons/Entypo";

//* BD firebase
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const Registrar = ({ setShowbuttons }: any) => {
  //* Inputs
  const [nombre, setNombre] = useState("");
  const [marca, setMarca] = useState("");
  const [proveedor, setProveedor] = useState("");
  const [precioCompra, setPrecioCompra] = useState("");
  const [precioVenta, setPrecioVenta] = useState("");
  const [fechaCompra, setFechaCompra] = useState("");
  const [fechaCaducidad, setFechaCaducidad] = useState("");
  const [ cantidad, setCantidad] = useState("");
  const [codigo, setCodigo] = useState("");

  //* Inicio camera
  const [permission, requestPermission] = useCameraPermissions();
  const [scannerVisible, setScannerVisible] = useState(false);
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
  //* fin camera

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
        cantidad,
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
      setCantidad("")
    } catch (error) {
      Alert.alert("Error", "No se pudo guardar: " + error);
      console.log(error);
    }
  };

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
          <Text style={styles.title}>Inventario</Text>

          <View style={styles.content}>
            <Text style={styles.label}>Datos generales</Text>
            <TextInput 
            value={nombre}
            onChangeText={setNombre}
            style={styles.Input} placeholder="Nombre del Producto" />
            <TextInput 
            value={marca}
            onChangeText={setMarca}
            style={styles.Input} placeholder="Marca" />
            <TextInput
            value={proveedor}
            onChangeText={setProveedor}
            style={styles.Input} placeholder="Proveedor" />

            <Text style={styles.label}>Precios</Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <TextInput
              value={precioCompra}
              onChangeText={setPrecioCompra}
              style={styles.minput} placeholder="Precio de Compra" />
              <TextInput 
              value={precioVenta}
              onChangeText={setPrecioCompra}
              style={styles.minput} placeholder="Precio de Venta" />
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
                <TextInput 
                value={fechaCompra}
                onChangeText={setFechaCompra}
                style={styles.minminput} placeholder="dd/mm/aaaa" />
              </View>

              <View style={{ display: "flex", width: "49%", gap: 5 }}>
                <Text style={{ fontSize: 12, color: "#696969ff" }}>
                  Fecha Caducidad
                </Text>
                <TextInput 
                value={fechaCaducidad}
                onChangeText={setFechaCaducidad}
                style={styles.minminput} placeholder="dd/mm/aaaa" />
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
            <TextInput
            value={cantidad}
            onChangeText={setCantidad}
            keyboardType="numeric"
            placeholder="Cantidad en stock"
              style={{
                borderWidth: 1,
                borderRadius: 5,
                fontSize: 16,
                paddingVertical: 10,
                marginBottom: 10,
                paddingLeft: 5,
              }}
            >
            </TextInput>
            <TouchableOpacity
            onPress={()=>guardarProducto()}
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
