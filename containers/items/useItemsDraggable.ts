import { useCallback, useEffect, useState, DragEvent } from 'react';
import { generateUID } from '../../helpers';
import useHandler from '../../hooks/useHandler';
import { DRAG_ITEM_ID_KEY, DRAG_ITEM_KEY } from './constants';
import './items.scss';

type AbstractItem = { ID?: string };

/**
 * Implement the draggable logic for an item
 * Linked to the selection logic to drag the currently selected elements
 * or to restore the selection after the drag
 * Also take care of rendering the drag element and including the needed data in the transfer
 * Items can be any object containing an ID
 * @param items List of all items in the list
 * @param checkedIDs List of the currently checked IDs
 * @param onCheck Check handler to update selection
 * @param getDragHtml Callback to return HTML content of the drag element
 * @returns Currently dragged ids and drag handler to pass to items
 */
const useItemsDraggable = <Item extends AbstractItem>(
    items: Item[],
    checkedIDs: string[],
    onCheck: (IDs: string[], checked: boolean, replace: boolean) => void,
    getDragHtml: (draggedIDs: string[]) => string
) => {
    // HTML reference to the drag element
    const [dragElement, setDragElement] = useState<HTMLDivElement>();

    // List of currently dragged item ids
    const [draggedIDs, setDraggedIDs] = useState<string[]>([]);

    // Saved selection when dragging an item not selected
    const [savedCheck, setSavedCheck] = useState<string[]>();

    useEffect(() => {
        setDraggedIDs([]);
    }, [items]);

    const clearDragElement = useHandler(() => {
        if (dragElement) {
            document.body.removeChild(dragElement);
            setDragElement(undefined);
        }
    });

    const handleDragCanceled = useHandler(() => {
        setDraggedIDs([]);

        if (savedCheck) {
            onCheck(savedCheck, true, true);
            setSavedCheck(undefined);
        }
    });

    /**
     * Drag end handler to use on the draggable element
     */
    const handleDragEnd = (event: DragEvent) => {
        clearDragElement();

        if (event.dataTransfer.dropEffect === 'none' || event.dataTransfer.dropEffect === 'copy') {
            return handleDragCanceled();
        }
    };

    const handleDragSucceed = useHandler((action: string | undefined) => {
        clearDragElement();

        setDraggedIDs([]);

        if (savedCheck) {
            if (action === 'link') {
                // Labels
                onCheck(savedCheck, true, true);
            }
            setSavedCheck(undefined);
        }
    });

    /**
     * Drag start handler to use on the draggable element
     */
    const handleDragStart = useCallback(
        (event: DragEvent, item: Item) => {
            clearDragElement();

            const ID = item.ID || '';
            const dragInSelection = checkedIDs.includes(ID);
            const selection = dragInSelection ? checkedIDs : [ID];

            setDraggedIDs(selection);
            setSavedCheck(checkedIDs);

            if (!dragInSelection) {
                onCheck([], true, true);
            }

            const dragElement = document.createElement('div');
            dragElement.innerHTML = getDragHtml(selection);
            dragElement.className = 'drag-element p1 bordered rounded';
            dragElement.id = generateUID(DRAG_ITEM_ID_KEY);
            // Wiring the dragend event on the drag element because the one from drag start is not reliable
            dragElement.addEventListener('dragend', (event) => handleDragSucceed(event.dataTransfer?.dropEffect));
            document.body.appendChild(dragElement);
            event.dataTransfer.setDragImage(dragElement, 0, 0);
            event.dataTransfer.setData(DRAG_ITEM_KEY, JSON.stringify(selection));
            event.dataTransfer.setData(DRAG_ITEM_ID_KEY, dragElement.id);
            setDragElement(dragElement);
        },
        [checkedIDs, onCheck]
    );

    return { draggedIDs, handleDragStart, handleDragEnd };
};

export default useItemsDraggable;
