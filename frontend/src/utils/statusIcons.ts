// src/utils/statusIcons.ts
import {
    CheckCircle as ActiveIcon,
    Pause as OnHoldIcon,
    Cancel as ClosedIcon,
    Done as FilledIcon,
    Clear as CancelledIcon,
    PriorityHigh as PriorityIcon,
    Archive as ArchivedIcon,
    Update as DeprecatedIcon,
    Help as DefaultIcon
  } from '@mui/icons-material';
  
  export const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return ActiveIcon;
      case 'on hold':
        return OnHoldIcon;
      case 'closed':
        return ClosedIcon;
      case 'filled':
        return FilledIcon;
      case 'cancelled':
        return CancelledIcon;
      case 'priority':
        return PriorityIcon;
      case 'archived':
        return ArchivedIcon;
      case 'deprecated':
        return DeprecatedIcon;
      default:
        return DefaultIcon;
    }
  };
  
  export const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'active':
        return '#4CAF50'; // Green
      case 'on hold':
        return '#FFC107'; // Amber
      case 'closed':
        return '#9E9E9E'; // Grey
      case 'filled':
        return '#2196F3'; // Blue
      case 'cancelled':
        return '#F44336'; // Red
      case 'priority':
        return '#E91E63'; // Pink
      case 'archived':
        return '#795548'; // Brown
      case 'deprecated':
        return '#FF5722'; // Deep Orange
      default:
        return '#757575'; // Dark Grey
    }
  };