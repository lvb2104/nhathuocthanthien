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
	MyPrescriptionsFilterParams,
	ApprovedPrescriptionFilterParams,
	PharmacistPrescriptionsFilterParams,
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

export async function getMyPrescriptions(
	params?: MyPrescriptionsFilterParams,
): Promise<GetMyPrescriptionsResponse> {
	const res = await axiosInstance.get(apiEndpoints.prescriptions.getMy, {
		params,
	});
	return res.data;
}

export async function getMyPrescriptionById(
	id: number,
): Promise<GetMyPrescriptionByIdResponse> {
	const res = await axiosInstance.get(apiEndpoints.prescriptions.getMyById(id));
	return res.data;
}

export async function getApprovedPrescription(
	params?: ApprovedPrescriptionFilterParams,
): Promise<GetApprovedPrescriptionResponse> {
	const res = await axiosInstance.get(apiEndpoints.prescriptions.getApproved, {
		params,
	});
	return res.data;
}

export async function getAllPrescriptionsForPharmacist(
	params?: PharmacistPrescriptionsFilterParams,
): Promise<GetAllPrescriptionsForPharmacistResponse> {
	const res = await axiosInstance.get(
		apiEndpoints.prescriptions.getAllForPharmacist,
		{ params },
	);
	return res.data;
}

export async function approvePrescription(
	id: number,
	request: ApprovePrescriptionRequest,
): Promise<ApprovePrescriptionResponse> {
	const res = await axiosInstance.patch(
		apiEndpoints.prescriptions.approve(id),
		request,
	);
	return res.data;
}

export async function rejectPrescription(
	id: number,
): Promise<RejectPrescriptionResponse> {
	const res = await axiosInstance.patch(apiEndpoints.prescriptions.reject(id));
	return res.data;
}
