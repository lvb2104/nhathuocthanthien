import { apiEndpoints } from '@/configs/apis';
import { axiosInstance } from '@/lib/axios';
import {
	CreatePrescriptionRequest,
	CreatePrescriptionResponse,
	ApprovePrescriptionRequest,
	ApprovePrescriptionResponse,
	RejectPrescriptionResponse,
	GetMyPrescriptionsResponse,
	GetMyPrescriptionByIdResponse,
	GetApprovedPrescriptionResponse,
	GetAllPrescriptionsForPharmacistResponse,
} from '@/types';

export async function createPrescription(
	request: CreatePrescriptionRequest,
): Promise<CreatePrescriptionResponse> {
	const res = await axiosInstance.post(
		apiEndpoints.prescriptions.create,
		request,
	);
	return res.data;
}

export async function getMyPrescriptions(): Promise<GetMyPrescriptionsResponse> {
	const res = await axiosInstance.get(apiEndpoints.prescriptions.getMy);
	return res.data;
}

export async function getMyPrescriptionById(
	id: number,
): Promise<GetMyPrescriptionByIdResponse> {
	const res = await axiosInstance.get(apiEndpoints.prescriptions.getMyById(id));
	return res.data;
}

export async function getApprovedPrescription(): Promise<GetApprovedPrescriptionResponse> {
	const res = await axiosInstance.get(apiEndpoints.prescriptions.getApproved);
	return res.data;
}

export async function getAllPrescriptionsForPharmacist(): Promise<GetAllPrescriptionsForPharmacistResponse> {
	const res = await axiosInstance.get(
		apiEndpoints.prescriptions.getAllForPharmacist,
	);
	return res.data;
}

export async function approvePrescription(
	id: number,
	request: ApprovePrescriptionRequest,
): Promise<ApprovePrescriptionResponse> {
	const res = await axiosInstance.post(
		apiEndpoints.prescriptions.approve(id),
		request,
	);
	return res.data;
}

export async function rejectPrescription(
	id: number,
): Promise<RejectPrescriptionResponse> {
	const res = await axiosInstance.post(apiEndpoints.prescriptions.reject(id));
	return res.data;
}
