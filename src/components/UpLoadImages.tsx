import isString from 'lodash/isString';
import { DropzoneOptions, useDropzone } from 'react-dropzone';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { SxProps } from '@mui/material';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import AddAPhotoRoundedIcon from '@mui/icons-material/AddAPhotoRounded';
import RejectionFiles from './RejectionFiles';

const DropZoneStyle = styled('div')(({ theme }) => ({
  outline: 'none',
  overflow: 'hidden',
  position: 'relative',
  height: '100px',
  padding: theme.spacing(3, 1),
  borderRadius: theme.shape.borderRadius,
  transition: theme.transitions.create('padding'),
  border: '2px dashed rgb(1, 170, 228)',
  '&:hover': { opacity: 0.72, cursor: 'pointer' },
}));

function UploadImages({
  error = false,
  files,
  helperText,
  sxStack,
  sxGrid,
  handleDelete,
  ...other
}: {
  error: boolean;
  helperText?: JSX.Element;
  files: string[] | any[];
  sxStack?: SxProps;
  sxGrid?: SxProps;
  handleDelete: (i: number) => void;
} & DropzoneOptions) {
  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } =
    useDropzone({
      multiple: true,
      ...other,
    });

  return (
    <Stack sx={{ ...sxStack }} spacing={2}>
      <DropZoneStyle
        {...getRootProps()}
        sx={{
          ...(isDragActive && { opacity: 0.72 }),
          ...((isDragReject || error) && {
            color: 'error.main',
            borderColor: 'error.light',
            bgcolor: 'error.lighter',
          }),
          ...(files.length && {
            padding: '5% 0',
          }),
        }}
      >
        <input {...getInputProps()} />

        <Stack
          direction='column'
          spacing={2}
          justifyContent='center'
          alignItems='center'
          sx={{ height: '100%' }}
        >
          <AddAPhotoRoundedIcon fontSize='large' />
          <Typography gutterBottom variant='body2' textAlign='center'>
            Drop or Select Image
          </Typography>
        </Stack>
      </DropZoneStyle>
      {files.length !== 0 && (
        <Grid container sx={{ ...sxGrid }} spacing={1} pr={1}>
          {files.map((file, i) => (
            <Grid
              item
              xs={6}
              sm={4}
              key={i}
              sx={{ position: 'relative', width: '100%', height: 140 }}
            >
              <img
                loading='lazy'
                alt='file preview'
                src={isString(file) ? file : file.preview}
                width='100%'
                height='100%'
              />

              <IconButton
                onClick={() => handleDelete(i)}
                sx={{
                  position: 'absolute',
                  top: 27,
                  right: 3,
                  bgcolor: 'primary.dark',
                }}
              >
                <CloseIcon fontSize='inherit' sx={{ color: 'white' }} />
              </IconButton>
            </Grid>
          ))}
        </Grid>
      )}
      {fileRejections.length > 0 && <RejectionFiles fileRejections={fileRejections} />}
      {helperText && helperText}
    </Stack>
  );
}

export default UploadImages;
