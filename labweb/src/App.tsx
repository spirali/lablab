import React from 'react';
import logo from './logo.svg';
import './App.css';
import ImageTable from './ImageTable';
import { Button, Paper, Grid, Container, Box } from '@material-ui/core';
import { ImageInfo, ImageMap, Annotation } from './ImageInfo';
import { Annotator } from './Annotator';
import AnnotationList from './AnnotationList';
import { AnnotationState } from './ImageInfo';
import CircularProgress from '@material-ui/core/CircularProgress';
import { SERVER_URL, uploadAnnotation } from './service';


const emptyAnnotation = {items:
        //[{id: 0, x: 100, y: 100}, {id: 1, x: 120, y: 90}, {id: 2, x: 220, y: 90}]
        [],
};
const annotation = undefined;


enum InfoState {
    LOADING,
    ERROR
}

interface Info {
    state: InfoState,
    message?: string,
}



function App() {
    //const [images, setImages] = React.useState([]);
    const [images, setImages] = React.useState<ImageMap>({});
    const [currentImage, setCurrentImage] = React.useState<ImageInfo | undefined>(undefined);
    const [astate, setAstate] = React.useState<AnnotationState>({annotation: emptyAnnotation, changed: false, annotationBackup: emptyAnnotation});
    const [info, setInfo] = React.useState<Info | null>({state: InfoState.LOADING});

    React.useEffect(() => {
        fetch(SERVER_URL + '/images')
        .then(response => response.json())
        .then(data => {
            setInfo(null);
            setImages(data);
            if (data) {
                setCurrentImage(data[0]);
            } else {
                setCurrentImage(undefined);
            }
        }).catch(e => {
            setInfo({state: InfoState.ERROR, message: "Connection to service failed:" + e})
        })
    }, []);

    const setCurrent = (iinfo?: ImageInfo) => {
        save()
        let newAnnotation;
        if (iinfo && iinfo.annotation) {
            newAnnotation = iinfo.annotation;
        } else {
            newAnnotation = emptyAnnotation;
        }
        setAstate({annotation: newAnnotation, changed: false, annotationBackup: newAnnotation});
        setCurrentImage(iinfo);
    }

    const updateAState = (astate: AnnotationState) => {
        astate.changed = true;
        setAstate(astate);
    }

    const save = () => {
        if (astate.changed && images && currentImage && astate.annotation) {
            uploadAnnotation(currentImage.id, astate.annotation).then(r =>
                {
                    console.log(r);
                    if (!r.ok || r.status !== 200) {
                        setInfo({state: InfoState.ERROR, message: "Uploading annotation failed"})
                    }
                });
            let annotation = astate.annotation;
            let tmp = {...images};
            tmp[currentImage.id] = {...currentImage, annotation: annotation}
            setImages(tmp);
            setAstate({...astate, changed: false, annotationBackup: annotation});
        }
    }

    const revert = () => {
        setAstate({...astate, changed: false, annotation: astate.annotationBackup});
    };


    /*
    const astate : AnnotationState = {
        annotation: annotation
    };*/

    if (info) {
        if (info.state === InfoState.LOADING) {
            return <CircularProgress/>
        }
        return (
            <Box color="error.main">{info.message}</Box>
        )
    }

    return (
        <Grid container spacing={3}>
        <Grid item xs={8}>
          <Annotator image={currentImage} astate={astate} setAstate={updateAState} revert={revert} save={save}/>
        </Grid>
        <Grid item xs={4}>
            <ImageTable images={images} selectedImage={currentImage} onSelect={setCurrent}/>
            <AnnotationList astate={astate} onUpdate={setAstate}/>
        </Grid>
        </Grid>);
}

export default App;
