

import React, { useEffect, useState } from "react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Area
} from "recharts";
import Sidebar from "../components/side";
import { api } from "../../service/api";
import { useNavigate } from "react-router-dom";

const COLORS = ["#EF4444", "#F59E0B", "#10B981", "#3B82F6"];

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [hoveredUser, setHoveredUser] = useState(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [chartAnimation, setChartAnimation] = useState(false);
  const navigate = useNavigate();

  // -------------------------------Calculate total revenue--------------------
  const totalRevenue = orders.reduce((sum, order) => {
    const orderTotal = order.items?.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0) || 0;
    return sum + orderTotal;
  }, 0);

  const scaledRevenue = totalRevenue / 1000;

  // -------------------------Overall Performance Data----------------
  console.log(users.length)
  const performanceData = [
    { name: "Users", value: users.length, color: COLORS[0] },
    { name: "Orders", value: orders.length, color: COLORS[1] },
    { name: "Products", value: products.length, color: COLORS[2] },
    { name: "Revenue", value: scaledRevenue, color: COLORS[3] },
  ];

  //-------------------- Fetch users and orders----------------
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users");
        const data = res.data;
        const allOrders = data.flatMap((u) => u.orders || []);
        setUsers(data);
        setOrders(allOrders);
        
        //----------------- Calculate monthly revenue after setting orders
        calculateMonthlyRevenue(allOrders);
      } catch (err) {        
        console.error("User fetch failed:", err.message);
      }
    };
    fetchUsers();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/product");
        setProducts(res.data);
      } catch (err) {
        console.error("Product fetch failed:", err.message);
      }
    };
    fetchProducts();
  }, []);

  // Calculate monthly revenue from orders
  const calculateMonthlyRevenue = (allOrders) => {
    const monthlyData = {};
    
    // Initialize all months with zero revenue
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    months.forEach(month => {
      monthlyData[month] = 0;
    });

    // Calculate revenue for each month
    allOrders.forEach(order => {
      if (order.date) {
        const orderDate = new Date(order.date);
        const monthName = months[orderDate.getMonth()];
        
        const orderTotal = order.items?.reduce((acc, item) => 
          acc + (item.price * (item.quantity || 1)), 0) || 0;
        
        monthlyData[monthName] += orderTotal;
      }
    });

    
    const monthlyArray = months.map(month => ({
      month,
      revenue: parseFloat(monthlyData[month].toFixed(2))
    }));

    setMonthlyRevenue(monthlyArray);
    
    
    setTimeout(() => setChartAnimation(true), 100);
  };

  
  const growthData = {
    users: 12.5,
    orders: 8.3,
    products: 5.7,
    revenue: 15.2
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6 ml-64">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-2">Welcome to your business dashboard</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Users", value: users.length, color: COLORS[0], onClick: () => navigate("/users") },
            { label: "Orders", value: orders.length, color: COLORS[1], onClick: () => navigate("/orders") },
            { label: "Products", value: products.length, color: COLORS[2], onClick: () => navigate("/Products") },
            { label: "Revenue", value: `$${totalRevenue.toFixed(2)}`, color: COLORS[3] },
          ].map((stat, i) => (
            <div
              key={i}
              onClick={stat.onClick}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className={`text-xs font-medium mt-1 ${
                    growthData[stat.label.toLowerCase()] >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {growthData[stat.label.toLowerCase()] >= 0 ? '↗' : '↘'} {Math.abs(growthData[stat.label.toLowerCase()])}%
                  </p>
                </div>
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}20` }}
                >
                  <div className="w-6 h-6 rounded-full" style={{ backgroundColor: stat.color }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Combined Performance and Revenue Charts */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Overall Performance Chart */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Overall Performance</h3>
                <div className="text-sm text-gray-600">
                  Business metrics overview
                </div>
              </div>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={performanceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      isAnimationActive={true}
                      animationDuration={800}
                      animationEasing="ease-in-out"
                    >
                      {performanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name) => {
                        if (name === 'Revenue') {
                          return [`$${(value * 1000).toFixed(2)}`, name];
                        }
                        return [value, name];
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                {performanceData.map((item, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <p className="text-sm font-medium text-gray-600">{item.name}</p>
                    </div>
                    <p className="text-lg font-bold text-gray-900">
                      {item.name === 'Revenue' ? `$${(item.value * 1000).toFixed(2)}` : item.value}
                    </p>
                    <p className={`text-xs font-medium mt-1 ${
                      growthData[item.name.toLowerCase()] >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {growthData[item.name.toLowerCase()] >= 0 ? '↗' : '↘'} {Math.abs(growthData[item.name.toLowerCase()])}%
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - Revenue Chart */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Monthly Revenue</h3>
                <div className="text-sm text-gray-600">
                  Revenue overview for the year
                </div>
              </div>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthlyRevenue}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip 
                      formatter={(value) => [`$${value}`, 'Revenue']}
                      labelFormatter={(label) => `Month: ${label}`}
                      contentStyle={{ 
                        borderRadius: '8px',
                        border: 'none',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="none"
                      fill="url(#revenueGradient)"
                      fillOpacity={1}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#3B82F6"
                      strokeWidth={3}
                      dot={{ 
                        fill: '#3B82F6', 
                        strokeWidth: 2, 
                        r: 4,
                        className: chartAnimation ? 'animate-pulse' : ''
                      }}
                      activeDot={{ 
                        r: 6, 
                        fill: '#1D4ED8',
                        className: 'transition-all duration-300'
                      }}
                      name="Monthly Revenue"
                      isAnimationActive={true}
                      animationDuration={1500}
                      animationEasing="ease-in-out"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Revenue Summary */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <p className="text-sm font-medium text-blue-600">Total Revenue</p>
                  <p className="text-lg font-bold text-blue-900">${totalRevenue.toFixed(2)}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <p className="text-sm font-medium text-green-600">Avg Monthly</p>
                  <p className="text-lg font-bold text-green-900">
                    ${monthlyRevenue.length > 0 ? (totalRevenue / monthlyRevenue.length).toFixed(2) : '0.00'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Management */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
            <span className="text-sm text-gray-600">{users.length} users</span>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {users.map((user) => (
              <div
                key={user.id}
                className={`p-4 border  ${
                  hoveredUser === user.id
                    ? "border-blue-500 bg-blue-50 shadow-md  scale-105"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onMouseEnter={() => setHoveredUser(user.id)}
                onMouseLeave={() => setHoveredUser(null)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{user.name}</h4>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.status}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {user.role}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {users.length === 0 && (
            <div className="text-center py-8 text-gray-500">No users found. Add your first user!</div>
          )}
        </div>

       
      </div>
    </div>
  );
}























