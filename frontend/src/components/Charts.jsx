import React from 'react';
import { FileText } from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export const ApplicationStatusChart = ({ data }) => {
  console.log('ApplicationStatusChart received data:', data);
  
  // Ensure data is valid and has required fields
  const safeData = {
    pending: data?.pending || 0,
    under_review: data?.under_review || 0,
    approved: data?.approved || 0,
    rejected: data?.rejected || 0,
    waitlisted: data?.waitlisted || 0,
  };

  console.log('ApplicationStatusChart safeData:', safeData);

  const chartData = [
    { name: 'Pending', value: safeData.pending, color: COLORS[2] },
    { name: 'Under Review', value: safeData.under_review, color: COLORS[0] },
    { name: 'Approved', value: safeData.approved, color: COLORS[1] },
    { name: 'Rejected', value: safeData.rejected, color: COLORS[3] },
    { name: 'Waitlisted', value: safeData.waitlisted, color: COLORS[4] },
  ];

  console.log('ApplicationStatusChart chartData:', chartData);

  // If no data, show empty state
  if (chartData.every(item => item.value === 0)) {
    console.log('ApplicationStatusChart showing empty state');
    return (
      <div className="h-64 flex items-center justify-center text-gray-400">
        <div className="text-center">
          <FileText className="h-12 w-12 mx-auto mb-2" />
          <p className="text-sm">No application data available</p>
          <p className="text-xs text-gray-300 mt-1">Chart will populate when applications are submitted</p>
        </div>
      </div>
    );
  }

  // Filter only items with values > 0 for the pie chart
  const filteredData = chartData.filter(item => item.value > 0);
  
  console.log('ApplicationStatusChart filteredData:', filteredData);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={filteredData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {filteredData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export const MonthlyApplicationsChart = ({ data }) => {
  // Ensure data is an array
  const safeData = Array.isArray(data) ? data : [];

  const chartData = safeData.map(item => ({
    month: new Date(item.month).toLocaleString('default', { month: 'short' }),
    applications: item.count,
  }));

  // If no data, show empty state
  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400">
        <div className="text-center">
          <FileText className="h-12 w-12 mx-auto mb-2" />
          <p className="text-sm">No monthly data available</p>
        </div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="applications" stroke="#3b82f6" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export const HousingAvailabilityChart = ({ data }) => {
  // Ensure data is valid and has required fields
  const safeData = {
    total_units: data?.total_units || 0,
    available_units: data?.available_units || 0,
  };

  const chartData = [
    { name: 'Available', value: safeData.available_units, color: COLORS[1] },
    { name: 'Allotted', value: safeData.total_units - safeData.available_units, color: COLORS[3] },
  ].filter(item => item.value > 0);

  // If no data, show empty state
  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400">
        <div className="text-center">
          <FileText className="h-12 w-12 mx-auto mb-2" />
          <p className="text-sm">No housing data available</p>
        </div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export const UserDistributionChart = ({ data }) => {
  // Ensure data is valid and has required fields
  const safeData = {
    citizens: data?.citizens || 0,
    officers: data?.officers || 0,
    admins: data?.admins || 0,
  };

  const chartData = [
    { name: 'Citizens', value: safeData.citizens, color: COLORS[0] },
    { name: 'Officers', value: safeData.officers, color: COLORS[1] },
    { name: 'Admins', value: safeData.admins, color: COLORS[4] },
  ].filter(item => item.value > 0);

  // If no data, show empty state
  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400">
        <div className="text-center">
          <FileText className="h-12 w-12 mx-auto mb-2" />
          <p className="text-sm">No user data available</p>
        </div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        {chartData.map((entry, index) => (
          <Bar key={entry.name} dataKey="value" fill={entry.color} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export const ApprovalRateChart = ({ data }) => {
  // Ensure data is valid and has required fields
  const safeData = {
    total_applications: data?.total_applications || 0,
    approved: data?.approved || 0,
    rejected: data?.rejected || 0,
    pending: data?.pending || 0,
  };

  const total = safeData.total_applications;
  const approved = safeData.approved;
  const rejected = safeData.rejected;
  const pending = safeData.pending;

  const approvalRate = total > 0 ? ((approved / total) * 100).toFixed(1) : 0;
  const rejectionRate = total > 0 ? ((rejected / total) * 100).toFixed(1) : 0;
  const pendingRate = total > 0 ? ((pending / total) * 100).toFixed(1) : 0;

  const chartData = [
    { name: 'Approved', value: parseFloat(approvalRate), color: COLORS[1] },
    { name: 'Rejected', value: parseFloat(rejectionRate), color: COLORS[3] },
    { name: 'Pending', value: parseFloat(pendingRate), color: COLORS[2] },
  ].filter(item => item.value > 0);

  // If no data, show empty state
  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400">
        <div className="text-center">
          <FileText className="h-12 w-12 mx-auto mb-2" />
          <p className="text-sm">No approval data available</p>
        </div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis dataKey="name" type="category" width={80} />
        <Tooltip />
        <Legend />
        {chartData.map((entry, index) => (
          <Bar key={entry.name} dataKey="value" fill={entry.color} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default {
  ApplicationStatusChart,
  MonthlyApplicationsChart,
  HousingAvailabilityChart,
  UserDistributionChart,
  ApprovalRateChart,
};
