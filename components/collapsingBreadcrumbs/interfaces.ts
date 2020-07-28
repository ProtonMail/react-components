export interface BreadcrumbInfo {
    key: string | number;
    text: string;
    collapsedText?: React.ReactNode;
    highlighted?: boolean;
    onClick?: () => void;
    onDragDrop?: (e: React.DragEvent<HTMLLIElement>) => void;
    onDragOver?: (e: React.DragEvent<HTMLLIElement>) => void;
    onDragLeave?: (e: React.DragEvent<HTMLLIElement>) => void;
    noShrink?: boolean;
}
