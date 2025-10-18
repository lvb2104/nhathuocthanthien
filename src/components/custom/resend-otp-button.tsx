import { app } from '@/configs/app';
import React, { useEffect, useState } from 'react';

function ResendOtpButton({ onResendOtp }: { onResendOtp: () => void }) {
	const [cooldown, setCooldown] = useState(app.RESEND_COOLDOWN_SECONDS);

	// Handle resend OTP click
	function handleResendOtp() {
		if (cooldown > 0) return;
		onResendOtp();

		const expiresAt = Date.now() + app.RESEND_COOLDOWN_SECONDS * 1000;
		localStorage.setItem(app.localStorageKey.OTP_STORAGE, expiresAt.toString());
		setCooldown(app.RESEND_COOLDOWN_SECONDS);
	}

	// Initialize cooldown from localStorage on mount
	useEffect(() => {
		const savedCooldown = localStorage.getItem(app.localStorageKey.OTP_STORAGE);
		if (savedCooldown) {
			const remaining = Math.floor(
				(parseInt(savedCooldown) - Date.now()) / 1000,
			);
			if (remaining > 0) {
				setCooldown(remaining);
			} else {
				localStorage.removeItem(app.localStorageKey.OTP_STORAGE);
			}
		}
	}, []);

	// Countdown effect
	useEffect(() => {
		if (cooldown <= 0) return;
		const interval = setInterval(() => {
			setCooldown(prev => {
				if (prev <= 1) {
					localStorage.removeItem(app.localStorageKey.OTP_STORAGE);
					clearInterval(interval);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(interval);
	}, [cooldown]);
	return (
		<div className='text-sm'>
			Chưa nhận mã?{' '}
			<button
				disabled={cooldown > 0}
				onClick={handleResendOtp}
				className={`text-${cooldown > 0 ? 'inherit' : '[#189DFE] cursor-pointer'}`}
			>
				{cooldown > 0 ? `Gửi lại sau ${cooldown}s` : 'Gửi lại'}
			</button>
		</div>
	);
}

export default ResendOtpButton;
