import { UsersTable } from './_components/users-table';
import { serverGetUsers } from '@/services';

async function UsersPage() {
	try {
		const response = await serverGetUsers();
		return <UsersTable initialUsers={response} />;
	} catch (error) {
		throw error;
	}
}

export default UsersPage;
