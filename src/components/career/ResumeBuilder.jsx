import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function ResumeBuilder({ userData }) {
  const [resume, setResume] = useState({
    summary: '',
    skills: [],
    certifications: []
  });

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif">
          <FileText className="w-5 h-5 text-blue-600" />
          Torah Resume Builder
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
          <div className="text-sm text-blue-900">
            Showcase your Torah learning achievements to potential employers and institutions
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Professional Summary
          </label>
          <Textarea
            placeholder="Describe your Torah education and expertise..."
            className="min-h-[100px] rounded-xl"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Torah Skills
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {['Hebrew', 'Aramaic', 'Gemara', 'Halacha', 'Chassidus'].map((skill, idx) => (
              <Badge key={idx} className="bg-purple-100 text-purple-800">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 rounded-xl">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}