import React, { useState, useEffect } from 'react';
import { FileText, Clock, Trash2, Edit, Calendar } from 'lucide-react';
import Card from './Card';
import { CardHeader, CardTitle, CardContent } from './Card';
import Button from './Button';
import api from '../services/api';
import toast from 'react-hot-toast';

const DraftApplications = () => {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDrafts();
  }, []);

  const fetchDrafts = async () => {
    try {
      const response = await api.get('/applications/drafts');
      setDrafts(response.data);
    } catch (error) {
      console.error('Error fetching drafts:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteDraft = async (draftId) => {
    if (!window.confirm('Are you sure you want to delete this draft?')) return;
    
    try {
      await api.delete(`/applications/drafts/${draftId}`);
      setDrafts(prev => prev.filter(d => d.id !== draftId));
      toast.success('Draft deleted');
    } catch (error) {
      toast.error('Failed to delete draft');
    }
  };

  const resumeDraft = (draftId) => {
    window.location.href = `/apply?draft=${draftId}`;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-xl border border-gray-100/50 p-6 space-y-4">
            <div className="h-6 w-1/2 rounded skeleton"></div>
            <div className="h-4 w-3/4 rounded skeleton"></div>
            <div className="h-4 w-1/4 rounded skeleton"></div>
          </div>
        ))}
      </div>
    );
  }

  if (drafts.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Draft Applications</h3>
        <p className="text-gray-500 mb-6">Save your applications as drafts to continue later</p>
        <Button onClick={() => window.location.href = '/schemes'} variant="primary">
          Start New Application
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Draft Applications</h2>
        <span className="text-sm text-gray-500">{drafts.length} drafts</span>
      </div>

      <div className="space-y-4">
        {drafts.map((draft) => (
          <Card key={draft.id} className="hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <FileText className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{draft.scheme_name}</h3>
                      <p className="text-sm text-gray-500">{draft.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>Last saved: {new Date(draft.updated_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>Progress: {draft.completion_percentage || 0}%</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${draft.completion_percentage || 0}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-600">
                      {draft.completion_percentage || 0}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => resumeDraft(draft.id)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Resume
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => deleteDraft(draft.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DraftApplications;
