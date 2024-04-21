import PublishingComponent from './PublishingComponent';
import PlayingComponent from './PlayingComponent';
import Container from '@mui/material/Container';
import Grid  from '@mui/material/Grid';
const AntMedia = () => {
  return (
    <Container>
         <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
         <Grid item xs={6}>
      <PlayingComponent /></Grid>
      <Grid item xs={6}>
      <PublishingComponent/></Grid>
      </Grid>
    </Container>
  );
};

export default AntMedia;