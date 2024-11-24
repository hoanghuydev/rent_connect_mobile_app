import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 30,
    fontSize: 24,
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
    color: "#333",
  },
  input: {
    marginBottom: 15,
  },
  loginButton: {
    marginTop: 10,
    marginBottom: 20,
  },
  loginButtonText: {
    fontSize: 16,
    color: "white",
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  footerText: {
    textAlign: "center",
    fontSize: 14,
    color: "#333",
  },
  registerText: {
    color: "#4CAF50",
    fontWeight: "bold",
  },
});

export default styles;
