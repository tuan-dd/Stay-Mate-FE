import { alpha } from '@mui/material/styles';
import { FileRejection } from 'react-dropzone';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { fData } from '../utils/numberFormat';

function RejectionFiles({ fileRejections }: { fileRejections: FileRejection[] }) {
  return (
    <Paper
      variant='outlined'
      sx={{
        py: 1,
        px: 2,
        mt: 3,
        borderColor: 'error.light',
        bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
      }}
    >
      {fileRejections.map(({ file, errors }, i) => {
        if ('path' in file) {
          return (
            <Box key={file.path as number} sx={{ my: 1 }}>
              <Typography variant='subtitle2' noWrap>
                {file.path as number} - {fData(file.size)}
              </Typography>

              {errors.map((error) => (
                <Typography key={error.code} variant='caption' component='p'>
                  - {error.message}
                </Typography>
              ))}
            </Box>
          );
        }
        return (
          <Box key={i} sx={{ my: 1 }}>
            <Typography variant='subtitle2' noWrap>
              {file.name} - {fData(file.size)}
            </Typography>

            {errors.map((error) => (
              <Typography key={error.code} variant='caption' component='p'>
                - {error.message}
              </Typography>
            ))}
          </Box>
        );
      })}
    </Paper>
  );
}

export default RejectionFiles;
