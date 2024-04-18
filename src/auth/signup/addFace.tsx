import Reactt, { useState }  from 'react';
import { Button, Card, Grid, Container } from '@mantine/core';
import FaceScanner from '../../components/FaceScanner';
import MediaPipe from "../../components/mediaPipe";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signUpSuccess, selectUser } from '../authSlice';

const AddFace = () => {
  const [addAction, setAddAction] = useState(false);
  const navigate = useNavigate();
  const userData = useSelector(selectUser);
  const dispatch = useDispatch();
  const addfaceAction = () => { 
    setAddAction(true);
    setTimeout(() => {
      // setAddAction(false);
      // Code to be executed after the delay
      console.log('Delayed action performed');
    }, 2000);
    // console.log(addAction)
  }
  return (
    <Container my="md">
      <Grid>
        <Grid.Col span={{ base: 12, xs: 12 }}>
          <Card
            shadow="sm"
            padding="xl"
            component="a"
          >
            <FaceScanner confirmScanAction={addAction} />
            {/* <MediaPipe/> */}
            <Button variant="filled" disabled={addAction} onClick={addfaceAction}>Confirm</Button>;
          </Card>
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default AddFace;