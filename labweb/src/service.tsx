import { Annotation } from './ImageInfo';


export let SERVER_URL = "";

if (window.location.href.startsWith("http://localhost:3000")) {
  console.log("DEV mode detected, connecting to http://localhost:3800");
  SERVER_URL = "http://localhost:3800";
}



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