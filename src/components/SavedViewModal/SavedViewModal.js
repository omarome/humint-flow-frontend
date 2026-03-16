import React, { useState, useMemo } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Typography, 
  Box, 
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper
} from '@mui/material';
import { LucideX, LucideSave, LucideTrash2, LucideFilter } from 'lucide-react';
import { detectDangerousInput } from '../../utils/validators/sanitize';
import './SavedViewModal.less';

const SavedViewModal = ({ isOpen, onClose, query, onSave }) => {
  const [viewName, setViewName] = useState('');
  const [temporaryRules, setTemporaryRules] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize rules from query when modal opens
  React.useEffect(() => {
    if (isOpen && query?.rules) {
      setTemporaryRules([...query.rules]);
      setViewName('');
    }
  }, [isOpen, query]);

  // Validation
  const validationError = useMemo(() => {
    if (!viewName.trim()) return null;
    if (viewName.length > 100) return 'Name cannot be more than 100 characters';
    return detectDangerousInput(viewName);
  }, [viewName]);

  const handleRemoveRule = (index) => {
    setTemporaryRules(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (validationError || !viewName.trim()) return;
    
    setIsSubmitting(true);
    try {
      const savedQuery = {
        ...query,
        rules: temporaryRules
      };
      await onSave(viewName, savedQuery);
      onClose();
    } catch (error) {
      console.error('Failed to save view:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      className="saved-view-modal"
      PaperProps={{
        sx: {
          borderRadius: '24px',
          padding: '8px',
          bgcolor: 'var(--dropdown-bg)',
          color: 'var(--text-color)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--dropdown-shadow)',
          backgroundImage: 'none',
        }
      }}
      BackdropProps={{
        sx: {
          backgroundColor: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(8px)',
        }
      }}
    >
      <DialogTitle className="modal-header">
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" fontWeight="600" display="flex" alignItems="center" gap={1}>
            <LucideFilter size={20} color="var(--primary-color)" />
            Save Current View
          </Typography>
          <IconButton onClick={onClose} size="small" sx={{ color: 'var(--text-muted)' }}>
            <LucideX size={20} />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 1, mb: 3 }}>
          <TextField
            fullWidth
            label="Filter View Name"
            placeholder="e.g., Active Users from New York"
            value={viewName}
            onChange={(e) => setViewName(e.target.value)}
            error={!!validationError}
            helperText={validationError || `${viewName.length}/100 characters`}
            variant="outlined"
            autoFocus
            inputProps={{ maxLength: 100 }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                '& fieldset': { borderColor: 'var(--border-color)' },
                '&:hover fieldset': { borderColor: 'var(--primary-color)' },
              },
              '& .MuiInputLabel-root': { color: 'var(--text-muted)' },
              '& .MuiInputBase-input': { color: 'var(--text-color)' },
            }}
          />
        </Box>

        <Typography variant="subtitle2" color="var(--text-muted)" gutterBottom fontWeight="600">
          SELECTED FILTERS ({temporaryRules.length})
        </Typography>
        
        <Paper 
          variant="outlined" 
          className={`filters-review-list ${temporaryRules.length === 0 ? 'error' : ''}`}
          sx={{ 
            maxHeight: '250px', 
            overflow: 'auto', 
            borderRadius: '12px',
            borderColor: temporaryRules.length === 0 ? 'var(--error-color)' : 'var(--border-color)',
            bgcolor: 'var(--background-muted)',
            transition: 'border-color 0.2s ease',
          }}
        >
          {temporaryRules.length === 0 ? (
            <Box p={4} textAlign="center">
              <Typography color="var(--text-muted)">No filters selected</Typography>
            </Box>
          ) : (
            <List disablePadding>
              {temporaryRules.map((rule, index) => (
                <React.Fragment key={index}>
                  <ListItem
                    secondaryAction={
                      <IconButton 
                        edge="end" 
                        size="small" 
                        onClick={() => handleRemoveRule(index)}
                        sx={{ color: 'var(--error-color)', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' } }}
                      >
                        <LucideTrash2 size={16} />
                      </IconButton>
                    }
                  >
                    <ListItemText 
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <span className="filter-field">{rule.field}</span>
                          <span className="filter-op">{rule.operator}</span>
                          <span className="filter-val">{String(rule.value)}</span>
                        </Box>
                      }
                      primaryTypographyProps={{ variant: 'body2', fontWeight: '500' }}
                    />
                  </ListItem>
                  {index < temporaryRules.length - 1 && <Divider sx={{ borderColor: 'var(--border-color-light)' }} />}
                </React.Fragment>
              ))}
            </List>
          )}
        </Paper>
        {temporaryRules.length === 0 && (
          <Box sx={{ mt: 1, mb: 2 }}>
            <Typography variant="caption" color="var(--error-color)" fontWeight="500">
              * At least one filter must be selected to save a view.
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button 
          onClick={onClose} 
          sx={{ 
            color: 'var(--text-muted)',
            borderRadius: '10px',
            textTransform: 'none',
          }}
        >
          Cancel
        </Button>
        <Button 
          variant="contained" 
          onClick={handleSave}
          disabled={!viewName.trim() || !!validationError || isSubmitting || temporaryRules.length === 0}
          startIcon={<LucideSave size={18} />}
          sx={{ 
            bgcolor: 'var(--primary-color)',
            '&:hover': { bgcolor: 'var(--primary-hover)' },
            borderRadius: '10px',
            textTransform: 'none',
            px: 3,
            boxShadow: '0 4px 12px rgba(124, 105, 239, 0.3)',
          }}
        >
          {isSubmitting ? 'Saving...' : 'Save View'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SavedViewModal;
