import React from 'react';
import { ImageInfo, ImageMap } from './ImageInfo';
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
          backgroundColor: (props.selectedImage && props.selectedImage.path === row.path) ? '#EEE' : '#FFF'
        }),
        sorting: true,
      }}
      columns={[
        {
          field: 'id',
          width: 50,
          render: row => <img alt="" width={40} height={40} src={SERVER_URL + "/preview/" + row.path}/>
        },
        { title: 'Image', field: 'path' },
        { title: 'Size',
          customSort: (a, b) => a.width * a.height - b.width * b.height,
          render: row => row.width + "x" + row.height
        },
        { title: 'Label',
          field: 'annotation',
          render: row => (row.annotation && row.annotation.items.length > 0)?(<Icon>done</Icon>):""
        },
      ]}
      onRowClick={((_evt, selectedRow) => props.onSelect(selectedRow))}
      data={Object.values(images)}
      title="Images"/>
  );
}


export default ImageTable;
