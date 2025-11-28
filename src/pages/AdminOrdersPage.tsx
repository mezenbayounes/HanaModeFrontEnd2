import AdminNavbar from '../components/AdminNavbar';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

interface OrderItem {
	product: { 
		name: string;
		images?: string[];
		colors?: Array<{ name: string; code: string; }>;
	} | string;
	quantity: number;
	size: string;
	color?: string; // backward compatibility 
	colorName?: string; // color name
	colorCode?: string; // color hex code
}

interface Order {
	id: number;
	email: string;
	items: OrderItem[];
	customerDetails: {
		firstName: string;
		lastName: string;
		address: string;
		phone: string;
		email?: string; // Email might also be in customerDetails
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
	
	// Filter states
	const [filterStatus, setFilterStatus] = useState<string>('all');
	const [filterName, setFilterName] = useState<string>('');
	const [filterDateFrom, setFilterDateFrom] = useState<string>('');
	const [filterDateTo, setFilterDateTo] = useState<string>('');

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

	const handleStatusChange = async (orderId: number, newStatus: Order['status']) => {
		try {
			await axios.patch(
				`${API_URL}/api/orders/${orderId}/status`,
				{ status: newStatus },
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			setOrders(orders =>
				orders.map(order =>
					order.id === orderId ? { ...order, status: newStatus } : order
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

	// Filter orders based on filters
	const filteredOrders = orders.filter(order => {
		// Status filter
		if (filterStatus !== 'all' && order.status !== filterStatus) {
			return false;
		}

		// Name filter
		if (filterName) {
			const fullName = `${order.customerDetails.firstName} ${order.customerDetails.lastName}`.toLowerCase();
			const email = order.email?.toLowerCase() || '';
			const searchTerm = filterName.toLowerCase();
			if (!fullName.includes(searchTerm) && !email.includes(searchTerm)) {
				return false;
			}
		}

		// Date range filter
		const orderDate = new Date(order.orderDate);
		if (filterDateFrom) {
			const fromDate = new Date(filterDateFrom);
			fromDate.setHours(0, 0, 0, 0);
			if (orderDate < fromDate) {
				return false;
			}
		}
		if (filterDateTo) {
			const toDate = new Date(filterDateTo);
			toDate.setHours(23, 59, 59, 999);
			if (orderDate > toDate) {
				return false;
			}
		}

		return true;
	});

	const resetFilters = () => {
		setFilterStatus('all');
		setFilterName('');
		setFilterDateFrom('');
		setFilterDateTo('');
	};

	if (loading) return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-hana">
			<div className="bg-gradient-to-r from-gray-800 to-gray-900 py-8 md:py-16 px-4">
				<div className="max-w-7xl mx-auto">
					<p className="text-white/80 uppercase tracking-[0.2em] md:tracking-[0.3em] text-xs md:text-sm">{t('admin.panel')}</p>
					<h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mt-2 md:mt-3">{t('orders.adminTitle', 'All Orders')}</h1>
				</div>
			</div>
			<AdminNavbar />
			<div className="flex items-center justify-center py-16">
				<div className="flex items-center gap-3 text-lg text-gray-600">
					<div className="w-6 h-6 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
					{t('common.loading', 'Loading...')}
				</div>
			</div>
		</div>
	);

	if (error) return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-hana">
			<div className="bg-gradient-to-r from-gray-800 to-gray-900 py-8 md:py-16 px-4">
				<div className="max-w-7xl mx-auto">
					<p className="text-white/80 uppercase tracking-[0.2em] md:tracking-[0.3em] text-xs md:text-sm">{t('admin.panel')}</p>
					<h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mt-2 md:mt-3">{t('orders.adminTitle', 'All Orders')}</h1>
				</div>
			</div>
			<AdminNavbar />
			<div className="flex items-center justify-center py-16">
				<div className="bg-red-50 border border-red-200 rounded-xl px-6 py-4 text-red-600 max-w-lg">
					{error}
				</div>
			</div>
		</div>
	);

	// Calculate statistics - using filteredOrders instead of all orders
	const totalOrders = filteredOrders.length;
	const pendingOrders = filteredOrders.filter(o => o.status === 'pending').length;
	const processingOrders = filteredOrders.filter(o => o.status === 'processing').length;
	const shippedOrders = filteredOrders.filter(o => o.status === 'shipped').length;
	const deliveredOrders = filteredOrders.filter(o => o.status === 'delivered').length;
	const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-hana">
			{/* Header */}
			<div className="bg-gradient-to-r from-gray-800 to-gray-900 py-8 md:py-16 px-4">
				<div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
					<div className="space-y-2 md:space-y-3">
						<p className="text-white/80 uppercase tracking-[0.2em] md:tracking-[0.3em] text-sm md:text-base">
							{t('admin.panel')}
						</p>
						<h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white">
							{t('orders.adminTitle', 'All Orders')}
						</h1>
						<p className="text-white/90 text-base md:text-xl max-w-2xl">
							{t('orders.manageDescription', 'Manage and track all customer orders')}
						</p>
					</div>

					{/* Statistics Cards */}
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
						<div className="bg-white/15 backdrop-blur px-3 md:px-5 py-3 md:py-4 text-white rounded-lg">
							<p className="text-sm md:text-base text-white/70 truncate">{t('orders.total', 'Total Orders')}</p>
							<p className="text-2xl md:text-3xl font-bold">{totalOrders}</p>
						</div>
						<div className="bg-white/15 backdrop-blur px-3 md:px-5 py-3 md:py-4 text-white rounded-lg">
							<p className="text-sm md:text-base text-white/70 truncate">{t('orders.status_pending', 'Pending')}</p>
							<p className="text-2xl md:text-3xl font-bold">{pendingOrders}</p>
						</div>
						<div className="bg-white/15 backdrop-blur px-3 md:px-5 py-3 md:py-4 text-white rounded-lg">
							<p className="text-sm md:text-base text-white/70 truncate">{t('orders.status_processing', 'Processing')}</p>
							<p className="text-2xl md:text-3xl font-bold">{processingOrders}</p>
						</div>
						<div className="bg-white/15 backdrop-blur px-3 md:px-5 py-3 md:py-4 text-white rounded-lg">
							<p className="text-sm md:text-base text-white/70 truncate">{t('orders.status_shipped', 'Shipped')}</p>
							<p className="text-2xl md:text-3xl font-bold">{shippedOrders}</p>
						</div>
						<div className="bg-white/15 backdrop-blur px-3 md:px-5 py-3 md:py-4 text-white rounded-lg">
							<p className="text-sm md:text-base text-white/70 truncate">{t('orders.status_delivered', 'Delivered')}</p>
							<p className="text-2xl md:text-3xl font-bold">{deliveredOrders}</p>
						</div>
						<div className="bg-white/15 backdrop-blur px-3 md:px-5 py-3 md:py-4 text-white rounded-lg">
							<p className="text-sm md:text-base text-white/70 truncate">{t('orders.revenue', 'Revenue')}</p>
							<p className="text-xl md:text-2xl font-bold truncate">{totalRevenue.toFixed(2)} DNT</p>
						</div>
					</div>
				</div>
			</div>

			<AdminNavbar />

			{/* Filters */}
			<div className="max-w-7xl mx-auto px-4 py-6">
				<div className="bg-white  shadow-sm border border-gray-200 p-4 md:p-6">
					<div className="flex flex-col md:flex-row gap-4 items-end">
						{/* Status Filter */}
						<div className="w-full md:w-1/4 space-y-1.5">
							<label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">{t('orders.status', 'Status')}</label>
							<select
								value={filterStatus}
								onChange={(e) => setFilterStatus(e.target.value)}
								className="w-full px-3 py-2  border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all text-base"
							>
								<option value="all">{t('shop.all', 'All')}</option>
								{statusOptions.map(status => (
									<option key={status} value={status}>{t(`orders.status_${status}`, status)}</option>
								))}
							</select>
						</div>

						{/* Name/Email Filter */}
						<div className="w-full md:w-1/4 space-y-1.5">
							<label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">{t('orders.customer', 'Customer')}</label>
							<input
								type="text"
								value={filterName}
								onChange={(e) => setFilterName(e.target.value)}
								placeholder={t('common.search', 'Search name or email...')}
								className="w-full px-3 py-2  border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all text-base"
							/>
						</div>

						{/* Date From */}
						<div className="w-full md:w-1/6 space-y-1.5">
							<label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">{t('common.from', 'From')}</label>
							<input
								type="date"
								value={filterDateFrom}
								onChange={(e) => setFilterDateFrom(e.target.value)}
								className="w-full px-3 py-2  border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all text-base"
							/>
						</div>

						{/* Date To */}
						<div className="w-full md:w-1/6 space-y-1.5">
							<label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">{t('common.to', 'To')}</label>
							<input
								type="date"
								value={filterDateTo}
								onChange={(e) => setFilterDateTo(e.target.value)}
								className="w-full px-3 py-2  border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all text-base"
							/>
						</div>

						{/* Reset Button */}
						<div className="w-full md:w-auto pb-0.5">
							<button
								onClick={resetFilters}
								className="w-full md:w-auto px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700  transition-colors text-base font-medium"
							>
								{t('filters.reset', 'Reset')}
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Orders List */}
			<div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
				<div className="space-y-6">
					{filteredOrders.length === 0 && (
						<div className="text-center py-16">
							<div className="bg-white rounded-2xl p-12 shadow-md">
								<p className="text-gray-500 text-xl">{t('orders.noOrders', 'No orders found.')}</p>
							</div>
						</div>
					)}
					{filteredOrders.map(order => (
						<div
							key={order.id}
							className="bg-white rounded-xl md:rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-all"
						>
							<div className="p-4 md:p-6 space-y-4">
								{/* Order Header */}
								<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 pb-4 border-b border-gray-200">
									<div className="space-y-2">
										<div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
											<span className="text-sm font-medium text-gray-500 uppercase tracking-wider">{t('orders.orderId', 'Order ID')}</span>
											<span className="text-sm font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded break-all sm:break-normal">{order.id}</span>
										</div>
										<div className="flex items-center gap-2 text-sm text-gray-500">
											<svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
											</svg>
											<span className="truncate">{new Date(order.orderDate).toLocaleString()}</span>
										</div>
									</div>

									{/* Status Selector */}
									<div className="flex flex-col gap-2 w-full sm:min-w-[200px] sm:w-auto">
										<label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">{t('orders.status', 'Status')}</label>
										<select
											value={order.status}
											onChange={e => handleStatusChange(order.id, e.target.value as Order['status'])}
											className="px-3 md:px-4 py-2 md:py-2.5 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all bg-white text-base font-medium"
										>
											{statusOptions.map(status => (
												<option key={status} value={status}>{t(`orders.status_${status}`, status)}</option>
											))}
										</select>
									</div>
								</div>

								{/* Customer Details */}
								<div className="grid sm:grid-cols-2 gap-3 md:gap-4">
									<div className="space-y-1.5 md:space-y-2">
										<h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{t('orders.customer', 'Customer Information')}</h3>
										<div className="bg-gray-50 rounded-lg p-2.5 md:p-3 space-y-1">
											<p className="text-base font-semibold text-gray-900">
												{order.customerDetails.firstName} {order.customerDetails.lastName}
											</p>
											<p className="text-sm text-gray-600">{order.email}</p>
											<div className="flex items-center gap-2 text-sm text-gray-600 pt-1">
												<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
												</svg>
												{order.customerDetails.phone}
											</div>
										</div>
									</div>

									<div className="space-y-1.5 md:space-y-2">
										<h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{t('orders.address', 'Shipping Address')}</h3>
										<div className="bg-gray-50 rounded-lg p-2.5 md:p-3">
											<div className="flex items-start gap-2 text-sm text-gray-600">
												<svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
												</svg>
												<span>{order.customerDetails.address}</span>
											</div>
										</div>
									</div>
								</div>

								{/* Order Items */}
								<div className="space-y-1.5 md:space-y-2">
									<h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{t('orders.products', 'Order Items')}</h3>
									<div className="bg-gray-50 rounded-lg p-2.5 md:p-3">
										<ul className="space-y-3">
											{order.items.map((item, idx) => {
												const productData = typeof item.product === 'object' ? item.product : null;
const productName = productData?.name || item?.product || "Unnamed product";												const productImage = productData?.images?.[0];
												
												// Get color code - either from order item or look it up from product colors
												const colorName = item.colorName || item.color;
												let colorCode = item.colorCode;
												
												// If no colorCode in order but we have productData and a color name, look it up
												if (!colorCode && colorName && productData && productData.colors) {
													const matchingColor = productData.colors.find(
														(c) => c && c.name && c.name.toLowerCase() === colorName.toLowerCase()
													);
													if (matchingColor) {
														colorCode = matchingColor.code;
													}
												}
												
												return (
													<li key={idx} className="flex gap-3 text-base py-2 border-b border-gray-200 last:border-0">
														{/* Product Image */}
														<div className="flex-shrink-0">
															{productImage ? (
																<img 
																	src={`${API_URL}${productImage}`} 
																	alt={typeof productName === 'string' ? productName : ''}
																	className="w-16 h-16 object-cover rounded-lg border-2 border-gray-300"
																/>
															) : (
																<div className="w-16 h-16 bg-gray-200 rounded-lg border-2 border-gray-300 flex items-center justify-center">
																	<svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
																	</svg>
																</div>
															)}
														</div>

														{/* Product Details */}
														<div className="flex-1 min-w-0 space-y-1">
															<p className="font-semibold text-lg text-gray-900 truncate">{typeof productName === 'string' ? productName : productName.name}</p>
															<div className="flex flex-wrap gap-2 text-sm">
																<div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded border border-gray-300">
																	<span className="text-gray-500">{t('product.size', 'Size')}:</span>
																	<span className="font-medium text-gray-900">{item.size}</span>
																</div>
																{colorName && (
																	<div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded border border-gray-300">
																		<span className="text-gray-500">{t('product.color', 'Color')}:</span>
																		{colorCode && (
																			<div 
																				className="w-4 h-4 rounded-full border border-gray-300" 
																				style={{ backgroundColor: colorCode }}
																				title={colorName}
																			/>
																		)}
																		<span className="font-medium text-gray-900">{colorName}</span>
																	</div>
																)}
																<div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded border border-gray-300">
																	<span className="text-gray-500">{t('product.quantity', 'Qty')}:</span>
																	<span className="font-medium text-gray-900">{item.quantity}</span>
																</div>
															</div>
														</div>
													</li>
												);
											})}
										</ul>
									</div>
								</div>

								{/* Order Total */}
								<div className="flex justify-between items-center pt-4 border-t border-gray-200">
									<span className="text-lg md:text-xl font-bold text-gray-700 uppercase tracking-wider">{t('orders.total', 'Total')}</span>
									<span className="text-2xl md:text-3xl font-bold text-gray-900">{order.total.toFixed(2)} DNT</span>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default AdminOrdersPage;
