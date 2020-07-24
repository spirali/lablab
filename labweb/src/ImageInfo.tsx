
export interface Point {
    id: number,
    x: number,
    y: number,
}

export interface Annotation {
    items: Point[]
}

export interface AnnotationState {
    annotation?: Annotation,
    selectedId?: number
}


export interface ImageInfo {
    id: number;
    path: string;
    width: number;
    height: number;
}


