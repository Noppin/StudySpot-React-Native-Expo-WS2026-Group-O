import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '../constants/theme';

interface AppErrorBoundaryProps {
  children: ReactNode;
}

interface AppErrorBoundaryState {
  hasError: boolean;
}

/**
 * Prevents an unexpected rendering error from leaving the app on a blank screen.
 * The user can retry the current screen without restarting the application.
 */
export class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('StudySpot encountered a rendering error.', error, info.componentStack);
  }

  private retry = (): void => {
    this.setState({ hasError: false });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <View style={styles.container} accessibilityRole="alert">
          <Text style={styles.eyebrow}>StudySpot</Text>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.message}>
            The current screen could not be displayed. You can try loading it again.
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={this.retry}
            style={({ pressed }) => [styles.button, pressed && styles.pressed]}
          >
            <Text style={styles.buttonText}>Try again</Text>
          </Pressable>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.background,
  },
  eyebrow: { ...theme.type.label, color: theme.colors.subtle },
  title: { ...theme.type.title, color: theme.colors.text, marginTop: theme.spacing.sm },
  message: { ...theme.type.body, color: theme.colors.muted, marginTop: theme.spacing.sm },
  button: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.text,
    borderRadius: theme.radius.pill,
    marginTop: theme.spacing.xl,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  buttonText: { ...theme.type.label, color: theme.colors.background },
  pressed: { opacity: 0.6 },
});
