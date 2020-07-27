import React from 'react';
//import { Button, TableContainer, TableHead, TableCell, TableBody, Table, TableRow, TableFooter, TablePagination } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { ImageInfo, ImageMap } from './ImageInfo';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import MaterialTable from 'material-table'
import { SERVER_URL } from './service';


import Icon from '@material-ui/core/Icon';



function ImageTable(props: {images: ImageMap, selectedImage?: ImageInfo, onSelect: (iinfo?: ImageInfo) => void}) {
  const images = props.images;

  if (images == null) {
    return <div>Loading ...</div>
  }

  return (
    <MaterialTable
      options={{
        padding: "dense",
        pageSize: 8,
        pageSizeOptions: [8, 50, 100],
        rowStyle: row => ({
          backgroundColor: (props.selectedImage && props.selectedImage.id === row.id) ? '#EEE' : '#FFF'
        })
      }}
      columns={[
        {
          field: 'id',
          width: 50,
          render: row => <img width={40} height={40} src={SERVER_URL + "/preview/" + row.id}/>
        },
        { title: 'Image', field: 'path' },
        { title: 'Size',
          render: row => row.width + "x" + row.height
        },
        { title: 'Label',
          render: row => (row.annotation && row.annotation.items.length > 0)?(<Icon>done</Icon>):""
        },
      ]}
      onRowClick={((_evt, selectedRow) => props.onSelect(selectedRow))}
      data={Object.values(images)}
      title="Images"/>
  );
}


export default ImageTable;
