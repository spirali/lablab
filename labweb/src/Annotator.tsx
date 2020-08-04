import React from 'react';
import { MouseEvent } from 'react';
//import { Button, TableContainer, TableHead, TableCell, TableBody, Table, TableRow, TableFooter, TablePagination } from '@material-ui/core';
import { ImageInfo } from './ImageInfo';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Box from '@material-ui/core/Box';
import { SERVER_URL } from './service';
import { AnnotationState } from './ImageInfo';


export function Annotator(props: {image?: ImageInfo, astate: AnnotationState, setAstate: (astate: AnnotationState) => void, revert: () => void, save: () => void}) {
    let image = props.image;

    const annotation = props.astate.annotation;
    const [zoom, setZoom] = React.useState<number>(1);
    const svgRef = React.useRef<SVGSVGElement>(null);

    if (!image) {
        return <span>No Image</span>
    }

    let image_url = SERVER_URL + "/image/" + image.path;
    let width = 2 / zoom;

    const ZOOM_STEP = 0.25;

    const onClick = (evt: MouseEvent<SVGSVGElement>) => {
        //const e = evt.target as HTMLElement;
        //const dim = e.getBoundingClientRect();

        let current : unknown = svgRef.current;
        if (current === null) {
            return;
        }

        const dim = (current as HTMLElement).getBoundingClientRect()
        const x = evt.clientX - dim.left;
        const y = evt.clientY - dim.top;
        const astate = props.astate;
        if (!astate.annotation) {
            return;
        }
        const items = astate.annotation.items;
        let newItems;
        if (astate.selectedId !== undefined) {
            newItems = [...items];
            newItems[astate.selectedId] = {id: astate.selectedId, x: x / zoom, y: y / zoom}
        } else {
            newItems = [...items, {id: items.length, x: x / zoom, y: y / zoom}];
        }
        props.setAstate({
            ...astate,
            annotation: {
                ...astate.annotation,
                items: newItems,
            }
        })
    };

    return (
    <Box m={1}>
        <Box m={1}>
        <ButtonGroup>
            <Button onClick={()=> setZoom(zoom + ZOOM_STEP)}>+</Button>
            <Button onClick={()=> setZoom(zoom - ZOOM_STEP)}>-</Button>
        </ButtonGroup>
        <ButtonGroup>
        <Button disabled={!props.astate.changed} onClick={props.save}>Save</Button>
        <Button disabled={!props.astate.changed} onClick={props.revert}>Revert</Button>
        </ButtonGroup>
        </Box>
        <Box>
        <svg
             ref={svgRef}
             onMouseDown={onClick}
            viewBox={"0 0 " + image.width + " " + image.height} style={{width: image.width * zoom, height: image.height * zoom}}>
            <image href={image_url} height={image.height} width={image.width}/>
            {
                annotation?(annotation.items.map((a) => {
                    if (a.id === props.astate.selectedId) {
                        return <circle key={"circ" + a.id} cx={a.x} cy={a.y} r={width*2} stroke={"#ff0"} strokeWidth={width} fill="#f0f"/>
                    } else {
                        return <circle key={"circ" + a.id} cx={a.x} cy={a.y} r={width*2} stroke={"#f0f"} strokeWidth={width} fill="none"/>
                    }
                })):null
            }
            {
                annotation?(annotation.items.map((a, i) =>
                    i > 0?<line key={"line" + a.id} x1={a.x} y1={a.y} x2={annotation!.items[i-1].x} y2={annotation!.items[i-1].y} stroke="#f0f" strokeWidth={width}/>:null
                )):null
            }
        </svg>
        </Box>
    </Box>);
}


export default Annotator;