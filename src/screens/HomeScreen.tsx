import { FlatList, StyleSheet, Text, View } from 'react-native';

import { LocationCard } from '../components/LocationCard';
import { getMockStudyLocations } from '../services/mockLocationService';
import type { StudyLocation } from '../types/StudyLocation';
import React from 'react';

interface HomeScreenProps {
  onSelectLocation: (location: StudyLocation) => void;
}

const locations = getMockStudyLocations();

export function HomeScreen({
  onSelectLocation,
}: HomeScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>StudySpot</Text>
      <Text style={styles.subtitle}>
        Find a suitable study location nearby.
      </Text>

      <FlatList
        data={locations}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <LocationCard
            location={item}
            onPress={onSelectLocation}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f7f7f7',
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
  },
  subtitle: {
    color: '#6b7280',
    fontSize: 16,
    marginTop: 6,
  },
  list: {
    paddingBottom: 24,
    paddingTop: 20,
  },
  separator: {
    height: 12,
  },
});
