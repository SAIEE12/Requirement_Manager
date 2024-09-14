// src/utils/domainIcons.ts
import { 
    Memory as HardwareIcon,
    Code as SoftwareIcon,
    SettingsInputComponent as EmbeddedIcon,
    DirectionsCar as AutomotiveIcon,
    Psychology as AIMLIcon,
    Domain as DefaultIcon
  } from '@mui/icons-material';
  
  export const getDomainIcon = (domainName: string) => {
    switch (domainName.toLowerCase()) {
      case 'hardware':
        return HardwareIcon;
      case 'software':
        return SoftwareIcon;
      case 'embedded':
        return EmbeddedIcon;
      case 'automotive':
        return AutomotiveIcon;
      case 'ai/ml':
        return AIMLIcon;
      default:
        return DefaultIcon;
    }
  };
  
  export const getDomainColor = (domainName: string): string => {
    switch (domainName.toLowerCase()) {
      case 'hardware':
        return '#4CAF50'; // Green
      case 'software':
        return '#2196F3'; // Blue
      case 'embedded':
        return '#FF9800'; // Orange
      case 'automotive':
        return '#F44336'; // Red
      case 'ai/ml':
        return '#9C27B0'; // Purple
      default:
        return '#757575'; // Grey
    }
  };