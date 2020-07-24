import React from 'react';
import logo from './logo.svg';
import './App.css';
import ImageTable from './ImageTable';
import { Button, Paper, Grid, Container } from '@material-ui/core';
import { ImageInfo } from './ImageInfo';
import { Annotator } from './Annotator';
import AnnotationList from './AnnotationList';
import { AnnotationState } from './ImageInfo';

const emptyAnnotation = {items:
        //[{id: 0, x: 100, y: 100}, {id: 1, x: 120, y: 90}, {id: 2, x: 220, y: 90}]
        []
};
const annotation = undefined;


function App() {
    //const [images, setImages] = React.useState([]);
    const [images, setImages] = React.useState<ImageInfo[] | null>([]);
    const [currentImage, setCurrentImage] = React.useState<ImageInfo | undefined>(undefined);
    const [astate, setAstate] = React.useState<AnnotationState>({annotation: emptyAnnotation});

    React.useEffect(() => {
        fetch('http://localhost:3800/images')
        .then(response => response.json())
        .then(data => {
            setImages(data);
            if (data) {
                setCurrentImage(data[0]);
            } else {
                setCurrentImage(undefined);
            }
        })
    }, []);

    const setCurrent = (iinfo?: ImageInfo) => {
        setAstate({annotation: emptyAnnotation});
        setCurrentImage(iinfo);
    }

    /*
    const astate : AnnotationState = {
        annotation: annotation
    };*/

    return (
        <Grid container spacing={3}>
        <Grid item xs={8}>
          <Annotator image={currentImage} astate={astate} setAstate={setAstate}/>
        </Grid>
        <Grid item xs={4}>
            <ImageTable images={images} selectedImage={currentImage} onSelect={setCurrent}/>
            <AnnotationList astate={astate} onUpdate={setAstate}/>
        </Grid>
        </Grid>);
}

export default App;
