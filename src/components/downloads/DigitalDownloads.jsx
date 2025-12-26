import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, Headphones, FileImage, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DigitalDownloads({ downloads, hasAccess }) {
  const getIcon = (type) => {
    switch(type) {
      case 'pdf': return FileText;
      case 'audio': return Headphones;
      case 'image': return FileImage;
      default: return FileText;
    }
  };

  const getColor = (type) => {
    switch(type) {
      case 'pdf': return 'from-red-500 to-red-600';
      case 'audio': return 'from-purple-500 to-purple-600';
      case 'image': return 'from-green-500 to-green-600';
      default: return 'from-blue-500 to-blue-600';
    }
  };

  return (
    <div className="space-y-4">
      {downloads?.map((download, idx) => {
        const Icon = getIcon(download.file_type);
        const colorClass = getColor(download.file_type);
        
        return (
          <motion.div
            key={download.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card className="glass-effect border-0 premium-shadow hover:premium-shadow-lg transition-all rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${colorClass} rounded-2xl flex items-center justify-center shrink-0`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <div className="flex-1">
                    <h4 className="font-bold text-lg text-slate-900 font-serif mb-1">
                      {download.title}
                    </h4>
                    <p className="text-sm text-slate-600 font-serif mb-2">
                      {download.description}
                    </p>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="font-serif">
                        {download.file_type?.toUpperCase()}
                      </Badge>
                      {download.file_size && (
                        <span className="text-xs text-slate-500">
                          {(download.file_size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      )}
                    </div>
                  </div>

                  {hasAccess ? (
                    <Button
                      onClick={() => window.open(download.file_url, '_blank')}
                      className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-serif"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  ) : (
                    <Button variant="outline" className="rounded-xl font-serif" disabled>
                      <Lock className="w-4 h-4 mr-2" />
                      Locked
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}