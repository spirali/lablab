import React from 'react';
//import { Button, TableContainer, TableHead, TableCell, TableBody, Table, TableRow, TableFooter, TablePagination } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { ImageInfo } from './ImageInfo';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import MaterialTable from 'material-table'
import { SERVER_URL } from './service';
import { Annotation } from './ImageInfo';
import { AnnotationState } from './ImageInfo';


export function AnnotationList(props: {astate: AnnotationState, onUpdate: (astate: AnnotationState) => void}) {
  let annotation = props.astate.annotation;

  if (annotation == null) {
    return <span>Loading ...</span>
  }

  return (
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
      actions={[
        {
          icon: 'delete',
          tooltip: 'Remove',
          onClick: (event, rowData) => {
            // Do save operation
          }
        },
        {
            icon: 'S',
            tooltip: 'Split',
            onClick: (event, rowData) => {
              // Do save operation
            }
          }
      ]}
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
      data={annotation.items}
     />
  );
}


export default AnnotationList;
