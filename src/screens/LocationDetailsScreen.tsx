import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ScreenContainer } from '../components/ScreenContainer';
import { theme } from '../constants/theme';
import type { RootStackParamList } from '../navigation/navigationTypes';

type Props = NativeStackScreenProps<RootStackParamList, 'Details'>;

export function LocationDetailsScreen({ route }: Props) {
  const { location } = route.params;

  async function openWebsite() {
    if (!location.website) return;
    const url = location.website.startsWith('http')
      ? location.website
      : `https://${location.website}`;
    if (await Linking.canOpenURL(url)) {
      await Linking.openURL(url);
    }
  }

  return (
    <ScreenContainer padded={false}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.category}>{location.category.toUpperCase()}</Text>
        <Text style={styles.title}>{location.name}</Text>
        <Text style={styles.intro}>
          Study place details collected from {location.source === 'sample' ? 'local sample data' : 'OpenStreetMap'}.
        </Text>

        <View style={styles.card}>
          <DetailRow label="Address" value={location.address ?? 'Address not available'} />
          <DetailRow label="Opening hours" value={location.openingHours ?? 'Not provided'} />
          <DetailRow label="Coordinates" value={`${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}`} />
          {location.distanceMeters !== undefined ? (
            <DetailRow label="Distance" value={`${Math.round(location.distanceMeters)} metres`} />
          ) : null}
        </View>

        {location.website ? (
          <Pressable
            accessibilityRole="link"
            onPress={() => void openWebsite()}
            style={({ pressed }) => [styles.websiteButton, pressed && styles.pressed]}
          >
            <Text style={styles.websiteText}>Open website ↗</Text>
          </Pressable>
        ) : null}

        <Text style={styles.attribution}>
          Map data © OpenStreetMap contributors. Place details may be incomplete or outdated.
        </Text>
      </ScrollView>
    </ScreenContainer>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 36 },
  category: { color: theme.colors.accent, fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
  title: { color: theme.colors.text, fontSize: 29, fontWeight: '800', marginTop: 7 },
  intro: { color: theme.colors.muted, fontSize: 13, lineHeight: 19, marginTop: 7 },
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.md,
    paddingHorizontal: 16,
    marginTop: 22,
  },
  row: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  label: { color: theme.colors.muted, fontSize: 11, fontWeight: '700', marginBottom: 5 },
  value: { color: theme.colors.text, fontSize: 14, lineHeight: 20 },
  websiteButton: {
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radius.md,
    padding: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  websiteText: { color: '#FFFFFF', fontWeight: '700' },
  pressed: { opacity: 0.75 },
  attribution: { color: theme.colors.muted, fontSize: 10, lineHeight: 15, marginTop: 20 },
});
