import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ContactMessage, getContactMessages, deleteContactMessage } from '../api/contactApi';
import AdminNavbar from '../components/AdminNavbar';
import { Mail, Phone, Calendar, Trash2, AlertCircle } from 'lucide-react';
import ConfirmationModal from '../components/ConfirmationModal';

export default function AdminMessagesPage() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Delete confirmation
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const data = await getContactMessages();
      setMessages(data);
    } catch (err) {
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setMessageToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (messageToDelete) {
      try {
        await deleteContactMessage(messageToDelete);
        setMessages(prev => prev.filter(msg => msg.id !== messageToDelete));
        setIsDeleteModalOpen(false);
        setMessageToDelete(null);
      } catch (err) {
        console.error("Failed to delete message", err);
        alert("Failed to delete message");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-hana">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 py-16 px-4">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="space-y-3">
            <p className="text-white/80 uppercase tracking-[0.3em] text-sm">
              {t('admin.panel')}
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              {t('admin.messages', 'Client Messages')}
            </h1>
            <p className="text-white/90 text-lg max-w-2xl">
              {t('contact.description', 'View and manage messages from your customers')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/15 backdrop-blur px-5 py-4 text-white">
              <p className="text-sm text-white/70">Total Messages</p>
              <p className="text-2xl font-bold">{messages.length}</p>
            </div>
          </div>
        </div>
      </div>

      <AdminNavbar />
      
      <div className="max-w-7xl mx-auto px-4 py-16">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-md text-center border border-red-200">
            {error}
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow p-8">
            <Mail className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No messages</h3>
            <p className="mt-1 text-sm text-gray-500">You haven't received any messages yet.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {messages.map((msg) => (
              <div key={msg.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100 relative group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold">
                      {msg.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{msg.name}</h3>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  {/* Delete Button */}
                  <button 
                    onClick={() => handleDeleteClick(msg.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    title="Delete Message"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {msg.email && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="h-4 w-4 mr-2 text-gray-400" />
                      <a href={`mailto:${msg.email}`} className="hover:text-gray-900 truncate transition-colors">
                        {msg.email}
                      </a>
                    </div>
                  )}
                  {msg.phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      <a href={`tel:${msg.phone}`} className="hover:text-gray-900 transition-colors">
                        {msg.phone}
                      </a>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-50">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {msg.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={t('admin.deleteMessage', 'Delete Message')}
        message={t('admin.confirmDeleteMessage', 'Are you sure you want to delete this message? This action cannot be undone.')}
        confirmText={t('common.delete', 'Delete')}
        cancelText={t('common.cancel', 'Cancel')}
      />
    </div>
  );
}
