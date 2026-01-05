
// import React, { useEffect, useState } from "react";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Area,
// } from "recharts";
// import Sidebar from "../components/side";
// import { api } from "../../service/api";
// import { useNavigate } from "react-router-dom";

// const COLORS = ["#EF4444", "#F59E0B", "#10B981", "#3B82F6"];

// export default function Dashboard() {
//   const [orders, setOrders] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [hoveredUser, setHoveredUser] = useState(null);
//   const [monthlyRevenue, setMonthlyRevenue] = useState([]);
//   const [chartAnimation, setChartAnimation] = useState(false);
//   const navigate = useNavigate();

//   const totalRevenue = orders.reduce((sum, order) => {
//     const orderTotal =
//       order.items?.reduce(
//         (acc, item) => acc + item.price * (item.quantity || 1),
//         0
//       ) || 0;
//     return sum + orderTotal;
//   }, 0);

//   const scaledRevenue = totalRevenue / 1000;

//   const performanceData = [
//     { name: "Users", value: users.length, color: COLORS[0] },
//     { name: "Orders", value: orders.length, color: COLORS[1] },
//     { name: "Products", value: products.length, color: COLORS[2] },
//     { name: "Revenue", value: scaledRevenue, color: COLORS[3] },
//   ];

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const res = await api.get("/users");
//         const data = res.data;
//         const allOrders = data.flatMap((u) => u.orders || []);
//         setUsers(data);
//         setOrders(allOrders);
//         calculateMonthlyRevenue(allOrders);
//       } catch (err) {
//         console.error("User fetch failed:", err.message);
//       }
//     };
//     fetchUsers();
//   }, []);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const res = await api.get("/product");
//         setProducts(res.data);
//       } catch (err) {
//         console.error("Product fetch failed:", err.message);
//       }
//     };
//     fetchProducts();
//   }, []);

//   const calculateMonthlyRevenue = (allOrders) => {
//     const monthlyData = {};
//     const months = [
//       "Jan",
//       "Feb",
//       "Mar",
//       "Apr",
//       "May",
//       "Jun",
//       "Jul",
//       "Aug",
//       "Sep",
//       "Oct",
//       "Nov",
//       "Dec",
//     ];
//     months.forEach((month) => {
//       monthlyData[month] = 0;
//     });

//     allOrders.forEach((order) => {
//       if (order.date) {
//         const orderDate = new Date(order.date);
//         const monthName = months[orderDate.getMonth()];
//         const orderTotal =
//           order.items?.reduce(
//             (acc, item) => acc + item.price * (item.quantity || 1),
//             0
//           ) || 0;
//         monthlyData[monthName] += orderTotal;
//       }
//     });

//     const monthlyArray = months.map((month) => ({
//       month,
//       revenue: parseFloat(monthlyData[month].toFixed(2)),
//     }));

//     setMonthlyRevenue(monthlyArray);
//     setTimeout(() => setChartAnimation(true), 100);
//   };

//   const growthData = {
//     users: 12.5,
//     orders: 8.3,
//     products: 5.7,
//     revenue: 15.2,
//   };

//   return (
//     <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
//       <div className="lg:w-64 w-full">
//         <Sidebar />
//       </div>

