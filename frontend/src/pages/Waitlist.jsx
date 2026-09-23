import React, { useState, useEffect } from 'react';
import { 
  List, 
  TrendingUp, 
  Clock, 
  Calendar,
  Home,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import Card from '../components/Card';
import { CardHeader, CardTitle, CardContent } from '../components/Card';
import EmptyState from '../components/EmptyState';
import { PageLoader } from '../components/LoadingSpinner';
import api from '../services/api';
import toast from 'react-hot-toast';

const Waitlist = () => {
  const [waitlistItems, setWaitlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWaitlist();
  }, []);

  const fetchWaitlist = async () => {
    try {
      const response = await api.get('/waitlist/my');
      setWaitlistItems(response.data);
    } catch (error) {
      toast.error('Failed to fetch waitlist data');
    } finally {
      setLoading(false);
    }
  };

  const calculateChance = (rank, totalUnits) => {
    if (!totalUnits || totalUnits === 0) return 0;
    const chance = Math.max(0, Math.min(100, ((totalUnits - rank + 1) / totalUnits) * 100));
    return Math.round(chance);
  };

  const getMovementIcon = (movement) => {
    if (movement > 0) return <ArrowUp className="h-4 w-4 text-green-600" />;
    if (movement < 0) return <ArrowDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  const CircularProgress = ({ percentage, size = 120, strokeWidth = 8 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          className="transform -rotate-90"
          width={size}
          height={size}
        >
          <circle
            className="text-gray-200"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          <circle
            className="text-primary-600 transition-all duration-500 ease-out"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-900">{percentage}%</span>
        </div>
      </div>
    );
  };

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Waitlist Status</h1>
        <p className="text-gray-600">Track your position in housing scheme waitlists</p>
      </div>

      {waitlistItems.length === 0 ? (
        <EmptyState
          icon="inbox"
          title="Not on any waitlist"
          description="Apply for housing schemes to get added to the waitlist"
          action={
            <a href="/schemes" className="btn btn-primary">
              Browse Schemes
            </a>
          }
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {waitlistItems.map((item) => {
            const chance = calculateChance(item.rank, 50); // Assuming 50 total units for demo
            const movement = Math.floor(Math.random() * 5) - 2; // Demo movement data

            return (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="bg-purple-100 p-3 rounded-lg">
                          <Home className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {item.scheme_name}
                          </h3>
                          <p className="text-sm text-gray-500">{item.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                          {item.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Ring */}
                  <div className="flex items-center justify-center mb-6">
                    <CircularProgress percentage={chance} size={140} strokeWidth={12} />
                  </div>

                  <div className="text-center mb-6">
                    <div className="text-sm text-gray-500 mb-1">Allotment Chance</div>
                    <div className="text-3xl font-bold text-gray-900">{chance}%</div>
                  </div>

                  {/* Rank Display */}
                  <div className="bg-gradient-to-r from-purple-50 to-primary-50 rounded-xl p-6 mb-6">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Current Rank</div>
                        <div className="text-2xl font-bold text-purple-700">#{item.rank}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Movement</div>
                        <div className="flex items-center justify-center">
                          {getMovementIcon(movement)}
                          <span className="text-lg font-semibold text-gray-700 ml-1">
                            {Math.abs(movement)}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Queue Size</div>
                        <div className="text-2xl font-bold text-gray-700">{item.rank + 20}</div>
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Application Timeline</span>
                      <span className="text-xs text-gray-500">Last updated: Today</span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">Application Submitted</div>
                          <div className="text-xs text-gray-500">30 days ago</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">Documents Verified</div>
                          <div className="text-xs text-gray-500">25 days ago</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-primary-500 rounded-full animate-pulse"></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">Waitlisted</div>
                          <div className="text-xs text-gray-500">20 days ago</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-400">Allotment Pending</div>
                          <div className="text-xs text-gray-400">Estimated: 2-3 months</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Estimated Date */}
                  {item.estimated_allotment_date && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        <div>
                          <div className="text-sm font-medium text-blue-900">Estimated Allotment Date</div>
                          <div className="text-sm text-blue-700">
                            {new Date(item.estimated_allotment_date).toLocaleDateString('en-US', {
                              month: 'long',
                              year: 'numeric',
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Info Card */}
      <Card className="bg-gradient-to-r from-purple-50 to-primary-50 border-0">
        <CardContent>
          <div className="flex items-start space-x-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">How Waitlist Works</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Applications are processed in order of submission date</li>
                <li>• Your position may improve as others are allotted or withdraw</li>
                <li>• Estimated allotment dates are subject to availability</li>
                <li>• You'll receive notifications when your status changes</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Waitlist;
