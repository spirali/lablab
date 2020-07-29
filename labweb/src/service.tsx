import { Annotation } from './ImageInfo';


export const SERVER_URL = "http://localhost:3800";


function doPost(url: string, data: any): Promise<Response> {
    return fetch(url, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    })
}

export function uploadAnnotation(imagePath: string, annotation: Annotation): Promise<Response> {
    return doPost(SERVER_URL + '/annotation/' + imagePath, annotation)
}