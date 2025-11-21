import AdminNavbar from '../components/AdminNavbar';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

interface OrderItem {
	product: { name: string } | string;
	quantity: number;
	size: string;
	color?: string;
}

interface Order {
	_id: string;
	email: string;
	items: OrderItem[];
	customerDetails: {
		firstName: string;
		lastName: string;
		address: string;
		phone: string;
	};
	total: number;
	status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
	orderDate: string;
}

const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];


const AdminOrdersPage: React.FC = () => {
	const { t } = useTranslation();
	const { token } = useAuth();
	const [orders, setOrders] = useState<Order[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		const fetchOrders = async () => {
			setLoading(true);
			try {
				const res = await axios.get(`${API_URL}/api/orders`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				setOrders(res.data);
			} catch (err: any) {
				setError(err.response?.data?.message || 'Failed to fetch orders');
			} finally {
				setLoading(false);
			}
		};
		fetchOrders();
	}, [token]);

	const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
		try {
			await axios.patch(
				`${API_URL}/api/orders/${orderId}/status`,
				{ status: newStatus },
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			setOrders(orders =>
				orders.map(order =>
					order._id === orderId ? { ...order, status: newStatus } : order
				)
			);
		} catch (err: any) {
			let backendMsg = 'Failed to update status';
			if (err.response && err.response.data) {
				if (typeof err.response.data === 'string') backendMsg = err.response.data;
				else if (err.response.data.message) backendMsg = err.response.data.message;
				else backendMsg = JSON.stringify(err.response.data);
			}
			setError(backendMsg);
		}
	};

	if (loading) return (
		<div className="min-h-screen bg-gray-50 flex flex-col">
			<AdminNavbar />
			<div className="flex-1 flex items-center justify-center">
				<div className="text-lg text-gray-600 animate-fade-in">{t('common.loading', 'Loading...')}</div>
			</div>
		</div>
	);
	if (error) return (
		<div className="min-h-screen bg-gray-50 flex flex-col">
			<AdminNavbar />
			<div className="flex-1 flex items-center justify-center">
				<div className="text-lg text-red-600 animate-fade-in">{error}</div>
			</div>
		</div>
	);

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col">
			<AdminNavbar />
			<div className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full">
				<h1 className="text-3xl font-bold mb-8 text-brown-700 animate-slide-up">{t('orders.adminTitle', 'All Orders')}</h1>
				<div className="grid gap-8">
					{orders.length === 0 && (
						<div className="text-center text-gray-500 py-16 animate-fade-in">{t('orders.noOrders', 'No orders found.')}</div>
					)}
					{orders.map(order => (
						<div
							key={order._id}
							className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 flex flex-col md:flex-row md:items-center gap-6 hover:shadow-xl transition-shadow animate-fade-in-up"
						>
							<div className="flex-1">
								<div className="flex flex-wrap gap-2 items-center mb-2">
									<span className="font-semibold text-gray-700">{t('orders.orderId', 'Order ID')}:</span>
									<span className="text-xs text-gray-500">{order._id}</span>
									<span className="ml-4 font-semibold text-gray-700">{t('orders.createdAt', 'Created')}:</span>
									<span className="text-xs text-gray-500">{new Date(order.orderDate).toLocaleString()}</span>
								</div>
								<div className="mb-2">
									<span className="font-semibold text-gray-700">{t('orders.user', 'Customer')}:</span>
									<span className="ml-2">{order.customerDetails.firstName} {order.customerDetails.lastName}</span>
									<span className="ml-2 text-xs text-gray-500">{order.email}</span>
								</div>
								<div className="mb-2">
									<span className="font-semibold text-gray-700">{t('orders.address', 'Address')}:</span>
									<span className="ml-2 text-xs text-gray-500">{order.customerDetails.address}</span>
									<span className="ml-4 font-semibold text-gray-700">{t('orders.phone', 'Phone')}:</span>
									<span className="ml-2 text-xs text-gray-500">{order.customerDetails.phone}</span>
								</div>
								<div className="mb-2">
									<span className="font-semibold text-gray-700">{t('orders.products', 'Items')}:</span>
									<ul className="ml-2 list-disc list-inside">
										{order.items.map((item, idx) => (
											<li key={idx} className="text-sm">
												{typeof item.product === 'object' && item.product
													? (item.product as any).name
													: item.product} (x{item.quantity})
												{item.size && <span> [{item.size}]</span>}
												{item.color && <span> <span className="inline-block w-3 h-3 rounded-full align-middle" style={{background:item.color, border:'1px solid #ccc'}}></span> {item.color}</span>}
											</li>
										))}
									</ul>
								</div>
								<div className="mb-2">
									<span className="font-semibold text-gray-700">{t('orders.total', 'Total')}:</span>
									<span className="ml-2">{order.total} DNT</span>
								</div>
							</div>
							<div className="flex flex-col gap-2 min-w-[200px]">
								<label className="font-semibold text-gray-700 mb-1">{t('orders.status', 'Status')}:</label>
								<select
									value={order.status}
									onChange={e => handleStatusChange(order._id, e.target.value as Order['status'])}
									className="border-2 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-400 transition"
								>
									{statusOptions.map(status => (
										<option key={status} value={status}>{t(`orders.status_${status}`, status)}</option>
									))}
								</select>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default AdminOrdersPage;
