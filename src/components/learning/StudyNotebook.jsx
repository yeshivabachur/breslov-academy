import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { FileText, Save, Clock, Tag, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';

export default function StudyNotebook({ lessonId, userEmail, notes, onSave }) {
  const [content, setContent] = useState('');
  const [annotations, setAnnotations] = useState([]);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  useEffect(() => {
    if (notes) {
      setContent(notes.content || '');
      setAnnotations(notes.annotations || []);
    }
  }, [notes]);

  const handleSave = async () => {
    setSaving(true);
    await onSave?.({ content, annotations });
    setLastSaved(new Date());
    setSaving(false);
  };

  const addAnnotation = (text, context) => {
    const newAnnotation = {
      id: Date.now(),
      text,
      context,
      timestamp: new Date().toISOString()
    };
    setAnnotations([...annotations, newAnnotation]);
  };

  const deleteAnnotation = (id) => {
    setAnnotations(annotations.filter(a => a.id !== id));
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl border-2 border-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-700 rounded-full flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Study Notes</h3>
            <p className="text-xs text-slate-600">Personal Learning Journal</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {lastSaved && (
            <div className="flex items-center gap-1 text-xs text-slate-600">
              <Clock className="w-3 h-3" />
              Saved {new Date(lastSaved).toLocaleTimeString()}
            </div>
          )}
          <Button
            onClick={handleSave}
            disabled={saving}
            size="sm"
            className="bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-lg"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Notes Area */}
      <div className="flex-1 p-4 overflow-y-auto">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your insights, questions, and reflections here..."
          className="w-full h-64 rounded-xl border-slate-200 focus:border-green-500 font-serif resize-none"
        />

        {/* Annotations */}
        {annotations.length > 0 && (
          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4 text-amber-600" />
              <h4 className="font-bold text-slate-900">Annotations</h4>
            </div>

            <AnimatePresence>
              {annotations.map((annotation) => (
                <motion.div
                  key={annotation.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="p-3 bg-amber-50 rounded-lg border border-amber-200 relative group"
                >
                  <div className="text-sm text-slate-700 mb-2 italic">
                    "{annotation.context}"
                  </div>
                  <div className="text-xs text-slate-600">
                    {annotation.text}
                  </div>
                  <div className="text-xs text-slate-500 mt-2">
                    {new Date(annotation.timestamp).toLocaleString()}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteAnnotation(annotation.id)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3 text-red-600" />
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <div className="flex justify-between text-xs text-slate-600">
          <span>{content.split(/\s+/).filter(w => w).length} words</span>
          <span>{annotations.length} annotations</span>
        </div>
      </div>
    </div>
  );
}