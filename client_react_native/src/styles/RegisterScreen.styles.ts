import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  title: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 24,
    marginBottom: 30,
    color: "#4CAF50",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333333",
  },
  input: {
    marginBottom: 15,
  },
  registerButton: {
    marginTop: 20,
    marginBottom: 30,
  },
  registerButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  footerText: {
    textAlign: "center",
    fontSize: 14,
    color: "#333333",
  },
  loginText: {
    fontWeight: "bold",
    color: "#4CAF50",
  },
});

export default styles;
