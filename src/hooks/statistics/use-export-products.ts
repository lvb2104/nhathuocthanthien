import { handleAxiosError } from '@/lib/utils';
import { exportProductsReport } from '@/services/statistics';
import { ExportProductsParams } from '@/types';
import { useMutation } from '@tanstack/react-query';

export function useExportProducts() {
	return useMutation({
		mutationFn: (params: ExportProductsParams) => exportProductsReport(params),
		onSuccess: (blob, variables) => {
			// Create download link
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;

			// Determine filename based on format
			const extension = variables.format === 'pdf' ? 'pdf' : 'xlsx';
			const filename = `bao-cao-san-pham-ban-chay.${extension}`;
			link.setAttribute('download', filename);

			// Trigger download
			document.body.appendChild(link);
			link.click();

			// Cleanup
			link.remove();
			window.URL.revokeObjectURL(url);
		},
		onError: (error: any) => handleAxiosError(error),
	});
}
