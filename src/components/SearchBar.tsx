import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { theme } from '../constants/theme';

interface SearchBarProps {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search by name',
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⌕</Text>
      <TextInput
        accessibilityLabel="Search study places"
        placeholder={placeholder}
        placeholderTextColor={theme.colors.subtle}
        value={value}
        onChangeText={onChangeText}
        style={styles.input}
        returnKeyType="search"
        autoCorrect={false}
      />
      {value ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          hitSlop={10}
          onPress={() => onChangeText('')}
        >
          <Text style={styles.clear}>×</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  icon: { color: theme.colors.subtle, fontSize: 18 },
  input: { ...theme.type.body, flex: 1, color: theme.colors.text, paddingVertical: 11 },
  clear: { color: theme.colors.muted, fontSize: 20, lineHeight: 22 },
});
