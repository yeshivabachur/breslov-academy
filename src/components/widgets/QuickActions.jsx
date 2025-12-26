import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Plus, BookOpen, Users, MessageCircle, Calendar, X } from 'lucide-react';

export default function QuickActions() {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    { icon: BookOpen, label: 'Start Lesson', color: 'from-blue-500 to-blue-600' },
    { icon: Users, label: 'Find Chavruta', color: 'from-purple-500 to-purple-600' },
    { icon: MessageCircle, label: 'Ask Question', color: 'from-green-500 to-green-600' },
    { icon: Calendar, label: 'Schedule Study', color: 'from-amber-500 to-amber-600' }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="mb-4 space-y-2"
          >
            {actions.map((action, idx) => {
              const Icon = action.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Button
                    className={`w-full bg-gradient-to-r ${action.color} text-white shadow-xl rounded-2xl justify-start`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {action.label}
                  </Button>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="lg"
        className="rounded-full w-16 h-16 p-0 bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-2xl hover:shadow-3xl"
      >
        {isOpen ? <X className="w-8 h-8" /> : <Plus className="w-8 h-8" />}
      </Button>
    </div>
  );
}