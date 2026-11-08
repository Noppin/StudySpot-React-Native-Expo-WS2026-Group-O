import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '../components/ScreenContainer';
import { theme } from '../constants/theme';
import { useCurrentLocation } from '../hooks/useCurrentLocation';
import type { HomeStackParamList } from '../navigation/navigationTypes';
import { useFavoritesStore, useIsFavorite } from '../store/favoritesStore';
import { distanceInMeters, formatDistance } from '../utils/distance';

type Props = NativeStackScreenProps<HomeStackParamList, 'LocationDetails'>;

function toUrl(website: string): string {
  return /^https?:\/\//i.test(website) ? website : `https://${website}`;
}

export function LocationDetailsScreen({ route }: Props) {
  const { location } = route.params;
  const { origin, coordinates } = useCurrentLocation();
  const isFavorite = useIsFavorite(location.id);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

  // Recalculate so the value is also correct for favourites opened later.
  const distance = formatDistance(distanceInMeters(origin, location));
  const distanceLabel = `${distance} ${coordinates ? 'from you' : 'from the default location'}`;

  async function openWebsite() {
    if (!location.website) return;
    const url = toUrl(location.website);
    if (await Linking.canOpenURL(url)) await Linking.openURL(url);
  }

  return (
    <ScreenContainer padded={false} edges={['left', 'right', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.category}>{location.category}</Text>
        <Text accessibilityRole="header" style={styles.title}>
          {location.name}
        </Text>
        <Text style={styles.distance}>{distanceLabel}</Text>

        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: isFavorite }}
          onPress={() => toggleFavorite(location)}
          style={({ pressed }) => [
            styles.favoriteButton,
            isFavorite && styles.favoriteButtonActive,
            pressed && styles.pressed,
          ]}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={18}
            color={isFavorite ? theme.colors.background : theme.colors.text}
          />
          <Text style={[styles.favoriteText, isFavorite && styles.favoriteTextActive]}>
            {isFavorite ? 'Saved to favorites' : 'Add to favorites'}
          </Text>
        </Pressable>

        <View style={styles.section}>
          <DetailRow label="Address" value={location.address ?? 'Not available'} />
          <DetailRow label="Category" value={`${location.category} (amenity=${location.amenity})`} />
          <DetailRow label="Distance" value={distance ?? 'Unknown'} />
          <DetailRow
            label="Coordinates"
            value={`${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}`}
          />
          <DetailRow label="Opening hours" value={location.openingHours ?? 'Not provided'} />
          <DetailRow
            label="Website"
            value={location.website ?? 'Not provided'}
            onPress={location.website ? () => void openWebsite() : undefined}
          />
          <DetailRow label="OpenStreetMap ID" value={`${location.osmType}/${location.osmId}`} last />
        </View>

        <Text style={styles.attribution}>
          Data © OpenStreetMap contributors. Details may be incomplete or outdated.
        </Text>
      </ScrollView>
    </ScreenContainer>
  );
}

interface DetailRowProps {
  label: string;
  value: string;
  onPress?: () => void;
  last?: boolean;
}

function DetailRow({ label, value, onPress, last }: DetailRowProps) {
  const content = (
    <>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, onPress && styles.link]} selectable={!onPress}>
        {value}
      </Text>
    </>
  );

  return onPress ? (
    <Pressable
      accessibilityRole="link"
      onPress={onPress}
      style={({ pressed }) => [styles.row, last && styles.rowLast, pressed && styles.pressed]}
    >
      {content}
    </Pressable>
  ) : (
    <View style={[styles.row, last && styles.rowLast]}>{content}</View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: theme.spacing.screen, paddingBottom: theme.spacing.xl },
  category: { ...theme.type.label, color: theme.colors.accent },
  title: { ...theme.type.title, color: theme.colors.text, marginTop: theme.spacing.xs },
  distance: { ...theme.type.caption, color: theme.colors.muted, marginTop: theme.spacing.xs },
  favoriteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.xl,
    paddingVertical: 12,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  favoriteButtonActive: { backgroundColor: theme.colors.text, borderColor: theme.colors.text },
  favoriteText: { ...theme.type.label, fontSize: 14, color: theme.colors.text },
  favoriteTextActive: { color: theme.colors.background },
  section: { marginTop: theme.spacing.xl },
  row: {
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
  },
  rowLast: { borderBottomWidth: 0 },
  label: { ...theme.type.label, color: theme.colors.subtle, marginBottom: 3 },
  value: { ...theme.type.body, color: theme.colors.text },
  link: { color: theme.colors.accent },
  pressed: { opacity: 0.6 },
  attribution: { ...theme.type.caption, fontSize: 11, color: theme.colors.subtle, marginTop: theme.spacing.lg },
});
