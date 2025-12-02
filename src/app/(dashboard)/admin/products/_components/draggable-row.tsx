'use client';

import * as React from 'react';
import { Row, flexRender } from '@tanstack/react-table';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { TableRow, TableCell } from '@/components/ui/table';

type DraggableRowProps<TData> = {
	row: Row<TData>;
};

export function DraggableRow<TData>({ row }: DraggableRowProps<TData>) {
	const { transform, transition, setNodeRef, isDragging } = useSortable({
		// assumes your row.original has an `id`
		id: (row.original as any).id,
	});

	return (
		<TableRow
			ref={setNodeRef}
			data-state={row.getIsSelected() && 'selected'}
			data-dragging={isDragging}
			className='relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80'
			style={{
				transform: CSS.Transform.toString(transform),
				transition,
			}}
		>
			{row.getVisibleCells().map(cell => (
				<TableCell key={cell.id}>
					{flexRender(cell.column.columnDef.cell, cell.getContext())}
				</TableCell>
			))}
		</TableRow>
	);
}
