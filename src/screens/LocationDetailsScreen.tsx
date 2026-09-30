import { Text, View } from 'react-native';

export function LocationDetailsScreen({ route }: any) {
  const { location } = route.params;

  return (
    <View>
      <Text>{location.name}</Text>
      <Text>{location.category}</Text>
      <Text>{location.address}</Text>
    </View>
  );
}
