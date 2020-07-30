
export interface Point {
    id: number,
    x: number,
    y: number,
}

export interface Annotation {
    items: Point[]
}

export interface AnnotationState {
    annotation: Annotation,
    selectedId?: number,
    annotationBackup: Annotation,
    changed: boolean
}

export interface ImageInfo {
    path: string;
    width: number;
    height: number;
    annotation?: Annotation;
}

export interface ImageMap { [key: string]: ImageInfo; }
