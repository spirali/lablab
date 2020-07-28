import { ImageInfo, ImageMap, Annotation } from './ImageInfo';


export const SERVER_URL = "http://localhost:3800";


function doPost(url: string, data: any): Promise<Response> {
    return fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    })
}

export function uploadAnnotation(imageId: number, annotation: Annotation): Promise<Response> {
    return doPost(SERVER_URL + '/update/' + imageId, annotation)
}