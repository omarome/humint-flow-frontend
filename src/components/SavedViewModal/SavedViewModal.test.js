import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { jest } from '@jest/globals';
import SavedViewModal from './SavedViewModal';


describe('SavedViewModal', () => {
  const mockQuery = {
    combinator: 'and',
    rules: [
      { field: 'firstName', operator: '=', value: 'John' },
      { field: 'age', operator: '>', value: '25' }
    ]
  };

  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly when open', () => {
    render(
      <SavedViewModal 
        isOpen={true} 
        onClose={mockOnClose} 
        query={mockQuery} 
        onSave={mockOnSave} 
      />
    );

    expect(screen.getByText(/Save Current View/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Filter View Name/i)).toBeInTheDocument();
    expect(screen.getByText(/SELECTED FILTERS \(2\)/i)).toBeInTheDocument();
  });

  it('validates name length', () => {
    render(
      <SavedViewModal 
        isOpen={true} 
        onClose={mockOnClose} 
        query={mockQuery} 
        onSave={mockOnSave} 
      />
    );

    const input = screen.getByLabelText(/Filter View Name/i);
    fireEvent.change(input, { target: { value: 'a'.repeat(101) } });
    
    expect(screen.getByText(/Name cannot be more than 100 characters/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Save View/i })).toBeDisabled();
  });

  it('validates dangerous characters', () => {
    render(
      <SavedViewModal 
        isOpen={true} 
        onClose={mockOnClose} 
        query={mockQuery} 
        onSave={mockOnSave} 
      />
    );

    const input = screen.getByLabelText(/Filter View Name/i);
    fireEvent.change(input, { target: { value: 'My View;' } });
    
    expect(screen.getByText(/Character ";" is not allowed/i)).toBeInTheDocument();
  });

  it('allows removing rules', () => {
    render(
      <SavedViewModal 
        isOpen={true} 
        onClose={mockOnClose} 
        query={mockQuery} 
        onSave={mockOnSave} 
      />
    );

    const removeButtons = screen.getAllByRole('button').filter(b => b.querySelector('svg'));
    // The first rule's trash icon
    fireEvent.click(removeButtons[1]); // Index 0 is close button, index 1 is first trash icon

    expect(screen.getByText(/SELECTED FILTERS \(1\)/i)).toBeInTheDocument();
    expect(screen.queryByText('firstName')).not.toBeInTheDocument();
  });

  it('calls onSave with correct data', async () => {
    mockOnSave.mockResolvedValue({});
    
    render(
      <SavedViewModal 
        isOpen={true} 
        onClose={mockOnClose} 
        query={mockQuery} 
        onSave={mockOnSave} 
      />
    );

    const input = screen.getByLabelText(/Filter View Name/i);
    fireEvent.change(input, { target: { value: 'My Saved View' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Save View/i }));

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith('My Saved View', mockQuery);
      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});
