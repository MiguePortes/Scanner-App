import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  Pressable,
} from "react-native";
import { useState} from "react";


import Registrar from "./Screens/Registrar";
import Buscar from "./Screens/Buscar";

export default function App() {
  const [showbuttons, setShowbuttons] = useState(true);
  const [active, setActive] = useState<"registrar" | "buscar">("registrar");

  return (
    <>
      {active === "registrar" ? (
        <Registrar setShowbuttons={setShowbuttons} />
      ) : (
        <Buscar setShowbuttons={setShowbuttons} />
      )}
      <StatusBar style="auto" />

      {showbuttons === true ? (
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            position: "absolute",
            bottom: 0,
          }}
        >
          <Pressable
            onPress={() => setActive("registrar")}
            style={{
              width: "50%",
              backgroundColor: active === "registrar" ? "#0A3B6C" : "#fff",
              borderTopColor: "#000",
              borderTopWidth: 2,
              padding: 20,
            }}
          >
            <Text
              style={{
                color: active === "registrar" ? "#fff" : "#0a3b6c",
                fontWeight: "900",
                textAlign: "center",
                fontSize: 18,
              }}
            >
              Registrar
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setActive("buscar")}
            style={{
              width: "50%",
              backgroundColor: active === "buscar" ? "#0a3b6c" : "#fff",
              padding: 20,
              borderTopWidth: 2,
              borderTopColor: "#000",
            }}
          >
            <Text
              style={{
                color: active === "buscar" ? "#fff" : "#0A3B6C",
                fontWeight: "900",
                textAlign: "center",
                fontSize: 18,
              }}
            >
              Buscar
            </Text>
          </Pressable>
        </View>
      ) : (
        <></>
      )}
    </>
  );
}
