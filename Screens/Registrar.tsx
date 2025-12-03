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
import DateTimePicker from "@react-native-community/datetimepicker";

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
  const [cantidad, setCantidad] = useState("");
  const [codigo, setCodigo] = useState("");
  const [scannerVisible, setScannerVisible] = useState(false);
  const [showDatePickerCompra, setShowDatePickerCompra] = useState(false);
  const [showDatePickerCaducidad, setShowDatePickerCaducidad] = useState(false);
  const [selectedDateCompra, setSelectedDateCompra] = useState(new Date());
  const [selectedDateCaducidad, setSelectedDateCaducidad] = useState(new Date());
  const [minCaducidadDate, setMinCaducidadDate] = useState(new Date());

  //* Inicio camera
  const [permission, requestPermission] = useCameraPermissions();
  
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
    setShowbuttons(true);
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

  const handleDateChangeCompra = (event: any, date?: Date) => {
    setShowDatePickerCompra(false);
    if (date) {
      setSelectedDateCompra(date);
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      setMinCaducidadDate(nextDay);
      const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
      setFechaCompra(formattedDate);
      setFechaCaducidad("");
    }
  };

  const handleDateChangeCaducidad = (event: any, date?: Date) => {
    setShowDatePickerCaducidad(false);
    if (date) {
      setSelectedDateCaducidad(date);
      const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
      setFechaCaducidad(formattedDate);
    }
  };

  const guardarProducto = async () => {
    if (
      nombre === "" ||
      marca === "" ||
      proveedor === "" ||
      precioCompra === "" ||
      precioVenta === "" ||
      fechaCompra === "" ||
      fechaCaducidad === "" ||
      codigo === "" ||
      cantidad === ""
    ) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    const compra = parseFloat(precioCompra);
    const venta = parseFloat(precioVenta);
    const stock = parseInt(cantidad);

    if (isNaN(compra) || compra <= 0 || compra.toString().includes('.')) {
      Alert.alert("Error", "Precio de compra inválido. Solo números enteros positivos.");
      return;
    }

    if (isNaN(venta) || venta <= 0 || venta.toString().includes('.')) {
      Alert.alert("Error", "Precio de venta inválido. Solo números enteros positivos.");
      return;
    }

    if (venta < compra) {
      Alert.alert("Error", "El precio de venta no puede ser menor al de compra.");
      return;
    }

    if (isNaN(stock) || stock <= 0) {
      Alert.alert("Error", "Cantidad en stock inválida. Solo números enteros positivos.");
      return;
    }

    const compraDate = new Date(selectedDateCompra);
    const caducidadDate = new Date(selectedDateCaducidad);
    if (caducidadDate <= compraDate) {
      Alert.alert("Error", "La fecha de caducidad debe ser posterior a la de compra.");
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
    } catch (error) {
      Alert.alert("Error", "No se pudo guardar: " + error);
      console.log(error);
    }
    setNombre("");
    setMarca("");
    setProveedor("");
    setPrecioCompra("");
    setPrecioVenta("");
    setFechaCompra("");
    setFechaCaducidad("");
    setCodigo("");
    setCantidad("");
    setSelectedDateCompra(new Date());
    setSelectedDateCaducidad(new Date());
    setMinCaducidadDate(new Date());
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
              onChangeText={(text) => {
                let trimmed = text.trimStart();
                let formatted = trimmed.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
                let spaceCount = (formatted.match(/ /g) || []).length;
                if (spaceCount > 2) {
                  formatted = formatted.replace(/\s+/g, ' ');
                  let parts = formatted.split(' ');
                  if (parts.length > 3) {
                    formatted = parts.slice(0, 3).join(' ');
                  }
                }
                setNombre(formatted);
              }}
              style={styles.Input}
              placeholder="Nombre del Producto"
            />
            <TextInput
              value={marca}
              onChangeText={(text) => {
                let trimmed = text.trimStart();
                let formatted = trimmed.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
                let spaceCount = (formatted.match(/ /g) || []).length;
                if (spaceCount > 2) {
                  formatted = formatted.replace(/\s+/g, ' ');
                  let parts = formatted.split(' ');
                  if (parts.length > 3) {
                    formatted = parts.slice(0, 3).join(' ');
                  }
                }
                setMarca(formatted);
              }}
              style={styles.Input}
              placeholder="Marca"
            />
            <TextInput
              value={proveedor}
              onChangeText={(text) => {
                let trimmed = text.trimStart();
                let formatted = trimmed.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
                let spaceCount = (formatted.match(/ /g) || []).length;
                if (spaceCount > 2) {
                  formatted = formatted.replace(/\s+/g, ' ');
                  let parts = formatted.split(' ');
                  if (parts.length > 3) {
                    formatted = parts.slice(0, 3).join(' ');
                  }
                }
                setProveedor(formatted);
              }}
              style={styles.Input}
              placeholder="Proveedor"
            />

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
                onChangeText={(text) => {
                  const numeric = text.replace(/[^0-9]/g, '');
                  setPrecioCompra(numeric);
                }}
                style={styles.minput}
                placeholder="Precio de Compra"
                keyboardType="numeric"
              />
              <TextInput
                value={precioVenta}
                onChangeText={(text) => {
                  const numeric = text.replace(/[^0-9]/g, '');
                  setPrecioVenta(numeric);
                }}
                style={styles.minput}
                placeholder="Precio de Venta"
                keyboardType="numeric"
              />
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
                <TouchableOpacity onPress={() => setShowDatePickerCompra(true)}>
                  <TextInput
                    value={fechaCompra}
                    style={styles.minminput}
                    placeholder="dd/mm/aaaa"
                    editable={false}
                  />
                </TouchableOpacity>
                {showDatePickerCompra && (
                  <DateTimePicker
                    value={selectedDateCompra}
                    mode="date"
                    display="default"
                    onChange={handleDateChangeCompra}
                    maximumDate={new Date()}
                  />
                )}
              </View>

              <View style={{ display: "flex", width: "49%", gap: 5 }}>
                <Text style={{ fontSize: 12, color: "#696969ff" }}>
                  Fecha Caducidad
                </Text>
                <TouchableOpacity onPress={() => setShowDatePickerCaducidad(true)}>
                  <TextInput
                    value={fechaCaducidad}
                    style={styles.minminput}
                    placeholder="dd/mm/aaaa"
                    editable={false}
                  />
                </TouchableOpacity>
                {showDatePickerCaducidad && (
                  <DateTimePicker
                    value={selectedDateCaducidad}
                    mode="date"
                    display="default"
                    onChange={handleDateChangeCaducidad}
                    minimumDate={minCaducidadDate}
                  />
                )}
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
              onChangeText={(text) => {
                const numeric = text.replace(/[^0-9]/g, '');
                setCantidad(numeric);
              }}
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
            ></TextInput>
            <TouchableOpacity
              onPress={() => guardarProducto()}
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