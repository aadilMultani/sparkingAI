import Chip from '@mui/material/Chip';
import IconifyIcon from 'components/base/IconifyIcon';

interface StatusChipProps {
  status: 'delivered' | 'canceled' | 'pending' | 'New' | 'In Progress' | 'Completed' | 'Cancelled';
}

const StatusChip = ({ status }: StatusChipProps) => {
  return (
    <Chip
      variant="outlined"
      size="small"
      icon={
        <IconifyIcon
          icon="radix-icons:dot-filled"
          sx={(theme) => ({
            color:
              status === 'New'
                ? `#2a75fd !important` :
                status === 'delivered' || status === 'Completed'
                  ? `${theme.palette.success.main} !important`
                  : status === 'pending' || status === 'In Progress'
                    ? `${theme.palette.warning.main} !important`
                    : `${theme.palette.error.main} !important`,
          })}
        />
      }
      label={status}
      sx={{
        pr: 0.65,
        width: 80,
        justifyContent: 'center',
        color:
          status === 'New'
            ? `#2a75fd`
            : status === 'delivered' || status === 'Completed'
              ? 'success.main'
              : status === 'pending' || status === 'In Progress'
                ? 'warning.main'
                : 'error.main',
        letterSpacing: 0.5,
        bgcolor:
          status === 'New'
            ? `#165eff33`
            : status === 'delivered' || status === 'Completed'
              ? 'transparent.success.main'
              : status === 'pending' || status === 'In Progress'
                ? 'transparent.warning.main'
                : 'transparent.error.main',
        borderColor:
          status === 'New'
            ? `#1668ff33`
            : status === 'delivered' || status === 'Completed'
              ? 'transparent.success.main'
              : status === 'pending' || status === 'In Progress'
                ? 'transparent.warning.main'
                : 'transparent.error.main',
      }}
    />
  );
};

export default StatusChip;
