import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { InfoBanner } from '../components/InfoBanner';
import { LocationCard } from '../components/LocationCard';
import { ScreenContainer } from '../components/ScreenContainer';
import { theme } from '../constants/theme';
import { useStudySpot } from '../hooks/useStudySpot';
import type { StudyLocation } from '../types/Location';

interface HomeScreenProps {
  onSelectLocation: (location: StudyLocation) => void;
}

export function HomeScreen({ onSelectLocation }: HomeScreenProps) {
  const [search, setSearch] = useState('');
  const {
    locations,
    isLoading,
    error,
    dataSource,
    refresh,
  } = useStudySpot();

  const filteredLocations = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return locations;

    return locations.filter((location) =>
      [location.name, location.category, location.address ?? '']
        .join(' ')
        .toLowerCase()
        .includes(term),
    );
  }, [locations, search]);

  const sourceLabel = {
    live: 'Live OpenStreetMap results',
    cache: 'Showing saved offline results',
    sample: 'Showing sample campus locations',
  }[dataSource];

  return (
    <ScreenContainer padded={false}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>FIND YOUR NEXT STUDY PLACE</Text>
        <Text style={styles.title}>StudySpot</Text>
        <Text style={styles.subtitle}>
          Libraries, cafés and quiet places around campus.
        </Text>
        <TextInput
          accessibilityLabel="Search study places"
          placeholder="Search name, category or address"
          placeholderTextColor={theme.colors.muted}
          value={search}
          onChangeText={setSearch}
          style={styles.search}
          returnKeyType="search"
        />
        <View style={styles.sourceRow}>
          <View style={[styles.sourceDot, dataSource === 'live' && styles.liveDot]} />
          <Text style={styles.sourceText}>{sourceLabel}</Text>
          {isLoading ? <ActivityIndicator size="small" color={theme.colors.accent} /> : null}
        </View>
      </View>

      <FlatList
        data={filteredLocations}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={() => void refresh()} />
        }
        ListHeaderComponent={
          error ? <InfoBanner message={`${error} ${sourceLabel}.`} tone="error" /> : undefined
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No places found</Text>
            <Text style={styles.emptyText}>Try another search or refresh the list.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <LocationCard
            location={item}
            onPress={onSelectLocation}
          />
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.screen,
    paddingTop: 22,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  eyebrow: {
    color: theme.colors.accent,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.3,
  },
  title: {
    color: theme.colors.text,
    fontSize: 32,
    fontWeight: '800',
    marginTop: 5,
  },
  subtitle: {
    color: theme.colors.muted,
    fontSize: 14,
    marginTop: 4,
  },
  search: {
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 18,
    color: theme.colors.text,
  },
  sourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  sourceDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#C18A35',
  },
  liveDot: { backgroundColor: '#2D9660' },
  sourceText: { color: theme.colors.muted, fontSize: 11, flex: 1 },
  list: {
    paddingHorizontal: theme.spacing.screen,
    paddingTop: 14,
    paddingBottom: 28,
    flexGrow: 1,
  },
  separator: { height: 10 },
  empty: { padding: 24, alignItems: 'center' },
  emptyTitle: { color: theme.colors.text, fontWeight: '700', fontSize: 17 },
  emptyText: { color: theme.colors.muted, marginTop: 5, textAlign: 'center' },
});