//       <div className="flex-1 p-4 sm:p-6 lg:p-8">
//         <div className="mb-8 text-center lg:text-left">
//           <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
//             Dashboard Overview
//           </h1>
//           <p className="text-gray-600 mt-2">
//             Welcome to your business dashboard
//           </p>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
//           {[
//             {
//               label: "Users",
//               value: users.length,
//               color: COLORS[0],
//               onClick: () => navigate("/users"),
//             },
//             {
//               label: "Orders",
//               value: orders.length,
//               color: COLORS[1],
//               onClick: () => navigate("/orders"),
//             },
//             {
//               label: "Products",
//               value: products.length,
//               color: COLORS[2],
//               onClick: () => navigate("/Products"),
//             },
//             {
//               label: "Revenue",
//               value: `$${totalRevenue.toFixed(2)}`,
//               color: COLORS[3],
//             },
//           ].map((stat, i) => (
//             <div
//               key={i}
//               onClick={stat.onClick}
//               className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer"
//             >
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">
//                     {stat.label}
//                   </p>
//                   <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">
//                     {stat.value}
//                   </p>
//                   <p
//                     className={`text-xs font-medium mt-1 ${
//                       growthData[stat.label.toLowerCase()] >= 0
//                         ? "text-green-600"
//                         : "text-red-600"
//                     }`}
//                   >
//                     {growthData[stat.label.toLowerCase()] >= 0 ? "↗" : "↘"}{" "}
//                     {Math.abs(growthData[stat.label.toLowerCase()])}%
//                   </p>
//                 </div>
//                 <div
//                   className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center"
//                   style={{ backgroundColor: `${stat.color}20` }}
//                 >
//                   <div
//                     className="w-5 h-5 sm:w-6 sm:h-6 rounded-full"
//                     style={{ backgroundColor: stat.color }}
//                   />
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100 mb-8">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
//             <div>
//               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 text-center sm:text-left">
//                 <h3 className="text-lg font-semibold text-gray-900">
//                   Overall Performance
//                 </h3>
//                 <div className="text-sm text-gray-600">
//                   Business metrics overview
//                 </div>
//               </div>

//               <div className="h-64 sm:h-80">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <PieChart>
//                     <Pie
//                       data={performanceData}
//                       cx="50%"
//                       cy="50%"
//                       labelLine={false}
//                       outerRadius="80%"
//                       fill="#8884d8"
//                       dataKey="value"
//                       label={({ name, percent }) =>
//                         `${name} ${(percent * 100).toFixed(0)}%`
//                       }
//                     >
//                       {performanceData.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={entry.color} />
//                       ))}
//                     </Pie>
//                     <Tooltip
//                       formatter={(value, name) => {
//                         if (name === "Revenue") {
//                           return [`$${(value * 1000).toFixed(2)}`, name];
//                         }
//                         return [value, name];
//                       }}
//                     />
//                     <Legend />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>

//             <div>
//               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 text-center sm:text-left">
//                 <h3 className="text-lg font-semibold text-gray-900">
//                   Monthly Revenue
//                 </h3>
//                 <div className="text-sm text-gray-600">
//                   Revenue overview for the year
//                 </div>
//               </div>

//               <div className="h-64 sm:h-80">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <LineChart
//                     data={monthlyRevenue}
//                     margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
//                   >
//                     <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                     <XAxis dataKey="month" tick={{ fontSize: 12 }} />
//                     <YAxis
//                       tick={{ fontSize: 12 }}
//                       tickFormatter={(value) => `$${value}`}
//                     />
//                     <Tooltip
//                       formatter={(value) => [`$${value}`, "Revenue"]}
//                       labelFormatter={(label) => `Month: ${label}`}
//                     />
//                     <Area
//                       type="monotone"
//                       dataKey="revenue"
//                       stroke="none"
//                       fill="#BFDBFE"
//                       fillOpacity={0.5}
//                     />
//                     <Line
//                       type="monotone"
//                       dataKey="revenue"
//                       stroke="#3B82F6"
//                       strokeWidth={3}
//                       dot={{
//                         fill: "#3B82F6",
//                         strokeWidth: 2,
//                         r: 3,
//                       }}
//                       activeDot={{
//                         r: 5,
//                         fill: "#1D4ED8",
//                       }}
//                     />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
//           <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 text-center sm:text-left">
//             <h3 className="text-lg font-semibold text-gray-900">
//               User Management
//             </h3>
//             <span className="text-sm text-gray-600">{users.length} users</span>
//           </div>

//           <div className="space-y-3 ">
//             {users.map((user) => (
//               <div
//                 key={user.id}
//                 className={`p-4 border rounded-lg  ${
//                   hoveredUser === user.id
//                     ? " bg-blue-50 "
//                     : "border-gray-200 hover:border-gray-300"
//                 }`}
//                 onMouseEnter={() => setHoveredUser(user.id)}
//                 onMouseLeave={() => setHoveredUser(null)}
//               >
//                 <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
//                   <div className="flex-1">
//                     <h4 className="font-semibold text-gray-900">{user.name}</h4>
//                     <p className="text-sm text-gray-600">{user.email}</p>
//                     <div className="flex flex-wrap items-center gap-2 mt-2">
//                       <span
//                         className={`px-2 py-1 rounded-full text-xs font-medium ${
//                           user.status === "Active"
//                             ? "bg-green-100 text-green-800"
//                             : "bg-red-100 text-red-800"
//                         }`}
//                       >
//                         {user.status}
//                       </span>
//                       <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
//                         {user.role}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {users.length === 0 && (
//             <div className="text-center py-8 text-gray-500">
//               No users found. Add your first user!
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }



























