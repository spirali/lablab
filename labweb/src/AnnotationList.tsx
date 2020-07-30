import React from 'react';
//import { Button, TableContainer, TableHead, TableCell, TableBody, Table, TableRow, TableFooter, TablePagination } from '@material-ui/core';
import MaterialTable from 'material-table'
import { AnnotationState } from './ImageInfo';
import { Box } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';



export function AnnotationList(props: {astate: AnnotationState, onUpdate: (astate: AnnotationState) => void}) {
  let annotation = props.astate.annotation;

  if (annotation == null) {
    return <span>Loading ...</span>
  }

  const deleteItem = () => {
    let id = props.astate.selectedId;
    if (id === undefined) {
      return;
    }
    let newList = [];
    for (let item of props.astate.annotation.items) {
      if (item.id < id) {
        newList.push(item);
      }
      if (item.id > id) {
        newList.push({...item, id: item.id - 1});
      }
    }
    props.onUpdate({...props.astate, selectedId: undefined, annotation: {...props.astate.annotation, items: newList}});
  }

  return (
    <Box>
    <MaterialTable
      options={{
        padding: "dense",
        paging: false,
        showTitle: false,
        search: false,
        toolbar: false,
        rowStyle: row => ({
          backgroundColor: (props.astate.selectedId === row.id) ? '#EEE' : '#FFF'
        })
      }}
      columns={[
        {
          title: 'id',
          field: 'id',
          width: 20,
        },
        { title: 'Position',
          render: row => row.x.toFixed(2) + "," + row.y.toFixed(2)
        },
      ]}
      onRowClick={(_evt, selectedRow) => {
          if (!selectedRow || props.astate.selectedId === selectedRow.id) {
            props.onUpdate({...props.astate, selectedId: undefined})
          } else {
            props.onUpdate({...props.astate, selectedId: selectedRow?.id})
          }
      }}
      data={annotation.items.map(a => ({...a}))}
     />
    <ButtonGroup>
        <Button onClick={deleteItem} disabled={props.astate.selectedId === undefined}>Remove</Button>
        <Button disabled={props.astate.selectedId === undefined}>Split</Button>
    </ButtonGroup>
     </Box>
  );
}


export default AnnotationList;
