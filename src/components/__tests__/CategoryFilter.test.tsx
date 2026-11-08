import { fireEvent, render, screen } from '@testing-library/react-native';

import { CATEGORY_FILTER_OPTIONS } from '../../utils/filters';
import { CategoryFilter } from '../CategoryFilter';

it('marks the selected category and reports new selections', async () => {
  const onSelect = jest.fn();
  await render(<CategoryFilter options={CATEGORY_FILTER_OPTIONS} selected="All" onSelect={onSelect} />);

  expect(screen.getByRole('button', { name: 'All' })).toBeSelected();
  expect(screen.getByRole('button', { name: 'Library' })).not.toBeSelected();

  await fireEvent.press(screen.getByRole('button', { name: 'Library' }));
  expect(onSelect).toHaveBeenCalledWith('Library');
});