import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  Cell,
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
  const navigate = useNavigate();

  const totalRevenue = orders.reduce((sum, order) => {
    const orderTotal =
      order.items?.reduce(
        (acc, item) => acc + item.price * (item.quantity || 1),
        0
      ) || 0;
    return sum + orderTotal;
  }, 0);

  // Calculate performance data with targets
  const getPerformanceData = () => {
    // Calculate growth percentages (you can replace these with real calculations)
    const calculateGrowth = (current, previous) => {
      if (!previous || previous === 0) return 0;
      return ((current - previous) / previous) * 100;
    };

    return [
      {
        name: "Users",
        value: users.length,
        target: 100, // Example target
        growth: calculateGrowth(users.length, 80), // Example previous value
        color: COLORS[0],
      },
      {
        name: "Orders",
        value: orders.length,
        target: 200, // Example target
        growth: calculateGrowth(orders.length, 150), // Example previous value
        color: COLORS[1],
      },
      {
        name: "Products",
        value: products.length,
        target: 150, // Example target
        growth: calculateGrowth(products.length, 120), // Example previous value
        color: COLORS[2],
      },
      {
        name: "Revenue",
        value: totalRevenue,
        target: 100000, // Example target
        growth: calculateGrowth(totalRevenue, 80000), // Example previous value
        color: COLORS[3],
      },
    ];
  };

  const performanceData = getPerformanceData();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users");
        const data = res.data;
        const allOrders = data.flatMap((u) => u.orders || []);
        setUsers(data);
        setOrders(allOrders);
        calculateMonthlyRevenue(allOrders);
      } catch (err) {
        console.error("User fetch failed:", err.message);
      }
    };
    fetchUsers();
  }, []);

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

  const calculateMonthlyRevenue = (allOrders) => {
    const monthlyData = {};
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    months.forEach((month) => {
      monthlyData[month] = 0;
    });

    allOrders.forEach((order) => {
      if (order.date) {
        const orderDate = new Date(order.date);
        const monthName = months[orderDate.getMonth()];
        const orderTotal =
          order.items?.reduce(
            (acc, item) => acc + item.price * (item.quantity || 1),
            0
          ) || 0;
        monthlyData[monthName] += orderTotal;
      }
    });

    const monthlyArray = months.map((month) => ({
      month,
      revenue: parseFloat(monthlyData[month].toFixed(2)),
    }));

    setMonthlyRevenue(monthlyArray);
  };

  // Custom tooltip for the bar chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isRevenue = data.name === "Revenue";
      const actualValue = isRevenue ? `$${data.value.toLocaleString()}` : data.value.toLocaleString();
      const targetValue = isRevenue ? `$${data.target.toLocaleString()}` : data.target.toLocaleString();
      
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-gray-800 text-sm">Actual:</span>
              <span className="font-medium text-black">{actualValue}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-800 text-sm">Target:</span>
              <span className="font-medium text-black">{targetValue}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm">Growth:</span>
              <span className={`font-medium ${data.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {data.growth >= 0 ? '+' : ''}{data.growth.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Find best performer
  const findBestPerformer = () => {
    if (performanceData.length === 0) return "N/A";
    const best = performanceData.reduce((max, item) => {
      const currentPerformance = item.value / item.target;
      const maxPerformance = max.value / max.target;
      return currentPerformance > maxPerformance ? item : max;
    });
    return best.name;
  };

  // Calculate average growth
  const calculateAverageGrowth = () => {
    if (performanceData.length === 0) return 0;
    const sum = performanceData.reduce((acc, item) => acc + item.growth, 0);
    return sum / performanceData.length;
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      <div className="lg:w-64 w-full">
        <Sidebar />
      </div>

      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mb-8 text-center lg:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Dashboard Analytics
          </h1>
          <p className="text-gray-600 mt-2">
            Comprehensive business performance overview
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {performanceData.map((stat, i) => (
            <div
              key={i}
              onClick={() => {
                if (stat.name === "Users") navigate("/users");
                if (stat.name === "Orders") navigate("/orders");
                if (stat.name === "Products") navigate("/Products");
              }}
              className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.name}
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">
                    {stat.name === "Revenue" ? `$${stat.value.toLocaleString()}` : stat.value.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className={`text-xs font-medium ${stat.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.growth >= 0 ? '↗' : '↘'} {Math.abs(stat.growth).toFixed(1)}%
                    </span>
                    <span className="text-xs text-gray-500">
                      vs target {stat.name === "Revenue" ? `$${stat.target.toLocaleString()}` : stat.target.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}20` }}
                >
                  <div
                    className="w-5 h-5 sm:w-6 sm:h-6 rounded-full"
                    style={{ backgroundColor: stat.color }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8">
          {/* Performance Analysis Chart */}
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Performance Analysis
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Actual vs Target comparison
                </p>
              </div>
              <div className="flex items-center gap-4 mt-2 sm:mt-0">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#3B82F6' }} />
                  <span className=" text-gray-800">Actual</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-300" />
                  <span className="text-sm text-gray-800">Target</span>
                </div>
              </div>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={performanceData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickFormatter={(value) => {
                      if (value >= 1000) return `${(value/1000).toFixed(0)}k`;
                      return value;
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar
                    dataKey="value"
                    name="Actual"
                    radius={[4, 4, 0, 0]}
                  >
                    {performanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                  <Bar
                    dataKey="target"
                    name="Target"
                    radius={[4, 4, 0, 0]}
                    fill="green"
                    opacity={0.7}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-gray-600/90 p-4 rounded-lg">
                <p className="text-sm text-white font-medium">Best Performer</p>
                <p className="text-lg font-bold text-white mt-1">
                  {findBestPerformer()}
                </p>
              </div>
              <div className="bg-gray-600/90 p-4 rounded-lg">
                <p className="text-sm text-white font-medium">Avg Growth</p>
                <p className={`text-lg font-bold mt-1 ${calculateAverageGrowth() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {calculateAverageGrowth().toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          {/* Monthly Revenue Chart */}
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Monthly Revenue Trend
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Year-over-year revenue analysis
                </p>
              </div>
              <div className="text-sm text-gray-600 mt-2 sm:mt-0">
                Total: ${totalRevenue.toLocaleString()}
              </div>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlyRevenue}
                  margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `$${value.toLocaleString()}`}
                    axisLine={false}
                  />
                  <Tooltip
                    formatter={(value) => [`$${value.toLocaleString()}`, "Revenue"]}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="none"
                    fill="#BFDBFE"
                    fillOpacity={0.5}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    dot={{
                      fill: "#3B82F6",
                      strokeWidth: 2,
                      r: 4,
                    }}
                    activeDot={{
                      r: 6,
                      fill: "#1D4ED8",
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Average Monthly Revenue</p>
                <p className="font-semibold text-gray-900">
                  ${monthlyRevenue.length > 0 
                    ? (monthlyRevenue.reduce((sum, m) => sum + m.revenue, 0) / monthlyRevenue.length).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })
                    : '0'}
                </p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full"
                  style={{
                    width: `${Math.min(100, (totalRevenue / 100000) * 100)}%`
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* User Management Section */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              User Management
            </h3>
            <div className="flex items-center gap-4 mt-2 sm:mt-0">
              <span className="text-sm text-gray-600">{users.length} users</span>
              <button 
                onClick={() => navigate("/users")}
                className="px-4 py-2 bg-gray-600/90 text-white rounded-lg  transition-colors text-sm font-medium"
              >
                View All
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {users.slice(0, 5).map((user) => (
              <div
                key={user.id}
                className={`p-4 border rounded-lg`}
                onMouseEnter={() => setHoveredUser(user.id)}
                onMouseLeave={() => setHoveredUser(null)}
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="font-semibold text-blue-600">
                          {user.name?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{user.name}</h4>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.status || "Inactive"}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {user.role || "User"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {users.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No users found. Add your first user!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}