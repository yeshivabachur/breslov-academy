import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Upload, File, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';

export default function SubmissionUploader({ assignmentId, assignmentTitle, onSubmit }) {
  const [text, setText] = useState('');
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    setUploading(true);
    
    const uploadedUrls = [];
    for (const file of selectedFiles) {
      try {
        const result = await base44.integrations.Core.UploadFile({ file });
        uploadedUrls.push({ name: file.name, url: result.file_url });
      } catch (error) {
        console.error('Upload error:', error);
      }
    }
    
    setFiles([...files, ...uploadedUrls]);
    setUploading(false);
  };

  const handleSubmit = async () => {
    const submission = {
      assignment_id: assignmentId,
      content_text: text,
      file_urls: files.map(f => f.url),
      graded: false
    };
    
    await onSubmit?.(submission);
  };

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardHeader>
        <CardTitle>Submit Assignment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 bg-blue-50 rounded-xl">
          <h3 className="font-bold text-slate-900">{assignmentTitle}</h3>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Your Answer</label>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your response here..."
            className="min-h-[200px] rounded-xl"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Attachments</label>
          <div className="space-y-2">
            <AnimatePresence>
              {files.map((file, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center justify-between p-3 bg-white rounded-xl"
                >
                  <div className="flex items-center gap-2">
                    <File className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-slate-900">{file.name}</span>
                  </div>
                  <button
                    onClick={() => setFiles(files.filter((_, i) => i !== idx))}
                    className="text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            <label className="block">
              <input
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-500 transition-colors">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-600">
                  {uploading ? 'Uploading...' : 'Click to upload files'}
                </p>
              </div>
            </label>
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!text.trim() && files.length === 0}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-2xl py-6"
        >
          <Send className="w-4 h-4 mr-2" />
          Submit Assignment
        </Button>
      </CardContent>
    </Card>
  );
}