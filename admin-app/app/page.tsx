'use client';

import { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsCard from '@/components/ui/StatsCard';
import StatusBadge from '@/components/ui/StatusBadge';
import { Users, Truck, ShoppingBag, IndianRupee, ArrowRight, Clock, Loader2 } from 'lucide-react';
import { adminAPI } from '@/lib/api';
import { DashboardStats, Order, DeliveryPartner } from '@/lib/types';
import Link from 'next/link';

const defaultStats: DashboardStats = {
  totalUsers: 0,
  totalPartners: 0,
  totalOrders: 0,
  totalRevenue: 0,
  usersGrowth: 0,
  partnersGrowth: 0,
  ordersGrowth: 0,
  revenueGrowth: 0,
};

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>(defaultStats);
  const [orders, setOrders] = useState<Order[]>([]);
  const [partners, setPartners] = useState<DeliveryPartner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [dashboardRes, ordersRes, partnersRes] = await Promise.all([
        adminAPI.getDashboard(),
        adminAPI.getOrders({ page: 1 }),
        adminAPI.getPartners({ page: 1 }),
      ]);
      if (dashboardRes.stats) setStats(dashboardRes.stats);
      if (ordersRes.orders) setOrders(ordersRes.orders);
      if (partnersRes.partners) setPartners(partnersRes.partners);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const recentOrders = orders.slice(0, 5);
  const onlinePartners = partners.filter((p) => p.status === 'online');

  return (
    <DashboardLayout
      title="Dashboard"
      subtitle="Welcome back! Here's what's happening today."
    >
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Users"
          value={stats.totalUsers}
          change={stats.usersGrowth}
          icon={Users}
          iconColor="text-info"
          iconBg="bg-info-light"
        />
        <StatsCard
          title="Delivery Partners"
          value={stats.totalPartners}
          change={stats.partnersGrowth}
          icon={Truck}
          iconColor="text-purple-600"
          iconBg="bg-purple-100"
        />
        <StatsCard
          title="Total Orders"
          value={stats.totalOrders}
          change={stats.ordersGrowth}
          icon={ShoppingBag}
          iconColor="text-primary"
          iconBg="bg-primary-muted"
        />
        <StatsCard
          title="Total Revenue"
          value={`₹${(stats.totalRevenue / 100000).toFixed(1)}L`}
          change={stats.revenueGrowth}
          icon={IndianRupee}
          iconColor="text-success"
          iconBg="bg-success-light"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 card overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              <h2 className="text-lg font-bold text-card-foreground">Recent Orders</h2>
              <p className="text-sm text-muted">Latest orders from customers</p>
            </div>
            <Link
              href="/orders"
              className="flex items-center gap-2 text-primary font-medium text-sm hover:underline"
            >
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Shop</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <Link
                        href={`/orders/${order.id}`}
                        className="font-semibold text-primary hover:underline"
                      >
                        #{order.id.slice(-6)}
                      </Link>
                    </td>
                    <td>
                      <div>
                        <p className="font-medium">{order.userName}</p>
                        <p className="text-xs text-muted">{order.userPhone}</p>
                      </div>
                    </td>
                    <td className="text-muted">{order.shopName}</td>
                    <td className="font-semibold">₹{order.grandTotal.toLocaleString('en-IN')}</td>
                    <td>
                      <StatusBadge status={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Online Partners */}
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              <h2 className="text-lg font-bold text-card-foreground">Online Partners</h2>
              <p className="text-sm text-muted">{onlinePartners.length} partners available</p>
            </div>
            <Link
              href="/partners"
              className="text-primary font-medium text-sm hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="p-4 space-y-3">
            {onlinePartners.map((partner) => (
              <Link
                key={partner.id}
                href={`/partners/${partner.id}`}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-border-light transition-colors"
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-primary-muted overflow-hidden">
                    {partner.avatar ? (
                      <img
                        src={partner.avatar}
                        alt={partner.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-primary font-bold">
                        {partner.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-card" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-card-foreground truncate">{partner.name}</p>
                  <p className="text-xs text-muted">{partner.vehicleNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-success">₹{partner.todayEarnings}</p>
                  <p className="text-xs text-muted">{partner.todayDeliveries} trips</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* Today's Summary */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary-muted flex items-center justify-center">
              <Clock className="text-primary" size={20} />
            </div>
            <div>
              <h3 className="font-bold text-card-foreground">Today's Summary</h3>
              <p className="text-xs text-muted">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted text-sm">New Orders</span>
              <span className="font-semibold">{stats.todayOrders || 45}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted text-sm">Delivered</span>
              <span className="font-semibold text-success">{stats.todayDelivered || 38}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted text-sm">Cancelled</span>
              <span className="font-semibold text-error">{stats.todayCancelled || 3}</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-border">
              <span className="text-muted text-sm">Revenue</span>
              <span className="font-bold text-lg text-primary">₹{((stats.todayRevenue || 24500) / 1000).toFixed(1)}K</span>
            </div>
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="card p-6">
          <h3 className="font-bold text-card-foreground mb-4">Order Status</h3>
          <div className="space-y-3">
            {[
              { status: 'pending', count: stats.pendingOrders || 4, color: 'bg-warning' },
              { status: 'confirmed', count: stats.confirmedOrders || 8, color: 'bg-info' },
              { status: 'preparing', count: stats.preparingOrders || 12, color: 'bg-purple-500' },
              { status: 'out_for_delivery', count: stats.outForDeliveryOrders || 6, color: 'bg-primary' },
              { status: 'delivered', count: stats.deliveredOrders || 38, color: 'bg-success' },
            ].map((item) => (
              <div key={item.status} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <StatusBadge status={item.status} variant="dot" />
                  <span className="font-medium">{item.count}</span>
                </div>
                <div className="h-1.5 bg-border-light rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full`}
                    style={{ width: `${(item.count / 68) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Shops */}
        <div className="card p-6">
          <h3 className="font-bold text-card-foreground mb-4">Top Performing Shops</h3>
          <div className="space-y-3">
            {(stats.topShops || [
              { name: 'Varthur Fresh Chicken', orders: 234, revenue: '₹1.4L' },
              { name: 'Royal Mutton Stall', orders: 189, revenue: '₹2.2L' },
              { name: 'Organic Meats & Co.', orders: 156, revenue: '₹1.8L' },
            ]).map((shop: any, index: number) => (
              <div
                key={shop.name}
                className="flex items-center gap-3 p-3 rounded-xl bg-border-light"
              >
                <div className="w-8 h-8 rounded-lg bg-primary-muted flex items-center justify-center font-bold text-primary text-sm">
                  #{index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-card-foreground truncate text-sm">
                    {shop.name}
                  </p>
                  <p className="text-xs text-muted">{shop.orders} orders</p>
                </div>
                <p className="font-semibold text-success text-sm">{shop.revenue}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
