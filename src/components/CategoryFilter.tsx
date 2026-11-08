import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { theme } from '../constants/theme';

interface CategoryFilterProps<T extends string> {
  options: readonly T[];
  selected: T;
  onSelect: (value: T) => void;
  getLabel?: (value: T) => string;
}

export function CategoryFilter<T extends string>({
  options,
  selected,
  onSelect,
  getLabel = (value) => value,
}: CategoryFilterProps<T>) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {options.map((option) => {
        const active = option === selected;
        return (
          <Pressable
            key={option}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            onPress={() => onSelect(option)}
            style={[styles.chip, active && styles.chipActive]}
          >
            <Text style={[styles.label, active && styles.labelActive]}>{getLabel(option)}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: theme.spacing.sm, paddingVertical: theme.spacing.xs },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  chipActive: { backgroundColor: theme.colors.text, borderColor: theme.colors.text },
  label: { ...theme.type.label, color: theme.colors.muted },
  labelActive: { color: theme.colors.background },
});
