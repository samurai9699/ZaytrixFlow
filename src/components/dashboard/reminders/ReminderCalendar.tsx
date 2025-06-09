import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventClickArg, ViewMountArg } from '@fullcalendar/core';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';
import { toast } from 'sonner';
import ReminderDetailsModal from './ReminderDetailsModal';
import CreateReminderModal from './CreateReminderModal';

interface Reminder {
  id: string;
  title: string;
  description?: string;
  due_date: string;
  status: string;
  invoice_id?: string;
  invoice?: {
    id: string;
    amount: number;
    client_name: string;
  };
}

const ReminderCalendar: React.FC = () => {
  const { user } = useAuth();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'dayGridMonth' | 'timeGridWeek' | 'timeGridDay'>('dayGridMonth');
  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    if (user) {
      fetchReminders();
    }
  }, [user]);

  const fetchReminders = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('reminders')
        .select(`
          id,
          title,
          due_date,
          status,
          invoice_id
        `)
        .eq('user_id', user?.id);

      if (error) throw error;

      setReminders(data || []);
    } catch (error) {
      console.error('Error fetching reminders:', error);
      toast.error('Failed to load reminders');
    } finally {
      setLoading(false);
    }
  };

  const getEventColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#6366F1'; // primary
      case 'sent':
        return '#10B981'; // success
      case 'completed':
        return '#8B5CF6'; // purple
      case 'failed':
        return '#EF4444'; // error
      default:
        return '#6B7280'; // gray
    }
  };

  const handleEventClick = (info: EventClickArg) => {
    const reminder = reminders.find(r => r.id === info.event.id);
    if (reminder) {
      setSelectedReminder(reminder);
      setShowDetailsModal(true);
    }
  };

  const handleDateSelect = () => {
    setShowCreateModal(true);
  };

  const handleEditReminder = () => {
    setShowDetailsModal(false);
    setShowEditModal(true);
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    fetchReminders();
  };

  const handleDeleteSuccess = () => {
    fetchReminders();
  };

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    fetchReminders();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      {loading ? (
        <div className="flex items-center justify-center h-[600px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="reminder-calendar">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView={view}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            events={reminders.map(reminder => ({
              id: reminder.id,
              title: reminder.title,
              start: reminder.due_date,
              backgroundColor: getEventColor(reminder.status),
              borderColor: getEventColor(reminder.status),
              textColor: '#ffffff',
              allDay: true
            }))}
            eventClick={handleEventClick}
            selectable={true}
            select={handleDateSelect}
            height="600px"
            viewDidMount={(info: ViewMountArg) => setView(info.view.type as 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay')}
          />
        </div>
      )}

      {/* Reminder Details Modal */}
      <ReminderDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        reminder={selectedReminder}
        onDelete={handleDeleteSuccess}
        onEdit={handleEditReminder}
      />

      {/* Create Reminder Modal */}
      <CreateReminderModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
      />

      {/* Edit Reminder Modal */}
      <CreateReminderModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={handleEditSuccess}
        editReminder={selectedReminder}
      />
    </div>
  );
};

export default ReminderCalendar;