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
          <Text style={styles.eyebrow}>STUDYSPOT</Text>
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
    padding: 24,
    backgroundColor: theme.colors.background,
  },
  eyebrow: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  title: {
    color: theme.colors.text,
    fontSize: 25,
    fontWeight: '800',
    marginTop: 8,
  },
  message: {
    color: theme.colors.muted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },
  button: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.control,
    marginTop: 20,
    padding: 14,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.75,
  },
});
