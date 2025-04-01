import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";

const SphereGreen = () => (
  <View style={styles.sphereGreen}>
    <View style={[styles.circle, styles.circleGreen]} />
  </View>
);

const SphereGray = () => (
  <View style={styles.sphereGray}>
    <View style={[styles.circle, styles.circleGray]} />
  </View>
);

const SignUp: React.FC = () => {
  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/ca9e464b944ab22129b2e7d0da766b29064e4364",
        }}
        style={styles.logo}
        resizeMode="contain"
      />

      <SphereGreen />
      <SphereGray />

      <View style={styles.content}>
        <View style={styles.headerContainer}>
          <Text style={styles.subtitle}>Let's get you started</Text>
          <Text style={styles.title}>Create an Account</Text>
        </View>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="#666"
          />
          <TextInput
            style={styles.input}
            placeholder="Email id"
            placeholderTextColor="#666"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#666"
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Re-enter password"
            placeholderTextColor="#666"
            secureTextEntry
          />

          <TouchableOpacity style={styles.button} onPress={() => {}}>
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#17181E",
    padding: 20,
    position: "relative",
  },
  logo: {
    width: 31,
    height: 37,
    position: "absolute",
    left: 24,
    top: 25,
  },
  sphereGreen: {
    position: "absolute",
    width: 255,
    height: 255,
    right: -50,
    top: -124,
    overflow: "hidden",
  },
  sphereGray: {
    position: "absolute",
    width: 137,
    height: 137,
    right: 308,
    top: 88,
    overflow: "hidden",
  },
  circle: {
    width: "100%",
    height: "100%",
    borderRadius: 999,
  },
  circleGreen: {
    backgroundColor: "#A9F99E",
  },
  circleGray: {
    backgroundColor: "#292929",
  },
  content: {
    marginTop: 200,
    alignItems: "center",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  subtitle: {
    color: "#FFF",
    fontSize: 21,
    marginBottom: 10,
    fontFamily: "Poppins-Regular",
  },
  title: {
    color: "#FFF",
    fontSize: 48,
    fontFamily: "Poppins-Bold",
  },
  formContainer: {
    width: "100%",
    alignItems: "center",
    gap: 20,
  },
  input: {
    width: 411,
    height: 61,
    borderRadius: 18,
    borderWidth: 4,
    borderColor: "#30303D",
    color: "#FFF",
    fontSize: 24,
    paddingHorizontal: 20,
    fontFamily: "Raleway-Regular",
  },
  button: {
    width: 481,
    height: 63,
    borderRadius: 13,
    backgroundColor: "#A9F99E",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    borderBottomWidth: 4,
    borderBottomColor: "#A9F99E",
  },
  buttonText: {
    color: "#17181E",
    fontSize: 24,
    fontFamily: "Poppins-Bold",
  },
});

export default SignUp;
