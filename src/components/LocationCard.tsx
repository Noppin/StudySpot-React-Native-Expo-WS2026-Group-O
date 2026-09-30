import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { StudyLocation } from '../types/StudyLocation';
import React from 'react';

interface LocationCardProps {
  location: StudyLocation;
  onPress: (location: StudyLocation) => void;
}

export function LocationCard({
  location,
  onPress,
}: LocationCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress(location)}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.content}>
        <Text style={styles.name}>{location.name}</Text>
        <Text style={styles.category}>{location.category}</Text>
        {location.address ? (
          <Text style={styles.address}>{location.address}</Text>
        ) : null}
      </View>

      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderColor: '#e5e7eb',
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  pressed: {
    opacity: 0.7,
  },
  content: {
    flex: 1,
    paddingRight: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
  },
  category: {
    fontSize: 14,
    marginTop: 4,
  },
  address: {
    color: '#6b7280',
    fontSize: 13,
    marginTop: 4,
  },
  chevron: {
    color: '#6b7280',
    fontSize: 28,
  },
});
