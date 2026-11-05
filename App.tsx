import { StatusBar } from "expo-status-bar";

import { AppNavigator } from "./src/navigation/AppNavigator";
import { NavigationContainer } from "@react-navigation/native";
import { StudySpotProvider } from "./src/store/StudySpotContext";

export default function App() {
  return (
    <>
      <StudySpotProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </StudySpotProvider>
    </>
  );
}
