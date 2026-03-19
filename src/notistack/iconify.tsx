"use client";

import { SxProps, Theme, Box } from '@mui/material';
import { Icon, IconifyIcon } from '@iconify/react'; // Assurez-vous d'importer IconifyIcon aussi.

interface IconifyProps {
  icon: string | IconifyIcon; // Le type exact attendu pour `icon`.
  sx?: SxProps<Theme>; // `sx` est utilisé uniquement avec `Box`, pas directement avec `Icon`.
  [key: string]: unknown; // Autres props éventuelles à transmettre à `Icon`.
}

const Iconify: React.FC<IconifyProps> = ({ icon, sx, ...other }) => {
  return (
    <Box sx={sx} {...other}>
      <Icon icon={icon} />
    </Box>
  );
};

export default Iconify;