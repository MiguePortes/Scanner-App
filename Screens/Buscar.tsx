import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
} from "react-native";
import { useState, useEffect } from "react";
import { useCameraPermissions, CameraView } from "expo-camera";
import React from "react";
import Entypo from "@expo/vector-icons/Entypo";

import {
  collection,
  query,
  where,
  limit,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

const Buscar = ({ setShowbuttons }: any) => {
  //Info
  const [product, setProduct] = useState<any>(null);
  const [codigo, setCodigo] = useState("");

  const [permission, requestPermission] = useCameraPermissions();
  const [scannerVisible, setScannerVisible] = useState(false);

  const [producExist, setProductExist] = useState(false);

  const obtenerProducto = async () => {
    const q = query(
      collection(db, "productos"),
      where("codigo", "==", codigo),
      limit(1)
    );
    try {
      const snap = await getDocs(q);
      if (snap.docs.length > 0) {
        setProductExist(true);
        const doc = snap.docs[0];
        setProduct({ id: doc.id, ...doc.data() });
      } else {
        setProductExist(false);
      }
    } catch (error) {
      console.log("Ocurrio un error..." + error);
    }
  };

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    setCodigo(data);
    setScannerVisible(false);
    setShowbuttons(true);
  };


  //! Si se desea mantener el boton buscar eliminar esto

  useEffect(() => {
    if (!codigo) return;
    obtenerProducto()
  }, [codigo]);

  //! Si se desea mantener el boton buscar eliminar esto



  const handleopencamer = () => {
    setScannerVisible(true);
    setShowbuttons(false);
  };

  const handleclosecamer = () => {
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

  return (
    <View style={{ flex: 1 }}>
      {scannerVisible ? (
        <View style={{ flex: 1 }}>
          <CameraView
            style={{ flex: 1, width: "100%" }}
            facing="back"
            onBarcodeScanned={handleBarcodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ["ean13", "ean8", "code128"],
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

          //! Boton buscar, si se quiere que se actualize la información despues de escanear, eliminar esto
            <TouchableOpacity
              onPress={() => obtenerProducto()}
              style={{
                backgroundColor: "#0a3b6c",
                padding: 10,
                borderRadius: 10,
                marginBottom: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  textAlign: "center",
                  fontWeight: 900,
                  color: "#fff",
                }}
              >
                Buscar
              </Text>
            </TouchableOpacity>
          //! Boton buscar, si se quiere que se actualize la información despues de escanear, eliminar esto

            <View style={{ flexDirection: "row", marginBottom: 20, }}>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderRadius: 5,
                  width: "80%",
                  fontSize: 16,
                  marginRight: 20,
                }}
                placeholder="Código de Barras"
                value={codigo}
                editable={false}
              />
              <TouchableOpacity onPress={() => handleopencamer()}>
                <Entypo name="camera" size={42} color={"black"}></Entypo>
              </TouchableOpacity>
            </View>

            <View
              style={{
                width: "100%",
                elevation: 5,
                borderColor: "#fff",
                shadowColor: "#0d00ffff",
                backgroundColor:
                  codigo === "" || !producExist ? "#0001" : "#ffffffff",
                height: 500,
                padding: 10,
              }}
            >
              {codigo === "" ? (
                <Text
                  style={{
                    textAlign: "center",
                    marginTop: 200,
                    fontSize: 20,
                    fontWeight: 900,
                  }}
                >
                  Escanea tu producto para poder ver los detalles
                </Text>
              ) : producExist ? (
                <View style={{ alignItems: "center", padding: 20,}}>
                  <Text style={styles.label}>{product.nombre}</Text>
                  <View style={styles.views}>
                    <Text style={styles.label}>Marca:</Text>
                    <Text style={styles.info}>{product.marca}</Text>
                  </View>
                  <View style={styles.views}>
                    <Text style={styles.label}>Proveedor:</Text>
                    <Text style={styles.info}>{product.proveedor}</Text>
                  </View>
                  <View style={styles.views}>
                    <Text style={styles.label}>Precio de compra:</Text>
                    <Text style={styles.info}>{product.precioCompra}</Text>
                  </View>
                  <View style={styles.views}>
                    <Text style={styles.label}>Precio de venta:</Text>
                    <Text style={styles.info}>{product.precioVenta}</Text>
                  </View>
                  <View style={styles.views}>
                    <Text style={styles.label}>Fecha de compra:</Text>
                    <Text style={styles.info}>{product.fechaCompra}</Text>
                  </View>
                  <View style={styles.views}>
                    <Text style={styles.label}>Fecha de caducidad:</Text>
                    <Text style={styles.info}>{product.fechaCaducidad}</Text>
                  </View>
                  <View style={styles.views}>
                    <Text style={styles.label}>Cantidad en stock:</Text>
                    <Text style={styles.info}>{product.cantidad}</Text>
                  </View>

                  <Image
                    style={{ width: 150, height: 100, }}
                    source={require("../assets/image.png")}
                  />

                  <Text>{product.codigo}</Text>
                </View>
              ) : (
                <Text
                  style={{
                    textAlign: "center",
                    marginTop: 150,
                    fontWeight: 900,
                    fontSize: 20,
                  }}
                >
                  {" "}
                  Este producto no esta en la base de datos {"\n"} {"\n"}{" "}
                  ¡Agregalo!{" "}
                </Text>
              )}
            </View>
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
  views:{
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 900,
  },
  info: {
    fontSize: 16,
    fontWeight: 500,
    textAlign: "right",
  },
});

export default Buscar;
