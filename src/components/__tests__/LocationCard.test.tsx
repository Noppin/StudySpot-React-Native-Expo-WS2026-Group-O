import { fireEvent, render, screen } from '@testing-library/react-native';

import { useFavoritesStore } from '../../store/favoritesStore';
import type { StudyLocation } from '../../types/Location';
import { LocationCard } from '../LocationCard';

const cafe: StudyLocation = {
  id: 'node-7',
  name: 'Study Café',
  category: 'Cafe',
  amenity: 'cafe',
  osmType: 'node',
  osmId: 7,
  latitude: 48.2,
  longitude: 16.3,
  address: 'Höchstädtplatz 6, 1200 Wien',
  distanceMeters: 1530,
};

beforeEach(() => {
  useFavoritesStore.setState({ favorites: [] });
});

it('shows name, category, distance and address', async () => {
  await render(<LocationCard location={cafe} onPress={jest.fn()} />);

  expect(screen.getByText('Study Café')).toBeOnTheScreen();
  expect(screen.getByText('Cafe · 1.5 km')).toBeOnTheScreen();
  expect(screen.getByText('Höchstädtplatz 6, 1200 Wien')).toBeOnTheScreen();
});

it('opens details when pressed', async () => {
  const onPress = jest.fn();
  await render(<LocationCard location={cafe} onPress={onPress} />);

  await fireEvent.press(screen.getByLabelText('Open Study Café details'));
  expect(onPress).toHaveBeenCalledWith(cafe);
});

it('adds and removes the place from favorites', async () => {
  await render(<LocationCard location={cafe} onPress={jest.fn()} />);

  await fireEvent.press(screen.getByLabelText('Add Study Café to favorites'));
  expect(useFavoritesStore.getState().favorites).toHaveLength(1);

  await fireEvent.press(screen.getByLabelText('Remove Study Café from favorites'));
  expect(useFavoritesStore.getState().favorites).toHaveLength(0);
});

it('renders a text action instead of the heart', async () => {
  const onRemove = jest.fn();
  await render(
    <LocationCard location={cafe} onPress={jest.fn()} action={{ label: 'Remove', onPress: onRemove }} />,
  );

  await fireEvent.press(screen.getByLabelText('Remove Study Café'));
  expect(onRemove).toHaveBeenCalledWith(cafe);
  expect(screen.queryByLabelText('Add Study Café to favorites')).toBeNull();
});
