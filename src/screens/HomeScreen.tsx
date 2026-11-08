import { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';

import { CategoryFilter } from '../components/CategoryFilter';
import { ErrorView } from '../components/ErrorView';
import { InfoBanner } from '../components/InfoBanner';
import { LoadingView } from '../components/LoadingView';
import { LocationCard } from '../components/LocationCard';
import { OfflineBanner, formatCacheAge } from '../components/OfflineBanner';
import { ScreenContainer } from '../components/ScreenContainer';
import { ScreenHeader } from '../components/ScreenHeader';
import { SearchBar } from '../components/SearchBar';
import { theme } from '../constants/theme';
import type { LocationStatus } from '../hooks/useCurrentLocation';
import { useLocations } from '../hooks/useLocations';
import { useOpenLocationDetails } from '../navigation/useOpenLocationDetails';
import { useSettingsStore } from '../store/settingsStore';
import type { CategoryFilterValue } from '../types/Settings';
import { CATEGORY_FILTER_OPTIONS, filterLocations, isFilterActive } from '../utils/filters';

const LOCATION_STATUS_LABELS: Record<LocationStatus, string> = {
  requesting: 'Finding your location…',
  granted: 'Near your current location',
  denied: 'Near FH Technikum Wien · location off',
  unavailable: 'Near FH Technikum Wien · GPS unavailable',
  disabled: 'Near FH Technikum Wien',
};

export function HomeScreen() {
  const openDetails = useOpenLocationDetails();
  const preferredCategory = useSettingsStore((state) => state.preferredCategory);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryFilterValue>(preferredCategory);
  const {
    locations,
    currentLocation,
    updatedAt,
    isShowingCache,
    isInitialLoading,
    isRefreshing,
    error,
    refresh,
  } = useLocations();

  // Apply the preferred category from Settings (also after it is rehydrated).
  useEffect(() => setCategory(preferredCategory), [preferredCategory]);

  const filter = useMemo(() => ({ query, category }), [query, category]);
  const filtered = useMemo(() => filterLocations(locations, filter), [locations, filter]);
  const filterActive = isFilterActive(filter);

  function resetFilters() {
    setQuery('');
    setCategory('All');
  }

  const hasData = locations.length > 0;
  const summary = hasData
    ? `${filtered.length} of ${locations.length} places${
        updatedAt ? ` · updated ${formatCacheAge(updatedAt)}` : ''
      }`
    : null;

  function renderEmpty() {
    if (isInitialLoading) return <LoadingView />;
    if (!hasData && error) {
      return <ErrorView title="Could not load places" message={error} onAction={refresh} />;
    }
    if (filterActive) {
      return (
        <ErrorView
          title="No matching places"
          message="Try another name or category."
          actionLabel="Reset filters"
          onAction={resetFilters}
        />
      );
    }
    return <ErrorView title="No places yet" message="Pull down to refresh." />;
  }

  return (
    <ScreenContainer padded={false}>
      <View style={styles.header}>
        <ScreenHeader title="StudySpot" subtitle={LOCATION_STATUS_LABELS[currentLocation.status]} />
        <SearchBar value={query} onChangeText={setQuery} />
        <View style={styles.filterRow}>
          <CategoryFilter
            options={CATEGORY_FILTER_OPTIONS}
            selected={category}
            onSelect={setCategory}
          />
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing && !isInitialLoading}
            onRefresh={refresh}
            tintColor={theme.colors.accent}
            colors={[theme.colors.accent]}
          />
        }
        ListHeaderComponent={
          <View>
            {isShowingCache ? <OfflineBanner cachedAt={updatedAt} /> : null}
            {error && hasData ? <InfoBanner tone="error" message={error} /> : null}
            {currentLocation.message ? (
              <InfoBanner tone="warning" message={currentLocation.message} />
            ) : null}
            {summary ? (
              <View style={styles.summaryRow}>
                <Text style={styles.summary}>{summary}</Text>
                {filterActive ? (
                  <Pressable accessibilityRole="button" onPress={resetFilters} hitSlop={8}>
                    <Text style={styles.reset}>Reset</Text>
                  </Pressable>
                ) : null}
              </View>
            ) : null}
          </View>
        }
        ListEmptyComponent={renderEmpty()}
        renderItem={({ item }) => <LocationCard location={item} onPress={openDetails} />}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: theme.spacing.screen,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
  },
  filterRow: { marginTop: theme.spacing.md },
  list: {
    paddingHorizontal: theme.spacing.screen,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.xl,
    flexGrow: 1,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: theme.spacing.xs,
  },
  summary: { ...theme.type.label, color: theme.colors.subtle },
  reset: { ...theme.type.label, color: theme.colors.accent },
});
